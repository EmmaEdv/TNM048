function table(){

    var color = d3.scale.category20();
    var nrOfShownCompl = 5;

    //Hitta livsmedel som kompletterar 
    this.findCompl = function(arguments, chosenRDI){
        var args = [],
            vitamin = [],
            highest = [],
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
            highest[i][d.type] = 0;
        });

        //Step är hur stort spann vi har på intervallet från hur mycket som saknas. (Nu i enheter, kanske bättre med %?)
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
            vitamin.forEach(function(d,i){ 
                diff += Math.abs(missing[i]-n[d.type]); 
                percent = Math.round(100 * (n[d.type]/chosenRDI[arguments[1]]));
                //diff.push(Math.abs(missing[i]-n[d.type]));
                //percent.push((n[d.type] + d[d.type])/chosenRDI[i]);
            }); 
            n.diff = diff;
            n.percent = percent;
        });
        
        //SORTERA alla funna komplement på differensen, lägst differens är bäst (a.diff-b.diff)
        complements.sort(function(a, b){ 
            return b.percent-a.percent; 
        });

        //Vikta:

        //LISTAN
        //Färgad fyrkant:
        var cube = "<div class='col-xs-1' style='padding:0;'> "+
                    "<div style='background-color:" + color(arguments[1]) + "; width: 10px; height: 10px;'> "+
                    "</div> "+
                "</div>";
        var vitText = "<ul style='padding:0px 0px 0px 3px;'> " +
                        "<li style='list-style-type: none;'> " + cube +
                            "<div class='col-xs-11' style='padding:0'> "+ 
                                complements[0].compType + 
                            "</div> "+
                        " </li> </ul>";

        document.getElementById("listVitamins").innerHTML += vitText;
        
        var compText = ""; 
        var popoverContent = "";
        //Lista med varje komplement + popoverruta
        complements.forEach(function(b,i){
            if(i<nrOfShownCompl){
                popoverContent =  complements[i].compType + " " + complements[i].percent;
                compText += "<ul>"+
                                "<a style='color: black;' class='popoverData' class='btn' href='#' data-content='"+
                                popoverContent + "' rel='popover' data-placement='bottom' data-original-title='" + 
                                complements[i].Livsmedelsnamn + "' data-trigger='hover'>"+
                                "<li id="+complements[i].Livsmedelsnummer+">"+
                                complements[i].Livsmedelsnamn +
                                 //   "100 g "+ complements[i].Livsmedelsnamn + "<br> ger dig <b>" + complements[i].percent + "%</b> mer av <b>" + complements[i].compType + "</b>"+
                                "</li> </a>"+
                            "</ul>";
            }
        });
        
        document.getElementById("listComplement").innerHTML += compText;
        
        //var popOver = "<a id='popoverOption' class='btn' href='#' data-content="+complements[0].Livsmedelsnummer+" rel='popover' data-placement='bottom' data-original-title=" + complements[0].Livsmedelsnamn + "data-trigger='hover'>Popup with option trigger</a>"

        setHover();
        setClick();
        //document.getElementById("table").innerHTML += res;
        //Vore nice att kunna autoadda och se hur stapeldiagrammet skulle se ut med det bästa livsmedlet.. :)
    }

    function setHover(){
        //Remove from this list & add to checkboxes... 
        $('#table li').hover(function(){
            var id = $(this).attr("id");
            console.log(id);
            $('.popoverData').popover(console.log("vetefan"));            
        });
    }

    function setClick(){
        //Remove from this list & add to checkboxes... 
        $('#table li').click(function(){
            var id = $(this).attr("id");
            console.log(id);
            
        });
    }
}