import axios from 'axios';
import {key} from "./../key";
export default class Search {
    constructor (query) {
        this.query = query;
    }
    async getResults() {
        try {
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
        } catch (e) {
            alert(e)
        }
    }
}



