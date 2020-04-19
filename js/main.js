// import { LocationPreview } from './services/location-preview.js';


const DUMMY_LOCATIONS = [
    {id: 'A1',
    address: 'Ramat Gan',
    position: {lat: 29.550431, lng: 34.956870}
    }
];

var gMap
var gMarkers = [] 
var gMarkerId = 1

function onInit() {
    renderMap(); 
}

function renderTable() {
    const elTableBody = document.querySelector('tbody');
    elTableBody.innerHTML = '';
    var locations = DUMMY_LOCATIONS;
    console.log(locations);
    locations.forEach( (location) => {
        const locationPreview = new LocationPreview(location);
        const elLocation = locationPreview.render();
        elTableBody.appendChild(elLocation);
    });
}


function renderMap() {
    if (!navigator.geolocation) {
        alert("HTML5 Geolocation is not supported in your browser.");
        return;
    }
    initMap();
}

function initMap(lat = 29.5577, lng = 34.9519, zoom = 12) {
    var elMap = document.querySelector('#map');
    var options = {
        center: { lat, lng },
        zoom,
        scaleControl: false,
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_BOTTOM
        },
        mapTypeControl: false,
        fullscreenControl: false,
        rotateControl: false,
        streetViewControl: false

    };

    gMap = new google.maps.Map(
        elMap,
        options
    );

    gMap.addListener('click', function (ev) {
        const lat = ev.latLng.lat()
        const lng = ev.latLng.lng()
        getAddressName (lat,lng) 
            .then(ans => {
                console.log (ans)
                addMarker(lat, lng, ans)


    // gMap.addListener('click', function (ev) {
    //     document.querySelector('.input-name-modal').hidden = false;
    //     document.querySelector('input[name="place-lat"]').value = ev.latLng.lat();
    //     document.querySelector('input[name="place-lng"]').value = ev.latLng.lng();
    // });

    // addMarker('XXX', lat, lng, 'Eilat')
            })
    })
    //Adding the goto my location control on the map
    var myLocationDiv = document.createElement('div');
    var centerControl = new gotoUserPosControl(myLocationDiv);
    myLocationDiv.index = 1;
    gMap.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(myLocationDiv);
}

function addMarker(lat, lng, title, iconUrl = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png') {
    var marker = new google.maps.Marker({
        id: gMarkerId++,
        position: { lat, lng },
        map: gMap,
        title: title,
        label: title,
        icon: {
            url: iconUrl
        }
    })
    gMarkers.push(marker)
    const infowindow = new google.maps.InfoWindow({
        content: title
    });
    marker.addListener('click', function () {
        infowindow.open(gMap, marker);
    })
}


function gotoUserPosControl(controlDiv) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '50%';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.style.cursor = 'pointer';
    controlUI.title = 'My Location';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.innerHTML = `<img src="img/myLoc.png">`
    controlUI.appendChild(controlText);

    // Setup the click event listeners
    controlUI.addEventListener('click', function () {
        gotoUserLoc()
    });

}

function gotoUserLoc() {
    navigator.geolocation.getCurrentPosition(setUserPos, handleLocationError);
}

function setUserPos(position) {
    const lat = position.coords.latitude
    const lng = position.coords.longitude;
    gMap.setCenter({ lat, lng });
    gMap.setZoom(18)
    addMarker(lat, lng, 'Home', 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png')
    getAddressName(lat,lng)
}


function handleLocationError(error) {
    var locationError = document.getElementById("locationError");
    switch (error.code) {
        case 0:
            locationError.innerHTML = "There was an error while retrieving your location: " + error.message;
            break;
        case 1:
            locationError.innerHTML = "The user didn't allow this page to retrieve a location.";
            break;
        case 2:
            locationError.innerHTML = "The browser was unable to determine your location: " + error.message;
            break;
        case 3:
            locationError.innerHTML = "The browser timed out before retrieving the location.";
            break;
    }
    return error
}