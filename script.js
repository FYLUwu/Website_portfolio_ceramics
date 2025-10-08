// DOM Elements
const elements = {
    galleryImages: document.querySelectorAll('.gallery-grid img'),
    overlay: document.getElementById('overlay'),
    focusedImage: document.getElementById('focusedImage'),
    closeBtn: document.getElementById('close'),
    prevBtn: document.getElementById('prev'),
    nextBtn: document.getElementById('next'),
    loadingBanner: document.getElementById('loadingBanner'),
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

// State
let currentIndex = 0;

// Image Gallery Functions
function showImage(index) {
    currentIndex = index;
    elements.focusedImage.style.opacity = 0;

    setTimeout(() => {
        elements.focusedImage.src = elements.galleryImages[currentIndex].src;
        elements.focusedImage.alt = elements.galleryImages[currentIndex].alt;
        elements.focusedImage.style.opacity = 1;
    }, 200);
}

function nextImage() {
    const newIndex = (currentIndex === elements.galleryImages.length - 1) ? 0 : currentIndex + 1;
    showImage(newIndex);
}

function previousImage() {
    const newIndex = (currentIndex === 0) ? elements.galleryImages.length - 1 : currentIndex - 1;
    showImage(newIndex);
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

    // Remove any existing loading banner
    const loadingBanner = document.getElementById('loadingBanner');
    if (loadingBanner) {
        loadingBanner.remove();
    }

    // Access code input events
    elements.accessCode.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            checkCode();
        }
        elements.accessError.classList.add('hidden');
    });

    // Gallery image clicks
    elements.galleryImages.forEach((img, i) => {
        img.addEventListener('click', () => {
            elements.focusedImage.src = img.src;
            elements.focusedImage.alt = img.alt;
            elements.overlay.classList.remove('hidden');
        });
    });

    // Close on click anywhere in overlay
    elements.overlay.addEventListener('click', () => {
        elements.overlay.classList.add('hidden');
    });

    // Overlay controls
    elements.closeBtn.addEventListener('click', closeOverlay);
    elements.prevBtn.addEventListener('click', previousImage);
    elements.nextBtn.addEventListener('click', nextImage);
    elements.overlay.addEventListener('click', (e) => {
        if (e.target === elements.overlay) closeOverlay();
    });

    // Navigation buttons
    elements.galleryBtn.addEventListener('click', () => smoothScroll(elements.gallery));
}

// Initialize application
window.addEventListener('DOMContentLoaded', initializeEventListeners);