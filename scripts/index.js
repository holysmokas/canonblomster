// =============================================================================
// CONTACT PROTECTION - Obfuscate email and phone from bots
// =============================================================================
function revealPhone() {
    // Decoded: +45 32 55 78 90
    const parts = ['45', '32', '55', '78', '90'];
    const phone = '+' + parts.join(' ');

    const el = document.querySelector('.phone-protected');
    if (el) {
        el.innerHTML = `<a href="tel:+45${parts.slice(1).join('')}">${phone}</a>`;
        el.style.background = '#e8f5e9';
    }
}

function revealEmail() {
    // Obfuscated email to prevent bot scraping
    const user = 'canonblomster';
    const domain = 'gmail';
    const tld = 'com';
    const email = user + '@' + domain + '.' + tld;

    const el = document.querySelector('.email-protected');
    if (el) {
        el.innerHTML = `<a href="mailto:${email}">${email}</a>`;
        el.style.background = '#e8f5e9';
    }
}

// Auto-reveal after user interaction (more user-friendly)
let hasInteracted = false;
document.addEventListener('click', function () {
    if (!hasInteracted) {
        hasInteracted = true;
        setTimeout(() => {
            revealPhone();
            revealEmail();
        }, 1000);
    }
}, { once: true });

// =============================================================================
// SLIDESHOW
// =============================================================================
let slideIndex = 0;
showSlides();

function showSlides() {
    let slides = document.getElementsByClassName("mySlides");

    // Hide all slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    // Move to next slide
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }

    // Show current slide
    if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].style.display = "flex";
    }

    // Change slide every 3 seconds
    setTimeout(showSlides, 3000);
}

// =============================================================================
// SIDE POPUPS
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
    const leftPopups = document.querySelectorAll('.popup-left');
    const rightPopups = document.querySelectorAll('.popup-right');
    const displayTime = 3000; // visible for 3 seconds

    // Function to show and hide with slide effect
    function showPopup(popup, direction) {
        popup.classList.add(`show-${direction}`);
        setTimeout(() => {
            popup.classList.remove(`show-${direction}`);
            popup.classList.add('hide');
            setTimeout(() => popup.classList.remove('hide'), 800);
        }, displayTime);
    }

    // Sequentially show left-side popups
    leftPopups.forEach((popup, index) => {
        setTimeout(() => {
            showPopup(popup, 'left');
        }, index * 1500);
    });

    // Sequentially show right-side popups
    rightPopups.forEach((popup, index) => {
        setTimeout(() => {
            showPopup(popup, 'right');
        }, 800 + index * 1500);
    });

    // Repeat every 10 seconds
    setInterval(() => {
        leftPopups.forEach((popup, index) => {
            setTimeout(() => {
                showPopup(popup, 'left');
            }, index * 1500);
        });
        rightPopups.forEach((popup, index) => {
            setTimeout(() => {
                showPopup(popup, 'right');
            }, 800 + index * 1500);
        });
    }, 10000);
});