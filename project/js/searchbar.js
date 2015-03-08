function searchbar() {

    //Variable to hold autocomplete options
    var keys;

    //Load US States as options from CSV - but this can also be created dynamically
    d3.csv("data/livsmedelKomma.csv",function (csv) {
        keys=csv;
        start();
    });


    //Call back for when user selects an option
    function onSelect(d) {
        console.log(d["Livsmedelsnummer"])
        alert(d["Livsmedelsnummer"]);
    }

    //Setup and render the autocomplete
    function start() {
        var mc = autocomplete(document.getElementById('searchBar'))
                .keys(keys)
                .dataField("Livsmedelsnamn")
                .placeHolder("Search States - Start typing here")
                .width(960)
                .height(500)
                .onSelected(onSelect)
                .render();
    }

}