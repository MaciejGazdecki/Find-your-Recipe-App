import {elements} from "./base";
import {limitRecipeTitle} from './searchView'

export const toggleLikedBtn = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';

    const loveBtn = document.querySelector('.recipe__love use');
    loveBtn.setAttribute('href', `img/icons.svg#${iconString}`);
    //<use href="img/icons.svg#icon-heart-outlined"></use>
};

export const toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : "hidden"
};

export const renderLike = like => {
  const markup = `
  <li>
      <a class="likes__link" href="#${like.id}">
         <figure class="likes__fig">
             <img src="${like.img}" alt="${like.title}">
         </figure>
         <div class="likes__data">
             <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
             <p class="likes__author">${like.author}</p>
         </div>
      </a>
  </li>
  `;
  elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {
  const element = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
  element.parentElement.removeChild(element);
};