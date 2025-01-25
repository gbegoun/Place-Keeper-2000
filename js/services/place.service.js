import { storageServiceAsync } from "./async-storage.service.js"

export const placeService = {
    addPlace,
    updatePlace,
    getPlaceById,
    removePlace,
    exportToCSV,
    getAllCheckedPlaces,
}

const STORAGE_KEY = 'places'

_createHell()

function addPlace(place){
    return storageServiceAsync.post(STORAGE_KEY, place)
}

function updatePlace(place){
    return storageServiceAsync.put(STORAGE_KEY, place)
}

function removePlace(id){
    return storageServiceAsync.remove(STORAGE_KEY, id)
}
function getPlaceById(id){
    return storageServiceAsync.get(STORAGE_KEY, id)
}

function getAllCheckedPlaces(){
    return storageServiceAsync.query(STORAGE_KEY)
    .then(places => places.filter(place => place.checked))
}

function exportToCSV() {
    try {
        const places = JSON.parse(localStorage.getItem('places')) || []
        console.log(places)
        const headers = ["Name", "Longitude", "latitude"]

        const rows = places.map(place => {
            return `${place.name},${place.coordinates.lng},${place.coordinates.lat}`
        }).join('\n')
        
        const csvContent = `${headers.join(',')}\n${rows}`;

        const blob = new Blob([csvContent],{type:'text/csv'})
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a')
        a.href = url
        a.download = "places.csv"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }
    catch (err){
        throw err
    } 
}

//private functions
 
function _createHell(){
    const places = storageServiceAsync.query(STORAGE_KEY)
    .then(places => {
        if (!places || places.length === 0)
        {
            addPlace({name:"Hell", coordinates: {lat: 63.44517149999999, lng: 10.9052167}, checked: true})
        }
    })
    .catch(err => {
        console.log('Error creating Hell', err)
        addPlace({name:"Hell", coordinates: {lat: 63.44517149999999, lng: 10.9052167}, checked: true})
    }) 
}