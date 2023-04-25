// Function for filtering, averaging and sorting the corelation values.
function processData(data, selected_genres = []) {
  // Filter to contain only the currently selected genres.
  let data_filtered = data.filter(function(d) {
    return selected_genres.length == 0 || selected_genres.includes(d.track_genre)
  })

  // Take the average of each key.
  let data_sum = {}
  for (const p in data_filtered[0]) {
    if (p == 'track_genre') continue;
    data_sum[p] = 0;
  }
  data_filtered.forEach(element => {
    for (const p in element) {
      if (p == 'track_genre') continue;
      data_sum[p] += Math.abs(element[p]);
    }
  });
  let cor_vals = [];
  for (const p in data_sum) {
    cor_vals.push({
      'property': p,
      'value': data_sum[p] / data_filtered.length
    });
  }

  // Sort them from largest to smallest.
  cor_vals.sort((a, b) => {
    if (a["value"] > b["value"]) return -1;
    if (a["value"] < b["value"]) return 1;
    return 0;
  });

  return cor_vals;
}

class ViewA {
  constructor(con, root, name, x, y, w, h, color) {
    this.con = con;
    this.name = name;

    // Create a container div.
    const div = root.append('div')
      .style('position', 'absolute')
      .style('width', `${w}`)
      .style('height', `${h}`)
      .style('left', `${x}`)
      .style('top', `${y}`)

    // Create an SVG to use as a canvas.
    const svg = div.append('svg')
      .attr('width', '100%')
      .attr("height", '100%');

    // Print that the view is connected.
    con.Test(`View ${name} is connected.`)

    // Read the correlation data.
    d3.csv('correlations.csv').then(data => {
      // Process the data.
      let cor_vals = processData(data, []);

      // TODO: Make these meaningful.
      let width = 800;
      let height = 600;
      let padding = 40;

      // Draw the x-axis.
      const x_scale = d3.scaleBand()
        .domain(cor_vals.map((d) => d['property']))
        .range([0, width])
        .padding(0.2);
      svg.append("g")
        .attr("transform", "translate(" + padding + "," + (height + padding) + ")")
        .call(d3.axisBottom(x_scale))
        .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end");

      // Draw the y-axis.
      const y_scale = d3.scaleSqrt()
        .domain([0, 1])
        .range([height, 0]);
      svg.append("g")
        .attr("transform", "translate(" + padding + "," + padding + ")")
        .call(d3.axisLeft(y_scale));

      // Draw the bars.
      svg.selectAll("mybar")
        .data(cor_vals)
        .enter()
        .append("rect")
          .attr("x", (d) => x_scale(d['property']) + padding)
          .attr("y", (d) => y_scale(d['value']) + padding)
          .attr("width", x_scale.bandwidth())
          .attr("height", (d) => height - y_scale(d['value']))
          .attr("fill", "#69b3a2");
    });
    
  }
}