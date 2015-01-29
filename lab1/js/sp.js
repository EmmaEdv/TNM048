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
    //...

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

    var brush = d3.svg.brush()
        .x(x)
        .y(y)
        .extent([86,88])
        .on("brush", brushed) // Skapar ett intervall och markerar dessa som selected
        .on("brushend", brushend); // rensar intervallet


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
        console.log("Jag är här!")   
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
            //tooltip
            .on("mousemove", function(d) {
                //...    
            })
            .on("mouseout", function(d) {
                //...   
            })
            .on("click",  function(d) {
                console.log(d["Country"]);
                var extentFoo = [[86,88], []];
                brush.extent(extentFoo);
                brush.event;
                brushed();
                //return append("text").text(d["Country"]);
            });
    }

    function brushed() {
        var extent = brush.extent(); // Ger oss max/min
        console.log("bruschehs");
        svg.selectAll(".dot").classed("hidden", function(d){ //
            //console.log(d)
            return extent[0] <= d["Life satisfaction"];// || d["Life satisfaction"] <= extent[1];
            //return true;
        });

    }

    function brushend(){}

    //method for selecting the dot from other components
    this.selectDot = function(value){
        svg.selectAll(".dot")
        .attr("fill", "#000");
       /* //... Ändra style här i, precis som i pc:
        var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
            // hitta intervallet  och spara
            extents = actives.map(function(p) { return y[p].brush.extent(); });
            // Visa dessa markerade mha css
        dot.style("fill", function(d) {
            
            return actives.every(function(p, i) {
                // ligger värdet i intervallet
                //Se till att countryColor sätter style globalt! 
                return extents[i][0] <= d[p] && d[p] <= extents[i][1];
            }) ? "gray" : "none";
        });*/
    };
    
    //method for selecting features of other components
    function selFeature(value){
        //...
        svg.selectAll(".dot")
        .attr("fill", "#000");
    }

}




