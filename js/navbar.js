function loadNavbar() {
  fetch('navbar.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('navbar-container').innerHTML = data;
    })
    .catch(error => console.error('Error loading navbar:', error));
}

function openConfig() {
  window.location.href = 'configuration.html'; 
}

// Call the loadNavbar function after the page loads
window.addEventListener('DOMContentLoaded', loadNavbar);
