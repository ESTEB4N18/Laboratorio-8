import { API_BASE_URL, PLACEHOLDER_IMAGE } from "./config.js";

const fetchJSON = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
};

export const getShowData = async (id) => {
  const data = await fetchJSON(`${API_BASE_URL}/shows/${id}`);

  return {
    id: data.id,
    name: data.name,
    rating: data.rating.average ?? 0,
    image: data.image?.medium ?? PLACEHOLDER_IMAGE
  };
};

export const searchShow = async (query) => {
  const results = await fetchJSON(
    `${API_BASE_URL}/search/shows?q=${encodeURIComponent(query)}`
  );

  return results[0]?.show?.id ?? null;
};

export const getEpisodeList = async (id) => {
  const episodes = await fetchJSON(`${API_BASE_URL}/shows/${id}/episodes`);

  const episodeList = episodes.map((episode) => ({
    number: episode.number,
    season: episode.season,
    rating: episode.rating.average ?? 0
  }));

  return Object.groupBy(episodeList, (episode) => episode.season);
};
