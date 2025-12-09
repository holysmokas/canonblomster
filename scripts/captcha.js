// CAPTCHA Questions Pool
const captchaQuestions = [
    {
        question: "Hvilken farve har en rose normalt?",
        options: [
            { text: "Rød", correct: true },
            { text: "Blå", correct: false },
            { text: "Grøn", correct: false },
            { text: "Gul", correct: false }
        ]
    },
    {
        question: "Hvad sælger en blomsterbutik?",
        options: [
            { text: "Blomster", correct: true },
            { text: "Biler", correct: false },
            { text: "Computere", correct: false },
            { text: "Møbler", correct: false }
        ]
    },
    {
        question: "Hvilket af disse er en blomst?",
        options: [
            { text: "Tulipan", correct: true },
            { text: "Hund", correct: false },
            { text: "Bil", correct: false },
            { text: "Computer", correct: false }
        ]
    },
    {
        question: "Hvornår giver man typisk blomster?",
        options: [
            { text: "Fødselsdag", correct: true },
            { text: "Når det regner", correct: false },
            { text: "Tirsdag kl. 3", correct: false },
            { text: "Aldrig", correct: false }
        ]
    },
    {
        question: "Hvad har blomster brug for?",
        options: [
            { text: "Vand", correct: true },
            { text: "Benzin", correct: false },
            { text: "WiFi", correct: false },
            { text: "Batterier", correct: false }
        ]
    }
];

// Check if user has already passed CAPTCHA
const captchaPassed = sessionStorage.getItem('captchaPassed');
if (captchaPassed === 'true') {
    document.getElementById('captcha-overlay').classList.add('hidden');
}

// Select random question
const randomQuestion = captchaQuestions[Math.floor(Math.random() * captchaQuestions.length)];

// Display question
document.getElementById('captcha-question').textContent = randomQuestion.question;

// Display options
const optionsContainer = document.getElementById('captcha-options');
optionsContainer.innerHTML = '';

// Shuffle options
const shuffledOptions = randomQuestion.options.sort(() => Math.random() - 0.5);

shuffledOptions.forEach(option => {
    const optionEl = document.createElement('div');
    optionEl.className = 'captcha-option';
    optionEl.textContent = option.text;
    optionEl.dataset.answer = option.correct ? 'correct' : 'wrong';
    optionsContainer.appendChild(optionEl);
});

// Handle option selection
let selectedAnswer = null;
const options = document.querySelectorAll('.captcha-option');
const submitBtn = document.getElementById('captcha-submit');
const errorMsg = document.getElementById('captcha-error');

options.forEach(option => {
    option.addEventListener('click', function () {
        // Remove previous selection
        options.forEach(opt => opt.classList.remove('selected'));

        // Add selection to clicked option
        this.classList.add('selected');
        selectedAnswer = this.dataset.answer;

        // Enable submit button
        submitBtn.disabled = false;

        // Hide error message
        errorMsg.classList.remove('show');
    });
});

// Handle submission
submitBtn.addEventListener('click', function () {
    if (selectedAnswer === 'correct') {
        // Save to session storage
        sessionStorage.setItem('captchaPassed', 'true');

        // Hide overlay with fade effect
        const overlay = document.getElementById('captcha-overlay');
        overlay.style.transition = 'opacity 0.5s ease';
        overlay.style.opacity = '0';

        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 500);
    } else {
        // Show error
        errorMsg.classList.add('show');

        // Reset selection
        options.forEach(opt => opt.classList.remove('selected'));
        selectedAnswer = null;
        submitBtn.disabled = true;

        // Remove error after 3 seconds
        setTimeout(() => {
            errorMsg.classList.remove('show');
        }, 3000);
    }
});