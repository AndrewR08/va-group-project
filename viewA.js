// Set the padding values.
const padding_top = 40;
const padding_bottom = 120;
const padding_left = 60;
const padding_right = 40;

// Function for filtering, averaging and sorting the corelation values.
function processData(data, selected_genres = []) {
  // Filter to contain only the currently selected genres.
  let data_filtered = data.filter(function(d) {
    return selected_genres.length == 0 || selected_genres.includes(d.track_genre)
  })

  // Take the average of each key.
  let data_sum = {}
  for (const p in data_filtered[0]) {
    if ((p == 'track_genre') || ((p == 'std_dev'))) continue;
    data_sum[p] = 0;
  }
  data_filtered.forEach(element => {
    for (const p in element) {
      if ((p == 'track_genre') || ((p == 'std_dev'))) continue;
      data_sum[p] += Math.abs(element[p]);
    }
  });
  let cor_vals = {};
  for (const p in data_sum) {
    cor_vals[p] = data_sum[p] / data_filtered.length;
  }

  return cor_vals;
}


class ViewA {
  constructor(con, root, name) {
    // Create a container div.
    const div = root.append('div')
      .attr('class', 'view');

    // Create an SVG to use as a canvas.
    this.svg = div.append('svg')
      .attr('width', '100%')
      .attr("height", '100vh');

    // Add the axes.
    this.x_axis = this.svg.append("g");
    this.y_axis = this.svg.append("g");

    // Read the correlation data.
    d3.csv('correlations.csv').then(data => {
      this.data = data;
      this.cor_vals = processData(data, []);

      // Add a bar for each property
      this.bars = {};
      for (const p in this.cor_vals) {
        this.bars[p] = this.svg
          .append("rect")
          .attr("fill", "#FF0000");
      }

      // Update the height and width then draw the graph.
      this.updateScales();
      this.draw();

      // Update the scale and update the graph whenever the window is adjusted.
      d3.select(window).on('resize', () => {
        this.updateScales();
        this.draw();
      });
    });
  }

  // Determine the current height and width of the SVG, then update the scales.
  updateScales() {
    this.width = this.svg.node().getBoundingClientRect()['width'];
    this.height = this.svg.node().getBoundingClientRect()['height'];
    this.x_scale = d3.scaleBand()
      .domain(Object.keys(this.cor_vals))
      .range([0, this.width - padding_left - padding_right])
      .padding(0.2);
    this.y_scale = d3.scaleSqrt()
      .domain([0, 1])
      .range([this.height - padding_top - padding_bottom, 0]);
  }

  updateSelectedGenres(selected_genres) {
    this.cor_vals = processData(this.data, selected_genres);
    this.updateScales();
    this.draw();
  }

  draw() {
    // Update the y-axis.
    this.x_axis
      .attr("transform", "translate(" + padding_left + "," + (this.height - padding_bottom) + ")")
      .call(d3.axisBottom(this.x_scale))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end")
        .style("font-size", '16');
  
    // Draw the y-axis.
    this.y_axis
      .attr("transform", "translate(" + padding_left + "," + padding_top + ")")
      .call(d3.axisLeft(this.y_scale))
      .style("font-size", '16');

    for (const p in this.cor_vals) {
      this.bars[p]
        .transition()
        .attr("x", this.x_scale(p) + padding_left)
        .attr("y", this.y_scale(this.cor_vals[p]) + padding_top)
        .attr("width", this.x_scale.bandwidth())
        .attr("height", (this.height - padding_bottom - padding_top) - this.y_scale(this.cor_vals[p]))
    }
  }
}