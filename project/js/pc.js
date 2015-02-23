function pc(){

    var self = this; // for internal d3 functions

    var pcDiv = $("#pc");

    var color = d3.scale.category10();

    var width = 960,
        height = 500,
        radius = Math.min(width, height) / 2;

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 70);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {return d["Livsmedelsnummer"]; });

    var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    
    d3.csv("data/livsmedel.csv", function(data) {
        
        self.data = data;
        console.log(data[3])
        
        
        draw(data);
    });

    function draw(data){
    
        /*var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        g.append("path")
            .attr("d", arc)
            .style("fill", function(d) { return color(color(index)); });*/  
    

    }
   
   
}

