/**
 * Lini Ceramics - Main Application Script
 * ========================================
 * Handles gallery lightbox, menu interactions, and access control
 */

/* ============================================
   DOM ELEMENT REFERENCES
   ============================================ */
const DOM = {
    // Gallery elements
    galleryImages: document.querySelectorAll('.gallery-grid img'),
    imageOverlay: document.getElementById('image-overlay'),
    overlayImage: document.getElementById('overlay-image'),

    // Menu elements
    menuToggle: document.getElementById('menu-toggle'),
    menuOverlay: document.getElementById('menu-overlay'),
    menuClose: document.getElementById('menu-close'),

    // Navigation button
    galleryButton: document.getElementById('gallery-btn'),
    gallerySection: document.getElementById('gallery'),

    // Access control elements
    accessOverlay: document.getElementById('access-overlay'),
    accessCode: document.getElementById('access-code'),
    accessSubmit: document.getElementById('access-submit'),
    accessError: document.getElementById('access-error'),
};

/* ============================================
   CONFIGURATION
   ============================================ */
const CONFIG = {
    CORRECT_ACCESS_CODE: 'Lini2025',
    SESSION_KEY: 'authenticated',
};

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

/**
 * Smooth scroll to element
 */
function smoothScroll(element) {
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Check if element exists and is valid
 */
function elementExists(element) {
    return element !== null && element !== undefined;
}

/* ============================================
   GALLERY LIGHTBOX
   ============================================ */

function openImageLightbox(imageSrc, imageAlt) {
    if (!elementExists(DOM.imageOverlay)) return;

    DOM.overlayImage.src = imageSrc;
    DOM.overlayImage.alt = imageAlt;
    DOM.imageOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeImageLightbox() {
    if (!elementExists(DOM.imageOverlay)) return;

    DOM.imageOverlay.classList.add('hidden');
    document.body.style.overflow = '';
}

function initializeGallery() {
    if (!DOM.galleryImages) return;

    DOM.galleryImages.forEach((img) => {
        img.addEventListener('click', () => {
            openImageLightbox(img.src, img.alt);
        });
    });

    // Close lightbox on overlay click
    if (elementExists(DOM.imageOverlay)) {
        DOM.imageOverlay.addEventListener('click', closeImageLightbox);
        DOM.imageOverlay.addEventListener('touchend', (e) => {
            e.preventDefault();
            closeImageLightbox();
        });
    }

    // Prevent image dragging on mobile
    if (elementExists(DOM.overlayImage)) {
        DOM.overlayImage.addEventListener('touchmove', (e) => {
            e.preventDefault();
        });
    }
}

/* ============================================
   MENU INTERACTIONS
   ============================================ */

function openMenu() {
    if (!elementExists(DOM.menuOverlay)) return;

    DOM.menuOverlay.classList.remove('hidden');
    DOM.menuOverlay.classList.add('show');
    DOM.menuOverlay.setAttribute('aria-hidden', 'false');

    if (elementExists(DOM.menuToggle)) {
        DOM.menuToggle.setAttribute('aria-expanded', 'true');
        DOM.menuToggle.classList.add('is-open');
    }

    document.body.style.overflow = 'hidden';

    if (elementExists(DOM.menuClose)) {
        DOM.menuClose.focus();
    }
    // ensure menu-panel is positioned relative to the visible viewport (mobile browsers)
    positionMenuPanelToViewport();
    attachViewportHandlers();
}

function closeMenu() {
    if (!elementExists(DOM.menuOverlay)) return;

    DOM.menuOverlay.classList.remove('show');
    DOM.menuOverlay.setAttribute('aria-hidden', 'true');
    DOM.menuOverlay.classList.add('hidden');

    if (elementExists(DOM.menuToggle)) {
        DOM.menuToggle.setAttribute('aria-expanded', 'false');
        DOM.menuToggle.classList.remove('is-open');
        DOM.menuToggle.focus();
    }

    document.body.style.overflow = '';
    // detach handlers when menu is closed
    detachViewportHandlers();
}

function toggleMenu() {
    if (!elementExists(DOM.menuOverlay)) return;

    const isHidden = DOM.menuOverlay.classList.contains('hidden');
    isHidden ? openMenu() : closeMenu();
}

function initializeMenu() {
    if (!elementExists(DOM.menuToggle)) return;

    // Toggle menu on hamburger click
    DOM.menuToggle.addEventListener('click', toggleMenu);

    // Close menu on close button click
    if (elementExists(DOM.menuClose)) {
        DOM.menuClose.addEventListener('click', closeMenu);
    }

    // Close menu on overlay background click
    if (elementExists(DOM.menuOverlay)) {
        DOM.menuOverlay.addEventListener('click', (e) => {
            if (e.target === DOM.menuOverlay) {
                closeMenu();
            }
        });

        // Handle menu link clicks
        const menuLinks = DOM.menuOverlay.querySelectorAll('a');
        menuLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                // Handle anchor links with smooth scroll
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.slice(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        smoothScroll(targetElement);
                    }
                }

                closeMenu();
            });
        });
    }

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elementExists(DOM.menuOverlay)) {
            if (!DOM.menuOverlay.classList.contains('hidden')) {
                closeMenu();
            }
        }
    });
}

