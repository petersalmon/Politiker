
// Creating the bounds of the map
var NorthWest = L.latLng(41.38917324986403, -75.12451171875),
    SouthEast = L.latLng(40.13269100586688, -72.7239990234375),
    mybounds = L.latLngBounds(NorthWest, SouthEast);

// Initializing the map
var mymap = L.map('map',{
    doubleClickZoom: false
}).setView([40.741919,-73.875504], 11).setMaxBounds(mybounds);

// Adding the tile layer
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    // maxBounds: mybounds,
    minZoom: 10,
    // maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoicGV0ZXJzNjRzIiwiYSI6ImNrNzd5YTk3cTBkMWYzZW9kb3R2Z2M1NzQifQ.TYnnhbb22jsBxXSxw0XaHw'
}).addTo(mymap);

// Initializing a sidebar
var sidebar = L.control.sidebar('sidebar').addTo(mymap);

// Upon clicking the draw icon on the sidebar, show the drawing options
// Leaflet.Geoman and Leaftlet.StyleEditor

var active = true;

document.getElementById("drawIcon").addEventListener("click", function(){

    // Toggle the Geoman UI
    mymap.pm.toggleControls({
        position: 'topleft'
        });

    elements = document.getElementsByClassName("leaflet-control-styleeditor");

    // Initialize the StyleEditor
    var styleEditor = L.control.styleEditor({
        position: 'topleft'
    });

    if(active == true){
        mymap.addControl(styleEditor);
    }
    else{
        elements[0].parentNode.removeChild(elements[0]);
    }
    
    active = !active;

});

// Initializing a canvas
// var myRenderer = L.canvas({ padding: 0.5 });
// var ciLayer = L.canvasIconLayer({}).addTo(mymap);

// var icon = L.icon({
//     iconUrl: 'img/marker.png',
//     iconSize: [30, 38],
//     iconAnchor: [10, 9]
// });

// Initializing a marker cluster 
var markerCluster = L.markerClusterGroup();

// Initializing a Census API object
// var tractData = census({
//     vintage: 2018,
//     geoHierarchy: {
//         place: { 
//             "lat": 40.741919,
//             "lng": -73.875504
//             },
//         tract: "*"
//     },
//     sourcePath: ["acs", "acs5"],
//     values: ["B01001_001E", "B01001_002E", "B01001_003E"],
//     statsKey: "cce3cc1b587f0b5559996f61c53980f8e44e05be",
//     geoResolution: "500k"
// }, 
// (err, res) => console.log(res));
// // console.log(tractData);

// Upon selection from the explore menu, populate the explore menu // highligth the area and print demographic stats
function getSelect(sel){

    // map.addLayer(comdisLayer);

    document.getElementById("demographic-data").innerHTML = ''

    //alert(sel.options[sel.selectedIndex].text);
    var cdSelect = sel.options[sel.selectedIndex].text;

    // Load in the demographics data
    fetch("/data/cd_dem_data.txt")
    .then(function(resp){
        return resp.json();
    })
    .then(function(data){

        for(i in data) {

            var cd = data[i];

            // cdBoro = cd["boro_cd"];
            // cdCode = cd["Community District"];
            cdName = cd["Name"]; 

            if(cdSelect === cdName){

                cdVar = cd.Variables;

                document.getElementById("demographic-data").innerHTML += '<br/>'  + '<b>' + '<u>' + "Population" + '</u>' + '</b>' + '<br/>'

                for(var a = 0; a < 5; a += 1){

                    document.getElementById("demographic-data").innerHTML +=

                    '<br/>' + '<i>' + cdVar[a]["Indicator"] + ': ' + '</i>' + '<b>' + cdVar[a]["2018"] + '</b>'
                }

                document.getElementById("demographic-data").innerHTML += '<br/>' + '<br/>'  + '<b>' + '<u>' + "Households" + '</u>' + '</b>' + '<br/>'

                for(var b = 5; b < 7; b += 1){

                    document.getElementById("demographic-data").innerHTML +=

                    '<br/>' + '<i>' + cdVar[b]["Indicator"] + ': ' + '</i>' + '<b>' + cdVar[b]["2018"] + '</b>'
                }

                document.getElementById("demographic-data").innerHTML += '<br/>' + '<br/>'  + '<b>' + '<u>' + "Race & Ethnicity" + '</u>' + '</b>' + '<br/>'

                for(var c = 7; c < 11; c += 1){

                    document.getElementById("demographic-data").innerHTML +=

                    '<br/>' + '<i>' + cdVar[c]["Indicator"] + ': ' + '</i>' + '<b>' + cdVar[c]["2018"] + '</b>'
                }

                document.getElementById("demographic-data").innerHTML += '<br/>' + '<br/>'  + '<b>' + '<u>' + "Income & Poverty" + '</u>' + '</b>' + '<br/>'

                for(var d = 11; d < 21; d += 1){

                    document.getElementById("demographic-data").innerHTML +=

                    '<br/>' + '<i>' + cdVar[d]["Indicator"] + ': ' + '</i>' + '<b>' + cdVar[d]["2018"] + '</b>'
                }

                document.getElementById("demographic-data").innerHTML += '<br/>' + '<br/>'  + '<b>' + '<u>' + "Neighborhood Conditions" + '</u>' + '</b>' + '<br/>'

                for(var e = 59; e < 68; e += 1){

                    document.getElementById("demographic-data").innerHTML +=

                    '<br/>' + '<i>' + cdVar[e]["Indicator"] + ': ' + '</i>' + '<b>' + cdVar[e]["2018"] + '</b>'
                }

                document.getElementById("demographic-data").innerHTML += '<br/>' + '<br/>'  + '<i>' + "Source: http://coredata.nyc/" + '</i>' 
            }
        }

    });

}

