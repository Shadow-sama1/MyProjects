/* ========================================
   SERMONS.JS - SERMON MANAGEMENT
   ======================================== */

/**
 * Sermon Storage Manager
 * Handles all LocalStorage operations for sermons
 */
const SermonStorage = {
    KEY: 'church_sermons',
    
    /**
     * Get all sermons from LocalStorage
     * @returns {Array} Array of sermon objects
     */
    getAll() {
        const data = localStorage.getItem(this.KEY);
        return data ? JSON.parse(data) : [];
    },
    
    /**
     * Save a new sermon
     * @param {Object} sermon - Sermon data
     * @returns {Object} Saved sermon with ID and timestamp
     */
    save(sermon) {
        const sermons = this.getAll();
        const newSermon = {
            id: Date.now(),
            timestamp: Date.now(),
            ...sermon
        };
        sermons.push(newSermon);
        localStorage.setItem(this.KEY, JSON.stringify(sermons));
        return newSermon;
    },
    
    /**
     * Delete a sermon by ID
     * @param {number} id - Sermon ID
     */
    delete(id) {
        const sermons = this.getAll();
        const filtered = sermons.filter(sermon => sermon.id !== id);
        localStorage.setItem(this.KEY, JSON.stringify(filtered));
    },
    
    /**
     * Get unique pastor names
     * @returns {Array} Array of pastor names
     */
    getPastors() {
        const sermons = this.getAll();
        const pastors = [...new Set(sermons.map(s => s.pastorName))];
        return pastors.sort();
    }
};

/**
 * Initialize Sermons Page
 * - Runs only on sermons.html page
 */
