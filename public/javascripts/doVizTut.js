var ds;
var w;
var h;
var padding = 20;
var count = 0;


function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function loadData(datafile) {
    var inputfile = "./data/vm/10-12-2015-12-14-vmstat.csv,disknumberwritesummation,Lun";
    generateViz(inputfile);
}

function showHeader(str) {
    d3.select("body").append("h1")
        .text(str);
}

function buildGraph(vm) {

    //console.log(JSON.stringify(vm));


    var w = 800;
    var h = 700;
    var padding = 30;
    //18-09-2015 10:44:00
    var format = d3.time.format("%d-%m-%Y %H:%M:%S").parse;
    var parseDate = d3.time.format("%m/%d/%Y %H:%M:%S").parse;
    //var color = d3.scale.category20();

    var count = 0;
    //var vm = vmObj.values;

    vm.forEach(function (d) {
        console.log(JSON.stringify(d.values[0].Timestamp));
        d.values.Timestamp = format(d.values['Timestamp']);
        d.Value = +d.Value;
    });

    vm.forEach(function (d) {
        console.log("A " + d.Timestamp);
    });
    var xMax = d3.max(vm, function (d) {
        return d.Timestamp;
    });
    var xMin = d3.min(vm, function (d) {
        return d.Timestamp;
    });
    var yMax = d3.max(vm, function (d) {
        return d.Value;
    });

    // scale values to domain

    var xScale = d3.time.scale().range([0, (w - padding)]).domain([xMin,xMax]);
    var yScale = d3.scale.linear().range([(h - padding), 0]).domain([0,yMax]);

    var xAxisGen = d3.svg.axis().scale(xScale).orient("bottom").ticks(5);
    var yAxisGen = d3.svg.axis().scale(yScale).orient("left").ticks(5);

    // build the line

    var vizLine = d3.svg.line()
        .x(function (d) {
            console.log("T: " + d.Timestamp);
            return xScale(d.Timestamp);
        })
        .y(function (d) {
            console.log("V: " + d.Value);
            return (yScale(d.Value));
        });

// add the canvas

    var svg = d3.select('body')
        .append("svg")
        .attr('width', w)
        .attr('height', h)
        .append("g")
        .attr("transform","translate("+ 50 +",0)");


    // add the path with values

    svg.append("path")
        .attr("class", "line")
        .attr("d", vizLine(vm));



    var yaxis = svg.append("g")
        .attr("class", "axis")
        .call(yAxisGen);

    var xaxis = svg.append("g")
        .attr("class", "axis")
        .attr("transform","translate(0," + (h - padding) + ")")
        .call(xAxisGen);

}

