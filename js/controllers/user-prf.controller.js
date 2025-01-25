import { userPrfService } from "../services/user-prf-serivce.js"

window.app = window.app || {}

window.app.userPrfController = {
    onInit,
    onSave,
    onReset,
}

function onInit(){
    console.log("Init user preferences")
    document.addEventListener("DOMContentLoaded", _setupFormValidation)
    _populatePreferences()
    _setStyle()
}

function onSave(){
    const preferences = {
        email : document.querySelector('input[name="email"]').value,
        age : document.querySelector('input[name="age"]').value,
        background_color : document.querySelector('input[name="background-color"]').value,
        text_color : document.querySelector('input[name="text-color"]').value,
        birth_date : document.querySelector('input[name="birth-date"]').value,
        birth_time : document.querySelector('input[name="birth-time"]').value,
        team : document.querySelector('select[name="team-sn"]').value,
    }
    userPrfService.saveToStorage(preferences)
    _setStyle()

}

function onReset(){
    _populatePreferences()
}

function _populatePreferences(){
    const preferences = userPrfService.loadFromStorage()
    
    if (preferences)    {
        document.querySelector('input[name="email"]').value = preferences.email
        document.querySelector('input[name="age"]').value = preferences.age
        document.querySelector('#ageValue').innerText = preferences.age
        
        document.querySelector('input[name="background-color"]').value = preferences.background_color
        document.querySelector('input[name="text-color"]').value = preferences.text_color
        document.querySelector('input[name="birth-date"]').value = preferences.birth_date
        document.querySelector('input[name="birth-time"]').value = preferences.birth_time       
        document.querySelector('select[name="team-sn"]').value =preferences.team
    }  
    else
    {
        document.querySelector('.user-preferences-form').reset()
        document.querySelector('input[name="background-color"]').value = "#90ee90"
        document.querySelector('input[name="text-color"]').value = "#000000"
    }
}

function _setStyle(){
    document.querySelector(".main").style.backgroundColor = document.querySelector('input[name="background-color"]').value
    document.querySelector(".main").style.color =  document.querySelector('input[name="text-color"]').value
}

function _setupFormValidation() {
    
    const form = document.querySelector(".user-preferences-form")
  
    form.addEventListener("submit", (event) => {
        const birth_date = document.querySelector('input[name="birth-date"]').value
        const birth_time = document.querySelector('input[name="birth-time"]').value
        const age = document.querySelector('input[name="age"]')
        let valid = true

        if (birth_date){
            let datetime
            if(birth_time){
                datetime = new Date(`${birth_date}T${birth_time}`)
            }
            else{
                datetime = new Date(`${birth_date}`)
            }

            const now = new Date()
            const diff = Math.floor((now - datetime)/ (1000 * 60 * 60 * 24 * 365.25))
            
            if (diff != age.value){
                age.setCustomValidity("Age does not match birth date and time")
                age.reportValidity()
                valid = false
            }
            age.setCustomValidity("")      
        }
        if(valid){
            onSave()
        }
        event.preventDefault() //keep form from submitting and closing
    })
  }