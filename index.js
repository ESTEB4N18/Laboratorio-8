import { getEpisodeList, getShowData, searchShow } from "./api.js";
import { DEFAULT_SHOW_ID } from "./config.js";
import {
  clearEpisodes,
  getElements,
  renderEpisodes,
  renderShowDetails,
  setSearchLoading,
  setSearchStatus
} from "./ui.js";

const elements = getElements();

const renderShow = async (id) => {
  setSearchStatus(elements, "Cargando...");
  clearEpisodes(elements);

  const [show, seasons] = await Promise.all([
    getShowData(id),
    getEpisodeList(id)
  ]);

  renderShowDetails(elements, show);
  renderEpisodes(elements, seasons);
  setSearchStatus(elements, "");
};

elements.searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = elements.searchInput.value.trim();

  if (!query) {
    setSearchStatus(elements, "Escribi el nombre de una serie.");
    elements.searchInput.focus();
    return;
  }

  setSearchLoading(elements, true);
  setSearchStatus(elements, "Buscando...");

  try {
    const showId = await searchShow(query);

    if (!showId) {
      setSearchStatus(elements, `No se encontro "${query}".`);
      return;
    }

    await renderShow(showId);
  } catch (error) {
    setSearchStatus(elements, "No se pudo buscar la serie. Intentalo de nuevo.");
  } finally {
    setSearchLoading(elements, false);
  }
});

try {
  setSearchLoading(elements, true);
  await renderShow(DEFAULT_SHOW_ID);
} catch (error) {
  setSearchStatus(elements, "No se pudo cargar la serie inicial.");
} finally {
  setSearchLoading(elements, false);
}
