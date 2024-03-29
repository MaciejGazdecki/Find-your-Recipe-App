import axios from 'axios';
import {key} from "./../key";

export default class Recipe {
    constructor(id) {
        this.id = id;
    }
    async getRecipe () {
        try {
            const res = await axios (`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (e) {
            alert('Something went wrong')
        }
    }
    calcTime () {
        //Assuming that we need 15 min for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }
    calcServings () {
        this.servings = 4;
    }
    parseIngredients () {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp ', 'tbsp ', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'gr'];

        const newIngredients = this.ingredients.map(el => {
            //Uniform units
            let ingredient = el.toLowerCase();

            //remove ()
            unitsLong.forEach((el, index) => {
                ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
            });
            //parse ingredients into count unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el => units.includes(el));

            let objectIng;

            if (unitIndex > -1) {
                //There is a unit
                //fe. 4 1/2 cups, arrCount is ['4', '1/2'] --> eval(4+1/2) --> 4.5
                const arrCount = arrIng.slice(0, unitIndex);

                let count;

                if (arrCount.length ===1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objectIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' ')
                }
            } else if (parseInt(arrIng[0])) {
                //there is no unit, but first element is a number
                objectIng = {
                    count: parseInt(arrIng[0]),
                    unit:'',
                    ingredient: arrIng.slice(1).join(' '),
                }
            } else if (unitIndex === -1) {
                //there is no unit
                objectIng = {
                    count: 1,
                    unit: '',
                    ingredient,
                }
            }

            return objectIng
        });
        this.ingredients = newIngredients;
    }
    updateServings (type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}