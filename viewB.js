const selected_genres = [];

class ViewB {
    constructor(con, root, name, x, y, w, h, color) {
        this.con = con
        this.name = name

        console.log(con)
        d3.csv('mm_scaled.csv').then(data =>{
            console.log(data)

            const div = root.append('div')
                .attr('class', 'view');

            const svg = div.append('svg')
                .attr("viewBox", "0 0 1000 1000")
                .style('margin-top', 'calc((50vh - 4px) - ((50vw - 8px) / 2))');


            const layout = d3.layout.cloud()
                .size([1000, 1000])
                .words(data)
                .padding(2)
                .rotate(()=>Math.floor(Math.random()*2)*270)
                .fontSize(d=>(d.popularity*45))
                .on("end", draw)

            layout.start()

            const tooltip = d3.select("body")
                    .append("div")
                    .style("position", "absolute")
                    .style("visibility", "hidden")
                    .style("background", "#000")

            function draw(words) {
                svg
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

                        const genre_var = d3.select(this).text()
                        const pop_var = d3.select(this).data()[0]['popularity']
                        const color = d3.select(this).attr('fill')

                        if (color==null) {
                            d3.select(this).attr("fill", "red")
                            d3.select(this).attr("opacity", "1")
                            selected_genres.push(genre_var)
                        }
                        else {
                            d3.select(this).attr("fill", null)
                            d3.select(this).attr("opacity", pop_var)
                            selected_genres.splice(selected_genres.indexOf(genre_var), 1)
                        }
                        con.updateSelected(selected_genres)
                    })

                    //display popularity value for hovered genre
                    .on('mouseover', function (d, i) {
                        d3.select(this).style("cursor", "default")

                        const pop_var = d3.select(this).data()[0]['popularity']

                        d3.select(this).transition()
                            .duration('50')
                            .attr('opacity', '.85')

                        tooltip.text('popularity: ' + Math.round(pop_var*100)) 
                                .style("visibility", "visible")
                                .style("left", d.x + "px")     
                                .style("top", d.y + "px")
                                .style("color", "white")

                    })
                    
                    .on("mousemove", function() {
                        d3.select(this).style("cursor", "default")
                    })                    

                    .on('mouseout', function (d, i) {
                        d3.select(this).style("cursor", "default")

                        const pop_var = d3.select(this).data()[0]['popularity']
                        
                        d3.select(this).transition()
                            .duration('50')
                            .attr('opacity', pop_var)

                        tooltip.style("visibility", "hidden")
                    })
            }
        })
    }
}