function pc(){

    var self = this; // for internal d3 functions

    var pcDiv = $("#pc");

    var margin = [30, 10, 10, 10],
        width = pcDiv.width() - margin[1] - margin[3],
        height = pcDiv.height() - margin[0] - margin[2];

    
    //initialize color scale
    //...
    var color = d3.scale.category20();
    
    //initialize tooltip
    //...

    var x = d3.scale.ordinal().rangePoints([0, width], 1),
        y = {};
        

    var line = d3.svg.line(),
        axis = d3.svg.axis().orient("left"),
        background,
        foreground;

    var svg = d3.select("#pc").append("svg:svg")
        .attr("width", width + margin[1] + margin[3])
        .attr("height", height + margin[0] + margin[2])
        .append("svg:g")
        .attr("transform", "translate(" + margin[3] + "," + margin[0] + ")");

    //Load data
    d3.csv("data/OECD-better-life-index-hi.csv", function(data) {

        self.data = data;

        // Extract the list of dimensions and create a scale for each.
        //...
        x.domain(dimensions = d3.keys(self.data[0]).filter(function(d) {
            //For every axis get max/min 
            return d != "Country" && (y[d] = d3.scale.linear()
                .domain(d3.extent(self.data,function(p){
                    //d: each column/category, p: each row
                    return +p[d];
                })).
                range([height, 0]));
           })
        );

        draw();
    });

    function draw(){
        // Add grey background lines for context.
        background = svg.append("svg:g")
            .attr("class", "background")
            .selectAll("path")
            //add the data and append the path 
            .data(self.data)
            .enter().append("path")
            .attr("d", path)
            .on("mousemove", function(d){})
            .on("mouseout", function(){});

        // Add blue foreground lines for focus.
        foreground = svg.append("svg:g")
            .attr("class", "foreground")
            .selectAll("path")
            //add the data and append the path 
            .data(self.data)
            .enter().append("path")
            .attr("d", path)
            .attr("stroke", function(d){
                var cColor = "#000";
                countryColor.forEach(function(c){
                    if(d["Country"] == c.Country){
                        cColor = c.Color;
                    }
                });
                return cColor;
            })
            .on("mousemove", function(){})
            .on("mouseout", function(){});

        // Add a group element for each dimension.
        var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("svg:g")
            .attr("class", "dimension")
            .attr("transform", function(d) { return "translate(" + x(d) + ")"; });
            
        // Add an axis and title.
        g.append("svg:g")
            .attr("class", "axis")
            //add scale
            .each(function(d){
                //Skalan som hämtats från datasetet
                d3.select(this).call(axis.scale(y[d]))
            })
            .append("svg:text")
            .attr("text-anchor", "middle")
            .attr("y", -9)
            .text(String);

        // Add and store a brush for each axis.
        g.append("svg:g")
            .attr("class", "brush")
            .each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);
    }

    // Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
        // finns det värden, spara dem i actives aka markerade länder
        var brushCountry = [];
        var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
            // hitta intervallet  och spara
            extents = actives.map(function(p) { return y[p].brush.extent(); });
            // Visa dessa markerade mha css
        foreground.style("display", function(d) {
            return actives.every(function(p, i) {
                // ligger värdet i intervallet ? ja: foreground style = null else: foreground style: "none"
                var isSelected = extents[i][0] <= d[p] && d[p] <= extents[i][1];
                // KAN NOG LÖSAS SNYGGARE
                if(isSelected) {
                    brushCountry.push(d["Country"]);
                }
                return isSelected;
            }) ? null : "none";
                   
        });
        // "higlight" the selected countries.
        sp1.selectDot(brushCountry);
    }

    //method for selecting the pololyne from other components	
    this.selectLine = function(value){
        foreground.style("display", function(d) {
            return d["Country"] == value ? null : "none";
        });

    };
    
    //method for selecting features of other components
    function selFeature(value){
        //...
    };

}
