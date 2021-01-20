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
    span.style.fontSize = "8px"
    let div = document.createElement("h2");
    let coord = $(span).html().slice(4);
    coord = coord.split(",");
    coord = [parseFloat(coord[0]),parseFloat(coord[1])]
    div.innerHTML = afficherVille(coord);
    $(span).click(function(){
        let coord = $(this).html().slice(4).split(",");
        coord.forEach(elem => {
            parseFloat(elem);
        });
        afficher(coord, true)
    })
    $("#point").append($(span)).append($(div));
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

function afficherVille(coord){
    const settings = {
        "crossDomain": true,
        "async" : false,
        "url": "https://geocode.xyz/"+coord[0] +","+coord[1]+"?json=1",
        "method": "GET",
    };

    $.ajax(settings).done(function (response) {
        let city = response.city;
        console.log(city)
        return city;
    });
}