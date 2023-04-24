class ViewA {
    constructor(con, root, name, x, y, w, h, color) {
        this.con = con
        this.name = name

        const div = root.append('div')
            .style('position', 'absolute')
            .style('width', `${w}`)
            .style('height', `${h}`)
            .style('left', `${x}`)
            .style('top', `${y}`)

        const svg = div.append('svg')
            .attr('width', '100%')
            .attr('height', '100%')

        svg.append('rect')
            .attr('width', '100%')
            .attr('height', '100%')
            .on('click', () => {
                this.con.showViewName(name)
            })
            .attr('fill', color)
        
        svg.append('text')
            .attr('x', '50%')
            .attr('y', '50%')
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-size', '36px')
            .text(name)

        svg.append('text')
            .attr('id', `${name}-label`)
            .attr('x', '50%')
            .attr('y', '60%')
            .attr('text-anchor', 'middle')
            .attr('fill', 'black')
            .attr('font-size', '24px')

        con.Test(`View ${name} is connected.`)
    }

    showLabel(viewName) {
        const label = d3.select(`#${this.name}-label`)
        label.text(`View ${viewName} Selected`)
    }
}