// profile.js
import { apiRequest } from './module/api.js';
import { toggleDarkMode, setInitialDarkMode } from './module/darkMode.js';
import { updatePageLanguage } from './module/language.js';

const API_URL = '../../resources/php/profile_api.php';
const $ = id => document.getElementById(id);

export async function getProfileData() {
    try {
        return await apiRequest(API_URL,'get');
    } catch (error) {
        console.error('Error fetching profile data:', error);
        throw error;
    }
}

export async function updateProfile(profileData) {
    try {
        return await apiRequest(API_URL, 'edit', profileData);
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
}

export async function updatePassword(passwordData) {
    try {
        return await apiRequest(API_URL,'update_password', passwordData);
    } catch (error) {
        console.error('Error updating password:', error);
        throw error;
    }
}

export function populateProfileFields(data) {
    const fields = ['FullName', 'email', 'firstName', 'lastName', 'mobileNumber', 'faxNumber', 'country'];
    fields.forEach(field => {
        const element = $(field);
        if (element) element.textContent = data[field];
    });

    const addressLine1Element = $('addressLine1');
    const addressLine2Element = $('addressLine2');

    if (addressLine1Element && addressLine2Element) {
        const addressParts = [
            data.addressLine1,
            data.addressLine2,
            data.district,
            data.city,
            data.stateProvince,
            data.country
        ].filter(Boolean);

        const midpoint = Math.ceil(addressParts.length / 2);
        addressLine1Element.textContent = addressParts.slice(0, midpoint).join(', ');
        addressLine2Element.textContent = addressParts.slice(midpoint).join(', ');
    }
}

export function initializeProfile() {
    const token = localStorage.getItem('userToken');
    // initialize the page
    populateProfileFields(getProfileData());
    console.log(getProfileData());
}
