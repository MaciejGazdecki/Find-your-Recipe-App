import style from '../sass/main.scss';
import Search from "./modules/Search";
import * as SearchView from "./views/searchView";
import {elements, renderLoader, clearLoader } from "./views/base";


// Global State of the app:
// - Search object
// - current recipe object
// - shopping list object
// - linked recipes
const state = {};

const controlSearch = async () => {
  const query = SearchView.getInput();
    console.log(query);

    if (query) {
        //add new object to state
        state.search = new Search(query);
        //prepare UI for results
        SearchView.clearInput();
        SearchView.clearList();
        renderLoader(elements.searchRes);
        // search for recipes
        await state.search.getResults();
        //render recipes in UI
        SearchView.renderResult(state.search.result);
        clearLoader();
    }
};

elements.searchForm.addEventListener('submit', evt => {
    evt.preventDefault();
    controlSearch();
});