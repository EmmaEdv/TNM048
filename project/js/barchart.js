function barchart() {

    var self = this;
    var nameOfRDI = ["Vitamin A()","Vitamin D(µg)","Vitamin E(mg)"
                    ,"Vitamin K(µg)" ,"Tiamin(mg)","Riboflavin(mg)","Vitamin C(mg)","Niacin(mg)"
                    ,"Vitamin B6(mg)","Vitamin B12(µg)","Folat(µg)"
                    ,"Fosfor(mg)","Jod(µg)","Järn(mg)","Kalcium(mg)","Kalium(mg)"
                    ,"Magnesium(mg)","Natrium(mg)","Selen(µg)","Zink(mg)"];
    // MAN RDI
    var manRDI = ["900", "10", "10"
                ,"80", "1.4", "1.6", "75", "19"
                , "1.6", "2", "300"
                ,"600", "150", "9", "800", "3500"
                ,"350", "2300", "60", "9"];
    // KVINNA RDI
    // Dessa värden är för menstration och planerar bli gravid annars är folat = 300 och järn=9
    var womRDI = ["700", "10", "8"
                ,"65", "1.1", "1.2", "75", "14"
                , "1.2", "2", "400"
                ,"600", "150", "15", "800", "3100"
                ,"280", "2300", "50", "7"];
    var chosenRDI = manRDI;
    var barDiv = $("#barChart");
    var color = d3.scale.category20();
    var margin = {top: 100, right: 30, bottom: 70, left: 40},
        width = barDiv.width() - margin.left - margin.right,
        height = barDiv.height() - margin.top - margin.bottom;
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

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d, i) {
            var procentRDI = Math.round(100 * procent(d,i))
            return "<strong>" + d.type + ":</strong> <span style='color:" + color(i) + "'>" + procentRDI + "% av RDI</span>";
        });
    
    var svg = d3.select("#barChart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    d3.csv("data/livsmedelKorrekt.csv", function(data) {
        self.data = data;
        var idOfDatum = [710]
            ,index = 0;

        processdata(idOfDatum);
    });

    function processdata(choosenFoodNumber) {
        var calIntake = [],
            summedCalIntake = [];

        nameOfRDI.forEach(function(o){
            calIntake[o] = 0;
        });

        totalGram = 0;
        var index = 0;
        self.data.forEach(function(c){
            choosenFoodNumber.forEach(function(cfn){
                if(c["Livsmedelsnummer"] == cfn) {
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
            procent = (d.sum/chosenRDI[i]);
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
            .call(xAxis);

        svg.selectAll(".tick.major text")
            .attr("transform", function(d) {
                    return "translate(" + 0 + "," + 0 + ")rotate(-45)";
                }).style("text-anchor", "end");

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
                var procentHeight = (procent(d,i));
                if(procentHeight > 1) { // FÖR ATT DEN BLIR FÖR STOR.
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
            .on('click', function(d){
                //Lägg till vitamin/mineral till listan
                var vitExists = false;
                var vitList = table1.getVitamin();
                //Man ska bara kunna lägga till vitaminen en gång
                vitList.forEach(function(vl){
                    if(d.type == vl)
                        vitExists = true;
                })

                if(Math.round(100*(d.sum/chosenRDI[arguments[1]])) < 100 && !vitExists){
                    table1.setVitamin(nameOfRDI[arguments[1]]);
                    table1.findCompl(arguments, chosenRDI);
                }
                else
                    console.log("Du kan endast lägga till vitaminer/mineraler som har < 100% och ej är tillagda")
            })

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
            .on('mouseover', function(d,i) {
                        return tip.show.apply(this, arguments);
                })
            .on('mouseout', tip.hide)
            .on('click', function(d){
                //Lägg till vitamin/mineral till listan
                var vitExists = false;
                var vitList = table1.getVitamin();
                //Man ska bara kunna lägga till vitaminen en gång
                vitList.forEach(function(vl){
                    if(d.type == vl){
                        vitExists = true;
                    }
                })

                if(Math.round(100*(d.sum/chosenRDI[arguments[1]])) < 100 && !vitExists){
                    table1.setVitamin(nameOfRDI[arguments[1]]);
                    table1.findCompl(arguments, chosenRDI);
                }
                else
                    console.log("Du kan endast lägga till vitaminer/mineraler som har < 100% och ej är tillagda")
            })

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
                .attr("x", function(d) {return x(d.type);})
                .attr("width", x.rangeBand()).attr("y", (height-(height*1.1)))
                .attr("height", (height*0.1))
                .style("fill", "url(#Gradient-1)")
                .style("opacity", function(a, i) {
                    return procent(a,i) > 1 ? .5 : 0; 
                })
                .on('mouseover', function(d,i) {
                    if(aboveMax.some(function(a) { return i === a; })) {
                        return tip.show.apply(this, arguments);
                    }
                    return tip.hide.apply(this, arguments);
                })
                .on('mouseout', tip.hide);
    }

    this.getData = function(){
        return self.data;
    }

    this.update = function(foodNumber) {
        processdata(foodNumber);
    }

}