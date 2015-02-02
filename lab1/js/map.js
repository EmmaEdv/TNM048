function map(){

    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 8])
        .on("zoom", move);

    var mapDiv = $("#map");

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = mapDiv.width() - margin.right - margin.left,
        height = mapDiv.height() - margin.top - margin.bottom;

    //initialize color scale
    //...
    //Nånting 20 färger
    var color = d3.scale.category20().range();
    //Färgskala?
    var colorScale = d3.scale.ordinal().range(color);

    //initialize tooltip
    //...

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

        //load summary data
        //...

        d3.csv("data/OECD-better-life-index-hi.csv", function(error, data) {
            self.data = data;
            
            //define the domain of the scatter plot axes
            //...  
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
            /*.attr("fill", function(d){
                /*if(country name == country name in current data file)
                return only if the country exists in the csv file
                    return color(d["Household income"]);
            })*/
            //.style()
            //tooltip
            .on("mousemove", function(d) {
                //...
            })
            .on("mouseout",  function(d) {
                //...
            })
            //selection
            .on("click",  function(d) {
                //...
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
        // TA LAND OCH KALLA PÅ DE ANDRA
    }
}

