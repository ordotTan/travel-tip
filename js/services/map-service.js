import {utilService} from './utils.js';
// import {removeMarkerService} from './main.js';
export const mapService = {
    getAddressName,
    getLatLng,
    addLocation,
    getLocations,
    deleteLocation
    // gMarkers
    // removeMarker
}

const API_KEY = `AIzaSyCs6TeFgTlIHNY0RfxI-HZL1lNzrPtviQ0`

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