// =============================================================================
// EU COOKIE CONSENT BANNER
// =============================================================================
document.addEventListener('DOMContentLoaded', function () {
    const banner = document.getElementById('consent-banner');
    const acceptAllBtn = document.getElementById('accept-all');
    const rejectAllBtn = document.getElementById('reject-all');
    const preferenceLink = document.getElementById('consent-preference-link');
    const consentKey = 'user_cookie_consent_canon';

    /**
     * Updates the Google Consent Mode status.
     * @param {string} analytics_storage - 'granted' or 'denied'
     * @param {string} ad_storage - 'granted' or 'denied'
     */
    function updateGAConsent(analytics_storage, ad_storage) {
        gtag('consent', 'update', {
            'analytics_storage': analytics_storage,
            'ad_storage': ad_storage
        });
    }

    // 1. Check if consent has already been given
    const currentConsent = localStorage.getItem(consentKey);

    if (currentConsent) {
        // Hide banner, show preference link
        banner.style.display = 'none';
        preferenceLink.style.display = 'block';

        // Update GA based on stored choice
        if (currentConsent === 'accepted') {
            updateGAConsent('granted', 'granted');
        } else if (currentConsent === 'rejected') {
            updateGAConsent('denied', 'denied');
        }
    } else {
        // Show banner if no choice is stored
        banner.style.display = 'flex';
        preferenceLink.style.display = 'none';
    }


    // 2. Event Listeners for buttons
    acceptAllBtn.addEventListener('click', function () {
        localStorage.setItem(consentKey, 'accepted');
        updateGAConsent('granted', 'granted');
        banner.style.display = 'none';
        preferenceLink.style.display = 'block';
    });

    rejectAllBtn.addEventListener('click', function () {
        localStorage.setItem(consentKey, 'rejected');
        // Note: The default 'denied' state is already set, but we call update for good measure
        updateGAConsent('denied', 'denied');
        banner.style.display = 'none';
        preferenceLink.style.display = 'block';
    });

});