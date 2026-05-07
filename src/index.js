const DEFAULT_SHOW_ID = "2993";
const PLACEHOLDER_IMAGE = "https://placehold.co/210x295";

const fetchJSON = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
};

const getShowData = async (id) => {
  const URL = `https://api.tvmaze.com/shows/${id}`;
  const data = await fetchJSON(URL);

  return {
    id: data.id,
    name: data.name,
    rating: data.rating.average ?? 0,
    image: data.image?.medium ?? PLACEHOLDER_IMAGE
  };
};

const searchShow = async (query) => {
  const URL = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`;
  const results = await fetchJSON(URL);

  return results[0]?.show?.id ?? null;
};

const getEpisodeList = async (id) => {
  const URL = `https://api.tvmaze.com/shows/${id}/episodes`;
  const episodes = await fetchJSON(URL);

  const episodeList = episodes.map(episode => ({
    number: episode.number,
    season: episode.season,
    rating: episode.rating.average ?? 0
  }));

  return Object.groupBy(episodeList, episode => episode.season);
};

const $showDetails = document.querySelector(".show-details");
const $searchForm = document.querySelector(".search-form");
const $searchInput = document.querySelector(".search-input");
const $searchButton = $searchForm.querySelector("button");
const $searchStatus = document.querySelector(".search-status");
const $episodes = document.querySelector(".episodes");

const setSearchLoading = (isLoading) => {
  $searchInput.disabled = isLoading;
  $searchButton.disabled = isLoading;
};

const setSearchStatus = (message) => {
  $searchStatus.textContent = message;
};

const createEpisodeHTML = (episode) => {
  const rating = Math.round(episode.rating);

  return `
    <div class="episode episode-${episode.number} rating-${rating}">
      ${episode.number}
    </div>
  `;
};

const createSeasonHTML = (data, number) => {
  const episodesHTML = data.map(createEpisodeHTML).join("");

  return `
    <article class="season">
      <header class="season-header">T${number}</header>
      ${episodesHTML}
    </article>
  `;
};

const renderShow = async (id) => {
  setSearchStatus("Cargando...");
  $episodes.innerHTML = "";

  const [show, seasons] = await Promise.all([
    getShowData(id),
    getEpisodeList(id)
  ]);

  $showDetails.innerHTML = `
    <img class="poster" src="${show.image}" alt="${show.name}">
    <div>
      <h1>${show.name}</h1>
      <p>Rating: ${show.rating}</p>
    </div>
  `;

  const list = Object.entries(seasons).map(([seasonNumber, season]) =>
    createSeasonHTML(season, seasonNumber)
  );

  $episodes.innerHTML = list.join("");
  setSearchStatus("");
};

$searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = $searchInput.value.trim();

  if (!query) {
    setSearchStatus("Escribi el nombre de una serie.");
    $searchInput.focus();
    return;
  }

  setSearchLoading(true);
  setSearchStatus("Buscando...");

  try {
    const showId = await searchShow(query);

    if (!showId) {
      setSearchStatus(`No se encontro "${query}".`);
      return;
    }

    await renderShow(showId);
  } catch (error) {
    setSearchStatus("No se pudo buscar la serie. Intentalo de nuevo.");
  } finally {
    setSearchLoading(false);
  }
});

try {
  setSearchLoading(true);
  await renderShow(DEFAULT_SHOW_ID);
} catch (error) {
  setSearchStatus("No se pudo cargar la serie inicial.");
} finally {
  setSearchLoading(false);
}
