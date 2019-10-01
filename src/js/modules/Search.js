import axios from 'axios';
export default class Search {
    constructor (query) {
        this.query = query;
    }
    async getResults() {
        const apiKey = '50c3adea60eb6dc5a272c99d394cfd62';
        try {
            const res = await axios(`https://www.food2fork.com/api/search?key=${apiKey}&q=${this.query}`);
            this.result = res.data.recipes;
        } catch (e) {
            alert(e)
        }
    }
}



