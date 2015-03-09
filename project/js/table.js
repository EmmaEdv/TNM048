function table(){

    var color = d3.scale.category20();
    var nrOfShownCompl = 5;
    var theChosenRDI,
        vitaminList = [],
        complementsList = [],
        complements = [],
        missing = [];

    var nameOfRDI = ["Vitamin A()","Vitamin D(µg)","Vitamin E(mg)"
                    ,"Vitamin K(µg)" ,"Tiamin(mg)","Riboflavin(mg)","Vitamin C(mg)","Niacin(mg)"
                    ,"Vitamin B6(mg)","Vitamin B12(µg)","Folat(µg)"
                    ,"Fosfor(mg)","Jod(µg)","Järn(mg)","Kalcium(mg)","Kalium(mg)"
                    ,"Magnesium(mg)","Natrium(mg)","Selen(µg)","Zink(mg)"];
    var rdiColor = [];
    nameOfRDI.forEach(function(f,i){
            console.log("FÄRGER I : " + color(i))
            rdiColor.push({ 
                type: f,
                color: color(i)    
            })
        })

    //Hitta livsmedel som kompletterar 
    this.findCompl = function(intearguments, chosenRDI){
        theChosenRDI = chosenRDI;
        var args = [],
            vitamin = [],
            highest = []; //missing ska innehålla den mängd som fattas för vardera typ som är vald.
        /*Prel-lösning
        //args.push(intearguments);
        //args.push([{type: "Zink(mg)", sum: 0}, 19, 0])
        //var vitamin = [args[0][0], args[1][0]];
        */
        console.log(intearguments[0]);
    args.push(intearguments[0]);
        //Just nu skickas ju endast in ett argument.....
        /*args.forEach(function(d,i){
            vitamin.push(intearguments[i][0]);
        })*/

        vitamin.push(intearguments[0])

        //Beräkna för vardera type hur stor mängd som saknas från RDI
        vitamin.forEach(function(d,i){
            missing.push(chosenRDI[intearguments[1]] - d.sum);
            highest.push({"Livsmedelsnamn": "dummy", "Livsmedelsnummer": -1});
            highest[i][d.type] = 0;
        });

        //Step är hur stort spann vi har på intervallet från hur mycket som saknas. (Nu i enheter, kanske bättre med %?)
        var step = 5;
        //I complements spar vi de livsmedel som man kan äta som komplement
        

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
                percent = Math.round(100 * (n[d.type]/chosenRDI[intearguments[1]]));
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
        console.log("FÄRGERNA BLIR FEL :( den tar fel id...");
        var colorOfRDI = rdiColor[1].color;
        rdiColor.forEach(function(d) {
                            console.log(d.type + " LIKA " + intearguments[0].type);
                            if(d.type == intearguments[0].type) {
                                console.log('YÄÄÄ');
                                colorOfRDI = d.color;
                            }
                        })
        console.log("FÄRG: " + colorOfRDI)

        var cube = "<div class='col-xs-1' style='padding:0;'> "+
                    "<div style='background-color:" + colorOfRDI + "; width: 10px; height: 10px;'> "+
                    "</div> "+
                "</div>";

        var vitText = "<ul style='padding:0px 0px 0px 3px;'> " +
                        "<li style='list-style-type: none;'> " + cube +
                            "<div class='col-xs-11' style='padding:0'> "+ 
                                intearguments[0].type + 
                            "</div> "+
                        " </li> </ul>";         

        document.getElementById("listVitamins").innerHTML += vitText;
        
        var compText = ""; 
        
        var popoverContent = "";

        //Lista med varje komplement + popoverruta
        complements.forEach(function(b,i){
            var compExists = false;
            if(i<nrOfShownCompl){
                //Livsmedlet ska bara vara med en gång
                complementsList.forEach(function(cl){
                    if(complements[i].Livsmedelsnummer == cl){
                        compExists = true;
                    }
                });

                if(!compExists){
                    complementsList.push(complements[i].Livsmedelsnummer);
                    popoverContent =  calculateContent(complements[i].Livsmedelsnummer, i);//complements[i].compType + " " + complements[i].percent;
/*http://jsfiddle.net/9P64a/*/
                    compText += "<ul id="+complements[i].Livsmedelsnummer+">"+
                                "<a style='color: black;' class='popoverData' class='btn' href='#' rel='popover' data-placement='bottom' " + 
                                "data-original-title='"+ complements[i].Livsmedelsnamn +"' data-trigger='hover'>"+
                                "<li>"+
                                complements[i].Livsmedelsnamn +
                                 //   "100 g "+ complements[i].Livsmedelsnamn + "<br> ger dig <b>" + complements[i].percent + "%</b> mer av <b>" + complements[i].compType + "</b>"+
                                "</li> </a>"+
                            "</ul>";
                }
            }
        });
        
        document.getElementById("listComplement").innerHTML += compText;
        
        //var popOver = "<a id='popoverOption' class='btn' href='#' data-content="+complements[0].Livsmedelsnummer+" rel='popover' data-placement='bottom' data-original-title=" + complements[0].Livsmedelsnamn + "data-trigger='hover'>Popup with option trigger</a>"

        setHover();
        setClick();
    }

    function calculateContent(id){
        var nr = "";
        console.log(complementsList, "awoolistan")
        complementsList.forEach(function(cl,n){
            if(id == cl){
                console.log(id, cl)
                nr = n;
            }
            else
                console.log("Det var ju mindre bra..")
        })
        //I OCH MED SORTERINGEN STÄMMER INTE NR... KIKA PÅ DET EMMA
        console.log(nr, complements[nr], id, vitaminList);
        var popoverContent = "",
            perc = "";

        vitaminList.forEach(function(vl, i){
            perc = Math.round(100 * (complements[nr][vl]/theChosenRDI[i]));
            console.log("vl",vl, "nr", nr, "perc", perc, complements[nr].percent)
            popoverContent += "" + vl + " ökar med " + perc + "%, \n";
        })

        return popoverContent;
    }

    function setHover(){
        //Remove from this list & add to checkboxes... 
        $('#table ul').hover(function(){
            var id = $(this).attr("id");
            console.log(id)
            var popoverContent = calculateContent(id);
            /*
            console.log(complements[nr].Livsmedelsnamn;, id, vitaminList);
            var popoverContent = "",
                perc = "";
            console.log("popoverContent", popoverContent, "perc", perc)

            vitaminList.forEach(function(vl, i){
                perc = Math.round(100 * (complements[nr][vl]/theChosenRDI[i]));
                console.log("vl",vl, "nr", nr, "perc", perc, complements[nr].percent)
                popoverContent += "" + vl + " ökar med " + perc + "%, \n";
            })*/
            //TODO: TROR INTE ATT DETTA STÄMMER HELT & HÅLLET... 
            $('.popoverData').popover({content: popoverContent});
            //$('.popoverData').popover({title: complements[nr].Livsmedelsnamn, content: popoverContent});
        });
    }

    function setClick(){
        //Remove from this list & add to checkboxes... 
        $('#table ul').click(function(){
            var id = $(this).attr("id");
            //console.log(id);
            document.getElementById(idNr).remove(this.selectedIndex);
            console.log("TODO: LÄGG TILL LIVSMEDEL MED NR: " + id[0] + " TILL LISTAN MED LIVSMEDEL & UPPDATERA GRAFER.");
            //LÄGG TILL LIVSMEDLET MED DETTA ID I LISTAN OCH UPPDATERA BARCHART & DONUT OSV

        });
    }    

    this.setVitamin = function(vitamin){
        console.log("pushing ", vitamin);
        vitaminList.push(vitamin);
    }

    this.getVitamin = function(){
       // console.log("getting vitaminlist");
        return vitaminList;
    }

    function getChosenRDI(){
        return theChosenRDI;
    }

    function setChosenRDI(chosenRDI){
        theChosenRDI = chosenRDI;
    }

    this.update = function(dataNumb) {
        //console.log(dataNumb);
        //draw(dataFoo, dataNumb);
        console.log("Uppdaterar table: " + dataNumb);
        document.getElementById("listVitamins").innerHTML = "";
        document.getElementById("listComplement").innerHTML = "";
    }
}