/* ============================================
   ACCESS CONTROL
   ============================================ */

function verifyAccessCode() {
    const inputCode = DOM.accessCode.value.trim();

    if (inputCode === CONFIG.CORRECT_ACCESS_CODE) {
        sessionStorage.setItem(CONFIG.SESSION_KEY, 'true');
        hideAccessOverlay();
    } else {
        showAccessError();
        DOM.accessCode.value = '';
    }
}

function hideAccessOverlay() {
    if (!elementExists(DOM.accessOverlay)) return;

    DOM.accessOverlay.style.opacity = '0';
    setTimeout(() => {
        DOM.accessOverlay.classList.add('hidden');
    }, 300);
}

function showAccessError() {
    if (!elementExists(DOM.accessError)) return;

    DOM.accessError.classList.remove('hidden');
    DOM.accessError.setAttribute('role', 'alert');
}

function initializeAccessControl() {
    // Check if already authenticated
    if (sessionStorage.getItem(CONFIG.SESSION_KEY) === 'true') {
        hideAccessOverlay();
        return;
    }

    // Submit button handler
    if (elementExists(DOM.accessSubmit)) {
        DOM.accessSubmit.addEventListener('click', verifyAccessCode);
    }

    // Enter key handler
    if (elementExists(DOM.accessCode)) {
        DOM.accessCode.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                verifyAccessCode();
            }
            // Hide error on input
            if (elementExists(DOM.accessError)) {
                DOM.accessError.classList.add('hidden');
            }
        });
    }
}

/* ============================================
   NAVIGATION
   ============================================ */

function initializeNavigation() {
    if (elementExists(DOM.galleryButton) && elementExists(DOM.gallerySection)) {
        DOM.galleryButton.addEventListener('click', () => {
            smoothScroll(DOM.gallerySection);
        });
    }
}

/* ============================================
   APPLICATION INITIALIZATION
   ============================================ */

function initializeApp() {
    initializeGallery();
    initializeMenu();
    initializeAccessControl();
    initializeNavigation();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

/* ============================================
   VISUAL VIEWPORT HELPERS (keep bottom sheet glued)
   ============================================ */
let _viewportHandlersAttached = false;

function positionMenuPanelToViewport() {
    const panel = document.querySelector('.menu-panel');
    if (!panel) return;

    // Only apply special positioning on narrow screens (phone behavior)
    const isPhone = window.matchMedia && window.matchMedia('(max-width:420px)').matches;
    if (!isPhone) {
        // Anchor panel directly beneath the topbar so they glue together
        const topbar = document.querySelector('.topbar');
        if (topbar) {
            const rect = topbar.getBoundingClientRect();
            // rect.bottom is relative to layout viewport; use that for fixed positioning
            panel.style.position = 'fixed';
            panel.style.top = rect.bottom + 'px';
            panel.style.left = 'auto';
            panel.style.right = '0';
            panel.style.bottom = 'auto';
            panel.style.transform = 'translateY(0)';
            panel.style.opacity = '1';
        } else {
            // Reset to default if no topbar
            panel.style.top = '';
            panel.style.bottom = '';
            panel.style.position = '';
        }
        return;
    }

    const vv = window.visualViewport;
    // If visualViewport is not supported, rely on window.innerHeight
    const vvHeight = vv ? vv.height : window.innerHeight;
    const vvOffsetTop = vv ? vv.offsetTop : 0;

    // compute top so that panel bottom aligns with visible viewport bottom
    const panelHeight = panel.offsetHeight || Math.min(400, vvHeight * 0.6);
    const top = Math.round(vvOffsetTop + vvHeight - panelHeight);

    // pin panel using fixed positioning relative to layout viewport
    panel.style.position = 'fixed';
    panel.style.left = '0';
    panel.style.right = '0';
    panel.style.top = top + 'px';
    panel.style.bottom = 'auto';
    panel.style.transform = 'translateY(0)';
    panel.style.opacity = '1';
}

function _onVisualViewportChange() {
    // reposition when the visual viewport changes (scroll/resize)
    positionMenuPanelToViewport();
}

function attachViewportHandlers() {
    if (_viewportHandlersAttached) return;
    _viewportHandlersAttached = true;
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', _onVisualViewportChange);
        window.visualViewport.addEventListener('scroll', _onVisualViewportChange);
    }
    // fallback
    window.addEventListener('resize', _onVisualViewportChange);
    window.addEventListener('orientationchange', _onVisualViewportChange);
}

function detachViewportHandlers() {
    if (!_viewportHandlersAttached) return;
    _viewportHandlersAttached = false;
    if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', _onVisualViewportChange);
        window.visualViewport.removeEventListener('scroll', _onVisualViewportChange);
    }
    window.removeEventListener('resize', _onVisualViewportChange);
    window.removeEventListener('orientationchange', _onVisualViewportChange);
}