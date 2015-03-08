function donut(){

    var self = this; // for internal d3 functions

    // var objects = {"Protein(g)", "Fett(g)", "Kolhydrater(g)","Fibrer(g)","Salt(g)","Vatten(g)"};
    var objects = {};
    var summedValueOfDatum = [];
    var typeOfDatum = ["Protein(g)", "Fett(g)", "Kolhydrater(g)","Fibrer(g)","Salt(g)","Vatten(g)"];
    var totalGram = 0;

    var pcDiv = $("#donut");

    var color = d3.scale.category10();

    var margin = [30, 10, 10, 10],
        width = pcDiv.width() - margin[1] - margin[3],
        height = pcDiv.height() - margin[0] - margin[2],
        //width = 960,
        //height = 500,
        radius = (Math.min(width, height) / 2) - margin[0] - margin[2];

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 70);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d, i) {
            return d["sum"]; }); // Detta ändras beroende på vad vi vill pie ska delas upp enligt. Nu är det
        //.value(function(d) {return d["Fett(g)"]; });

    var svg = d3.select("#donut").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

    
    d3.csv("data/livsmedelKorrekt.csv", function(data) {
        self.data = data;
        var index = 0;
        var dataFoo = [];
        var summedIntake = {};
        var idOfDatum = [710];

        // DETTA KAN NOG GÖRAS I PROCcESS
        /*self.data.forEach(function(c){
            if(index < 4){
                idOfDatum.push(c["Livsmedelsnummer"]);
                index++;
            }
        });*/

        // MÅSTE FINNAS ETT BÄTTRE SÄTT!!!!!! För man inte kan += ett var utan värde
        /*typeOfDatum.forEach(function(o){
            summedIntake[o] = 0;
        });
     
        self.data.forEach(function(c){

            if(index < 4){
                dataFoo.push(c);
                typeOfDatum.forEach(function(o){
                    summedIntake[o] += +c[o];
                    totalGram += +c[o];
                })
                
                index++;
            }
        });

        // DETTA GÖRS BARA FÖR ATT PIE VILL HA DET [object, object object]. Vet inte hur man löser med {protein: .....}
        typeOfDatum.forEach(function(f){
            summedValueOfDatum.push({
                type: f,
                sum: +summedIntake[f]     
            })
        })*/
      //  console.log(idOfDatum);
        foo = processdata(idOfDatum)
        //draw(foo[0], foo[1]);
        //console.log("innan draw: " + foo[1][3].sum);
        //draw(foo[1]);
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
                    //console.log("inne")
                    //choosenDatum.push(c);
                    typeOfDatum.forEach(function(t){
                        calIntake[t] += +c[t];
                        totalGram += +c[t];
                    })
                    index++;
                    /*dataFoo.push({
                        Namn: c["Livsmedelsnamn"],
                        Energi: c["Energi (kJ)(kJ)"]});*/
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
        //return [choosenDatum, summedCalIntake]
        
    }

    //function draw(data, intake){
    function draw(intake){
        
        //console.log(data);
        //console.log(intake);
        //console.log(typeOfDatum);
        //console.log("INTAKE: " + intake)
        svg.selectAll("*").remove();

        //console.log("DRAW INTAKE: " + intake[1].sum)
        var g = svg.selectAll(".arc")
            .data(pie(intake))
            .enter().append("g")
            .attr("class", "arc");

        //console.log([intake])

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

        // TA X,Y POS SEN RITA?

        var indexText = 0;
        g.append("text")
            .attr("class", "text")
            .attr("transform", function(d) {
                var c = arc.centroid(d),
                    x = c[0],
                    y = c[1],
                    // pythagorean theorem for hypotenuse
                h = Math.sqrt(x*x + y*y);
                return "translate(" + (x/h * (radius+10)) +  ',' + (y/h * (radius+10)) +  ")"; 
                })
            //.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .attr("text-anchor", function(d) {
                    return (d.endAngle + d.startAngle)/2 > Math.PI ? "end" : "start";
                })
            .text(function(d, i) {
                //console.log(data[1]["Energi (kJ)(kJ)"]);
                //var text = data[indexText]["Livsmedelsnamn"];
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
        //console.log(dataNumb);
        //draw(dataFoo, dataNumb);
        console.log("Uppdaterar donut: " + dataNumb);

        processdata(dataNumb);
        // drawAllExcept([123, 12,3 1,2 3123]);
    }
}

