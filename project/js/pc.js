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
        .value(function(d) {return d["Energi (kJ)(kJ)"]; });

    var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    
    d3.csv("data/livsmedelKomma.csv", function(data) {
        self.data = data;
        console.log(data[0])
        var index = 0;
        var dataFoo = [];
     
        self.data.forEach(function(c){
            //console.log(c);
            if(index < 10){
                //console.log(c["Energi (kJ)(kJ)"]);
                dataFoo.push(c);
                /*dataFoo.push({
                    Namn: c["Livsmedelsnamn"],
                    Energi: c["Energi (kJ)(kJ)"]});*/
                index++;
            }
        });
        console.log(dataFoo)
        /*var g = svg.selectAll(".arc")
            .data(pie(dataFoo))
            .enter().append("g")
            .attr("class", "arc");

        g.append("path")
            .attr("d", arc)
            .style("fill", function(d) { return color(1); });*/
        draw(dataFoo);
    });

    function draw(data){
    
        var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        var indexColor = 0;
        g.append("path")
            .attr("d", arc)
            .style("fill", function(d) { 
                var sendColor = color(indexColor);
                indexColor++;
                console.log(indexColor);
                return sendColor;
            });

        var indexText = 0;
        g.append("text")
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .text(function(d) {
                //console.log(data[1]["Energi (kJ)(kJ)"]);
                var text = data[indexText]["Livsmedelsnamn"];
                indexText++;
                return text; 
            });

    }
   
   
}

