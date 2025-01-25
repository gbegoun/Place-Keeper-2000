export const mapService = {
	getCityCoordinates,
	getRandomLocation,
}

async function getCityCoordinates(cityName) {
	return new Promise((resolve, reject) => {
	  const geocoder = new google.maps.Geocoder()
	  geocoder.geocode({ address: cityName }, (results, status) => {
		if (status === "OK" && results[0] && results[0].geometry && results[0].geometry.location) {
		  resolve({ lat: results[0].geometry.location.lat(), 
					lng: results[0].geometry.location.lng()})
		} else {
		  reject(new Error(`Geocode failed for ${cityName}: ${status}`))	  
		}
	  })
	})
  }

async function getRandomLocation() {
	let cityName 
	let cityCoordinates
	try {		
		cityName = await _getRandomCityName()
		try		{
			cityCoordinates = await getCityCoordinates(cityName)
		}
		catch(err) {
			const lat =  Math.random() * 180-90
			const lng = Math.random() * 360-180
			cityCoordinates =  {lat: lat, lng: lng}
		}
	}
	catch(err){
		cityName = "NoName"
		const lat =  Math.random() * 180-90
		const lng = Math.random() * 360-180
		cityCoordinates =  {lat: lat, lng: lng}
		
	}
	
	return { name :cityName, coordinates: cityCoordinates, checked: true }
  }

  export async function _getRandomCityName() {
	try {
	  const response = await fetch('https://randomuser.me/api/?results=1'); 
	  const data = await response.json();
	  return data.results[0].location.city;
	} catch (error) {
	  console.error("Error fetching random name:", error);
	  return "NoName"; 
	}
  }
