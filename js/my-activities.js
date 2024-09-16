// Adding animation of selected option
document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

    navLinks.forEach(function(link) {
        link.addEventListener("click", function() {
            // Remove 'active' class from all links
            navLinks.forEach(function(link) {
                link.classList.remove("active");
            });

            // Add 'active' class to the clicked link
            this.classList.add("active");
        });
    });
});

// JavaScript
document.addEventListener("DOMContentLoaded", function() {
    const seeMoreBtn = document.getElementById("seeMoreBtn");
    const cardDeck = document.querySelector(".activities-card-decks .row");

    let isExpanded = false;
    let originalDeckHTML = cardDeck.innerHTML;

    seeMoreBtn.addEventListener("click", function() {
        if (isExpanded) {
            // When clicking on "Show less", we restore the initial state of the cards
            cardDeck.innerHTML = originalDeckHTML;
            seeMoreBtn.textContent = "See more";
            isExpanded = false;
        } else {
            // When clicking on "See more", we duplicate the cards
            cardDeck.innerHTML += originalDeckHTML;
            seeMoreBtn.textContent = "Show less";
            isExpanded = true;
        }
    });
});

