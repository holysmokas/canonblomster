// scripts/main.js
document.addEventListener("DOMContentLoaded", function () {
    // Initialize image grid for botanisk page
    const imageGrid = document.getElementById('imageGrid');
    if (imageGrid) {
        // Load products from localStorage (set by admin dashboard)
        const products = JSON.parse(localStorage.getItem('canonProducts')) || [];

        if (products.length > 0) {
            // Display products from admin dashboard
            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'image-card';
                card.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpeg'">
                    <div class="image-desc">${product.description}</div>
                `;
                imageGrid.appendChild(card);
            });
        } else {
            // Fallback to default images if no products in admin
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
    }

    // Initialize contact form handler
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Initialize quote form handler (from kurater.html)
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        initializeQuoteForm();
    }

    // Show side popups if on index page
    if (document.querySelector('.side-popups')) {
        showSidePopups();
    }

    // Initialize slideshow
    autoShowSlides();
});

// Handle contact form submission
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

// Initialize quote form from kurater.html
function initializeQuoteForm() {
    const form = document.getElementById('quoteForm');
    const fileInput = document.getElementById('fileInput');
    const fileUpload = document.querySelector('.file-upload');

    if (!form || !fileInput || !fileUpload) return;

    // Handle file input changes
    fileInput.addEventListener('change', function () {
        const fileCount = this.files.length;
        if (fileCount > 0) {
            fileUpload.querySelector('.file-upload-label').innerHTML =
                `✓ ${fileCount} fil${fileCount > 1 ? 'er' : ''} valgt<br><small>Klik for at ændre filer</small>`;
            fileUpload.style.borderColor = '#e85d75';
            fileUpload.style.background = '#ffeef8';
        }
    });

    // Handle drag over
    fileUpload.addEventListener('dragover', function (e) {
        e.preventDefault();
        this.style.borderColor = '#e85d75';
        this.style.background = '#ffeef8';
    });

    // Handle drag leave
    fileUpload.addEventListener('dragleave', function () {
        this.style.borderColor = '#e8e8e8';
        this.style.background = 'transparent';
    });

    // Handle file drop
    fileUpload.addEventListener('drop', function (e) {
        e.preventDefault();
        fileInput.files = e.dataTransfer.files;
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
    });

    // Handle form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        alert('Tak for din forespørgsel! Vi gennemgår dine oplysninger og vender tilbage inden for 24 timer med et skræddersyet tilbud. Tjek din e-mail for bekræftelse.');

        form.reset();
        fileUpload.querySelector('.file-upload-label').innerHTML =
            '📷 Klik for at uploade billeder eller træk dem herind<br><small>Upload gerne inspirationsbilleder eller referencer</small>';
        fileUpload.style.borderColor = '#e8e8e8';
        fileUpload.style.background = 'transparent';
    });
}

// Slideshow functionality
let slideIndex = 0;

function autoShowSlides() {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    if (slides.length === 0) return;

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    slides[slideIndex - 1].style.display = "block";
    setTimeout(autoShowSlides, 3000);
}

// Show popups in sequence
function showSidePopups() {
    // Left side popups
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

    // Right side popups
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