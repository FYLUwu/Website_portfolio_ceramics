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
  infoBox: document.getElementById('info-box')
};

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

function hideBanner() {
  elements.loadingBanner.classList.add('fadeOut');
  setTimeout(() => {
    elements.loadingBanner.style.display = 'none';
  }, 500);
}

function smoothScroll(element) {
  element.scrollIntoView({ behavior: 'smooth' });
}

// Event Listeners
function initializeEventListeners() {
  // Gallery image clicks
  elements.galleryImages.forEach((img, i) => {
    img.addEventListener('click', () => {
      showImage(i);
      elements.overlay.classList.remove('hidden');
    });
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
  elements.infoBtn.addEventListener('click', () => smoothScroll(elements.infoBox));

  // Loading banner
  window.addEventListener('load', hideBanner);
}

// Initialize application
initializeEventListeners();