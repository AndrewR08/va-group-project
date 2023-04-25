new (class Control {
    #viewA
    #viewB

    constructor() {
        const root = d3.select('body')
            .append('div')
            .style('height', '1000')
            .style('width', '1000');

        this.#viewA = new ViewA(this, root, 'BarGraph', 0, 0, '50vw', '100vh', 'white');
        this.#viewB = new ViewB(this, root, 'B', '50vw', 0, '50vw', '100vh', 'white');
    }

    showViewName(viewName){
        this.#viewB.showLabel(viewName, 'green');
    }

    updateSelectedGenre(selected_genres) {
        this.#viewA.updateSelectedGenre(selected_genres);
    }

    Test(str) {
        console.log(str);
    }
})()