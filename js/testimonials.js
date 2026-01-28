/* ========================================
   TESTIMONIALS.JS - TESTIMONIES MANAGEMENT
   ======================================== */

/**
 * Testimony Storage Manager
 * Handles backend API operations for testimonies
 * Uses Netlify Functions for persistent storage
 */
const TestimonyStorage = {
    apiBase: '/.netlify/functions',
    localCache: [], // Cache for offline functionality
    
    /**
     * Get all testimonies from backend API
     * @returns {Promise<Array>} Array of testimony objects
     */
    async getAll() {
        try {
            const response = await fetch(`${this.apiBase}/testimonies`);
            if (!response.ok) throw new Error('Failed to fetch testimonies');
            
            const result = await response.json();
            this.localCache = result.data || [];
            return this.localCache;
        } catch (error) {
            console.error('Error fetching testimonies:', error);
            // Return cached data if API fails
            return this.localCache;
        }
    },
    
    /**
     * Save a new testimony to backend API
     * @param {Object} testimony - Testimony data
     * @returns {Promise<Object>} Saved testimony with ID and timestamp
     */
    async save(testimony) {
        try {
            const response = await fetch(`${this.apiBase}/testimonies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(testimony)
            });
            
            if (!response.ok) throw new Error('Failed to save testimony');
            
            const result = await response.json();
            // Update local cache
            this.localCache.push(result.data);
            return result.data;
        } catch (error) {
            console.error('Error saving testimony:', error);
            throw error;
        }
    },
    
    /**
     * Update a testimony in backend API
     * @param {number} id - Testimony ID
     * @param {Object} updates - Fields to update
     * @returns {Promise<Object>} Updated testimony object
     */
    async update(id, updates) {
        try {
            const response = await fetch(`${this.apiBase}/update-testimony/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });
            
            if (!response.ok) throw new Error('Failed to update testimony');
            
            const result = await response.json();
            // Update local cache
            const index = this.localCache.findIndex(t => t.id === id);
            if (index !== -1) {
                this.localCache[index] = result.data;
            }
            return result.data;
        } catch (error) {
            console.error('Error updating testimony:', error);
            throw error;
        }
    },
    
    /**
     * Delete a testimony from backend API
     * @param {number} id - Testimony ID
     * @returns {Promise<boolean>} Success status
     */
    async delete(id) {
        try {
            const response = await fetch(`${this.apiBase}/update-testimony/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) throw new Error('Failed to delete testimony');
            
            // Update local cache
            this.localCache = this.localCache.filter(t => t.id !== id);
            return true;
        } catch (error) {
            console.error('Error deleting testimony:', error);
            throw error;
        }
    },
    
    /**
     * Get a testimony by ID from local cache
     * @param {number} id - Testimony ID
     * @returns {Object} Testimony object or undefined
     */
    getById(id) {
        return this.localCache.find(t => t.id === id);
    }
};

/**
 * Initialize Testimonies Page
 * - Runs only on testimonials.html page
 */
function initTestimoniesPage() {
    const testimonyForm = document.getElementById('testimonyForm');
    const testimoniesContainer = document.getElementById('testimoniesContainer');
    const sortTestimonies = document.getElementById('sortTestimonies');
    const testimonyCount = document.getElementById('testimonyCount');
    
    // Check if we're on the testimonies page
    if (!testimonyForm) return;
    
    // Track loading state
    let isLoading = false;
    
    /**
     * Handle Testimony Form Submission
     */
    testimonyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (isLoading) return;
        isLoading = true;
        
        const submitBtn = testimonyForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Posting...';
        submitBtn.disabled = true;
        
        try {
            const testimony = {
                name: document.getElementById('testimonyName').value.trim() || 'Anonymous',
                title: document.getElementById('testimonyTitle').value.trim(),
                message: document.getElementById('testimonyMessage').value.trim()
            };
            
            // Validate
            if (!testimony.title || !testimony.message) {
                alert('Please fill in the title and message');
                return;
            }
            
            // Save to backend
            await TestimonyStorage.save(testimony);
            
            // Show success message
            alert('Your testimony has been shared. Thank you for your faith!');
            
            // Reset form
            testimonyForm.reset();
            
            // Refresh display
            await renderTestimonies();
        } catch (error) {
            alert('Failed to post testimony. Please try again.');
            console.error('Error posting testimony:', error);
        } finally {
            isLoading = false;
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
    
    /**
     * Render Testimonies Based on Sort
     */
    async function renderTestimonies() {
        try {
            let testimonies = await TestimonyStorage.getAll();
            
            // Sort
            const sortValue = sortTestimonies.value;
            if (sortValue === 'newest') {
                testimonies.sort((a, b) => b.timestamp - a.timestamp);
            } else if (sortValue === 'oldest') {
                testimonies.sort((a, b) => a.timestamp - b.timestamp);
            } else if (sortValue === 'mostLiked') {
                testimonies.sort((a, b) => (b.likes || 0) - (a.likes || 0));
            }
            
            // Update count
            if (testimonyCount) {
                testimonyCount.textContent = testimonies.length;
            }
            
            // Clear container
            testimoniesContainer.innerHTML = '';
            
            // Display testimonies
            if (testimonies.length === 0) {
                testimoniesContainer.innerHTML = '<p class="placeholder-text">No testimonies yet. Be the first to share your story!</p>';
                return;
            }
            
            testimonies.forEach(testimony => {
                const card = createTestimonyCard(testimony);
                testimoniesContainer.appendChild(card);
            });
        } catch (error) {
            console.error('Error rendering testimonies:', error);
            testimoniesContainer.innerHTML = '<p class="placeholder-text">Failed to load testimonies. Please refresh the page.</p>';
        }
    }
    
    /**
     * Create Testimony Card Element
     * @param {Object} testimony - Testimony data
     * @returns {HTMLElement} Testimony card element
     */
    function createTestimonyCard(testimony) {
        const card = document.createElement('div');
        card.className = 'testimony-card';
        
        const timeAgo = getTimeAgo(testimony.timestamp);
        const likes = testimony.likes || 0;
        const isLiked = testimony.liked || false;
        
        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">${escapeHtml(testimony.title)}</h3>
                <p class="card-subtitle">By: ${escapeHtml(testimony.name)}</p>
            </div>
            <div class="card-content">
                <p>${escapeHtml(testimony.message)}</p>
            </div>
            <div class="posted-date">📅 ${timeAgo}</div>
            <div class="testimony-stats">
                <div class="stat-item">
                    <button class="like-button ${isLiked ? 'liked' : ''}" data-id="${testimony.id}" 
                            title="Like this testimony">
                        ${isLiked ? '❤️' : '🤍'}
                    </button>
                    <span class="like-count">${likes} ${likes === 1 ? 'like' : 'likes'}</span>
                </div>
            </div>
            <div class="card-footer">
                <button class="btn btn-danger delete-testimony" data-id="${testimony.id}">
                    🗑️ Delete
                </button>
            </div>
        `;
        
        // Like button handler
        const likeBtn = card.querySelector('.like-button');
        likeBtn.addEventListener('click', async () => {
            try {
                const current = TestimonyStorage.getById(testimony.id);
                const newLiked = !current.liked;
                const newLikes = newLiked ? (current.likes || 0) + 1 : Math.max(0, (current.likes || 0) - 1);
                
                await TestimonyStorage.update(testimony.id, {
                    likes: newLikes,
                    liked: newLiked
                });
                
                await renderTestimonies();
            } catch (error) {
                alert('Failed to update like. Please try again.');
                console.error('Error updating like:', error);
            }
        });
        
        // Delete button handler
        const deleteBtn = card.querySelector('.delete-testimony');
        deleteBtn.addEventListener('click', async () => {
            if (confirm(`Delete this testimony?`)) {
                try {
                    await TestimonyStorage.delete(testimony.id);
                    await renderTestimonies();
                } catch (error) {
                    alert('Failed to delete testimony. Please try again.');
                    console.error('Error deleting testimony:', error);
                }
            }
        });
        
        return card;
    }
    
    /**
     * Event Listeners
     */
    sortTestimonies.addEventListener('change', renderTestimonies);
    
    // Initial render - load testimonies on page load
    renderTestimonies();
}

/**
 * Display Testimonies on Home Page
 * - Shows 3 most liked testimonies
 */
function displayHomePageTestimonies() {
    // This could be added to home page if desired
    // Currently not implemented as per requirements
}

/**
 * Initialize on Page Load
 */
document.addEventListener('DOMContentLoaded', () => {
    initTestimoniesPage();
    displayHomePageTestimonies();
});
