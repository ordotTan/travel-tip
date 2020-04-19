// import { LocationPreview } from './services/location-preview.js';


const DUMMY_LOCATIONS = [
    {id: 'A1',
    address: 'Ramat Gan',
    position: {lat: 29.550431, lng: 34.956870}
    }
];

function renderTable(){
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

    renderTable();

    // gMap.addListener('click', function (ev) {
    //     document.querySelector('.input-name-modal').hidden = false;
    //     document.querySelector('input[name="place-lat"]').value = ev.latLng.lat();
    //     document.querySelector('input[name="place-lng"]').value = ev.latLng.lng();
    // });

    // addMarker('XXX', lat, lng, 'Eilat')

    //Adding the goto my location control on the map
    // var myLocationDiv = document.createElement('div');
    // var centerControl = new gotoUserPosControl(myLocationDiv);
    // myLocationDiv.index = 1;
    // gMap.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(myLocationDiv);

}