function buildLine(vm) {

    var vmList = d3.nest()
        .key(function (d) { return d.Entity;})
        /*
        .key(function (d) { return d.Timestamp;})
        .rollup(function(d) {
            return d3.sum(d, function(g) {
                console.log(JSON.stringify(g));
                return g.Value;
            })
            */
        .entries(vm);
    //console.log(JSON.stringify(vmList));
    console.log("keys " + d3.keys(vmList));
    var myKeys = [];

    vmList.forEach( function(d,i) {
        console.log("M " + d.key);
        myKeys.push(d.key);
    });

    var color = d3.scale.linear().domain([1,vmList.length])
        .range(["#007AFF", "#FFF500"])
        .interpolate(d3.interpolateHcl);


    var counterArr = new Array (10);
    var i;

    for (i = 0; i < vmList.length; i++)
    {
        counterArr[i] = i + 0;
    }

    counterArr = shuffle(counterArr);


    //    .range([d3.rgb("#007AFF"), d3.rgb('#FFF500')]);
    /*
    var colMap = myKeys.map(function (item, index) {

    })
    */

    var w = 800;
    var h = 900;
    var padding = 80;
    var ypad = 0;
    //18-09-2015 10:44:00
    var format = d3.time.format("%d-%m-%Y %H:%M:%S").parse;
    var parseDate = d3.time.format("%m/%d/%Y %H:%M:%S").parse;
    //var color = d3.scale.category20();



    var count = 0;
    //var vm = vmObj.values;

    vm.forEach(function (d) {
        console.log(d.MetricId);
        d.Timestamp = format(d.Timestamp);
        d.Value = +d.Value;
    });

    vm.forEach(function (d) {
        //console.log("A " + d.Timestamp);
    });
    var xMax = d3.max(vm, function (d) {
        return d.Timestamp;
    });
    var xMin = d3.min(vm, function (d) {
        return d.Timestamp;
    });
    var yMax = d3.max(vm, function (d) {
        return d.Value;
    });

    console.log("YMA " + yMax);

    // scale values to domain

    var xScale = d3.time.scale().range([0, (w - padding)]).domain([xMin,xMax]);
    var yScale = d3.scale.linear().range([(h - padding), 0]).domain([0,yMax]);

    var xAxisGen = d3.svg.axis().scale(xScale).orient("bottom").ticks(10).tickFormat(d3.time.format("%d%H%M"));
    var yAxisGen = d3.svg.axis().scale(yScale).orient("right").ticks(5);

    var tooltip = d3.select("body").append("div")
        .attr("class","tooltip")
        .style("opacity",0);

    // build the line

    var vizLine = d3.svg.line()
        .x(function (d) {
            //console.log("T: " + d.Timestamp);
            return xScale(d.Timestamp);
        })
        .y(function (d) {
            //console.log("V: " + d.Value);
            return (yScale(d.Value));
        });

// add array of canvas & infobox

    var limit = vmList.length;
    var delimit = 5;
    var svgArr = [];
    var svgInfoArr = [];
    var svgcount=0;

    for (i=0;i<limit;i++) {
        if (i%delimit == 0) {
            console.log("S " + svgcount);
            svgcount++;
            var svg = d3.select('#content')
                .append("svg")
                .attr('width', w)
                .attr('height', h)
                .append("g")
                .attr("transform","translate("+ 50 +","+(delimit+svgcount)+")");

            var yaxis = svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate("+ypad+",0)")
                .call(yAxisGen);

            var xaxis = svg.append("g")
                .attr("class", "axis")
                .attr("transform","translate("+ypad+"," + (h - padding) + ")")
                //.attr("transform","translate(0,"+ (h - delimit*svgcount)+")")
                .call(xAxisGen);

            svgArr.push(svg);


        }
    }


    var svginfobox = d3.select("#footer")
        .append("svg")
        .attr('width',w)
        .attr('height', 20 * (vmList.length))
        .append("g");

    // add the path with values
    var svgcount = -1;
    var base = 'svg';


    vmList.forEach(function (d,i) {
        console.log("K: " + d.key);
        var a = d.key;

        if (i%delimit == 0) { svgcount++;}

        svginfobox.append("text")
            .attr("class", "infotext")
            .attr("x", 160)
            .attr("y", 110 + (i * 15))
            .text(d.key)
            .attr("fill", "black")
            .attr("text-anchor", "bottom");

        svginfobox.append("rect")
            .attr("x", 100)
            .attr("y", 100 + (15 * i))
            .attr("width", 45)
            .attr("height", 15)
            .style("fill", myColors[counterArr[i]]);

        console.log("APPENDING " + svgcount + " " + d.key);
        svgArr[svgcount].append("path")
            .attr("class", "line")
            .style("stroke", function() {
                return d.color = myColors[counterArr[i]]})
            .attr("d", vizLine(d.values))
            // Tooltip stuff after this
            .on('mouseover', function(){
                tooltip.transition()
                    .duration(500)
                    .style("opacity",0.8)
                tooltip.html("<strong>" + d.key + "</strong>" )
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            });

    });


}


/*
 0: Object
 Description: "Number of disk writes during the collection interval"
 Entity: "drupal-mediamosa"
 EntityId: "VirtualMachine-vm-90"
 Instance: "naa.600601600f213300defe98a3a052e311"
 IntervalSecs: "20"
 Lun: "Data-Lun11"
 MetricId: "disk.numberwrite.summation"
 Timestamp: "18-09-2015 10:44:20"
 Unit: "number"
 Value: "283"
 */

function generateViz(queryString) {
    //"./data/vm/test3.csv,disknumberwritesummation,Lun"

    console.log(queryString);
    var qStr = queryString.split(',');
    var tmpinputFile = qStr[0];
    var metric = qStr[1];
    var lunFilter = qStr[2];


    var inputFile = "./data/vm/csv/" + metric + "-" + tmpinputFile + "-vmstat.csv";
    //var inputFile = "./data/vm/csv/test3.csv";

    var w = screen.width;
    var h = screen.height;

    console.log(qStr);



    d3.csv(inputFile, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            ds = data.filter(function(row) {
                return row['MetricId'] == metric;

            });
            ds = ds.filter(function(row) {
                return row['Lun'] == lunFilter;
            });

            //console.log(JSON.stringify(ds));
        }
        console.log(metric + " " + lunFilter + " " + inputFile);
        buildLine(ds);



    });


}