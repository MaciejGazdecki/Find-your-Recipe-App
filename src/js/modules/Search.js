import axios from 'axios';
export default class Search {
    constructor (query) {
        this.query = query;
    }
    async getResults() {
        const apiKey = '6e8fd3af7e48db3af76e5a2684414a51';
        try {
            const res = await axios(`https://www.food2fork.com/api/search?key=${apiKey}&q=${this.query}`);
            this.result = res.data.recipes;
        } catch (e) {
            alert(e)
        }
    }
}



