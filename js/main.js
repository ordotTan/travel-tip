import { LocationPreview } from './cmps/location-preview.js';
import { mapService } from './services/map-service.js';

var gMap
var gMarkers = []
var gCurrentLocation

window.addEventListener('load', onInit)

function onInit() {
    bindEvents();
    renderMap();
    setMapInitialPos()
}

function bindEvents() {
    document.querySelector('.btn-copy-loc').addEventListener('click', onCopyLocation)
    document.querySelector('.btn-search').addEventListener('click', onSearch);
}


function onSearch() {
    const elInput = document.querySelector('input');
    const address = elInput.value;
    mapService.getLatLng(address)
        .then(ans => {
            addNewLocation(address, ans.lat, ans.lng)
            onGoToLocation({ lat: ans.lat, lng: ans.lng })
        })
}

function renderTable() {
    const elTableBody = document.querySelector('tbody');
    elTableBody.innerHTML = '';
    var locations = mapService.getLocations()
    locations.forEach((location) => {
        const locationPreview = new LocationPreview(location, onDeleteLocation, onGoToLocation);
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

function initMap(lat = 32.0717001153281, lng = 34.7991300499871, zoom = 13) {
    gCurrentLocation = { lat, lng };
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
        mapService.getAddressName(lat, lng)
            .then(ans => {
                addNewLocation(ans, lat, lng)
            })

    })
    //Adding the goto my location control on the map
    var myLocationDiv = document.createElement('div');
    var centerControl = new gotoUserPosControl(myLocationDiv);
    myLocationDiv.index = 1;
    gMap.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(myLocationDiv);
}

function addMarker(locationId, lat, lng, title, iconUrl = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png') {
    var marker = new google.maps.Marker({
        id: locationId,
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
    const lat = +position.coords.latitude
    const lng = +position.coords.longitude;
    gMap.setCenter({ lat, lng });
    gMap.setZoom(18)
    mapService.getAddressName(lat, lng)
        .then(ans => {
            addNewLocation(ans, lat, lng)
        })
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


function onGoToLocation(location) {
    const lat = location.lat
    const lng = location.lng
    gMap.setCenter({ lat, lng })
    gMap.setZoom(18);
}


function onDeleteLocation(locationId) {
    mapService.deleteLocation(locationId);
    renderTable();
    var markerIdx = gMarkers.findIndex((marker) => {
        return marker.id === locationId;
    })
    gMarkers[markerIdx].setMap(null)
    gMarkers.splice(markerIdx, 1)
}


function onCopyLocation() {
    const locations = mapService.getLocations()
    if (!gCurrentLocation || locations.length === 0) {
        return
    }
    const lat = gCurrentLocation.lat
    const lng = gCurrentLocation.lng
    const urlToCopy = `${window.location.origin}?lat=${lat}&lng=${lng}`
    document.querySelector('.loc-place-holder').value = urlToCopy

    /* Select the text field */
    const copyText = document.querySelector('.loc-place-holder')
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/
    /* Copy the text inside the text field */
    document.execCommand("copy");
    Swal.fire({
        position: 'top-middle',
        icon: 'success',
        title: 'Location copied to your clipboard',
        showConfirmButton: false,
        timer: 2000
    })

}

function setMapInitialPos() {
    const urlParams = new URLSearchParams(window.location.search);
    let lat = +urlParams.get('lat');
    let lng = +urlParams.get('lng');
    if (lat === 0 && lng === 0) {
        lat = 32.0717001153281
        lng = 34.7991300499871
    }
    gMap.setCenter({ lat, lng });
    gMap.setZoom(18);
    mapService.getAddressName(lat, lng)
        .then(ans => {
            addNewLocation(ans, lat, lng)
        })
}

function addNewLocation(ans, lat, lng) {
    mapService.getWeather(lat, lng)
        .then(weather => {
            var locationId = mapService.addLocation(ans, lat, lng, weather);
            addMarker(locationId, lat, lng, ans)
            gCurrentLocation = { lat, lng }
            document.querySelector('.curr-location-content').innerHTML = 'Location: ' + ans;
            renderTable()

        });
}