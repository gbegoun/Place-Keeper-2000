(function initializeApp() {
    console.log("Application initializing...");

    if (window.app?.MainController?.onInit) {
        window.app.MainController.onInit(); // Initialize MainController
    } else {
        console.error("MainController.onInit is not defined");
    }

    if (window.app?.PlaceController?.onInit) {
        window.app.PlaceController.onInit(); // Initialize PlaceController
    } else {
        console.error("PlaceController.onInit is not defined");
    }

    if (window.app?.userPrfController?.onInit) {
        window.app.userPrfController.onInit(); // Initialize PlaceController
    } else {
        console.error("userPrfController.onInit is not defined");
    }

    console.log("Application initialized");
})();