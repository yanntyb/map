let ville;
let choosed = false;

function initialize() {
    $("#validation").click(function () {4
            if ($("#input").html !== "") {
                $.ajax({
                    url: "http://api.openweathermap.org/data/2.5/weather?q=" + input.value + "&appid=3078318dd0d0534083752a2e64525eb6&lang=fr",
                    type: "GET",
                    datatyp: "json",
                    success: function (result) {
                        ville = result.coord;
                        if(!choosed){
                            let map =  L.map('map').setView([ville.lat, ville.lon], 10);// LIGNE 18

                            let osmLayer = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', { // LIGNE 20
                                maxZoom: 19
                            });
                            map.addLayer(osmLayer);
                            map.on("click",function(e){
                                console.log(e);
                                L.marker([e.latlng.lat,e.latlng.lng]).addTo(map);
                            })

                            choosed = true;
                        }
                        else{
                            let mapPrevious = document.getElementById("map");
                            $(mapPrevious).remove();
                            let map = document.createElement("div");
                            map.id = "map";
                            document.body.append(map);
                            map =  L.map('map').setView([ville.lat, ville.lon], 10);// LIGNE 18

                            osmLayer = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', { // LIGNE 20
                                maxZoom: 19
                            });
                            map.addLayer(osmLayer);
                            map.on("click",function(e){
                                console.log(e);
                                L.marker([e.latlng.lat,e.latlng.lng]).addTo(map);
                            })
                        }
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

