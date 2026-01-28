/* ========================================
   TALENTS.JS - TALENTS MARKETPLACE MANAGEMENT
   ======================================== */

/**
 * Talent Storage Manager
 * Handles all LocalStorage operations for talents
 */
const TalentStorage = {
    KEY: 'church_talents',
    
    /**
     * Get all talents from LocalStorage
     * @returns {Array} Array of talent objects
     */
    getAll() {
        const data = localStorage.getItem(this.KEY);
        return data ? JSON.parse(data) : [];
    },
    
    /**
     * Save a new talent
     * @param {Object} talent - Talent data
     * @returns {Object} Saved talent with ID and timestamp
     */
    save(talent) {
        const talents = this.getAll();
        const newTalent = {
            id: Date.now(),
            timestamp: Date.now(),
            ...talent
        };
        talents.push(newTalent);
        localStorage.setItem(this.KEY, JSON.stringify(talents));
        return newTalent;
    },
    
    /**
     * Delete a talent by ID
     * @param {number} id - Talent ID
     */
    delete(id) {
        const talents = this.getAll();
        const filtered = talents.filter(talent => talent.id !== id);
        localStorage.setItem(this.KEY, JSON.stringify(filtered));
    },
    
    /**
     * Get unique skill names
     * @returns {Array} Array of skill names
     */
    getSkills() {
        const talents = this.getAll();
        const skills = [...new Set(talents.map(t => t.skill))];
        return skills.sort();
    }
};

/**
 * Initialize Talents Page
 * - Runs only on talents.html page
 */
