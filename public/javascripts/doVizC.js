function loadData(datafile) {


  /*
     var elem = document.getElementById('ab');
  //var filter = elem.value;
  var txt = "lun";
  console.log("FIL: " + filter);
  console.log("T: " + txt);
  if (filter.contains('test')) {
  var inputfile = filter;
  filter = "Lun";
  } else {
  var inputfile = "/viz/data/allTotal.json";
  }


  //var inputfile = "/viz/data/allTotal.json";
  var inputfile = datafile;
  d3.(datafile , function(error, data) {
    console.log("into AAA " + inputfile);
    if (error) {
      console.log(error);
    }

    data.forEach(function(ds){
      //console.log(ds['object']);
      console.log(ds['object']);
      showHeader(ds);
      generateVis(ds);
    });
  });
*/
  var inputfile = datafile;
  generateVis(inputfile);
}

function generateVis(ds) {
  var margin = {top: 30, right: 20, bottom: 30, left: 20},
      width = 1200 - margin.left - margin.right,
      height = 1200 - margin.top - margin.bottom;

  // Parse the date / time
  // 04-09-2015 09:55:40
  var parseDate = d3.time.format("%d-%m-%Y %H:%M:%S").parse;
  var color = d3.scale.category20();


  // Set the ranges
  var x = d3.time.scale().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);

  // Define the axes
  var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(20).tickFormat(d3.time.format("%d%H%M"));

  var yAxis = d3.svg.axis().scale(y)
    .orient("right").ticks(5);

  // Define the line
  var rwline = d3.svg.line()
    .defined(function(d) { return d.Value != null; })
    .x(function(d) { return x(d.Poll_Time); })
    .y(function(d) { return y(d.param); });

  // Adds the svg canvas
  var svg = d3.select('.draw')
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Get the data, +d turns it into a number
  d3.csv(ds, function(error, data) {
    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "ts"; }));
    data.forEach(function(d) {
      d.Timestamp = parseDate(d.Timestamp);
      d.MetridId = +d.MetridId;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.Timestamp; }));
    y.domain([0, d3.max(data, function(d) { return d.Value; })]); 

    // Nest the entries by symbol
    var dataNest = d3.nest()
    .key(function(d) {
      console.log(d.Entity);
      return d.Entity;})
    .entries(data);

  // Loop through each symbol / key
  var count = 0;
  dataNest.forEach(function(d) {
    count++;
    console.log("K: " + d.key);
    svg.append("path")
    .attr("class", "line")
    .style("stroke", function() {
      return d.color = color(d.key);})
    .attr("d", rwline(d.values));

  svg.append("rect")
    .attr("x", 100)
    .attr("y", 50 + (15 * count))
    .attr("width", 45)
    .attr("height", 10)
    .style("fill", color(d.key));
  svg.append("text")
    .attr("x", 150 )
    .attr("y", 56 + (15 * count))
    .text(d.key)
    .attr("fill", "black")
    .attr("text-anchor", "top");

  });

  //

  // Add the X Axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // Add the Y Axis
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  });
}

