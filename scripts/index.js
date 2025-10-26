
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
