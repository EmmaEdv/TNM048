function map(){

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 8])
        .on("zoom", move);

    var mapDiv = $("#map");

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = mapDiv.width() - margin.right - margin.left,
        height = mapDiv.height() - margin.top - margin.bottom;


    //initialize tooltip
    var div = d3.select("body").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

    var projection = d3.geo.mercator()
        .center([50, 60 ])
        .scale(250);

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom);

    var path = d3.geo.path()
        .projection(projection);

    g = svg.append("g");

    // load data and draw the map
    d3.json("data/world-topo.json", function(error, world) {
        var countries = topojson.feature(world, world.objects.countries).features;

        d3.csv("data/OECD-better-life-index-hi.csv", function(error, data) {
            self.data = data;
            draw(countries, self.data);
        });
        
        
    });

    function draw(countries,data)
    {
        var country = g.selectAll(".country").data(countries);
        
        //initialize a color country object	

        country.enter().insert("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("id", function(d) { return d.id; })
            .attr("title", function(d) { return d.properties.name; })
            //country color
            //...
            .attr("fill", function(d){
                var cColor = "#000";
                countryColor.forEach(function(c){
                    if(d.properties.name == c.Country){
                        cColor = c.Color;
                    }
                });
                return cColor;
            })
            .on("mousemove", function(d) {
                console.log("ÖVER");
                console.log(d["Country"]);
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(d.properties.name)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px"); 
            })
            .on("mouseout", function(d) {
                div.transition()        
                    .duration(500)      
                    .style("opacity", 0);  
            })
            //selection
            .on("click",  function(d) {
                selFeature(d);
            });

    }
    
    //zoom and panning method
    function move() {

        var t = d3.event.translate;
        var s = d3.event.scale;
        

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");

    }
    
    //method for selecting features of other components
    function selFeature(value){
        var sendCounrty = [];
        sendCounrty.push(value.properties.name);
        sp1.selectDot(sendCounrty);
        pc1.selectLine(sendCounrty);
    }
}

