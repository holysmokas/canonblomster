// Kurater Form Submission Handler

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyu0aiZ5wTa9L1NCeXyy9ZDyPMLNFJmDuir_8gnOEB-XPNKBFrevhSLD5LOmr6mEyF9/exec";

document.getElementById('kuraterForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;

    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Sender...';

    try {
        // Collect form data
        const formData = new FormData(this);

        // Get all checked flowers
        const flowers = [];
        document.querySelectorAll('input[name="flowers"]:checked').forEach(checkbox => {
            flowers.push(checkbox.value);
        });

        // Get all checked colors
        const colors = [];
        document.querySelectorAll('input[name="colors"]:checked').forEach(checkbox => {
            colors.push(checkbox.value);
        });

        // Get selected style
        const style = document.querySelector('input[name="style"]:checked')?.value || '';

        // Prepare data object
        const data = {
            formType: 'contact', // Important: identifies this as contact form
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

        // Submit to Google Apps Script
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        // Show success message
        submitBtn.innerHTML = '✅ Sendt!';
        submitBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';

        // Show alert
        alert('🌸 Tak for din forespørgsel!\n\nVi har modtaget din besked og vil kontakte dig snarest.\n\nCanon Blomster');

        // Reset form
        this.reset();

        // Reset file upload label
        const fileLabel = document.querySelector('.file-upload-label');
        if (fileLabel) {
            fileLabel.innerHTML = '📷 Klik for at uploade billeder<br><span class="help-text">Du kan uploade flere billeder</span>';
        }

        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
        }, 3000);

    } catch (error) {
        console.error('Error submitting form:', error);

        // Show error message
        submitBtn.innerHTML = '❌ Fejl';
        submitBtn.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';

        alert('Der opstod en fejl. Prøv venligst igen eller kontakt os direkte på canonblomster@gmail.com');

        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
        }, 3000);
    }
});

// File upload preview
document.getElementById('fileUpload').addEventListener('change', function (e) {
    const files = e.target.files;
    const label = document.querySelector('.file-upload-label');
    if (files.length > 0) {
        label.innerHTML = `📷 ${files.length} billede(r) valgt<br><span class="help-text">Klik for at ændre</span>`;
    } else {
        label.innerHTML = '📷 Klik for at uploade billeder<br><span class="help-text">Du kan uploade flere billeder</span>';
    }
});