// This function sets the hover color for the cards
function getHoverColor(cardType) {
    switch (cardType) {
        case 'analytical':
            return 'rgba(255, 0, 0, 0.2)'; // Red
        case 'creative':
            return 'rgba(128, 0, 128, 0.2)'; // Purple
        case 'body':
            return 'rgba(0, 128, 0, 0.2)'; // Green
        default:
            return 'transparent';
    }
}

// This function toggles the menu visibility
function toggleMenu() {
    var menu = document.getElementById("menu");
    menu.classList.toggle("show-menu");
}

// Function to animate boxes
function animateBoxes() {
    const boxes = document.querySelectorAll('.box');
    
    console.log(`Found ${boxes.length} boxes to animate.`); // Debugging line

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            console.log(`Box intersection: ${entry.isIntersecting}`); // Debugging line
            if (entry.isIntersecting) {
                let finalLeft = 250 + (entry.target.dataset.index * 275) + 'px';
                entry.target.style.left = finalLeft;
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.38, 
        rootMargin: '0px 0px 0px 100000px' // Adjust rootMargin as needed
 });

    boxes.forEach((box, index) => {
        box.dataset.index = index;
        observer.observe(box);
        console.log(`Observing box ${index}`); // Debugging line
    });
}

function fadeInElementsOnScroll() {
    const selectors = '.about-this-page, .fade-in-section, .top-statement, .middle-statement, .bottom-statement';
    const elements = document.querySelectorAll(selectors);

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const viewportHeight = window.innerHeight;
        const threshold = 500; // You might adjust this based on your needs or make it dynamic based on element classes if they require different thresholds

        if (elementTop < viewportHeight - threshold && !element.classList.contains('visible')) {
            element.classList.add('visible');
        }
    });
}


// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");

    // Hamburger menu event listener
    document.querySelector('.menu-icon').addEventListener('mouseover', function() {
        document.querySelector('.dropdown-menu').classList.toggle('show-menu');
    });

    // Card hover effect event listeners
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseover', () => {
            const content = card.querySelector('.card-content');
            content.classList.add('visible');
        });
        card.addEventListener('mouseenter', function() {
            this.style.backgroundColor = getHoverColor(this.classList[1]);
        });
        card.addEventListener('mouseleave', function() {
            this.style.backgroundColor = "transparent";
        });
    });

    // Scroll event listeners
    window.addEventListener('scroll', function() {
        console.log("Scroll event fired");
        animateBoxes(); // Call animate boxes on scroll
        fadeInElementsOnScroll();
    });

    // Photo movement logic
    const photos = document.querySelectorAll('.photo');

    window.addEventListener('scroll', function() {
        const scrollDistance = window.scrollY;

        photos.forEach((photo, index) => {
            // Decide the direction based on index: 0 for left, 1 for up, 2 for right
            let direction = index % 3;
            let movement = 0;

            if (scrollDistance < 1000) { // Adjust as needed
                movement = scrollDistance / 5; // Adjust for speed/distance
            } else {
                movement = 200; // Max movement
            }

            switch (direction) {
                case 0: // Left
                    photo.style.transform = `translateX(${-movement}px)`;
                    break;
                case 1: // Up
                    photo.style.transform = `translateY(${-movement}px)`;
                    break;
                case 2: // Right
                    photo.style.transform = `translateX(${movement}px)`;
                    break;
            }
        });

        

        // Reset photos to original position when scrolled back to the top
        if (scrollDistance === 0) {
            photos.forEach(photo => {
                photo.style.transform = 'translate(0, 0)';
            });
        }
    });

    // Initial call to animate boxes in case they should be visible on load
    animateBoxes();
});
