new (class Control {
    #viewA
    #viewB

    constructor() {
        const root = d3.select('body').append('div')
            .style('height', '1000')
            .style('width', '1000');

        this.#viewA = new ViewA(this, root, 'BarGraph', 0, 0, '50vw', '100vh', 'a');
        this.#viewB = new ViewB(this, root, 'B', '50%', 0, '50%', '100%', 'green');
    }

    showViewName(viewName){
        this.#viewB.showLabel(viewName, 'green');
    }

    Test(str) {
        console.log(str);
    }
})()