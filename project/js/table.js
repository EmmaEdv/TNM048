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
            highest = [], index = -1; //missing ska innehålla den mängd som fattas för vardera typ som är vald.
    
        args.push(intearguments[0]);
        //Just nu skickas ju endast in ett argument.....
        /*args.forEach(function(d,i){
            vitamin.push(intearguments[i][0]);
        })*/

        vitamin.push(intearguments[0])

        //Beräkna för vardera type hur stor mängd som saknas från RDI
        vitamin.forEach(function(d,i){
            nameOfRDI.forEach(function(pos, j){
                if(pos == d.type)
                    index = j;
            });
            missing.push(100 - Math.round(100 * ((d.sum)/theChosenRDI[index])))
           // missing.push(percent(intearguments[0].type, (intearguments[0].sum-d.sum)));
//            missing.push(chosenRDI[intearguments[1]] - d.sum);
            highest.push({"Livsmedelsnamn": "dummy", "Livsmedelsnummer": -1});
            highest[i][d.type] = 0;
        });
//console.log("vitaminlängd", vitaminList.length)
        nrOfShownCompl = 5*vitaminList.length;

        //Step är hur stort spann vi har på intervallet från hur mycket som saknas. (Nu i enheter, kanske bättre med %?)
        var step = 1;
        var lessThanFive = true;
        var robert = -1;
        //I complements spar vi de livsmedel som man kan äta som komplement
        
        var theData = bar1.getData();
        //För vardera livsmedel kollar vi hur deras vitaminer står sig mot intervallet.
        while(lessThanFive){
            theData.forEach(function(c, h){
                //sortera sen på de valda kategorierna
                //Eller kolla om den inlagda redan finns i arrayen?
                //console.log(c[type], missing-interval, missing+interval)
                //För varje vitamin
                var vitindex = 0;
                vitamin.forEach(function(d, i){   
                    //console.log(missing[i]-step, c[t.type], missing[i]+step)
                    //sparar en temp för att inte spara över datan, är det nödvändigt?

                    nameOfRDI.forEach(function(pos, j){
                        if(pos == d.type)
                            robert = j;
                    });

                    var temp = c;
                    //console.log("två",d.type, temp[d.type])
                    var dataObjPercent = Math.round(100 * (temp[d.type]/theChosenRDI[robert]));
                    
                    /*while(lessThanFive){
                        //Om dess innehåll är inom intervallen:
                        //console.log(missing[i])
                        //console.log(dataObjPercent, (missing[i]-step))
                        
                        //if(dataObjPercent >= ((missing[i]-step) < 0 ? 0 : (missing[i]-step)) && dataObjPercent <= (missing[i]+step)){ 
                            //Spara den med det bästa intervallet. :)
                            //Spara differensen mellan livsmedlets innehåll och vad som saknas.
                            //temp.compType = d.type;
                            
                            
                           // complements.push(temp);
                           // console.log("Inom intervallen, lägger till: ", temp.Livsmedelsnamn, temp.hej)
                        //}
                        //Vill spara det livsmedel som har störst innehåll  
                        // else if(c[d.type] > highest[i][d.type]){ 
                        //     temp.compType = d.type;
                        //     highest[i] = temp;
                        //     //Samma livsmedel bör bara adderas en gång
                        //     if(complements.length == 0 || (complements[complements.length-1].Livsmedelsnummer != temp.Livsmedelsnummer))
                        //         complements.push(temp);
                        // }
                        //if(complements.length > 5)
                            //lessThanFive = false;
                        
                        step += 5;
                    }*/
                    var max = missing[i] + step;
                    var min = missing[i] - step;

                    if(dataObjPercent >= min && dataObjPercent <= max){
                        if(complements.length < nrOfShownCompl){
                            temp.compType = d.type
                            complements.push(temp);
                            theData.splice(h,1);
                        }
                        else{
                            lessThanFive = false;
                        }
                    }
                });
                vitindex++;
            });
            step += 1;
        }

        //Adderar differenserna för att sedan sortera på det för att få fram bästa alternativ
        //Just nu visas ju bara en kategori åt gången.. heehehe
        complements.forEach(function(n){
            var diff = 0,
                percent = 0;
            /*var diff = [],
                percent = [];*/
            vitamin.forEach(function(d,i){ 
                diff += Math.abs(missing[i]-n[d.type]); 
                percent = Math.round(100 * (n[d.type]/theChosenRDI[intearguments[1]]));
                //diff.push(Math.abs(missing[i]-n[d.type]));
                //percent.push((n[d.type] + d[d.type])/chosenRDI[i]);
            }); 
            n.diff = diff;
            n.percent = percent;
        });
        
        //SORTERA alla funna komplement på differensen, lägst differens är bäst (a.diff-b.diff)
        /*complements.sort(function(a, b){ 
            return b.percent-a.percent; 
        });*/

        // SCOOOOORRRRE
        complements.forEach(function(d,i){
            var percent = 0, weight = 1;

            vitaminList.forEach(function(e){
                nameOfRDI.forEach(function(pos, j){
                    if(pos == e)
                        index = j;
                })

                percent = Math.round(100 * (d[e]/theChosenRDI[index]));
                if(percent > 100)
                    weight *= 100;
                else
                    weight *= percent;

            });
            d.weight = (weight/100);
        });

        complements.sort(function(a, b){ 
            return b.weight-a.weight; 
        });

        var compindex = 0;
        complements.forEach(function(d,i){
            var hej = "", index = -1;
            var percent = 0;
            var weight = 0.01;
            hej += d.Livsmedelsnamn + " ";
            if(compindex < nrOfShownCompl) {
                vitaminList.forEach(function(e){
                    nameOfRDI.forEach(function(pos, j){
                        if(pos == e)
                            index = j;
                    })
                    percent = Math.round(100 * (d[e]/theChosenRDI[index]));

                    hej += e + " " + d[e] + ": " + percent + "% ";
                });
                hej += " weighted score: " + d.weight;
                console.log(hej);
                compindex++;
            }
            console.log("-------------------------------------------------------");
           
        });
