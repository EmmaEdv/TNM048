var countryColor = [];
function sp(){

    var self = this; // for internal d3 functions

    var spDiv = $("#sp");

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = spDiv.width() - margin.right - margin.left,
        height = spDiv.height() - margin.top - margin.bottom;

    //initialize color scale
    //...
    var color20 = d3.scale.category20();
    var color20b = d3.scale.category20b();
    //initialize tooltip
    var div = d3.select("body").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

//var countryText = svg.selectAll("text").data(self.data)

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#sp").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    //Load data
    d3.csv("data/OECD-better-life-index-hi.csv", function(error, data) {
        self.data = data;
        
        //define the domain of the scatter plot axes

        //Från lab 0
        //Household income
        var xScale = x
            .domain([0, d3.max(self.data, function(d) { return d["Household income"]; })]);

        //Employment rate
        var yScale = y
            .domain([0, d3.max(self.data, function(d) { return d["Employment rate"]; })]);

        //console.log(d3.max(self.data, function(d) { return d[1]; }));

        setColor(self.data);
        
        draw();

    });

    function setColor(data){
        //kolla ifall mer än 20, använd color20b i så fall. Annars color20
        var index = 0;
         data.forEach(function(d){
            countryColor.push({
                Country: d["Country"],
                Color: index>20 ? color20b(index-20) : color20(index),
                Style: ".hidden"
            });
            index++;
        });
        //console.log(countryColor);
    }

    function draw()
    {
        // Add x axis and title.
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Household income");
            
        // Add y axis and title.
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Employment rate");
            
        // Add the scatter dots.
        svg.selectAll(".dot")
            .data(self.data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("fill", function(d){
                var cColor = "#000";
                countryColor.forEach(function(c){
                    if(d["Country"] == c.Country){
                        cColor = c.Color;
                    }
                });
                return cColor;
            })
            //Define the x and y coordinate data values for the dots
            .attr("cx", function(d){
                return x(d["Household income"]);
            })
            .attr("cy", function(d){
                return y(d["Employment rate"]);
            })
            .attr("r", function(d){
                return d["Life satisfaction"]/8;
            })
            .on("mousemove", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(d["Country"])
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px"); 
            })
            .on("mouseout", function(d) {
                div.transition()        
                    .duration(500)      
                    .style("opacity", 0);  
            })
            .on("click",  function(d) {
                selFeature(d)
            });
    }

    //method for selecting the dot from other components
    this.selectDot = function(value){
        //var selectedColor;
        svg.selectAll(".dot").attr("fill", function(d){ //
            var selectedColor = "#ccc"

            value.forEach(function(v){
                countryColor.forEach(function(c){
                    if(v == d["Country"] && v == c.Country)
                        selectedColor = c.Color;
                })
            });

            return selectedColor;
        });
    };
    
    //method for selecting features of other components
    function selFeature(value){
        svg.selectAll(".dot").attr("fill", function(d){ //
            // Select lines in pc
            pc1.selectLine(value["Country"]);

            var selectedColor = "#ccc"
            countryColor.forEach(function(c){
                if(value["Country"] == c.Country && value["Country"] == d["Country"]){
                    selectedColor = c.Color;
                }
            });
            return selectedColor;
        });
    }

}




