console.log('program-activity.js loaded'); // Confirm script is loaded

import { database, ref, set } from './database-connection.js';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('set-map-points').addEventListener('click', setMapPoints);
    document.getElementById('set-password').addEventListener('click', setPassword);
    document.getElementById('program-button').addEventListener('click', programActivity);
    document.getElementById('toggle-password').addEventListener('click', togglePasswordVisibility);
});

function goBackToCourse() {
    window.location.href = 'activity-of-the-course.html'; // Redirect back to the initial page
}

function setMapPoints() {
    window.location.href = 'map-of-activity.html'; 
}

function programActivity() {
    const activityName = document.getElementById('activity-name').value;
    const date = document.getElementById('activity-date').value;
    const startTime = document.getElementById('activity-start').value;
    const endTime = document.getElementById('activity-end').value;
    const modality = document.querySelector('input[name="modality"]:checked').value;
    const helpWithLocation = document.getElementById('help-location-toggle').checked;
    const password = document.getElementById('password-input').value;

    if (!activityName || !date || !startTime || !endTime) {
        alert("Please fill in all the required fields.");
        return;
    }

    const activityData = {
        activityName: activityName,
        date: date,
        startTime: startTime,
        endTime: endTime,
        modality: modality,
        helpWithLocation: helpWithLocation,
        password: password
    };

    const activityRef = ref(database, 'activities/' + activityName);

    set(activityRef, activityData)
        .then(() => {
            alert('Activity saved successfully!');
        })
        .catch((error) => {
            console.error('Error saving activity:', error);
            alert('Failed to save activity. Please try again.');
        });
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password-input");
    const toggleButton = document.querySelector(".toggle-password");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleButton.textContent = "Hide";
    } else {
        passwordInput.type = "password";
        toggleButton.textContent = "Show";
    }
}

function setPassword() {
    const password = document.getElementById('password-input').value;
    if (!password) {
        alert('Please enter a password.');
        return;
    }

    const passwordRef = ref(database, 'activityPassword');
    set(passwordRef, password)
        .then(() => {
            alert('Password set and saved successfully!');
        })
        .catch((error) => {
            console.error('Error saving password:', error);
            alert('Failed to save password. Please try again. Error: ' + error.message);
        });
}


export { programActivity, togglePasswordVisibility, setPassword, setMapPoints, goBackToCourse };
