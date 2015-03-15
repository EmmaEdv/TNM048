function table(){

    var color = d3.scale.category20();
    var nrOfShownCompl = 5, prev = 0;
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

        vitamin.push(intearguments[0])

        //Beräkna för vardera type hur stor mängd som saknas från RDI
        vitamin.forEach(function(d,i){
            nameOfRDI.forEach(function(pos, j){
                if(pos == d.type)
                    index = j;
            });
            missing.push(100 - Math.round(100 * ((d.sum)/theChosenRDI[index])))
<<<<<<< HEAD
=======

>>>>>>> c71210a4a56abae9d966c7b153873ffc3faa81d4
            highest.push({"Livsmedelsnamn": "dummy", "Livsmedelsnummer": -1});
            highest[i][d.type] = 0;
        });

        nrOfShownCompl = 5*vitaminList.length;

<<<<<<< HEAD
        //Step är hur stort spann vi har på intervallet från hur mycket som saknas.
=======
        //Step är hur stort spann vi har på intervallet från hur mycket som saknas. 
>>>>>>> c71210a4a56abae9d966c7b153873ffc3faa81d4
        var step = 1;
        var lessThanFive = true;
        var whichRDI = -1;
        //I complements spar vi de livsmedel som man kan äta som komplement
        
        var theData = bar1.getData();
        //För vardera livsmedel kollar vi hur deras vitaminer står sig mot intervallet.
        while(lessThanFive){
            theData.forEach(function(c, h){
<<<<<<< HEAD
                //sortera sen på de valda kategorierna
                //Eller kolla om den inlagda redan finns i arrayen?
                //För varje vitamin
                var vitindex = 0;
                vitamin.forEach(function(d, i){   
                    //sparar en temp för att inte spara över datan, är det nödvändigt?
=======
                
                //För varje vitamin
                var vitindex = 0;
                vitamin.forEach(function(d, i){   

>>>>>>> c71210a4a56abae9d966c7b153873ffc3faa81d4
                    nameOfRDI.forEach(function(pos, j){
                        if(pos == d.type)
                            whichRDI = j;
                    });
                    //sparar data item i en temporär då vi vill lägga till attrubut
                    var temp = c;
<<<<<<< HEAD
                    var dataObjPercent = Math.round(100 * (temp[d.type]/theChosenRDI[robert]));
                    var max = missing[i] + step,
                        min = missing[i] - step;
=======
                    
                    var dataObjPercent = Math.round(100 * (temp[d.type]/theChosenRDI[whichRDI]));
                    
                    var max = missing[i] + step;
                    var min = missing[i] - step;
>>>>>>> c71210a4a56abae9d966c7b153873ffc3faa81d4

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
        complements.forEach(function(n){
            var diff = 0,
                percent = 0;
<<<<<<< HEAD

            vitamin.forEach(function(d,i){ 
                diff += Math.abs(missing[i]-n[d.type]); 
                percent = Math.round(100 * (n[d.type]/theChosenRDI[intearguments[1]]));
=======
            var temp = [];
            vitamin.forEach(function(d,i){ 
                diff += Math.abs(missing[i]-n[d.type]); 
                percent = Math.round(100 * (n[d.type]/theChosenRDI[intearguments[1]]));
                temp.push({vit: d.type, per: percent});
>>>>>>> c71210a4a56abae9d966c7b153873ffc3faa81d4
            }); 
            n.diff = diff;
            n.percent = percent;
        });

        //Beräkna score
        complements.forEach(function(d,i){
            var percent = 0, weight = 1;

            vitaminList.forEach(function(e){
                nameOfRDI.forEach(function(pos, j){
                    if(pos == e)
                        index = j;
                })

                percent = Math.round(100 * (d[e]/theChosenRDI[index]));
                if(percent > 100)
                    weight += 1.1*100;
                else
                    weight += percent;

            });
            d.weight = Math.round(weight)/100;
        });

        complements.sort(function(a, b){ 
            return b.weight-a.weight; 
        });

        var compindex = 0;
        complements.forEach(function(d,i){
            var output = "", index = -1;
            var percent = 0;

            output += d.Livsmedelsnamn + " ";
            if(compindex < 2) {
                vitaminList.forEach(function(e){
                    nameOfRDI.forEach(function(pos, j){
                        if(pos == e)
                            index = j;
                    })
                    percent = Math.round(100 * (d[e]/theChosenRDI[index]));

                    output += e + " " + d[e] + ": " + percent + "% ";
                });
<<<<<<< HEAD
                hej += " weighted score: " + d.weight;
                console.log(hej);
=======
                output += " Score: " + d.weight;
                
                console.log(output);
>>>>>>> c71210a4a56abae9d966c7b153873ffc3faa81d4
                compindex++;
            }
           
        });
<<<<<<< HEAD
    console.log("");
    console.log("=======================================================");
    console.log("");
        //Vikta:
=======
console.log("");
console.log("=======================================================");
console.log("");
>>>>>>> c71210a4a56abae9d966c7b153873ffc3faa81d4

        //LISTAN
        //Färgad fyrkant:
        var colorOfRDI = rdiColor[1].color;
        rdiColor.forEach(function(d) {
                            if(d.type == intearguments[0].type) {
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
        
        var hej = vitaminList.length;
        //Lista med varje komplement + popoverruta
        complements.forEach(function(b,i){
            //Töm textrutan om det lagts till ytterligare vitaminer. Prev måste sättas om
            if(prev != hej){
                document.getElementById("listComplement").innerHTML = "";
                prev++;
            }

            var compExists = false;
            if(i<2){
                //Livsmedlet ska bara vara med en gång
                complementsList.forEach(function(cl){
                    if(complements[i].Livsmedelsnummer == cl){
                        compExists = false;
                    }
                });

                if(!compExists){
                    complementsList.push(complements[i].Livsmedelsnummer);
                    popoverContent =  calculateContent(complements[i].Livsmedelsnummer, i);
<<<<<<< HEAD
                    compText += "<ul>"+
                                "<li id="+complements[i].Livsmedelsnummer+">"+
                                "<a style='color: black;' class='popoverData' class='btn' href='#' rel='popover' data-placement='bottom' " + 
                                "data-original-title='"+ complements[i].Livsmedelsnamn +"' data-trigger='hover'>"
                                +complements[i].Livsmedelsnamn +"</a></li>"+"</ul>";
=======
/*http://jsfiddle.net/9P64a/*/
                    compText += "<ul>"+
                                "<li id="+complements[i].Livsmedelsnummer+">"+
                                "<a style='color: black;' class='popoverData' class='btn' href='#' rel='popover' data-placement='bottom' " + 
                                "data-original-title='"+ complements[i].Livsmedelsnamn +"' + data-content=' Score: "+
                                complements[i].weight +
                                "' data-trigger='hover'>"+
                                
                                complements[i].Livsmedelsnamn +

                                "</a></li>"+
                                "</ul>";
>>>>>>> c71210a4a56abae9d966c7b153873ffc3faa81d4
                }
            }
        });
        
        document.getElementById("listComplement").innerHTML += compText;
<<<<<<< HEAD
=======
        
        setHover();
        //setClick();
>>>>>>> c71210a4a56abae9d966c7b153873ffc3faa81d4
    }

    function calculateContent(id){
        var nr = "";
        var popoverContent = "",
            perc = "";
        var index = -1;

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
                    popoverContent += "" + vl + " ökar med " + perc + "% ";
                })

            }
        })

        return popoverContent;
    }

    function setHover(){
        //Remove from this list & add to checkboxes... 
        $('#table li').hover(function(){
            var id = $(this).attr("id");

            var popoverContent = calculateContent(id);

<<<<<<< HEAD
            $('.popoverData').popover({content: calculateContent(id)});
=======
            $('.popoverData').popover();
>>>>>>> c71210a4a56abae9d966c7b153873ffc3faa81d4
        });
    }

    function setClick(){
        //Remove from this list & add to checkboxes... 
        $('#table ul').click(function(){
            var id = $(this).attr("id");
            document.getElementById(id).remove(this.selectedIndex);
            console.log("TODO: LÄGG TILL LIVSMEDEL MED NR: " + id[0] + " TILL LISTAN MED LIVSMEDEL & UPPDATERA GRAFER.");
            //LÄGG TILL LIVSMEDLET MED DETTA ID I LISTAN OCH UPPDATERA BARCHART & DONUT OSV
        });
    }    

    this.setVitamin = function(vitamin){
        vitaminList.push(vitamin);
    }

    this.getVitamin = function(){
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
        vitaminList = [];
        document.getElementById("listVitamins").innerHTML = "";
        document.getElementById("listComplement").innerHTML = "";
    }
}