console.log("");
console.log("=======================================================");
console.log("");
        //Vikta:

        //LISTAN
        //Färgad fyrkant:
        var colorOfRDI = rdiColor[1].color;
        rdiColor.forEach(function(d) {
                            //console.log(d.type + " LIKA " + intearguments[0].type);
                            if(d.type == intearguments[0].type) {
                                //console.log('YÄÄÄ');
                                colorOfRDI = d.color;
                            }
                        })

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
                    compText += "<ul>"+
                                "<li id="+complements[i].Livsmedelsnummer+">"+
                                "<a style='color: black;' class='popoverData' class='btn' href='#' rel='popover' data-placement='bottom' " + 
                                "data-original-title='"+ complements[i].Livsmedelsnamn +"' data-trigger='hover'>"+
                                
                                complements[i].Livsmedelsnamn +
                                 //   "100 g "+ complements[i].Livsmedelsnamn + "<br> ger dig <b>" + complements[i].percent + "%</b> mer av <b>" + complements[i].compType + "</b>"+
                                "</a></li>"+
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
        var popoverContent = "",
            perc = "";
        var index = -1;

        //console.log("complementslist",complementsList)
        complementsList.forEach(function(cl,n){
            if(id == cl){
                //nr = vilken position i listan detta livsmedel har.
                nr = n;

                vitaminList.forEach(function(vl, i){
                    nameOfRDI.forEach(function(m, j){
                        if(m==vl){
                            index = j;
                        }
                    });
                    
                    perc = Math.round(100 * (complements[nr][vl]/theChosenRDI[index]));
                  //  console.log(complements[nr].Livsmedelsnamn+":", vl+": ", perc)
                    popoverContent += "" + vl + " ökar med " + perc + "% ";
                })

            }
        })

        //console.log(nr, complements[nr], id, vitaminList);

        return popoverContent;
    }

    function setHover(){
        //Remove from this list & add to checkboxes... 
        $('#table li').hover(function(){
            console.log("HOVER")
            var id = $(this).attr("id");

            var popoverContent = calculateContent(id);

            //TODO: TROR INTE ATT DETTA STÄMMER HELT & HÅLLET... 
            $('.popoverData').popover({content: calculateContent(id)});
            //$('.popoverData').popover({title: complements[nr].Livsmedelsnamn, content: popoverContent});
        });
    }

    function setClick(){
        //Remove from this list & add to checkboxes... 
        $('#table ul').click(function(){
            var id = $(this).attr("id");
            //console.log(id);
            document.getElementById(id).remove(this.selectedIndex);
            console.log("TODO: LÄGG TILL LIVSMEDEL MED NR: " + id[0] + " TILL LISTAN MED LIVSMEDEL & UPPDATERA GRAFER.");
            //LÄGG TILL LIVSMEDLET MED DETTA ID I LISTAN OCH UPPDATERA BARCHART & DONUT OSV

        });
    }    

    this.setVitamin = function(vitamin){
        //console.log("pushing ", vitamin);
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

    function percent(vitamin, value){
        nameOfRDI.forEach(function(pos, j){
            if(pos == vitamin)
                index = j;
        });

        percent = Math.round(100 * (parseFloat(value)/parseFloat(theChosenRDI[index])));
        console.log(percent)
        return percent;
    }

    this.update = function(dataNumb) {
        //console.log(dataNumb);
        //draw(dataFoo, dataNumb);
       // console.log("Uppdaterar table: " + dataNumb);
        vitaminList = [];
        document.getElementById("listVitamins").innerHTML = "";
        document.getElementById("listComplement").innerHTML = "";
    }
}