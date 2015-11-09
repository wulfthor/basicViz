function loadData(datafile) {

    var inputfile = datafile;
    generateVis(inputfile);
}

function generateVizSAN(queryString) {
    console.log(queryString);
    var qStr = queryString.split(",");
    var tmpds = qStr[0];
    var param = qStr[1];
    var lunTarget = qStr[2];


    var ds = "data/emc/csv/2015-" + tmpds + "-ALL.csv";

    var margin = {top: 30, right: 20, bottom: 70, left: 20},
        width = 900 - margin.left - margin.right,
        height = 870 - margin.top - margin.bottom;

    // Parse the date / time
    var parseDate = d3.time.format("%m/%d/%Y %H:%M:%S").parse;
    var color = d3.scale.category20();


    // Set the ranges
    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
        //.orient("bottom").ticks(20);
        .orient("bottom").ticks(20).tickFormat(d3.time.format("%m%d-%H%M"));

    var yAxis = d3.svg.axis().scale(y)
        .orient("right").ticks(5);

    // Define the line
    var rwline = d3.svg.line()
        .x(function(d) {return x(d.Poll_Time);})
        .y(function(d) {return y(d[param]); });

    // Adds the svg canvas
    var svg = d3.select("#sancontent")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Get the data, +d turns it into a number
    d3.csv(ds, function(error, data) {
        color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Poll_Time"; }));
        data.forEach(function(d) {
            d.Poll_Time = parseDate(d.Poll_Time);
            d[param] = +d[param];
        });

        // Scale the range of the data
        x.domain(d3.extent(data, function(d) {return d.Poll_Time; }));
        y.domain([0, d3.max(data, function(d) {return d[param]; })]);

        // Nest the entries by symbol
        //.key(function(d) { if (d.Object_Name.match(re)){ return d.Object_Name;}})
        var re =/lun/i;
        var dataNest = d3.nest()
            .key(function(d) {
                console.log("OOBN: " + d.Object_Name);
                return d.Object_Name;})
            .entries(data);

        // Loop through each symbol / key
        var count = 0;
        dataNest.forEach(function(d) {
            var testName = d.key;
            if (testName.indexOf(lunTarget)) {
                count++;
                rwline(d.values);
                 svg.append("path")
                 .attr("class", "line")
                 .style("stroke", function() {
                 return d.color = color(d.key.split('[')[0]);})
                 //.attr("d", d="M 100 350 l 150 -300");
                 .attr("d", d=rwline(d.values));
            }

        });

        //

        // Add the X Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(45)")
            .style("text-anchor", "start");

        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);


    });
}

