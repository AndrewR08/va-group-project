new (class Control {
    #viewA
    #viewB

    constructor() {
        const root = d3.select('body')
            .append('div')
            .style('height', '1000')
            .style('width', '1000');

        this.#viewA = new ViewA(this, root, 'BarGraph', 0, 0, '50vw', '100vh', 'white');
        this.#viewB = new ViewB(this, root, 'WordCloud', '50vw', 0, '50vw', '100vh', 'white');
    }

    updateSelected(selected_genres) {
        console.log('update selected', selected_genres)
        this.#viewA.updateSelectedGenres(selected_genres);
    }

    Test(str) {
        console.log(str);
    }
})()