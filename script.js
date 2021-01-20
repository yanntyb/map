let ville;
let tabPoint = [];
let index = 1;

function initialize() {
    $("#validation").click(function () {
            if ($("#input").html !== "") {
                $.ajax({
                    url: "https://api.openweathermap.org/data/2.5/weather?q=" + input.value + "&appid=3078318dd0d0534083752a2e64525eb6&lang=fr",
                    type: "GET",
                    datatyp: "json",
                    success: function (result) {
                        afficher(result.coord);
                    },
                    error: function () {
                        console.log("error");

                    }
                });
            }
        }
    )
}

initialize();

function afficherPoint(point){
    let span = document.createElement("span");
    span.innerHTML = "<br>"+point;
    $(span).click(function(){
        let coord = $(this).html().slice(4).split(",");
        coord.forEach(elem => {
            parseFloat(elem);
        });
        console.log(coord)
        afficher(coord, true)
    })
    $("#point").append($(span));
}

function afficher(data,tp = false){
    ville = data;
    let mapPrevious = document.getElementById("map");
    $(mapPrevious).remove();
    let map = document.createElement("div");
    map.id = "map";
    document.body.append(map);
    if(tp){
        map = L.map('map').setView(data, 10);
        L.marker(data).addTo(map);
    }else{
        map = L.map('map').setView([data.lat, data.lon], 10);
    }


    osmLayer = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    });
    map.addLayer(osmLayer);
    map.on("click", function (e) {
        let coord = [e.latlng.lat, e.latlng.lng]
        afficherPoint(coord);
        L.marker(coord).addTo(map);
    })
}