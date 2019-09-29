import style from '../sass/main.scss';
import Search from "./modules/Search";
import * as SearchView from "./views/searchView";
import {elements, renderLoader, clearLoader } from "./views/base";
import Recipe from "./modules/Recipe";


// Global State of the app:
// - Search object
// - current recipe object
// - shopping list object
// - linked recipes
const state = {};

//SEARCH CONTROLLER
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
        try {
            // search for recipes
            await state.search.getResults();
            //render recipes in UI
            SearchView.renderResult(state.search.result);
            clearLoader();
        } catch (e) {
            alert('Something went wrong...');
            clearLoader();
        }

    }
};

elements.searchForm.addEventListener('submit', evt => {
    evt.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', evt => {
    const btn = evt.target.closest('.btn-inline');
    if (btn) {
        const gotoPage = parseInt(btn.dataset.goto);
        SearchView.clearList();
        SearchView.renderResult(state.search.result,gotoPage);
    }
});

//RECIPE CONTROLLER

const controlRecipe = async () => {
    //Get ID from url
    const id = window.location.hash.replace('#', '');
    console.log(id);
    if (id) {
        //Prepare UI for changes

        //Create new Recipe Object
        state.recipe = new Recipe(id);
        // window.r = state.recipe;
        try {
            //get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            // Calculate Servings and Time
            state.recipe.calcTime();
            state.recipe.calcServings();
            // Render Recipe
            console.log(state.recipe);
        } catch (e) {
            alert('Error processing recipe')
        }

    }
};
['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));