function initTalentsPage() {
    const talentForm = document.getElementById('talentForm');
    const talentsContainer = document.getElementById('talentsContainer');
    const searchTalent = document.getElementById('searchTalent');
    const filterAvailability = document.getElementById('filterAvailability');
    const clearTalentFilters = document.getElementById('clearTalentFilters');
    
    // Check if we're on the talents page
    if (!talentForm) return;
    
    /**
     * Handle Talent Form Submission
     */
    talentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const talent = {
            name: document.getElementById('talentName').value.trim(),
            skill: document.getElementById('skillName').value.trim(),
            description: document.getElementById('talentDescription').value.trim(),
            contact: document.getElementById('talentContact').value.trim(),
            availability: document.getElementById('talentAvailability').value
        };
        
        // Validate
        if (!talent.name || !talent.skill || !talent.description || !talent.contact || !talent.availability) {
            alert('Please fill in all fields');
            return;
        }
        
        // Validate email or phone
        const emailPhoneRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$|^\(\d{3}\)\s*\d{3}-\d{4}$|^\d{10}$/;
        if (!emailPhoneRegex.test(talent.contact) && 
            !talent.contact.includes('@') && 
            !talent.contact.includes('-') &&
            talent.contact.replace(/\D/g, '').length < 10) {
            alert('Please enter a valid email or phone number');
            return;
        }
        
        // Save to LocalStorage
        TalentStorage.save(talent);
        
        // Show success message
        alert('Your talent has been posted successfully!');
        
        // Reset form
        talentForm.reset();
        
        // Refresh display
        renderTalents();
    });
    
    /**
     * Render Talents Based on Filters & Search
     */
    function renderTalents() {
        let talents = TalentStorage.getAll();
        
        // Search by skill name
        const searchQuery = searchTalent.value.toLowerCase();
        if (searchQuery) {
            talents = talents.filter(t => 
                t.skill.toLowerCase().includes(searchQuery) ||
                t.name.toLowerCase().includes(searchQuery)
            );
        }
        
        // Filter by availability
        const availabilityFilter = filterAvailability.value;
        if (availabilityFilter) {
            talents = talents.filter(t => t.availability === availabilityFilter);
        }
        
        // Sort by newest first
        talents.sort((a, b) => b.timestamp - a.timestamp);
        
        // Clear container
        talentsContainer.innerHTML = '';
        
        // Display talents
        if (talents.length === 0) {
            talentsContainer.innerHTML = '<p class="placeholder-text">No talents found matching your search.</p>';
            return;
        }
        
        talents.forEach(talent => {
            const card = createTalentCard(talent);
            talentsContainer.appendChild(card);
        });
    }
    
    /**
     * Create Talent Card Element
     * @param {Object} talent - Talent data
     * @returns {HTMLElement} Talent card element
     */
    function createTalentCard(talent) {
        const card = document.createElement('div');
        card.className = 'talent-card';
        
        const availabilityClass = talent.availability.toLowerCase();
        const timeAgo = getTimeAgo(talent.timestamp);
        
        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">${escapeHtml(talent.skill)}</h3>
                <p class="card-subtitle">By: ${escapeHtml(talent.name)}</p>
            </div>
            <div class="card-content">
                <p>${escapeHtml(talent.description)}</p>
                <div style="margin-top: var(--spacing-md);">
                    <span class="availability-badge ${availabilityClass}">
                        ${talent.availability}
                    </span>
                </div>
            </div>
            <div class="posted-date">⏰ ${timeAgo}</div>
            <div class="card-footer">
                <button class="btn btn-primary hire-talent" data-id="${talent.id}">
                    ✉️ Contact
                </button>
                <button class="btn btn-danger delete-talent" data-id="${talent.id}">
                    🗑️ Delete
                </button>
            </div>
        `;
        
        // Contact button handler
        const contactBtn = card.querySelector('.hire-talent');
        contactBtn.addEventListener('click', () => openContactModal(talent));
        
        // Delete button handler
        const deleteBtn = card.querySelector('.delete-talent');
        deleteBtn.addEventListener('click', () => {
            if (confirm(`Remove "${talent.skill}" from ${talent.name}?`)) {
                TalentStorage.delete(talent.id);
                renderTalents();
            }
        });
        
        return card;
    }
    
    /**
     * Open Contact Modal
     * @param {Object} talent - Talent data
     */
    function openContactModal(talent) {
        document.getElementById('modalTalentName').textContent = talent.name;
        document.getElementById('modalSkill').textContent = `Skill: ${talent.skill}`;
        document.getElementById('modalDescription').textContent = talent.description;
        document.getElementById('modalContact').textContent = talent.contact;
        
        // Add contact info for copying
        const copyBtn = document.getElementById('copyContact');
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(talent.contact).then(() => {
                copyBtn.textContent = '✓ Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy Contact Info';
                }, 2000);
            });
        };
        
        openModal('contactModal');
    }
    
    /**
     * Event Listeners
     */
    searchTalent.addEventListener('input', renderTalents);
    filterAvailability.addEventListener('change', renderTalents);
    
    document.getElementById('closeContactModal').addEventListener('click', () => {
        closeModal('contactModal');
    });
    
    clearTalentFilters.addEventListener('click', () => {
        searchTalent.value = '';
        filterAvailability.value = '';
        renderTalents();
    });
    
    // Initial render
    renderTalents();
}

/**
 * Display Featured Talents on Home Page
 * - Shows 3 random talents with "Available" status
 */
function displayFeaturedTalents() {
    const container = document.getElementById('featuredTalentsContainer');
    
    if (!container) return;
    
    let talents = TalentStorage.getAll();
    
    // Filter available talents
    talents = talents.filter(t => t.availability === 'Available');
    
    // Shuffle and limit to 3
    talents = talents.sort(() => Math.random() - 0.5).slice(0, 3);
    
    // Clear container
    container.innerHTML = '';
    
    if (talents.length === 0) {
        container.innerHTML = '<p class="placeholder-text">Talents will appear here. Visit the <a href="talents.html">Talents page</a> to share your skills.</p>';
        return;
    }
    
    talents.forEach(talent => {
        const card = document.createElement('div');
        card.className = 'talent-card';
        
        const availabilityClass = talent.availability.toLowerCase();
        
        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">${escapeHtml(talent.skill)}</h3>
                <p class="card-subtitle">By: ${escapeHtml(talent.name)}</p>
            </div>
            <div class="card-content">
                <p>${escapeHtml(talent.description.substring(0, 80))}...</p>
                <div style="margin-top: var(--spacing-md);">
                    <span class="availability-badge ${availabilityClass}">
                        ${talent.availability}
                    </span>
                </div>
            </div>
            <div class="card-footer">
                <a href="talents.html" class="btn btn-primary" style="flex: 1;">View All Talents</a>
            </div>
        `;
        
        container.appendChild(card);
    });
}

/**
 * Initialize on Page Load
 */
document.addEventListener('DOMContentLoaded', () => {
    initTalentsPage();
    displayFeaturedTalents();
});
