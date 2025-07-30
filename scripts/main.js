/* main.js */


// scripts/main.js
document.addEventListener("DOMContentLoaded", function () {
    const imageGrid = document.getElementById('imageGrid');
    for (let i = 1; i <= 37; i++) {
        const card = document.createElement('div');
        card.className = 'image-card';
        card.innerHTML = `
      <img src="images/image_${i}.jpeg" alt="Blomst ${i}">
      <div class="image-desc">Beskrivelse for billede ${i}</div>
    `;
        imageGrid.appendChild(card);
    }
});

let slideIndex = 0;
autoShowSlides();

function autoShowSlides() {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    slides[slideIndex - 1].style.display = "block";
    setTimeout(autoShowSlides, 3000); // Change image every 3 seconds
}

// Show popups in sequence
function showSidePopups() {
    // Left side
    setTimeout(() => {
        document.querySelector('.popup-left-top').classList.add('show');
    }, 400);
    setTimeout(() => {
        document.querySelector('.popup-left-middle').classList.add('show');
    }, 1400);
    setTimeout(() => {
        document.querySelector('.popup-left-bottom').classList.add('show');
    }, 2400);

    // Right side
    setTimeout(() => {
        document.querySelector('.popup-right-top').classList.add('show');
    }, 400);
    setTimeout(() => {
        document.querySelector('.popup-right-middle').classList.add('show');
    }, 1400);
    setTimeout(() => {
        document.querySelector('.popup-right-bottom').classList.add('show');
    }, 2400);
}

document.addEventListener("DOMContentLoaded", showSidePopups);
