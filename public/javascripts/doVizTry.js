function loadData(datafile) {

  var inputfile = datafile;
  generateVis(inputfile);
}

/*
"Lun","Value","Timestamp","MetricId","Unit","Description","Entity","EntityId","IntervalSecs","Instance"
"Data-Lun11","283","18-09-2015 10:44:20","disk.numberwrite.summation","number","Number ","drupal-mediamosa","VirtualMachine-vm-90","20","naa.600601600f213300defe98a3a052e311"
*/

function generateVis(queryString) {
  var qStr = queryString.split(",");
  var ds = qStr[0]; //read file
  var param = qStr[1];// parameter for y-val
  var group = qStr[2];// parameter for grouping


  // define the vizarea
  var margin = {top: 30, right: 20, bottom: 30, left: 20},
      width = 1200 - margin.left - margin.right,
      height = 870 - margin.top - margin.bottom;

  // Parse the date / time
  var parseDate = d3.time.format("%d-%m-%Y %H:%M:%S").parse;
  // set the color (max is 20 pr chart)
  var color = d3.scale.category20();


  // Set the ranges
  // x scal on canvas
  var x = d3.time.scale().range([0, width]);
  // y scale on canvas
  var y = d3.scale.linear().range([height, 0]);
  console.log("into SSS");

  // Define the axes
  var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(20).tickFormat(d3.time.format("%H%M"));

  var yAxis = d3.svg.axis().scale(y)
    .orient("right").ticks(5);

  // Define the line
  var rwline = d3.svg.line()
    .x(function(d) { return x(d.Timestamp); })
    .y(function(d) { return y(d.Value); });

  // Adds the svg canvas
  var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Get the data, +d turns it into a number
  d3.csv(ds, function(error, data) {
    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Poll_Time"; }));
    data.forEach(function(d) {
      console.log(d.MetricId);
      if (d.MetricId == param) {
        d.Timestamp = parseDate(d.Timestamp);
        d.Value = +d.Value;
        console.log("P: " + d.Value);
      }
    });
    data.forEach(function(d) {
      console.log(d.Value);
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.Timestamp; }));
    y.domain([0, d3.max(data, function(d) { return d.Value; })]);

    // Nest the entries by symbol
    //.key(function(d) { if (d.Object_Name.match(re)){ return d.Object_Name;}})
    //.key(function(d) { return d.Lun;})
    var dataNest = d3.nest()
    .key(function(d) { return d.Entity;})
    .entries(data);

  // Loop through each symbol / key
  var count = 0;
  dataNest.forEach(function(d) {
    console.log("into nest");
    console.log(d);
  });
  dataNest.forEach(function(d) {
    console.log("ixxnto nest");
    console.log(d);
    svg.append("path")
    .attr("class", "line")
    .style("stroke", function() { 
      console.log("into ...");
    .attr("d", rwline(d.Value));

  svg.append("rect")
    .attr("x", 100)
    .attr("y", 50 + (15 * count))
    .attr("width", 45)
    .attr("height", 10)
    .style("fill", color(d.key));
  svg.append("text")
    .attr("x", 150 )
    .attr("y", 56 + (15 * count))
    .text(function() { return d.key})
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

