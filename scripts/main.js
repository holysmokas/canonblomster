// scripts/main.js
document.addEventListener("DOMContentLoaded", function () {
    const imageGrid = document.getElementById('imageGrid');
    if (imageGrid) {
        for (let i = 1; i <= 37; i++) {
            const card = document.createElement('div');
            card.className = 'image-card';
            card.innerHTML = `
          <img src="images/image_${i}.jpeg" alt="Blomst ${i}">
          <div class="image-desc">Beskrivelse for billede ${i}</div>
        `;
            imageGrid.appendChild(card);
        }
    }

    // Form submission handler
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Show side popups if on index page
    if (document.querySelector('.side-popups')) {
        showSidePopups();
    }
});

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;

    // Get form data
    const formData = {
        navn: form.querySelector('#name').value,
        email: form.querySelector('#email').value,
        besked: form.querySelector('#message').value
    };

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sender...';

    try {
        // Replace this URL with your actual Google Apps Script Web App URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbw-fQE46SHZP7MQWi5JqM9WKxdU-fgqHciGc05NG9weIC1zsx6Q1VxQeGbbrotuA0w/exec';

        const response = await fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors', // Important for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        // With no-cors mode, we can't read the response, so we assume success
        // Show success message
        submitBtn.textContent = 'Sendt! ✓';
        submitBtn.style.background = '#28a745';

        // Reset form
        form.reset();

        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
            submitBtn.style.background = '';
        }, 3000);

    } catch (error) {
        console.error('Error:', error);
        submitBtn.textContent = 'Fejl - prøv igen';
        submitBtn.style.background = '#dc3545';

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
            submitBtn.style.background = '';
        }, 3000);
    }
}

// Slideshow functionality
let slideIndex = 0;
autoShowSlides();

function autoShowSlides() {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    if (slides.length === 0) return;

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    slides[slideIndex - 1].style.display = "block";
    setTimeout(autoShowSlides, 3000);
}

// Show popups in sequence
function showSidePopups() {
    // Left side
    setTimeout(() => {
        const popup = document.querySelector('.popup-left-top');
        if (popup) {
            popup.classList.add('show');
            setTimeout(() => popup.classList.remove('show'), 800);
        }
    }, 400);

    setTimeout(() => {
        const popup = document.querySelector('.popup-left-middle');
        if (popup) {
            popup.classList.add('show');
            setTimeout(() => popup.classList.remove('show'), 1200);
        }
    }, 800);

    setTimeout(() => {
        const popup = document.querySelector('.popup-left-bottom');
        if (popup) {
            popup.classList.add('show');
            setTimeout(() => popup.classList.remove('show'), 1400);
        }
    }, 1200);

    // Right side
    setTimeout(() => {
        const popup = document.querySelector('.popup-right-top');
        if (popup) {
            popup.classList.add('show');
            setTimeout(() => popup.classList.remove('show'), 2000);
        }
    }, 1600);

    setTimeout(() => {
        const popup = document.querySelector('.popup-right-middle');
        if (popup) {
            popup.classList.add('show');
            setTimeout(() => popup.classList.remove('show'), 2400);
        }
    }, 2000);

    setTimeout(() => {
        const popup = document.querySelector('.popup-right-bottom');
        if (popup) {
            popup.classList.add('show');
            setTimeout(() => popup.classList.remove('show'), 2800);
        }
    }, 2400);
}