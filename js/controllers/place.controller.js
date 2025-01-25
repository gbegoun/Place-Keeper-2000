import { mapService } from '../services/map.service.js'
import { storageServiceAsync } from '../services/async-storage.service.js'
import { placeService } from '../services/place.service.js'

window.app = window.app || {}

window.app.PlaceController = {
	onInit,
	initMap,
	onAddPlace,
	onSavePlace,
	onCheckboxChange,
	onRemovePlace,
	onClickedGo,
	onExportToCSV,
	onAddRandom,
	}	
	
let map
let AdvancedMarkerElement
let markers = []

function onInit() {
	console.log("Init place")
	initMap()
}

async function initMap() {
	console.log("init map")
	// Request needed libraries.
	//@ts-ignore

	const { Map , RenderingType} = await google.maps.importLibrary("maps")
	const markerLibrary  = await google.maps.importLibrary("marker")
	AdvancedMarkerElement = markerLibrary.AdvancedMarkerElement

	let position
  	mapService.getCityCoordinates('Hell, Norway')
  		.then(coordinates => {
  			position = coordinates
  		})
  		.catch(error=> {
			position = { lat: 0, lng: 0 }
  			console.error("Error", error)
  		})
		.finally(() => {
			map = new google.maps.Map(document.querySelector('.map-content'), {
			zoom: 12,
			center: position,
			mapId: "my_map",
			RenderingType : RenderingType.RASTER,
			})
			populatePlaceList()

			map.addListener('click',async ev => {
				const lat = ev.latLng.lat()
				const lng = ev.latLng.lng()
				onAddPlace({lat:lat, lng:lng})
				await placeService.addPlace(name, lat, lng, gMap.getZoom())
				renderPlaces()
				})
		})
		
}

async function populatePlaceList(){
	const places = storageServiceAsync.query('places')
	.then(places => {
		var strHtml = places.map(place => `
			<div class="place"><input type="checkbox" id='${place.id}' ${place.checked ? 'checked' : '' } onChange="app.onCheckboxChange(event)">${place.name} 
				<button id='${place.id}' onclick="app.PlaceController.onRemovePlace(event)">X</button>
				<button id='${place.id}' onclick="app.PlaceController.onClickedGo(event)">Go</button>
			</div>`)
		document.querySelector('.list-view').innerHTML = strHtml.join('')
		renderMarkers()
	})
	.catch(error => {
		console.error("Error", error)
	})
}

function renderMarkers(){

	placeService.getAllCheckedPlaces()
		.then(checkedPlaces => {
			_removeAllMarkers()
			
			checkedPlaces.forEach(place => {
				const marker = new AdvancedMarkerElement({
					position: place.coordinates,			
					map: map,
					title: place.name,})
				markers.push(marker)
				})
		})
		.catch(error => {
			console.error("Error", error)
		})
}

function onAddPlace(coordinates = null){
	const elModal = document.querySelector('.place-edit-modal')	
	resetForm()
	if (coordinates){
		const elForm = document.querySelector('.add-place-form')
		elForm.querySelector('.place-lat').value = coordinates.lat
		elForm.querySelector('.place-lng').value = coordinates.lng
	}
	
	
	elModal.showModal()
}

function resetForm(){
	const elForm = document.querySelector('.add-place-form')
	elForm.querySelector(".lat-error").classList.remove('show')
	elForm.reset()
}

function onSavePlace(){
	let isValid = true
	const elModal = document.querySelector('.place-edit-modal')
	const elForm = document.querySelector('.add-place-form')

	const entries = Object.fromEntries(new FormData(elForm).entries());

	isValid *= _validateField(entries.lat, -90, 90, '.place-lat', '.lat-error')
	isValid *= _validateField(entries.lng, -180, 180, '.place-lng', '.lng-error')

	if (!isValid) return

	const name = entries.name
	const coordinates = { lat: parseFloat(entries.lat).valueOf(),
						  lng: parseFloat(entries.lng).valueOf()}
				
	const place = placeService.addPlace({name:name, coordinates:coordinates, checked: true}).then(() => {						  
		elModal.close()
		populatePlaceList()
	})
	map.setCenter(coordinates)
}

function onClickedGo(event){
	const place = placeService.getPlaceById(event.target.id).then(place => {
	map.setCenter(place.coordinates)
	})
}

function onCheckboxChange(event){
	placeService.getPlaceById(event.target.id).then(place => {
	place.checked = event.target.checked
	placeService.updatePlace(place).then(() => renderMarkers())
	})
}
	
function onRemovePlace(event){
	placeService.removePlace(event.target.id).then(() => {
	populatePlaceList()
	})
}

function onExportToCSV()
{
	placeService.exportToCSV()
}

async function onAddRandom(){
	const randomPlace = await mapService.getRandomLocation()
	try {
		placeService.addPlace({name : randomPlace.name,
							 coordinates :randomPlace.coordinates,
							 checked: true}).then(() => populatePlaceList())
		map.setCenter(randomPlace.coordinates)
	}
	catch(err) {
		console.error("Error", err)
	}
}

function _removeAllMarkers() {
	markers.forEach(marker => marker.setMap(null))
	markers = []
}

function _validateField(value, min, max, inputSelector, errorSelector) {
	const elForm = document.querySelector('.add-place-form')

    const inputElement = elForm.querySelector(inputSelector);
    const errorElement = elForm.querySelector(errorSelector);

    if (value < min || value > max) {
        inputElement.classList.add('invalid')
        errorElement.classList.add('show')
		return false
	}
	inputElement.classList.remove('invalid')
	errorElement.classList.remove('show')
	return true
}
