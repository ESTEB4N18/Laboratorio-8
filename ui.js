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

export const getElements = () => {
  const searchForm = document.querySelector(".search-form");

  return {
    showDetails: document.querySelector(".show-details"),
    searchForm,
    searchInput: document.querySelector(".search-input"),
    searchButton: searchForm.querySelector("button"),
    searchStatus: document.querySelector(".search-status"),
    episodes: document.querySelector(".episodes")
  };
};

export const setSearchLoading = (elements, isLoading) => {
  elements.searchInput.disabled = isLoading;
  elements.searchButton.disabled = isLoading;
};

export const setSearchStatus = (elements, message) => {
  elements.searchStatus.textContent = message;
};

export const clearEpisodes = (elements) => {
  elements.episodes.innerHTML = "";
};

export const renderShowDetails = (elements, show) => {
  elements.showDetails.innerHTML = `
    <img class="poster" src="${show.image}" alt="${show.name}">
    <div>
      <h1>${show.name}</h1>
      <p>Rating: ${show.rating}</p>
    </div>
  `;
};

export const renderEpisodes = (elements, seasons) => {
  const list = Object.entries(seasons).map(([seasonNumber, season]) =>
    createSeasonHTML(season, seasonNumber)
  );

  elements.episodes.innerHTML = list.join("");
};
