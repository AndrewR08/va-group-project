new (class Control {
    #viewA
    #viewB

    constructor() {
        const root = d3.select('body').append('div')
            .style('height', '10f00')
            .style('width', '1000')

        this.#viewA = new ViewA(this, root, 'A', 0, 0, '50%', '100%', 'red')
        this.#viewB = new ViewB(this, root, 'B', '50%', 0, '50%', '100%', 'green')
    }

    showViewName(viewName){
        this.#viewA.showLabel(viewName, 'red')
        this.#viewB.showLabel(viewName, 'green')
    }

    Test(str) {
        console.log(str)
    }
})()