function initSermonsPage() {
    const sermonForm = document.getElementById('sermonForm');
    const sermonsContainer = document.getElementById('sermonsContainer');
    const filterPastor = document.getElementById('filterPastor');
    const sortSermons = document.getElementById('sortSermons');
    const clearFilters = document.getElementById('clearFilters');
    
    // Check if we're on the sermons page
    if (!sermonForm) return;
    
    /**
     * Handle Sermon Form Submission
     */
    sermonForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const sermon = {
            pastorName: document.getElementById('pastorName').value.trim(),
            title: document.getElementById('sermonTitle').value.trim(),
            date: document.getElementById('sermonDate').value,
            mediaUrl: document.getElementById('mediaUrl').value.trim() || null,
            description: document.getElementById('sermonDescription').value.trim()
        };
        
        // Validate
        if (!sermon.pastorName || !sermon.title || !sermon.date || !sermon.description) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Save to LocalStorage
        SermonStorage.save(sermon);
        
        // Show success message
        alert('Sermon saved successfully!');
        
        // Reset form
        sermonForm.reset();
        
        // Refresh display
        renderSermons();
        updatePastorFilter();
    });
    
    /**
     * Update Pastor Filter Options
     */
    function updatePastorFilter() {
        const pastors = SermonStorage.getPastors();
        const currentValue = filterPastor.value;
        
        // Clear existing options except the first one
        while (filterPastor.options.length > 1) {
            filterPastor.remove(1);
        }
        
        // Add pastor options
        pastors.forEach(pastor => {
            const option = document.createElement('option');
            option.value = pastor;
            option.textContent = pastor;
            filterPastor.appendChild(option);
        });
        
        // Restore previous selection if it still exists
        if (currentValue && Array.from(filterPastor.options).some(opt => opt.value === currentValue)) {
            filterPastor.value = currentValue;
        }
    }
    
    /**
     * Render Sermons Based on Filters & Sort
     */
    function renderSermons() {
        let sermons = SermonStorage.getAll();
        
        // Filter by pastor
        const selectedPastor = filterPastor.value;
        if (selectedPastor) {
            sermons = sermons.filter(s => s.pastorName === selectedPastor);
        }
        
        // Sort
        const sortValue = sortSermons.value;
        if (sortValue === 'newest') {
            sermons.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortValue === 'oldest') {
            sermons.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sortValue === 'title') {
            sermons.sort((a, b) => a.title.localeCompare(b.title));
        }
        
        // Clear container
        sermonsContainer.innerHTML = '';
        
        // Display sermons
        if (sermons.length === 0) {
            sermonsContainer.innerHTML = '<p class="placeholder-text">No sermons found matching your filters.</p>';
            return;
        }
        
        sermons.forEach(sermon => {
            const card = createSermonCard(sermon);
            sermonsContainer.appendChild(card);
        });
    }
    
    /**
     * Create Sermon Card Element
     * @param {Object} sermon - Sermon data
     * @returns {HTMLElement} Sermon card element
     */
    function createSermonCard(sermon) {
        const card = document.createElement('div');
        card.className = 'sermon-card';
        
        const dateFormatted = formatDate(sermon.date);
        
        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">${escapeHtml(sermon.title)}</h3>
                <p class="card-subtitle">By: ${escapeHtml(sermon.pastorName)}</p>
            </div>
            <div class="card-content">
                <p>${escapeHtml(sermon.description)}</p>
            </div>
            <div class="posted-date">📅 ${dateFormatted}</div>
            <div class="card-footer">
                ${sermon.mediaUrl ? `
                    <button class="btn btn-primary play-sermon" data-id="${sermon.id}">
                        ▶️ Play Sermon
                    </button>
                ` : '<p class="placeholder-text">No audio available</p>'}
                <button class="btn btn-danger delete-sermon" data-id="${sermon.id}">
                    🗑️ Delete
                </button>
            </div>
        `;
        
        // Play button handler
        const playBtn = card.querySelector('.play-sermon');
        if (playBtn) {
            playBtn.addEventListener('click', () => openSermonPlayer(sermon));
        }
        
        // Delete button handler
        const deleteBtn = card.querySelector('.delete-sermon');
        deleteBtn.addEventListener('click', () => {
            if (confirm(`Delete "${sermon.title}"?`)) {
                SermonStorage.delete(sermon.id);
                renderSermons();
                updatePastorFilter();
            }
        });
        
        return card;
    }
    
    /**
     * Open Sermon Player Modal
     * @param {Object} sermon - Sermon data
     */
    function openSermonPlayer(sermon) {
        document.getElementById('modalSermonTitle').textContent = sermon.title;
        document.getElementById('modalPastorName').textContent = `By: ${sermon.pastorName}`;
        document.getElementById('modalDescription').textContent = sermon.description;
        document.getElementById('audioSource').src = sermon.mediaUrl;
        document.getElementById('audioPlayer').load();
        
        openModal('audioModal');
    }
    
    /**
     * Event Listeners
     */
    filterPastor.addEventListener('change', renderSermons);
    sortSermons.addEventListener('change', renderSermons);
    clearFilters.addEventListener('click', () => {
        filterPastor.value = '';
        sortSermons.value = 'newest';
        renderSermons();
    });
    
    document.getElementById('closeAudioModal').addEventListener('click', () => {
        closeModal('audioModal');
    });
    
    // Initial render
    updatePastorFilter();
    renderSermons();
}

/**
 * Display Latest Sermons on Home Page
 * - Shows 3 most recent sermons
 */
function displayLatestSermons() {
    const container = document.getElementById('latestSermonsContainer');
    
    if (!container) return;
    
    let sermons = SermonStorage.getAll();
    
    // Sort by newest
    sermons = sermons.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
    
    // Clear container
    container.innerHTML = '';
    
    if (sermons.length === 0) {
        container.innerHTML = '<p class="placeholder-text">No sermons yet. Visit the <a href="sermons.html">Sermons page</a> to share one.</p>';
        return;
    }
    
    sermons.forEach(sermon => {
        const dateFormatted = formatDate(sermon.date);
        const card = document.createElement('div');
        card.className = 'sermon-card';
        
        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">${escapeHtml(sermon.title)}</h3>
                <p class="card-subtitle">By: ${escapeHtml(sermon.pastorName)}</p>
            </div>
            <div class="card-content">
                <p>${escapeHtml(sermon.description.substring(0, 100))}...</p>
            </div>
            <div class="posted-date">📅 ${dateFormatted}</div>
            <div class="card-footer">
                <a href="sermons.html" class="btn btn-primary" style="flex: 1;">View Sermon</a>
            </div>
        `;
        
        container.appendChild(card);
    });
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Initialize on Page Load
 */
document.addEventListener('DOMContentLoaded', () => {
    initSermonsPage();
    displayLatestSermons();
});
