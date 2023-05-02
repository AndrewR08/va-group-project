const selected_genres = [];

class ViewB {
    constructor(con, root, name, x, y, w, h, color) {
        this.con = con
        this.name = name

        d3.csv('correlations.csv').then(data =>{
            console.log(data)

            const div = root.append('div')
                .attr('class', 'view')
                .style("cursor", "default")

            // Add the title to the view.
            div.append('div')
                .attr('class', 'view-title')
                .html('Variance of Genre');

            const svg = div.append('svg')
                .attr("viewBox", "-500 -500 1000 1000")
                .style('margin-top', "max(0px, calc(((100vh - 40px - 8px - 40px) - (50vw - 6px)) / 2))")
                .style('margin-bottom', "max(0px, calc(((100vh - 40px - 8px - 40px) - (50vw - 6px)) / 2))")
                .style('height', 'min(calc(100vh - 8px - 40px - 40px), calc(50vw - 6px))')
                .style('width', 'min(calc(100vh - 8px - 40px), calc(50vw - 6px))');

            div.append('input')
                .attr('id', 'clear-button')
                .attr('type', 'button')
                .attr('value', 'CLEAR SELECTION')
                .on('click', () => {
                    const matches = document.querySelectorAll('[fill*="red"]')
                    matches.forEach( x => d3.select(x).attr("fill", null) )
                    matches.forEach( x => selected_genres.splice(selected_genres.indexOf(d3.select(x).text()), 1))
                    con.updateSelected(selected_genres)
                });

            const word_size_scale = d3.scaleLinear()
                .domain(d3.extent(data, (d) => d.std_dev))
                .range([15, 50])

            const layout = d3.layout.cloud()
                .size([1000, 1000])
                .words(data)
                .padding(10)
                .rotate(0)
                .fontSize((d) => word_size_scale(d.std_dev))
                .on("end", draw)

            layout.start()

            const tooltip = d3.select("body")
                .append("div")
                .style("position", "absolute")
                .style("visibility", "hidden")
                .style("background-color", "rgba(0, 0, 0, 0.8)")
                .style("pointer-events", "none")
                .style("transform", "translate(-50%, 15px)")
                .style('padding', '5px')
                .style("text-align", "center")
            
            tooltip.append('div')
                .attr('id', 'genre-pop')
            
            tooltip.append('div')
                .attr('id', 'genre-std')

            function updateToolTip(d) {
                let sd_var = d3.select(this).data()[0]['std_dev']
                let pop_var = d3.select(this).data()[0]['avg_popularity']
                sd_var = parseFloat(sd_var).toFixed(2)
                pop_var = parseFloat(pop_var).toFixed(2)

                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '.85')

                tooltip.style("visibility", "visible")
                    .style("left", d.x + "px")
                    .style("top", d.y + "px")
                    .style("color", "white")

                d3.select('#genre-std')
                    .text(`Std Dev: ${sd_var}`) 
                
                d3.select('#genre-pop')
                    .text(`Popularity: ${pop_var}`)

            }

            function draw(words) {
                svg
                    .append("g")
                    .selectAll("text")
                    .data(words)
                    .enter()
                    .append("text")
                    .text((d) => d['track_genre'])
                    .style("font-size", (d) => d.size)
                    .style("font-family", "Impact")
                    .attr("text-anchor", "middle")
                    .attr("transform", function (d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"})
                    .attr('opacity', (d) => ((d['avg_popularity'] * 0.8) + 0.2))
                    .style("text-transform", "uppercase")
                    .style("cursor", "pointer")

                    .on('click', function(d) {
                        const genre_var = d3.select(this).text()
                        const pop_var = d3.select(this).data()[0]['avg_popularity']
                        const color = d3.select(this).attr('fill')

                        if (color == null) {
                            d3.select(this).attr("fill", "red")
                            selected_genres.push(genre_var)
                        } else {
                            d3.select(this).attr("fill", null)
                            d3.select(this).attr("opacity", (pop_var * 0.8) + 0.2)
                            selected_genres.splice(selected_genres.indexOf(genre_var), 1)
                        }
                        con.updateSelected(selected_genres)
                    })


                    
                    //display std_dev and popularity values for hovered genre
                    .on('mouseover', updateToolTip)
                    
                    .on("mousemove", updateToolTip)                    

                    .on('mouseout', function (d, i) {
                        //d3.select(this).style("cursor", "default")

                        const sd_var = d3.select(this).data()[0]['std_dev']
                        const pop_var = d3.select(this).data()[0]['avg_popularity']
                        
                        d3.select(this).transition()
                            .duration('50')
                            .attr('opacity', (pop_var * 0.8) + 0.2)

                        tooltip.style("visibility", "hidden")
                    })
            }
        })
    }
}