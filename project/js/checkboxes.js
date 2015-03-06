function checkboxes(){

    var self = this;
    var objects = {};
    var summedValueOfDatum = [];
    var typeOfDatum = ["Protein(g)", "Fett(g)", "Kolhydrater(g)","Fibrer(g)","Salt(g)","Vatten(g)"];
    var totalGram = 0;

    var chbDiv = $("#checkBox");

    var height = chbDiv.height(),
        width = chbDiv.width();
    
    d3.csv("data/livsmedelKomma.csv", function(data) {
        self.data = data;
        var index = 0;
        var dataFoo = [];
        var summedIntake = {};

        // MÅSTE FINNAS ETT BÄTTRE SÄTT!!!!!! För man inte kan += ett var utan värde
        typeOfDatum.forEach(function(o){
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
        })
        

        draw(dataFoo, summedValueOfDatum);
    });

    function draw(data, intake) {

        // document.getElementById("checkBox").innerHTML = "";
        var foo = '';
        var livsNumb = [];
        data.forEach( function(d) {
            foo += "<label><input type='checkbox' value='" 
                    + d["Livsmedelsnummer"] + "' checked/>" + d["Livsmedelsnamn"] + "<br><label>";
            livsNumb.push(d["Livsmedelsnummer"]);
        });
        $('#checkBox').html(foo);
       
        $('#checkBox').on('click', 'input', function(event) {  //on click 
            var $this = $(this); // DETTA SER SKUMT UT MEN ÄR BARA ETT NAMN
            if($this.prop('checked')) { // check select status
                livsNumb.push($this.val());
                console.log("FLER " + livsNumb);
                donut1.update(livsNumb);
                bar1.update(livsNumb);
            }else{
                var index = livsNumb.indexOf($this.val());
                if (index > -1) {
                    livsNumb.splice(index, 1);
                }
                console.log("FÄRRE " + livsNumb);
                donut1.update(livsNumb);
                bar1.update(livsNumb);
            }
        });
    }
}

