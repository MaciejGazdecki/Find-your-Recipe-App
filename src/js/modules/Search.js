import axios from 'axios';
export default class Search {
    constructor (query) {
        this.query = query;
    }
    async getResults() {
        const apiKey = 'e00ba54c1eddefd2894f1c5d1daf23a2';
        try {
            const res = await axios(`https://www.food2fork.com/api/search?key=${apiKey}&q=${this.query}`);
            this.result = res.data.recipes;
            // console.log(this.result);
        } catch (e) {
            alert(e)
        }
    }
}



