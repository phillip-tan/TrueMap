console.log('Hello World')

var svg = d3.select("svg");
var path = d3.geoPath(); // initialize the drawing pattern as a geometric shape

// Data will appear when hovering over a particular state.
var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip");

// State color to indicate time until license expiration will be a color gradient.
var stateColor = d3.scaleLinear()
  .domain([0, 365])
	.range(['red', '#ddd', 'lightgreen']);


var legendText = ["Most Expiring", "Neutral", "Least Expiring"];
// Legend will display most expiring, neutral, and least expiring example color tones from gradient.
var legendColor = d3.scaleLinear()
  .domain([0, 3])
  .range(['red', '#ddd', 'lightgreen']);


var legend = d3.select("body").append("svg")
  .attr("class", "legend")
  .attr("width", 140)
  .attr("height", 200)
  .selectAll("g")
  .data(legendColor.domain().slice().reverse())
 // enter allows you to bring in data that don't have elements bound to them
 // append binds the data to the new element
  .enter().append("g")
  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });


// Add the colors to legend.
legend.append("rect")
  .attr("width", 18)
 	.attr("height", 18)
 	.style("fill", legendColor);

// Add the labels to legend.
legend.append("text")
  .data(legendText)
  .attr("x", 24)
  .attr("y", 9)
  .attr("dy", ".35em")
  .text(function(d) { return d; });


function onClick(d) {
  console.log("click")
}

function onMouseover(d) {
  console.log("mouseover")
  tooltip.transition()
         .duration(200)
         .style("opacity", .9);
  // this places the tooltip right above the hovered us state
  tooltip.text(d.place)
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY - 28) + "px")
}

function onMouseout(d) {
  console.log("mouseout")
  tooltip.transition()
         .duration(500)
         .style("opacity", 0)
}



function drawMap(error, us) {
  if (error) throw error // establish error handler for callback function

  svg.append("g") // add group element to the svg
      .attr("class", "states") // draw all of the states with a class attribute in the json
    .selectAll("path") // allows manipulation of anything within a state border
    .data(topojson.feature(us, us.objects.states).features) // data join for state land
    .enter().append("path") // add new data since last data join, add path element
      .attr("d", path) // d attribute defines a path to be drawn, draws state land
      .on("mouseover", onMouseover) // the g element above cannot capture clicks
      .on("mouseout", onMouseout) // must do event listener on path element
      .on("click", onClick)

  console.log('break point')
  // draw all of the overlapping borders
  svg.append("path")
      .attr("class", "state-borders")
      .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })))
};



d3.json("https://d3js.org/us-10m.v1.json", drawMap)
