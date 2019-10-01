import style from '../sass/main.scss';
import Search from "./modules/Search";
import * as SearchView from "./views/searchView";
import * as RecipeView from "./views/recipeView";
import * as ListView from "./views/listView";
import {elements, renderLoader, clearLoader } from "./views/base";
import Recipe from "./modules/Recipe";
import List from "./modules/List";
import Likes from "./modules/Likes";


// Global State of the app:
// - Search object
// - current recipe object
// - shopping list object
// - linked recipes
const state = {};

//SEARCH CONTROLLER
const controlSearch = async () => {
  const query = SearchView.getInput();

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
            console.log(e);
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
    if (id) {
        //Prepare UI for changes
        renderLoader(elements.recipe);
        RecipeView.clearRecipe();

        //highlight selected
        if (state.search) SearchView.highlightSelected(id);
        //Create new Recipe Object
        state.recipe = new Recipe(id);
        try {
            //get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            // Calculate Servings and Time
            state.recipe.calcTime();
            state.recipe.calcServings();
            // Render Recipe
            clearLoader();
            RecipeView.renderRecipe(state.recipe);
        } catch (e) {
            alert('Error processing recipe')
        }

    }
};
['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));

//List controler

const controlList = () => {
    //create new List if there is not any
    if(!state.list) state.list = new List();
    //add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        ListView.renderItem(item);
    })
};

//Likes controller
const controlLikes = () => {
    if (!state.likes) state.likes = new Likes();
    const curId = state.recipe.id;

    //user has not liked recipe
    if(!state.likes.isLiked(curId)) {
        const newLike = state.likes.addLike(curId, state.recipe.title,state.recipe.author, state.recipe.img);

        console.log(state.likes);
        //user liked recipe
    } else {
        state.likes.deleteLike(curId);

        console.log(state.likes);
    }
};

//Handling recipe buttons
elements.shopping.addEventListener('click', e => {
     const id = e.target.closest('.shopping__item').dataset.itemid;

     //delete from the list and UI
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id);
        ListView.deleteItem(id);
    } else if (e.target.matches('#count-value')) {
        const val = parseFloat(e.target.value);
        state.list.updateCount(id,val);
    }
});

elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')) {
        if(state.recipe.servings >1) {
            state.recipe.updateServings('dec');
            RecipeView.updateServingsIngredients(state.recipe)
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        RecipeView.updateServingsIngredients(state.recipe)
    } else if (e.target.matches('#recipe-add, #recipe-add *')) {
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLikes();
    }
});