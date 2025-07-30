
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
        const popup = document.querySelector('.popup-left-top');
        popup.classList.add('show');
        setTimeout(() => popup.classList.remove('show'), 800);
    }, 400);

    setTimeout(() => {
        const popup = document.querySelector('.popup-left-middle');
        popup.classList.add('show');
        setTimeout(() => popup.classList.remove('show'), 1200);
    }, 800);

    setTimeout(() => {
        const popup = document.querySelector('.popup-left-bottom');
        popup.classList.add('show');
        setTimeout(() => popup.classList.remove('show'), 1400);
    }, 1200);


    // Right side
    setTimeout(() => {
        const popup = document.querySelector('.popup-right-top');
        popup.classList.add('show');
        setTimeout(() => popup.classList.remove('show'), 2000);
    }, 1600);

    setTimeout(() => {
        const popup = document.querySelector('.popup-right-middle');
        popup.classList.add('show');
        setTimeout(() => popup.classList.remove('show'), 2400);
    }, 2000);

    setTimeout(() => {
        const popup = document.querySelector('.popup-right-bottom');
        popup.classList.add('show');
        setTimeout(() => popup.classList.remove('show'), 2800);
    }, 2400);
}


document.addEventListener("DOMContentLoaded", showSidePopups);
