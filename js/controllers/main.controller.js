window.app = window.app || {}

window.app.MainController = {
	onInit,
    onTabChange,
	}	

function onInit() {
	console.log("Init main")
    onTabChange("home")
}

function onTabChange(tab) {
    const elSections = document.querySelectorAll('.tab')
    elSections.forEach(elSection => {
        elSection.classList.remove('active-tab')
    })

    const elSection = document.querySelector(`[data-tab="${tab}"]`);
    elSection.classList.add('active-tab')
}