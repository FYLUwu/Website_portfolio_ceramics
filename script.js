const galleryImages = document.querySelectorAll('.gallery-grid img');
const overlay = document.getElementById('overlay');
const focusedImage = document.getElementById('focusedImage');
const closeBtn = document.getElementById('close');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

let currentIndex = 0;

function showImage(index) {
  currentIndex = index;
  focusedImage.style.opacity = 0;
  setTimeout(() => {
    focusedImage.src = galleryImages[currentIndex].src;
    focusedImage.alt = galleryImages[currentIndex].alt;
    focusedImage.style.opacity = 1;
  }, 200);
}

galleryImages.forEach((img, i) => {
  img.addEventListener('click', () => {
    showImage(i);
    overlay.classList.remove('hidden');
  });
});

closeBtn.addEventListener('click', () => {
  overlay.classList.add('hidden');
});

prevBtn.addEventListener('click', () => {
  const newIndex = (currentIndex === 0) ? galleryImages.length - 1 : currentIndex - 1;
  showImage(newIndex);
});

nextBtn.addEventListener('click', () => {
  const newIndex = (currentIndex === galleryImages.length - 1) ? 0 : currentIndex + 1;
  showImage(newIndex);
});

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) {
    overlay.classList.add('hidden');
  }
});

window.addEventListener('load', function() {
  const banner = document.getElementById('loadingBanner');
  banner.classList.add('fadeOut');
  setTimeout(() => { banner.style.display = 'none'; }, 500);
});

document.querySelector('.button').addEventListener('click', () => {
  const gallery = document.getElementById('gallery');
  gallery.scrollIntoView({ behavior: 'smooth' });
});