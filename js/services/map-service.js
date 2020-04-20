import {utilService} from './utils.js';
export const mapService = {
    getAddressName,
    getLatLng,
    addLocation,
    getLocations,
    deleteLocation,
    getWeather
}

const API_KEY = ''
const API_KEY_WEATHER = 'cf3131f6e8946b86e553eb5d63bac0be';

var gLocations = []

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
    return axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY_WEATHER}`)
        .then(res => {
            return res.data.weather[0].description;
        });
}


function addLocation(address,lat,lng, weather) {
    const location = createLocation (address,lat,lng, weather)
    gLocations.push(location)
    return location.id;
}

function createLocation (address,lat,lng,weather) {
    return {
        id: utilService.makeId(),
        address,
        position:{lat:lat,lng:lng},
        weather
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
}