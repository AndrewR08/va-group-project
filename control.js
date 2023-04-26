new (class Control {
    #viewA
    #viewB

    constructor() {
        const root = d3.select('body')
            .append('div')
            .attr('id', 'view-container');

        this.#viewA = new ViewA(this, root, 'BarGraph');
        this.#viewB = new ViewB(this, root, 'WordCloud', '50vw', 0, '50vw', '100vh', 'white');
    }

    updateSelected(selected_genres) {
        this.#viewA.updateSelectedGenres(selected_genres);
    }

    Test(str) {
        console.log(str);
    }
})()