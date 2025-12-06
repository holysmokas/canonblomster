// Kurater Form Submission Handler

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyu0aiZ5wTa9L1NCeXyy9ZDyPMLNFJmDuir_8gnOEB-XPNKBFrevhSLD5LOmr6mEyF9/exec";

// Create custom popup
function showPopup(message, type = 'info') {
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${type === 'success' ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' :
            type === 'error' ? 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)' :
                'linear-gradient(135deg, #e85d75 0%, #f39c9d 100%)'};
        color: white;
        padding: 40px 60px;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 600;
        font-size: 1.2em;
        max-width: 500px;
        text-align: center;
        animation: popIn 0.3s ease;
    `;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        z-index: 9999;
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.animation = 'popOut 0.3s ease';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            popup.remove();
            overlay.remove();
        }, 300);
    }, 3000);
}

document.getElementById('kuraterForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Sender...';

    try {
        const formData = new FormData(this);

        const flowers = [];
        document.querySelectorAll('input[name="flowers"]:checked').forEach(checkbox => {
            flowers.push(checkbox.value);
        });

        const colors = [];
        document.querySelectorAll('input[name="colors"]:checked').forEach(checkbox => {
            colors.push(checkbox.value);
        });

        const style = document.querySelector('input[name="style"]:checked')?.value || '';

        const data = {
            formType: 'contact',
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            contactMethod: formData.get('contactMethod'),
            eventType: formData.get('eventType'),
            eventDate: formData.get('eventDate'),
            eventTime: formData.get('eventTime'),
            eventLocation: formData.get('eventLocation'),
            guestCount: formData.get('guestCount'),
            flowers: flowers,
            colors: colors,
            style: style,
            budget: formData.get('budget'),
            specialRequests: formData.get('specialRequests')
        };

        console.log('Submitting form data:', data);

        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        submitBtn.innerHTML = '✅ Sendt!';
        submitBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';

        showPopup('🌸 Tak for din forespørgsel!<br><br>Vi har modtaget din besked og vil kontakte dig snarest.<br><br>Canon Blomster', 'success');

        this.reset();

        const fileLabel = document.querySelector('.file-upload-label');
        if (fileLabel) {
            fileLabel.innerHTML = '📷 Klik for at uploade billeder<br><span class="help-text">Du kan uploade flere billeder</span>';
        }

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
        }, 3000);

    } catch (error) {
        console.error('Error submitting form:', error);

        submitBtn.innerHTML = '❌ Fejl';
        submitBtn.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';

        showPopup('Der opstod en fejl. Prøv venligst igen eller kontakt os direkte på canonblomster@gmail.com', 'error');

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
        }, 3000);
    }
});

document.getElementById('fileUpload').addEventListener('change', function (e) {
    const files = e.target.files;
    const label = document.querySelector('.file-upload-label');
    if (files.length > 0) {
        label.innerHTML = `📷 ${files.length} billede(r) valgt<br><span class="help-text">Klik for at ændre</span>`;
    } else {
        label.innerHTML = '📷 Klik for at uploade billeder<br><span class="help-text">Du kan uploade flere billeder</span>';
    }
});

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes popIn {
        from { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
        to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    @keyframes popOut {
        from { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        to { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
    }
`;
document.head.appendChild(style);
