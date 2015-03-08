function table(){

    var color = d3.scale.category20();
    var nrOfShownCompl = 5;

    this.findCompl = function(arguments, chosenRDI){
        //Ska senare ta in args från checkboxes eller liknande? 
        //och får då ta forEach och pusha till args!
        //Kan då i samma forEach beräkna missing som görs i forEach nedan!
        //console.log(arguments, arguments.length)
        var args = [],
            vitamin = [],
            highest = [],
            closest = [],
            missing = []; //missing ska innehålla den mängd som fattas för vardera typ som är vald.
        /*Prel-lösning
        //args.push(arguments);
        //args.push([{type: "Zink(mg)", sum: 0}, 19, 0])
        //var vitamin = [args[0][0], args[1][0]];
        */
    args.push(arguments);
        //Just nu skickas ju endast in ett argument.....
        args.forEach(function(d,i){
            vitamin.push(arguments[i][0]);
        })

        //Beräkna för vardera type hur stor mängd som saknas från RDI
        vitamin.forEach(function(d,i){
            missing.push(chosenRDI[arguments[1]] - d.sum);
            highest.push({"Livsmedelsnamn": "dummy", "Livsmedelsnummer": -1});
            closest.push({"Livsmedelsnamn": "dummy", "Livsmedelsnummer": -1});
            highest[i][d.type] = 0;
            closest[i][d.type] = 0;
        });

        //Step är hur stort spann vi har på intervallet från hur mycket som saknas.
        var step = 5;
        //I complements spar vi de livsmedel som man kan äta som komplement
        var complements = [];

        var theData = bar1.getData();
        //För vardera livsmedel kollar vi hur deras vitaminer står sig mot intervallet.
        theData.forEach(function(c){
            //sortera sen på de valda kategorierna
            //Eller kolla om den inlagda redan finns i arrayen?
            //console.log(c[type], missing-interval, missing+interval)

            //För varje vitamin
            vitamin.forEach(function(d, i){   
                //console.log(missing[i]-step, c[t.type], missing[i]+step)
                //sparar en temp för att inte spara över datan, är det nödvändigt?
                var temp = c;
                
                //console.log(t.type, temp[t.type], missing[i])
                //console.log(highest[i])
                //Om dess innehåll är inom intervallen:
                if(temp[d.type] >= ((missing[i]-step) < 0 ? 0 : (missing[i]-step)) && temp[d.type] <= (missing[i]+step)){ 
                    //Spara den med det bästa intervallet. :)
                /*    if(Math.abs(missing[i]-c[t.type]) < Math.abs(missing[i]-closest[i].value) || (missing[i]-temp[t.type]) == 0){
                        console.log("diff:", Math.abs(missing[i]-temp[t]))
                        closest[i] = temp;
                    }   */
                    //Spara differensen mellan livsmedlets innehåll och vad som saknas.
                    temp.compType = d.type;
                    //Samma livsmedel bör bara adderas en gång
                    if(complements.length == 0 || (complements[complements.length-1].Livsmedelsnummer != temp.Livsmedelsnummer))
                        complements.push(temp);
                   // console.log("Inom intervallen, lägger till: ", temp.Livsmedelsnamn, temp.hej)
                }
                //Vill spara det livsmedel som har störst innehåll  
                else if(c[d.type] > highest[i][d.type]){ 
                    temp.compType = d.type;
                    highest[i] = temp;
                    //Samma livsmedel bör bara adderas en gång
                    if(complements.length == 0 || (complements[complements.length-1].Livsmedelsnummer != temp.Livsmedelsnummer))
                        complements.push(temp);
                }
            });
        });

        //Adderar differenserna för att sedan sortera på det för att få fram bästa alternativ
        //Just nu visas ju bara en kategori åt gången.. heehehe
        complements.forEach(function(n){
            var diff = 0,
                percent = 0;
            /*var diff = [],
                percent = [];*/
            vitamin.forEach(function(v,l){ 
                diff += Math.abs(missing[l]-n[v.type]); 
                percent = Math.round(100 * (n[v.type]/chosenRDI[arguments[1]]));
                //diff.push(Math.abs(missing[l]-n[v.type]));
                //percent.push((n[v.type] + d[v.type])/chosenRDI[i]);
            }); 
            n.diff = diff;
            n.percent = percent;
        });
        
        //SORTERA alla funna komplement på differensen, lägst differens är bäst (a.diff-b.diff)
        complements.sort(function(a, b){ return b.percent-a.percent; });

    //console.log("Alla complements", complements)
        //Räkna ut hur mycket av detta man behöver äta för att nå upp till missing..
        if(complements[0][vitamin[0].type] > 0){
            var amount = Math.ceil(complements[0].diff/complements[0][vitamin[0].type]);
            console.log("För att öka " + complements[0].compType + " med " + complements[0].percent + "% kan du äta/dricka " + complements[0].Livsmedelsnamn + "'")
        } else {
            console.log("För att öka " + complements[0].compType + " med " + complements[0].percent + "% kan du äta/dricka 1 '" + complements[0].Livsmedelsnamn + "'")
        }

        //Listan
        var div = "<div class='col-xs-1' style='padding:0;'> "+
                    "<div style='background-color:" + color(arguments[1]) + "; width: 10px; height: 10px;'> "+
                    "</div> "+
                "</div>";
        var text = "<ul style='padding:0px 0px 0px 3px;'> "+
                        "<li style='list-style-type: none;'> "+div+
                            "<div class='col-xs-11' style='padding:0'> "+ 
                                complements[0].compType + 
                            "</div> "+
                        " </li>";
        complements.forEach(function(b,i){
           // console.log(complements[i])
            if(i<nrOfShownCompl)
            text += "<ul>"+
                        "<li id="+complements[i].Livsmedelsnummer+"> "+
                            "100 g "+ complements[i].Livsmedelsnamn + "<br> ger dig <b>" + complements[i].percent + "%</b> mer av <b>" + complements[i].compType + "</b>"+
                        "</li>"+
                    "</ul>";
        });
        text += "<ul>";
        document.getElementById("table").innerHTML += text;
    setClick();
        //document.getElementById("table").innerHTML += res;
        //Vore nice att kunna autoadda och se hur stapeldiagrammet skulle se ut med det bästa livsmedlet.. :)
    }

    function setClick(){
        //Remove from this list & add to checkboxes... 
        $('#table li').click(function(){
            var id = $(this).attr("id");
            console.log(id);
            
        });
    }
}