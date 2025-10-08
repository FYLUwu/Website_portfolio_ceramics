// DOM Elements
const elements = {
    galleryImages: document.querySelectorAll('.gallery-grid img'),
    overlay: document.getElementById('overlay'),
    focusedImage: document.getElementById('focusedImage'),
    galleryBtn: document.querySelector('.button'),
    infoBtn: document.querySelector('.infoButton'),
    gallery: document.getElementById('gallery'),
    infoBox: document.getElementById('info-box'),
    accessOverlay: document.querySelector('.access-overlay'),
    accessCode: document.getElementById('access-code'),
    accessError: document.getElementById('access-error')
};

// Password protection
const CORRECT_CODE = 'Lini2025';

function checkCode() {
    const input = elements.accessCode.value;
    if (input === CORRECT_CODE) {
        elements.accessOverlay.style.opacity = '0';
        setTimeout(() => {
            elements.accessOverlay.classList.add('hidden');
        }, 500);
        sessionStorage.setItem('authenticated', 'true');
    } else {
        elements.accessError.classList.remove('hidden');
        elements.accessCode.value = '';
    }
}

function closeOverlay() {
    elements.overlay.classList.add('hidden');
}

function smoothScroll(element) {
    element.scrollIntoView({ behavior: 'smooth' });
}

// Event Listeners
function initializeEventListeners() {
    // Check if already authenticated
    if (sessionStorage.getItem('authenticated') === 'true') {
        elements.accessOverlay.classList.add('hidden');
    }

    // Access code input events
    elements.accessCode.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            checkCode();
        }
        elements.accessError.classList.add('hidden');
    });

    // Gallery image clicks
    elements.galleryImages.forEach((img) => {
        img.addEventListener('click', () => {
            elements.focusedImage.src = img.src;
            elements.focusedImage.alt = img.alt;
            elements.overlay.classList.remove('hidden');
        });
    });

    // Handle overlay closing
    elements.overlay.addEventListener('click', closeOverlay);
    elements.overlay.addEventListener('touchend', (e) => {
        e.preventDefault();
        closeOverlay();
    });

    // Prevent image drag on mobile
    elements.focusedImage.addEventListener('touchmove', (e) => {
        e.preventDefault();
    });

    // Navigation buttons
    elements.galleryBtn.addEventListener('click', () => smoothScroll(elements.gallery));
    elements.infoBtn?.addEventListener('click', () => smoothScroll(elements.infoBox));
}

// Initialize application
window.addEventListener('DOMContentLoaded', initializeEventListeners);