// Creating markers and additional map layers
fetch("/data/qn_bk_data.json")
    .then(function(resp){
        return (resp.json());
    })
    .then(function(data){

        var markersList = [];
 
        for (var i = 0; i < Object.keys(data).length; ++i){

            var id = data[i]['ID'];
            var name = data[i]['First Name'] + ' ' + data[i]['Middle Initial'] + ' ' + data[i]['Last Name'] + ' ' + data[i]['Name Suffix'];
            var address = data[i]['House Number'] + ' ' + data[i]['Apartment Number'] + ' ' + data[i]['Street Name'] + ', ' + data[i]['City'] + ', ' + data[i]['Zip Code'];
            var gender = data[i]['Gender'];
            var teleNum = data[i]['Telephone Number'];
            var polParty = data[i]['Political Party'];
            var statCode = data[i]['Status Code'];
            var voteType = data[i]['Vote Type'];
            var ylv = data[i]['Year Last Voted'];
            var lat = data[i]['Latitude'];
            var lng = data[i]['Longitude'];

            // Marker definition
            // ,  {icon: icon}
            var marker =  L.marker([lat, lng]).bindPopup('<b>' + 'ID: ' + '</b>' + '<i>' + id + '</i>' +
                                                        '<br/>' + '<b>' + 'Name: ' + '</b>' + '<i>' + name + '</i>' +
                                                        '<br/>' + '<b>' + 'Gender: ' + '</b>' + '<i>' + gender + '</i>' +
                                                        '<br/>' + '<b>' + 'Address: ' + '</b>' + '<i>' + address + '</i>' +
                                                        '<br/>' + '<b>' + 'Telephone: ' + '</b>' + '<i>' + teleNum + '</i>' +
                                                        '<br/>' + '<b>' + 'Political Party: ' + '</b>' + '<i>' + polParty + '</i>' +
                                                        '<br/>' + '<b>' + 'Status Code: ' + '</b>' + '<i>' + statCode + '</i>' +
                                                        '<br/>' + '<b>' + 'Voter Type: ' + '</b>' + '<i>' + voteType + '</i>');

            // Adding marker to list
            markersList.push(marker);
        }

        // Creating a layer of markers and adding to canvas
        // ciLayer.addLayers(markersList);

        // Creating a layer of markers and adding to canvas
        markerCluster.addLayers(markersList);

        var markerSets = {
            "Voters":markerCluster
        };

        // Partition style
        var layerStyle = {
            "color": "#000000",
            "weight": 3,
            "opacity": 0.5
        };

        // A function to add a popup to each partition with the name as the content
        function onEachFeature(feature, layer) {

            // does this feature have a property named popupContent?
            if (feature.properties && feature.properties.boro_cd) {
                var cdBoro = feature.properties.boro_cd.toString();
                var cdName = cdDict[cdBoro];
                layer.bindPopup(/* "Community District: " + */ cdName);
            }
            else if (feature.properties && feature.properties.ElectDist) {
                layer.bindPopup(/* "Election District: " + */ feature.properties.ElectDist.toString());
            }
            else if (feature.properties && feature.properties.CounDist) {
                layer.bindPopup(/* "City Council District: " + */ feature.properties.CounDist.toString());
            }
            else if (feature.properties && feature.properties.StSenDist) {
                layer.bindPopup(/* "State Senate District: " + */ feature.properties.StSenDist.toString());
            }
            else if (feature.properties && feature.properties.CongDist) {
                layer.bindPopup(/* "Congressional District: " + */ feature.properties.CongDist.toString());
            }
            else if (feature.properties && feature.properties.AssemDist) {
                layer.bindPopup(/* "State Assembly District: " + */ feature.properties.AssemDist.toString());
            }
            else if (feature.properties && feature.properties.ntaname) {
                layer.bindPopup(/* "Neighborhood: " + */ feature.properties.ntaname.toString());
            }
            else if (feature.properties && feature.properties.postalCode) {
                layer.bindPopup(/* "Zip Code: " + */ feature.properties.postalCode.toString());
            }
            else if (feature.properties && feature.properties.boro_name) {
                layer.bindPopup(/* "Borough: " + */ feature.properties.boro_name.toString());
            }

            // Macke certain events occur only at specific zoom levels
            mymap.on('zoomend', function() {
                var zoomlevel = mymap.getZoom();
                    if (zoomlevel <= 11){

                        layer.setStyle({
                            "opacity": 0.5,
                            "fillOpacity": 0.2
                        });

                        if (mymap.hasLayer(markerCluster)) {
                            mymap.removeLayer(markerCluster);
                        }
                    }
                    if (zoomlevel > 11){
                        if (!(mymap.hasLayer(markerCluster))){
                            mymap.addLayer(markerCluster);
                        }
                    }
                // console.log("Current Zoom Level =" + zoomlevel)
                });

            layer.on('mouseover', function() { 

                var zoomlevel = mymap.getZoom();

                if (mymap.hasLayer(boroughsLayer)) {
                    if (zoomlevel <= 12){
                        // Open popup on mouseover
                        var center = layer.getBounds().getCenter(); // in middle of partition
                        // var center = layer.getBounds().getCenter(); // at cursor location
                        layer.openPopup(center); 
                    }
                }
                else{
                    if (zoomlevel <= 14){
                        // Open popup on mouseover
                        var center = layer.getBounds().getCenter(); // in middle of partition
                        // var center = layer.getBounds().getCenter(); // at cursor location
                        layer.openPopup(center); 
                    }
                }
                // Highlight partition on mouseover
                this.setStyle({
                    "opacity": 1,
                    "fillOpacity": 0
                });
            });

            layer.on('mouseout', function() { 
                // Unhighlight partition on mouseout

                var zoomlevel = mymap.getZoom();
                // if (zoomlevel <= 11){
                this.setStyle({
                    "opacity": 0.5,
                    "fillOpacity": 0.2
                });
                layer.closePopup(); 
                // }
            });

            // If the CD layer is chosen, and a partition is clicked, populate the explore tab with demographic data 
            layer.on('click', function(e){

                mymap.eachLayer(function (layer) {
                    if(layer["urls"] !== undefined){

                        layerUrl = layer["urls"][0]

                        if(layerUrl.substring(5, 28) === "nyc_community_districts"){

                            // chnge the contents of the select tab
                            var popCont = e.target._popup._content;
                            // console.log(popCont.toString());
                            $("#explore-select").select2();
                            $("#explore-select").val(popCont.toString()).trigger("change");
                            $("#explore-select").select2({
                                dropdownParent: $('#explore')
                            });
                        }
                    }
                });
            });

            // Zoom in on double click of partition
            layer.on('dblclick', function(e) { 

                // mymap.eachLayer(function(layer){
                //     console.log(layer)
                // });
            
                // console.log(layer)
                // console.log(feature)

                var center = layer.getBounds().getCenter();
                var zoomlevel = mymap.getZoom();

                if (mymap.hasLayer(boroughsLayer)) {
                    mymap.setView(center, zoom = 13);
                }
                else{
                    mymap.setView(center, zoom = 15);
                }

                // mymap.fitBounds(layer.getBounds()); 
                // mymap.setView(center, zoom = 12);
                layer.closePopup();
                mymap.on('zoomend', function() {
                    if (zoomlevel > 11){
                        layer.setStyle({
                            "opacity": 1,
                            "fillOpacity": 0
                        });
                    }
                });

                // set the view
                // mymap.setView([e.latlng.lat, e.latlng.lng], 13); 
            });

            // Get a list of the markers in a polygon and print the content of the markers in 'voter' section of the sidebar
            layer.on('click', function(e) {

                // get a list of all the parmers and contents in polygon

                // for each marker in list, add it to the voter tab 

                var coords = layer.feature.geometry.coordinates;
                var coordsMerged = [].concat.apply([], coords);
                var coordsMerged2 = [].concat.apply([], coordsMerged);
                coordsMerged2.push(coordsMerged2[0]);

                // Get polygon bounds to search in
                var searchWithin = turf.polygon([
                    coordsMerged2
                ]);

                // Creating a map of marker coordinates and content
                const coorContTable = new Map;
                var pointCoors = [];

                for(var i = 0; i < Object.keys(markersList).length; ++i){

                    // console.log(markersList[i]);
                    // console.log(markersList[i]["_latlng"]);

                    var lat = markersList[i]["_latlng"]["lat"];
                    var lng = markersList[i]["_latlng"]["lng"];
                    var markerCont = markersList[i]["_popup"]["_content"];
                    
                    pointCoors.push([lng,lat]);
                    coorContTable.set(lng + "|" + lat, markerCont);
                }

                // Get marker coordinates
                var points = turf.points(pointCoors);

                // Clear content
                document.getElementById("sidebar-voters-content").innerHTML = ""
                
                // Search for points in polygon
                var ptsWithin = turf.pointsWithinPolygon(points, searchWithin);

                // Print content for each coordinate set in ptsWithin
                for(var i = 0; i < 100; ++i){ // (var i = 0; i < ptsWithin.features.length; ++i) (only provide preview of all voters)

                    if(ptsWithin.features[i] !== undefined){
                        var lng = ptsWithin.features[i]["geometry"]["coordinates"][0];
                        var lat = ptsWithin.features[i]["geometry"]["coordinates"][1];

                        content = coorContTable.get(lng + "|" + lat);

                        // Change the sidebar contents upon a click
                        document.getElementById("sidebar-voters-content").innerHTML += content.toString() + "<br />" + "<br />"
                    }
                }

                // Add button to export selected voters to list if tab has content
                var votersContent = document.getElementById("sidebar-voters-content").innerHTML
                if(votersContent === "") {
                    $('#voters-to-list').css('display','none');
                }
                else{
                    $('#voters-to-list').css('display','block');
                }

                // Export all selected voters to a file
                var selectedMarkers = [];
                for(var i = 0; i < ptsWithin.features.length; ++i){
                    if(ptsWithin.features[i] !== undefined){
                        var lng = ptsWithin.features[i]["geometry"]["coordinates"][0];
                        var lat = ptsWithin.features[i]["geometry"]["coordinates"][1];

                        content = coorContTable.get(lng + "|" + lat);
                        idContent = content.substring(content.indexOf("<i>") + 3, content.indexOf("</i>"))
                        selectedMarkers.push(idContent);
                    }
                }

                // Send the list of selected voters/markerids to the database
                $.ajax({
                    "url": "/Politiker/maps/",
                    "method": "POST",
                    "data": {markerIds:selectedMarkers},
                    "content-type": "application/json",
                    success: function(response){
                        console.log(response);
                    }
                });
            });
        }
        // Once the user is done drawing a shape, get a list of all the voters within it's bounds
        mymap.on('pm:create', function(e){

            var coordsArray = []

            // Creating a map of marker coordinates and content
            const coorContTable = new Map;
            var pointCoors = [];

            for(var i = 0; i < Object.keys(markersList).length; ++i){

                var lat = markersList[i]["_latlng"]["lat"];
                var lng = markersList[i]["_latlng"]["lng"];
                var markerCont = markersList[i]["_popup"]["_content"];
                
                pointCoors.push([lng,lat]);
                coorContTable.set(lng + "|" + lat, markerCont);
            }

            // Get marker coordinates
            var points = turf.points(pointCoors);

            if(e.shape.toString() === 'Circle'){

                // Clear content
                document.getElementById("sidebar-voters-content").innerHTML = ""

                for(var i = 0; i < points.features.length; ++i){

                    var pointArrays = points.features[i.toString()].geometry.coordinates;
                    var pointCoor = [pointArrays[1],pointArrays[0]];

                    var radius = e.layer.getRadius(); //in meters
                    var circleCenterPoint = e.layer.getLatLng(); //gets the circle's center latlng

                    var isInCircleRadius = circleCenterPoint.distanceTo(pointCoor) <= radius;

                    if(isInCircleRadius){

                        var lng = pointCoor[1];
                        var lat = pointCoor[0];

                        content = coorContTable.get(lng + "|" + lat);

                        // Change the sidebar contents upon a click
                        document.getElementById("sidebar-voters-content").innerHTML += content.toString() + "<br />" + "<br />"
                    }
                }
            }
            else{
                if(e.shape.toString() === 'Rectangle' | e.shape.toString() === 'Polygon'){
                    var coords = e.layer.getLatLngs();

                    for(var i = 0; i < coords['0'].length; ++i){
                        var lat = Object.values(coords['0'][i.toString()])[0]
                        var lng = Object.values(coords['0'][i.toString()])[1]
                        newArray = [lng, lat];
                        coordsArray.push(newArray);
                    }

                    coordsArray.push(coordsArray[0]);
                }
                // else{
                //     var coords = e.layer.getLatLngs();
                
                //     for(var i = 0; i < coords.length; ++i){
                //         var lat = Object.values(coords[i.toString()])[0]
                //         var lng = Object.values(coords[i.toString()])[1]
                //         newArray = [lng, lat];
                //         coordsArray.push(newArray);
                //     }

                //     coordsArray.push(coordsArray[0]);
                // }

                // Get polygon bounds to search in
                var searchWithin = turf.polygon([
                    coordsArray
                ]);

                // Clear content
                document.getElementById("sidebar-voters-content").innerHTML = ""

                // Search for points in polygon
                var ptsWithin = turf.pointsWithinPolygon(points, searchWithin);

                // console.log(ptsWithin);

                // Print content for each coordinate set in ptsWithin
                for(var i = 0; i < 100; ++i){ // (var i = 0; i < ptsWithin.features.length; ++i) (only provide preview of all voters)

                    if(ptsWithin.features[i] !== undefined){
                        var lng = ptsWithin.features[i]["geometry"]["coordinates"][0];
                        var lat = ptsWithin.features[i]["geometry"]["coordinates"][1];

                        content = coorContTable.get(lng + "|" + lat);

                        // Change the sidebar contents upon a click
                        document.getElementById("sidebar-voters-content").innerHTML += content.toString() + "<br />" + "<br />"
                    }
                }
                // Export all selected voters to Mongodb
                var selectedMarkers = [];
                for(var i = 0; i < ptsWithin.features.length; ++i){
                    if(ptsWithin.features[i] !== undefined){
                        var lng = ptsWithin.features[i]["geometry"]["coordinates"][0];
                        var lat = ptsWithin.features[i]["geometry"]["coordinates"][1];

                        content = coorContTable.get(lng + "|" + lat);
                        idContent = content.substring(content.indexOf("<i>") + 3, content.indexOf("</i>"))
                        selectedMarkers.push(idContent);
                    }
                }

                // console.log(selectedMarkers);

                // Send the list of selected voters/markerids to the database
                $.ajax({
                    "url": "/Politiker/maps/",
                    "method": "POST",
                    "data": {markerIds:selectedMarkers},
                    "content-type": "application/json",
                    success: function(response){
                        // console.log(response);
                    }
                });
            }
            // Add button to export selected voters to list if tab has content
            var votersContent = document.getElementById("sidebar-voters-content").innerHTML
            if(votersContent === "") {
                $('#voters-to-list').css('display','none');
            }
            else{
                $('#voters-to-list').css('display','block');
            }
        });

        // When the CD in the explore tab is changed, highlight the corresponding partition on the map
        $('#explore-select').on('change', function(){

            // Get the select CD name
            var elSelect = document.getElementById("explore-select");
            var boroSelectName = elSelect.value;

            // Turning the name to a code
            function getKeyByValue(object, value) {
                return Object.keys(object).find(key => object[key] === value);
            }

            var boroSelect = getKeyByValue(cdDict, boroSelectName);

            mymap.eachLayer(function(layer) {
                if( layer instanceof L.GeoJSON )
                   mymap.removeLayer(layer);
            });

            mymap.addLayer(comdisLayer); 
            
            mymap.eachLayer(function(layer){

                if(layer.feature !== undefined){

                    layer.setStyle({
                        "color": "#000000",
                        "opacity": 0.5,
                        "fillOpacity": 0.2
                    });

                    if(layer.feature.properties.boro_cd === boroSelect){
                        layer.setStyle({
                            "color": "rgb(250, 181, 10)",
                        });
                    }
                }
            });
        });

        // Creating each new partition layer
        // var cityLayer = new L.GeoJSON.AJAX("maps/nyc.geojson",{style:layerStyle, onEachFeature: onEachFeature});
        var boroughsLayer = new L.GeoJSON.AJAX("/maps/boroughs.geojson",{style:layerStyle, onEachFeature: onEachFeature});
        var zipLayer = new L.GeoJSON.AJAX("/maps/nyc_zip_codes.geojson",{style:layerStyle, onEachFeature: onEachFeature});
        var neighborhoodLayer = new L.GeoJSON.AJAX("/maps/neighborhoods.geojson",{style:layerStyle, onEachFeature: onEachFeature});
        var stateAssLayer = new L.GeoJSON.AJAX("/maps/nyc_state_assembly_districts.geojson",{style:layerStyle, onEachFeature: onEachFeature});
        var congDisLayer = new L.GeoJSON.AJAX("/maps/nyc_congressional_districts.geojson",{style:layerStyle, onEachFeature: onEachFeature});
        var stateSenLayer = new L.GeoJSON.AJAX("/maps/nyc_state_senate_districts.geojson",{style:layerStyle, onEachFeature: onEachFeature}); 
        var cityCouncilLayer = new L.GeoJSON.AJAX("/maps/nyc_city_council_districts.geojson",{style:layerStyle, onEachFeature: onEachFeature});    
        var electDisLayer = new L.GeoJSON.AJAX("/maps/nyc_election_districts.geojson",{style:layerStyle, onEachFeature: onEachFeature});
        var comdisLayer = new L.GeoJSON.AJAX("/maps/nyc_community_districts.geojson",{style:layerStyle, onEachFeature: onEachFeature}); 

        // Grouping the partition choices together
        var partitions = {
            "None": mymap,
            // "City": cityLayer,
            "Borough": boroughsLayer,
            "Zip Code": zipLayer,
            "Neighborhood": neighborhoodLayer,
            "State Assembly District": stateAssLayer,
            "Congresional District": congDisLayer,
            "State Senate District": stateSenLayer,
            "City Council District": cityCouncilLayer,
            "Election District": electDisLayer,
            "Community District": comdisLayer
        };

        // Add clusters to map
        // markerCluster.addTo(mymap);
        // markerCluster.checkIn(voters);

        // Add the selection menu in top right corner of map
        L.control.layers(partitions, markerSets).addTo(mymap); //markerSets

        // Show borough layer upon initial page load
        mymap.addLayer(boroughsLayer);
    });

/*
You need to fingure out:



FIX THE CIRCLE AND POLYGON DRAW SELECTIONS AND ADD AN AJAX CALL TO THE CIRCLE!!!



1. Draw cutom boundaries on the map and have it populate the voter tab [X]
2. Tab for highlighting/filtering map partitions based on stats []
3. Tab for saving custom map layers with drawings []
4. Add zipcode demographic data []
5. Figure out exactly how you want the map to look at each zoom level/layer []
*/