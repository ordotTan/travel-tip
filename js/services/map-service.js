import {utilService} from './utils.js';
// import {removeMarkerService} from './main.js';
export const mapService = {
    getAddressName,
    getLatLng,
    addLocation,
    getLocations,
    deleteLocation,
    getWeather,
    // gMarkers
    // removeMarker
}

const API_KEY = `AIzaSyCs6TeFgTlIHNY0RfxI-HZL1lNzrPtviQ0`
const API_KEY_WEATHER = 'cf3131f6e8946b86e553eb5d63bac0be';

// var gMarkers = []
var gLocations = []

// function removeMarker(placeId) {
//     const markerIdx = gMarkers.findIndex(marker => marker.id === placeId)
//     gMarkers[markerIdx].setMap(null)
//     gMarkers.splice(markerIdx, 1)
// }


function getAddressName(lat, lng) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`)
        .then(res => { 
            return res.data.results[0].formatted_address 
        })
}

function getLatLng(address) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`)
        .then(res => {
            return res.data.results[0].geometry.location
        })
}

function getWeather(lat, lng){
    return axios.get(`api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY_WEATHER}`)
    .then(res => {
        return res.weather.main;
    });
}


function addLocation(address,lat,lng) {
    const location = createLocation (address,lat,lng)
    gLocations.push(location)
    return location.id;
}

function createLocation (address,lat,lng) {
    return {
        id: utilService.makeId(),
        address,
        position:{lat:lat,lng:lng}
    }
}

function getLocations() {
    return gLocations
}

function deleteLocation(locationId){
    var locationIdx = gLocations.findIndex((location) => {
        return location.id === locationId;
    })
    gLocations.splice(locationIdx, 1);

    // var markerIdx = gMarkers.findIndex((marker) => {
    //     return marker.id === locationId;
    // })
    // removeMarkerService.removeMarker(gMarkers[markerIdx].id)
}