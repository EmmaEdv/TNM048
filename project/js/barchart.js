function barchart() {

    var self = this;

    /*var nameOfRDI = ["Vitamin A()","Retinol(µg)","β-Karoten(µg)","Vitamin D(µg)","Vitamin E(mg)"
                    ,"Vitamin K(µg)" ,"Tiamin(mg)","Riboflavin(mg)","Vitamin C(mg)","Niacin(mg)"
                    ,"Niacinekvivalenter()","Vitamin B6(mg)","Vitamin B12(µg)","Folat(µg)"
                    ,"Fosfor(mg)","Jod(µg)","Järn(mg)","Kalcium(mg)","Kalium(mg)"
                    ,"Magnesium(mg)","Natrium(mg)","Selen(µg)","Zink(mg)"];*/

    var nameOfRDI = ["Vitamin A()","Vitamin D(µg)","Vitamin E(mg)"
                    ,"Vitamin K(µg)" ,"Tiamin(mg)","Riboflavin(mg)","Vitamin C(mg)","Niacin(mg)"
                    ,"Vitamin B6(mg)","Vitamin B12(µg)","Folat(µg)"
                    ,"Fosfor(mg)","Jod(µg)","Järn(mg)","Kalcium(mg)","Kalium(mg)"
                    ,"Magnesium(mg)","Natrium(mg)","Selen(µg)","Zink(mg)"];

    var manRDI = ["900", "10", "10"
                ,"80", "1.4", "1.6", "75", "19"
                , "1.6", "2", "300"
                ,"600", "150", "9", "800", "3.5"
                ,"350", "2300", "60", "9"];
    // Dessa värden är för menstration och planerar bli gravid annars är folat = 300 och järn=9
    var womRDI = ["700", "10", "8"
                ,"65", "1.1", "1.2", "75", "14"
                , "1.2", "2", "400"
                ,"600", "150", "15", "800", "3.1"
                ,"280", "2300", "50", "7"];
    // folat = bra för kvinnor   Niacinekvivalenter()= niacin typ
    var barDiv = $("#barChart");
    var color = d3.scale.category20();
    var margin = {top: 100, right: 30, bottom: 70, left: 40},
    //width = 960 - margin.left - margin.right,
    width = barDiv.width() - margin.left - margin.right,
    height = barDiv.height() - margin.top - margin.bottom;
    //width = 1300 - margin.left - margin.right,
    //height = 500 - margin.top - margin.bottom;

    var formatPercent = d3.format("0%");

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
        //.tickFormat(formatPercent); // BÖR SE ÖVER DETTA

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d, i) {
            var procentRDI = Math.round(100 * procent(d,i))
            //return "<strong>" + d.type + ":</strong> <span style='color:black'>" + procentRDI + "% av RDI</span>";
            return "<strong>" + d.type + ":</strong> <span style='color:" + color(i) + "'>" + procentRDI + "% av RDI</span>";
        });
    
    var svg = d3.select("#barChart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    d3.csv("data/livsmedelKomma.csv", function(data) {
        self.data = data;
        var idOfDatum = []
            ,index = 0;

        self.data.forEach(function(c){
            if(index < 4){
                idOfDatum.push(c["Livsmedelsnummer"]);
                index++;
            }
        });
        processdata(idOfDatum);
    });

    function processdata(choosenFoodNumber) {
        //var choosenDatum = []; 
        var calIntake = [],
            summedCalIntake = [];

        nameOfRDI.forEach(function(o){

            calIntake[o] = 0;
            //console.log(o + " Nollställ " + calIntake[o]);
        });

        totalGram = 0;
        var index = 0;
        self.data.forEach(function(c){
            choosenFoodNumber.forEach(function(cfn){
                if(c["Livsmedelsnummer"] == cfn) {
                    //choosenDatum.push(c);
                    nameOfRDI.forEach(function(t){
                        calIntake[t] += +c[t];
                    })
                    index++;
                }
            })
        });

        nameOfRDI.forEach(function(f){
            summedCalIntake.push({
                type: f,
                sum: +calIntake[f]     
            })
        })

        draw(summedCalIntake); 
    }

    function procent(d, i) {
        var procent = 0;
        if(d.sum != 0)
            procent = (d.sum/manRDI[i]);
        else
            procent = 0

        return procent;
    }

    function draw(intake) {

        x.domain(intake.map(function(d) { return d.type; }));
        y.domain([0, 100]);
        svg.selectAll('*').remove();

        var modIndex = 0;
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            //.attr("transform","rotate(-45)")
            .call(xAxis);

        /*svg.append("g")
            .attr("class", "xaxis axis")  // two classes, one for css formatting, one for selection below
            .attr("transform", "translate(0," + (height) + ")")
            .call(xAxis);*/

        svg.selectAll(".tick.major text")
            //.attr("text-anchor", "middle")  // select all the text elements for the xaxis
            .attr("transform", function(d) {
                    return "translate(" + 0 + "," + 0 + ")rotate(-45)";
                }).style("text-anchor", "end");
      
       // svg.append("g").style("fill", "red")  // select all the text elements for the xaxis
          /*.attr("transform", function(d) {
             return "translate(0," + height + ")rotate(-45)";
         }).attr("transform","rotate(-45)").call(xAxis);*/

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Procent");
            
        var indexColor = 0;
        var aboveMax = [];
        svg.selectAll(".bar")
            .data(intake)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {
                return x(d.type);
            })
            .attr("width", x.rangeBand())
            .attr("y", function(d, i) {
                var procentY = procent(d,i);
                if(procentY > 1)
                    procentY = 1.1;

                return height - (height*procentY); })
            .attr("height", function(d,i) { 
                //var fooo = height - (height*procent(d,i));
                var procentHeight = (procent(d,i));
                if(procentHeight > 1) { // FÖR ATT DEN BLIR FÖR STOR. Sen clippar vi den
                    procentHeight = 1.1;
                    aboveMax.push(+i);
                } 

                return (height*procentHeight); })
            .style("fill", function(d) { 
                var sendColor = color(indexColor);
                indexColor++;
                return sendColor;
            })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)

            // TOMMA BARA FÖR ATT VIS TIP
            svg.selectAll(".tipbar")
            .data(intake)
            .enter().append("rect")
            .attr("class", "tipbar")
            .attr("x", function(d) {
                return x(d.type);
            })
            .attr("width", x.rangeBand())
            .attr("y", function(d, i) {
                return height; })
            .attr("height", function(d,i) { 
                return (height); })
            .style("opacity", "0")
            //.on('mouseover', tip.show)
            .on('mouseover', function(d,i) {
                        // tip.show(d, i);
                        return tip.show.apply(this, arguments);
                   
                    return tip.hide.apply(this, arguments);
                })
            .on('mouseout', tip.hide)
            //.on('mouseout', tip.hide)

            /*<svg>
                <!--VWT Inte HUR MAN GÖR DETTTTTA I CSSSS!!!!-->
                <defs>
                   <linearGradient id="Gradient-1" x1="3%" y1="4%" x2="6%" y2="6%"  >
                     <stop offset="0%" stop-color= "red" />
                     <stop offset="50%" stop-color= "white" />
                   </linearGradient>

                   <linearGradient id="repeat" xlink:href="#Gradient-1" spreadMethod="repeat" />
                </defs>
            </svg>*/

            var defs = svg.append("defs");
            var linG = defs.append("svg:linearGradient")
                .attr("id", "Gradient-1")
                .attr("x1", "3%")
                .attr("y1", "4%")
                .attr("x2", "6%")
                .attr("y2", "6%")
                .attr("spreadMethod", "repeat");
            linG.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", "red");
            linG.append("stop")
                .attr("offset", "50%")
                .attr("stop-color", "white");
           
            // FÖR ÖVER 100%
            svg.selectAll(".above")
                .data(intake).enter()
                .append("rect")
                //.attr("class", "grad2")
                .attr("x", function(d) {return x(d.type);})
                .attr("width", x.rangeBand()).attr("y", (height-(height*1.1)))
                .attr("height", (height*0.1))
                .style("fill", "url(#Gradient-1)")
                .style("opacity", function(a, i) {
                    return procent(a,i) > 1 ? .5 : 0; 
                })
                .on('mouseover', function(d,i) {
                    if(aboveMax.some(function(a) { return i === a; })) {
                        // tip.show(d, i);
                        return tip.show.apply(this, arguments);
                    }
                    return tip.hide.apply(this, arguments);
                })
                .on('mouseout', tip.hide);

                //svg.selectAll(".tick.major").append("text").style("fill", "red") 
    }

    this.update = function(foodNumber) {
        processdata(foodNumber);
        console.log("Uppdaterar barchart");
    }

}