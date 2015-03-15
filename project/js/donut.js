function donut(){

    var self = this;
    var objects = {};
    var summedValueOfDatum = [];
    var typeOfDatum = ["Protein(g)", "Fett(g)", "Kolhydrater(g)","Fibrer(g)","Salt(g)","Vatten(g)"];
    var totalGram = 0;

    var pcDiv = $("#donut");

    var color = d3.scale.category10();

    var margin = [30, 10, 10, 10],
        width = pcDiv.width() - margin[1] - margin[3],
        height = pcDiv.height() - margin[0] - margin[2],
        radius = (Math.min(width, height) / 2) - margin[0] - margin[2];

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 70);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d, i) {
            return d["sum"]; }); // Detta ändras beroende på vad vi vill pie ska delas upp enligt. 

    var svg = d3.select("#donut").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d, i) {
            var procentRDI = Math.round(100 * procent(d,i))
            return "<strong>" + d.type + ":</strong> <span style='color:" + color(i) + "'>" + procentRDI + "% av RDI</span>";
        });

    
    d3.csv("data/livsmedelKorrekt.csv", function(data) {
        self.data = data;
        var index = 0;
        var dataFoo = [];
        var summedIntake = {};
        var idOfDatum = [710];

        foo = processdata(idOfDatum)
    });
    
    function processdata(choosenFoodNumber) {
        var choosenDatum = [], 
            calIntake = [],
            summedCalIntake = [];

        typeOfDatum.forEach(function(o){
            calIntake[o] = 0;
        });

        totalGram = 0;
        var index = 0;
        self.data.forEach(function(c){
            choosenFoodNumber.forEach(function(cfn){
                if(c["Livsmedelsnummer"] == cfn) {
                    typeOfDatum.forEach(function(t){
                        calIntake[t] += +c[t];
                        totalGram += +c[t];
                    })
                    index++;
                }
            })
        });

        typeOfDatum.forEach(function(f){
            summedCalIntake.push({
                type: f,
                sum: +calIntake[f]     
            })
        })
        draw(summedCalIntake);
    }

    //function draw(data, intake){
    function draw(intake){
        svg.selectAll("*").remove();

        var g = svg.selectAll(".arc")
            .data(pie(intake))
            .enter().append("g")
            .attr("class", "arc");

        var indexColor = 0;
        g.append("path")
            .attr("d", arc)
            .style("fill", function(d) {
                var sendColor = color(indexColor);
                if(indexColor == 5) {
                    indexColor++;
                    var sendColor = color(indexColor);
                }
                indexColor++;
                return sendColor;
            });
        
        // TA X,Y POS SEN RITA ut text utanför?
        var indexText = 0;
        g.append("text")
            .attr("class", "text")
            .attr("transform", function(d) {
                    var c = arc.centroid(d),
                        x = c[0],
                        y = c[1],
                    h = Math.sqrt(x*x + y*y);
                    return "translate(" + (x/h * (radius+10)) +  ',' + (y/h * (radius+10)) +  ")"; 
                })
            .attr("dy", ".35em")
            .attr("text-anchor", function(d) {
                    return (d.endAngle + d.startAngle)/2 > Math.PI ? "end" : "start";
                })
            .text(function(d, i) {
                var percent = Math.round((intake[i]["sum"] / totalGram) * 100);
                var text = percent + "% " + intake[i]["type"];
                indexText++;
                // Kanske ska lösas snyggare
                if(percent != 0)
                    return text;
                else
                    return null;
            });
    }

    this.update = function(dataNumb) {
        processdata(dataNumb);
    }
}

