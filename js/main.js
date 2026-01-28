/* ========================================
   MAIN.JS - SHARED FUNCTIONALITY & NAVIGATION
   ======================================== */

/**
 * DOM Elements
 */
const darkModeBtn = document.getElementById('darkModeBtn');
const html = document.documentElement;

/**
 * Initialize Dark Mode
 * - Retrieves saved preference from LocalStorage
 * - Applies theme on page load
 */
function initDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
        enableDarkMode();
    }
}

/**
 * Enable Dark Mode
 */
function enableDarkMode() {
    document.body.classList.add('dark-mode');
    darkModeBtn.textContent = '☀️';
    localStorage.setItem('darkMode', 'true');
}

/**
 * Disable Dark Mode
 */
function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    darkModeBtn.textContent = '🌙';
    localStorage.setItem('darkMode', 'false');
}

/**
 * Toggle Dark Mode
 */
function toggleDarkMode() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    if (isDarkMode) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

/**
 * Update Active Navigation Link
 * - Highlights the current page in the navigation
 */
function updateActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Format Date to Readable String
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Get Time Ago String
 * @param {number} timestamp - Milliseconds since epoch
 * @returns {string} Human readable time difference
 */
function getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return formatDate(new Date(timestamp).toISOString().split('T')[0]);
}

/**
 * Close Modal
 * @param {string} modalId - ID of the modal to close
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

/**
 * Open Modal
 * @param {string} modalId - ID of the modal to open
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
    }
}

/**
 * Close Modal on Escape Key
 */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close modals
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
        // Close mobile menu
        if (navMenu && navMenu.classList.contains('open')) {
            closeMobileMenu();
        }
    }
});

/**
 * Close Modal on Outside Click
 */
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.add('hidden');
    }
});

/**
 * Event Listeners
 */
if (darkModeBtn) {
    darkModeBtn.addEventListener('click', toggleDarkMode);
}

/**
 * Initialize on Page Load
 */
document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    updateActiveNav();
});
