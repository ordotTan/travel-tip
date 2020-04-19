// place = {
//     id : 'fdwf3d',
//     name : "some name",
//     location : {lat:12.3, lng:43.4}
// }

const API_KEY = `AIzaSyCs6TeFgTlIHNY0RfxI-HZL1lNzrPtviQ0`

    // getAddressName(29.5577, 34.9519)
    //     .then(console.log)

// getLatLng('Times Square')
//     .then(console.log)

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


