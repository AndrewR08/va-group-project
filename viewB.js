class ViewB {
    constructor(con, root, name, x, y, w, h, color) {
        d3.csv('mm_scaled.csv').then(data =>{
            console.log(data)
            //const scale = d3.scaleLinear().domain(d3.extent(data, d=>+d.track_genre)).range([10,100])
            const div = root.append('div')
            .style('position', 'absolute')
            .style('width', `${w}`)
            .style('height', `${h}`)
            .style('left', `${x}`)
            .style('top', `${y}`)

            const svg = div.append('svg')
            .attr('width', '100%')
            .attr('height', '100%')


            var layout = d3.layout.cloud()
                .size([1000, 1000])
                .words(data)
                .padding(2)
                .rotate(()=>Math.floor(Math.random()*2)*270)
                .fontSize(d=>(d.popularity*30))
                .on("end", draw)

            layout.start()

            var tooltip = d3.select("body")
                    .append("div")
                    .style("position", "absolute")
                    .style("visibility", "hidden")
                    .style("background", "#000")

            function draw(words) {
                //console.log(words)
                    //.attr("width", layout.size()[0])
                    //.attr("height", layout.size()[1])
                svg.attr('width', '100%')
                    .attr('height', '100%')
                    .append("g")
                    .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                    .selectAll("text")
                    .data(words)
                    .enter()
                    .append("text")
                    .text((d) => d['track_genre'])
                    .style("font-size", (d) => d.size)
                    .style("font-family", "Impact")
                    .attr("text-anchor", "middle")
                    .attr("transform", function (d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"})
                    .attr('opacity', (d) => d['popularity'])
                    .style("cursor", "default")

                    

                    .on('click', function(d) {
                        d3.select(this).style("cursor", "default")

                        var genre_var = d3.select(this).text()
                        var pop_var = d3.select(this).data()[0]['popularity']
                        const single = [{track_genre:genre_var, popularity:pop_var}]
                        console.log(single)

                        var color = d3.select(this).attr('fill')
                        console.log(color)

                        if (color==null) {
                            d3.select(this).attr("fill", "red")
                            d3.select(this).attr("opacity", "1")
                        }
                        else {
                            d3.select(this).attr("fill", null)
                            d3.select(this).attr("opacity", pop_var)
                        }
                    })

                    //display popularity value for hovered genre
                    .on('mouseover', function (d, i) {
                        d3.select(this).style("cursor", "default")

                        var pop_var = d3.select(this).data()[0]['popularity']

                        d3.select(this).transition()
                            .duration('50')
                            .attr('opacity', '.85')

                        tooltip.text('popularity: ' + Math.round(pop_var*100)) 
                                .style("visibility", "visible")
                                .style("left", d.x + "px")     
                                .style("top", d.y + "px")
                                .style("color", "white")

                        //console.log(d3.select(this).data()[0]['x'])
                        //console.log(d)

                    })
                    
                    .on("mousemove", function() {
                        d3.select(this).style("cursor", "default")
                    })                    

                    .on('mouseout', function (d, i) {
                        d3.select(this).style("cursor", "default")

                        var pop_var = d3.select(this).data()[0]['popularity']
                        
                        d3.select(this).transition()
                            .duration('50')
                            .attr('opacity', pop_var)

                        tooltip.style("visibility", "hidden")
                    })
            }

        })

        con.Test(`View ${name} is connected.`)
    }

    showLabel(viewName, tcolor) {
        const label = d3.select(`#${this.name}-label`)
        label.text(`View ${viewName} Selected`)
    }
}