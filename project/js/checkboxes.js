function checkboxes(){

    var self = this;
    var objects = {};
    var summedValueOfDatum = [];
    var typeOfDatum = ["Protein(g)", "Fett(g)", "Kolhydrater(g)","Fibrer(g)","Salt(g)","Vatten(g)"];
    var totalGram = 0;

    var chbDiv = $("#checkBox");

    var height = chbDiv.height(),
        width = chbDiv.width();
    
    d3.csv("data/livsmedelKorrekt.csv", function(data) {
        self.data = data;
        var index = 0;
        var dataFoo = [710];
        var summedIntake = {};
        
        processdata(dataFoo);
    });

    function processdata(choosenfoodnumber) {
        var index = 0;
        var dataFoo = [];
        var summedIntake = {};

        // MÅSTE FINNAS ETT BÄTTRE SÄTT ATT LÖSA DETTA PÅ.. För man inte kan += ett var utan värde
        typeOfDatum.forEach(function(o){
            summedIntake[o] = 0;
        });
     
        self.data.forEach(function(c){
            choosenfoodnumber.forEach(function(cfn) {
                if(c["Livsmedelsnummer"] == cfn){
                    dataFoo.push(c);
                    typeOfDatum.forEach(function(o){
                        summedIntake[o] += +c[o];
                        totalGram += +c[o];
                    })
                    index++;
                }
            })
        });

        // DETTA GÖRS BARA FÖR ATT PIE VILL HA DET [object, object object]. Vet inte hur man löser med {protein: .....}
        typeOfDatum.forEach(function(f){
            summedValueOfDatum.push({
                type: f,
                sum: +summedIntake[f]    
            })
        })

        draw(dataFoo, summedValueOfDatum);
    }

    function draw(data, intake) {
        var foo = '';
        var livsNumb = [];

        data.forEach( function(d) {
            foo += "<label class='check'><input type='checkbox' value='" 
                    + d["Livsmedelsnummer"] + "' checked/>" + d["Livsmedelsnamn"] + "<br><label>";
            livsNumb.push(d["Livsmedelsnummer"]);
        });
        $('#checkBox').html(foo);
       
        $('#checkBox').on('click', 'input', function(event) { 
            var $this = $(this); // DETTA SER SKUMT UT MEN ÄR BARA ETT NAMN
            if($this.prop('checked')) { // check select status
                livsNumb.push($this.val());
                
                donut1.update(livsNumb);
                bar1.update(livsNumb);
                table1.update(livsNumb);
            }else{
                var index = livsNumb.indexOf($this.val());
                if (index > -1) {
                    livsNumb.splice(index, 1);
                }
                
                donut1.update(livsNumb);
                bar1.update(livsNumb);
                table1.update(livsNumb);
            }
        });
    }

     this.update = function(choosenfoodnumbers) {
        processdata(choosenfoodnumbers);
    }
}

