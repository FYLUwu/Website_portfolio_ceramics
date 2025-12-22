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
   SCROLL LOCK (handles nested overlays)
   ============================================ */
let _scrollBlockCount = 0;
function _blockTouch(e) {
    e.preventDefault();
}
function disableBodyScroll() {
    if (_scrollBlockCount === 0) {
        try {
            document.body.style.overflow = 'hidden';
        } catch (err) {}
        document.addEventListener('touchmove', _blockTouch, { passive: false });
    }
    _scrollBlockCount++;
}
function enableBodyScroll() {
    _scrollBlockCount = Math.max(0, _scrollBlockCount - 1);
    if (_scrollBlockCount === 0) {
        try {
            document.body.style.overflow = '';
        } catch (err) {}
        document.removeEventListener('touchmove', _blockTouch);
    }
}

/* ============================================
   GALLERY LIGHTBOX
   ============================================ */

function openImageLightbox(imageSrc, imageAlt) {
    if (!elementExists(DOM.imageOverlay)) return;

    DOM.overlayImage.src = imageSrc;
    DOM.overlayImage.alt = imageAlt;
    DOM.imageOverlay.classList.remove('hidden');
    disableBodyScroll();
}

function closeImageLightbox() {
    if (!elementExists(DOM.imageOverlay)) return;

    DOM.imageOverlay.classList.add('hidden');
    enableBodyScroll();
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

    disableBodyScroll();

    if (elementExists(DOM.menuClose)) {
        DOM.menuClose.focus();
    }
    // ensure menu-panel is positioned relative to the visible viewport (mobile browsers)
    // update CSS vh variable first so CSS-based sizes match the visible viewport
    if (typeof updateVh === 'function') updateVh();
    positionMenuPanelToViewport();
    attachViewportHandlers();
    activateFocusTrap();
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

    enableBodyScroll();
    // detach handlers when menu is closed
    detachViewportHandlers();
    deactivateFocusTrap();
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
    // set initial --vh so CSS using var(--vh) is correct on mobile
    if (typeof updateVh === 'function') updateVh();
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
let _vhUpdateTimer = null;

function updateVh() {
    const vv = window.visualViewport;
    const height = vv ? vv.height : window.innerHeight;
    const vh = (height * 0.01);
    document.documentElement.style.setProperty('--vh', vh + 'px');
}

function updateVhDebounced() {
    if (_vhUpdateTimer) clearTimeout(_vhUpdateTimer);
    _vhUpdateTimer = setTimeout(() => {
        updateVh();
    }, 60);
}

function positionMenuPanelToViewport() {
    const panel = document.querySelector('.menu-panel');
    if (!panel) return;

    // Only apply special positioning on narrow screens (phone behavior)
    const isPhone = window.matchMedia && window.matchMedia('(max-width:420px)').matches;
    if (!isPhone) {
        // On desktop/tablet prefer CSS-driven layout (full-screen centered overlay)
        // Clear any inline positioning set previously so stylesheet controls appearance
        panel.style.position = '';
        panel.style.top = '';
        panel.style.left = '';
        panel.style.right = '';
        panel.style.bottom = '';
        panel.style.transform = '';
        panel.style.opacity = '';
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
    // update CSS vh and reposition when the visual viewport changes (scroll/resize)
    if (window.visualViewport) {
        updateVhDebounced();
    } else {
        // fallback immediate update
        updateVh();
    }
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
    // ensure CSS var is initialized when handlers attach
    updateVh();
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

/* ============================================
   FOCUS TRAP (accessibility for overlays)
   ============================================ */
let _previouslyFocused = null;
let _focusableElements = [];
let _focusTrapListener = null;

function _getFocusable(container) {
    if (!container) return [];
    return Array.from(
        container.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')
    ).filter((el) => el.offsetParent !== null);
}

function _onTrapKey(e) {
    if (e.key !== 'Tab') return;
    const first = _focusableElements[0];
    const last = _focusableElements[_focusableElements.length - 1];
    if (!first || !last) return;

    if (e.shiftKey) {
        if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
        }
    } else {
        if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
}

function activateFocusTrap() {
    const panel = document.querySelector('.menu-panel');
    if (!panel) return;
    _previouslyFocused = document.activeElement;
    _focusableElements = _getFocusable(panel);
    if (_focusableElements.length) _focusableElements[0].focus();
    _focusTrapListener = _onTrapKey;
    document.addEventListener('keydown', _focusTrapListener);

    // prevent touchmove on the overlay background but allow scrolling inside panel
    if (DOM.menuOverlay) {
        DOM.menuOverlay.addEventListener('touchmove', _menuOverlayTouchMove, { passive: false });
    }
}

function deactivateFocusTrap() {
    if (_focusTrapListener) {
        document.removeEventListener('keydown', _focusTrapListener);
        _focusTrapListener = null;
    }
    if (_previouslyFocused && typeof _previouslyFocused.focus === 'function') {
        _previouslyFocused.focus();
    }
    // remove overlay touchmove handler
    if (DOM.menuOverlay) {
        DOM.menuOverlay.removeEventListener('touchmove', _menuOverlayTouchMove);
    }
}

function _menuOverlayTouchMove(e) {
    // allow touchmove if the event happened inside the scrollable panel
    const panel = document.querySelector('.menu-panel');
    if (panel && e.target && e.target instanceof Element && e.target.closest('.menu-panel')) {
        // allow; do not prevent
        return;
    }
    // otherwise prevent background scroll
    e.preventDefault();
}