let ville;
let tabPoint = [];
let index = 1;
let indexSelected = [0,0];
let selected = false;
/**
 * Init the map frame.
 */
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
    })
}

/**
 *
 * @param point
 */
function afficherPoint(point){
    let divGlobal = document.createElement("div");
    divGlobal.className = "pointGlobal"
    let span = document.createElement("span");
    span.innerHTML = point;
    span.style.display = "none";
    span.style.fontSize = "8px";
    let div = document.createElement("h2");
    div.className = "ville";
    let coord = $(span).text()
    coord = coord.split(",");
    coord = [parseFloat(coord[0]),parseFloat(coord[1])]
    afficherVille(coord, div);
    if(div.innerHTML === ""){
        div.innerHTML = "Inconnue"
    }
    $(divGlobal).click(function(){
        let coord = $($(this).children()[0]).text().split(",");
        coord.forEach(elem => {
            parseFloat(elem);
        });
        afficher(coord, true)
    })
    $(divGlobal).append($(span)).append($(div));
    $("#point").append($(divGlobal));
}

/**
 *
 * @param data
 * @param tp
 */
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

function afficherVille(coord, div){
    const settings = {
        "crossDomain": true,
        "url": "https://geocode.xyz/"+coord[0] +","+coord[1]+"?json=1",
    };

    $.get(settings)
        .done(function (response) {
        div.innerHTML = response.city;
        tabPoint.push([response.city, [coord]]);
    });
}

function distance(coord1, coord2) {
    let lat1 = coord1[0][0];
    let lon1 = coord1[0][1];
    let lat2 = coord2[0][0];
    let lon2 = coord2[0][1];
    if ((lat1 === lat2) && (lon1 === lon2)) {
        return 0;
    }
    else {
        let radlat1 = Math.PI * lat1/180;
        let radlat2 = Math.PI * lat2/180;
        let theta = lon1-lon2;
        let radtheta = Math.PI * theta/180;
        let a = Math.sin(radlat1) * Math.sin(radlat2);
        let b = Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        let dist = a + b;
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;
        console.log(dist);
        return dist;
    }
}

$("#calcule").click(function(){
    $("#distanceResult").css({
        "display" : "none"
    })
    $("#modal").css({
        "display": "block"
    })
    $("#close").click(function(){
        $("#modal").css({
            "display": "none"
        })
        $("#distanceResult").html("");
    })
    defineSelectOption();
    $("#calculerDistance").click(function(){
        $("#distanceResult").css({
            "display" : "block"
        })
        calcule();
    });


})

function defineSelectOption(){
    let input = document.getElementsByClassName("inputVille");
    $("option").remove()
    for(let i=0; i<=1; i++) {
        for (let j of tabPoint) {
            let select = document.createElement("option");
            select.value = j[0];
            select.innerHTML = j[0];
            select.dataset.position = j[1];
            input[i].append(select);
        }
        input[i].addEventListener("change", function(){
            let indexselected = this.selectedIndex;
            indexSelected[i] = indexselected;
        })
    }
}

function calcule(){
    let coord = [[],[]];
    for(let i in indexSelected){
        coord[i] = tabPoint[indexSelected[i]][1];
        coord[i].forEach(elem => {
            elem = parseInt(elem);
        })
    }
    let distanceCalc = distance(coord[0], coord[1]);
    $("#distanceResult").html(distanceCalc.toFixed(3) + " Km");
}



initialize();
