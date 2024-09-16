function highlightNavItem(element) {
    // Remove 'active' class from all navbar items except the clicked one
    var navItems = document.querySelectorAll('.navbar-brand');
    navItems.forEach(function(item) {
        if (item !== element) {
            item.classList.remove('active');
            var navbar = item.closest('.navbar');
            navbar.classList.remove('active');
        }
    });
    
    // Add 'active' class to the clicked navbar item
    element.classList.add('active');
    
    // Add 'active' class to the parent navbar
    var navbar = element.closest('.navbar');
    navbar.classList.add('active');
}
