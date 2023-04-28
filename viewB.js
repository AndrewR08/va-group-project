const selected_genres = [];

class ViewB {
    constructor(con, root, name, x, y, w, h, color) {
        this.con = con
        this.name = name

        console.log(con)
        d3.csv('correlations.csv').then(data =>{
            console.log(data)

            const div = root.append('div')
                .attr('class', 'view');

            const svg = div.append('svg')
                .attr("viewBox", "0 0 1000 1000")
                .style('margin-top', "max(0px, calc(((100vh - 35px - 8px) - (50vw - 6px)) / 2))")
                .style('margin-bottom', "max(0px, calc(((100vh - 35px - 8px) - (50vw - 6px)) / 2))")
                .style('height', 'min(calc(100vh - 8px - 35px), calc(50vw - 6px))')
                .style('width', 'min(calc(100vh - 8px - 35px), calc(50vw - 6px))');

            div.append('input')
                .attr('id', 'clear-button')
                .attr('type', 'button')
                .attr('value', 'CLEAR SELECTION')
                .on('click', () => {
                    // TODO: Clear the selected genres.
                    console.log('clear')
                    const matches = document.querySelectorAll('[fill*="red"]')
                    matches.forEach( x => d3.select(x).attr("fill", null) )
                    matches.forEach( x => selected_genres.splice(selected_genres.indexOf(d3.select(x).text()), 1))
                    con.updateSelected(selected_genres)
                });

            const layout = d3.layout.cloud()
                .size([1000, 1000])
                .words(data)
                .padding(2)
                .rotate(()=>Math.floor(Math.random()*2)*270)
                .fontSize(d=>(d.std_dev*50))
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
                    .attr('opacity', (d) => d['std_dev'])
                    .style("cursor", "default")

                    .on('click', function(d) {
                        d3.select(this).style("cursor", "default")

                        const genre_var = d3.select(this).text()
                        const pop_var = d3.select(this).data()[0]['std_dev']
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

                        var pop_var = d3.select(this).data()[0]['std_dev']
                        pop_var = parseFloat(pop_var).toFixed(2)
                        //console.log(pop_var)

                        d3.select(this).transition()
                            .duration('50')
                            .attr('opacity', '.85')

                        tooltip.text('Std Dev: ' + pop_var) 
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

                        const pop_var = d3.select(this).data()[0]['std_dev']
                        
                        d3.select(this).transition()
                            .duration('50')
                            .attr('opacity', pop_var)

                        tooltip.style("visibility", "hidden")
                    })
            }
        })
    }
}