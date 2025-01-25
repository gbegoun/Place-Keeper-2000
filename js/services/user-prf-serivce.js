export const userPrfService = {
    loadFromStorage,
    saveToStorage,
}

const STORAGE_KEY = 'user-prf'

function loadFromStorage()
{
    const preferences = JSON.parse(localStorage.getItem(STORAGE_KEY))   
    return preferences
}

function saveToStorage(preferences)
{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
}