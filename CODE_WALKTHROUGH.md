# Code Walkthrough - Solomon's Porch

A detailed guide explaining how key features are implemented.

---

## 🔧 How LocalStorage Works

### Saving Data
```javascript
// Step 1: Create an object with data
const sermon = {
    pastorName: "Rev. Johnson",
    title: "Finding Purpose",
    date: "2024-01-15",
    mediaUrl: "https://example.com/audio.mp3",
    description: "A powerful message..."
};

// Step 2: Get existing data (or empty array)
const sermons = JSON.parse(localStorage.getItem('church_sermons')) || [];

// Step 3: Add unique ID and timestamp
const newSermon = {
    id: Date.now(),        // Unique ID based on time
    timestamp: Date.now(), // When it was created
    ...sermon              // Spread in the data
};

// Step 4: Add to array
sermons.push(newSermon);

// Step 5: Save back to LocalStorage
localStorage.setItem('church_sermons', JSON.stringify(sermons));
```

### Retrieving Data
```javascript
// Get data from LocalStorage
const sermons = JSON.parse(localStorage.getItem('church_sermons')) || [];

// Use the data
sermons.forEach(sermon => {
    console.log(sermon.title);
});
```

### Updating Data (Likes Example)
```javascript
// Find the testimony
const testimonies = JSON.parse(localStorage.getItem('church_testimonies')) || [];
const testimony = testimonies.find(t => t.id === testimonyId);

// Update it
if (testimony) {
    testimony.likes = (testimony.likes || 0) + 1;
    testimony.liked = true;
}

// Save back
localStorage.setItem('church_testimonies', JSON.stringify(testimonies));
```

---

## 🎯 Understanding the Sermon Storage Manager

```javascript
const SermonStorage = {
    KEY: 'church_sermons',  // LocalStorage key
    
    // Get all sermons
    getAll() {
        const data = localStorage.getItem(this.KEY);
        return data ? JSON.parse(data) : [];
    },
    
    // Save a sermon
    save(sermon) {
        const sermons = this.getAll();  // Get existing
        const newSermon = {
            id: Date.now(),             // Unique ID
            timestamp: Date.now(),      // Creation time
            ...sermon                   // Spread in data
        };
        sermons.push(newSermon);        // Add to array
        localStorage.setItem(this.KEY, JSON.stringify(sermons)); // Save
        return newSermon;
    },
    
    // Delete a sermon
    delete(id) {
        const sermons = this.getAll();
        // Filter out the sermon with this ID
        const filtered = sermons.filter(sermon => sermon.id !== id);
        localStorage.setItem(this.KEY, JSON.stringify(filtered)); // Save
    }
};

// Usage:
SermonStorage.save(newSermon);     // Add
const all = SermonStorage.getAll(); // Get
SermonStorage.delete(sermonId);     // Remove
```

---

## 📝 Form Handling Pattern

### Basic Form Submit
```javascript
// 1. Get the form element
const form = document.getElementById('sermonForm');

// 2. Add submit event listener
form.addEventListener('submit', (e) => {
    e.preventDefault();  // Stop default form submission
    
    // 3. Get input values
    const title = document.getElementById('sermonTitle').value;
    const pastor = document.getElementById('pastorName').value;
    
    // 4. Validate
    if (!title || !pastor) {
        alert('Please fill all fields');
        return;
    }
    
    // 5. Create object
    const sermon = {
        pastorName: pastor,
        title: title,
        // ... other fields
    };
    
    // 6. Save to storage
    SermonStorage.save(sermon);
    
    // 7. Show feedback
    alert('Saved!');
    
    // 8. Reset form
    form.reset();
    
    // 9. Refresh display
    renderSermons();
});
```

---

## 🎨 How Filtering Works

### Simple Filter Example
```javascript
function renderSermons() {
    let sermons = SermonStorage.getAll();
    
    // Get selected pastor
    const selectedPastor = document.getElementById('filterPastor').value;
    
    // Filter if a pastor is selected
    if (selectedPastor) {
        sermons = sermons.filter(s => s.pastorName === selectedPastor);
    }
    
    // Sort by date
    sermons.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Render
    renderCards(sermons);
}
```

### Multi-Filter Example (Talents)
```javascript
function renderTalents() {
    let talents = TalentStorage.getAll();
    
    // Filter 1: Search by skill name
    const searchQuery = document.getElementById('searchTalent').value.toLowerCase();
    if (searchQuery) {
        talents = talents.filter(t => 
            t.skill.toLowerCase().includes(searchQuery)
        );
    }
    
    // Filter 2: By availability
    const availability = document.getElementById('filterAvailability').value;
    if (availability) {
        talents = talents.filter(t => t.availability === availability);
    }
    
    // Sort by newest
    talents.sort((a, b) => b.timestamp - a.timestamp);
    
    // Render
    renderTalentCards(talents);
}
```

---

## 🏗️ Creating and Displaying Cards

### Card Creation Pattern
```javascript
function createSermonCard(sermon) {
    // 1. Create a div
    const card = document.createElement('div');
    card.className = 'sermon-card';
    
    // 2. Set HTML content (using template literals)
    card.innerHTML = `
        <div class="card-header">
            <h3 class="card-title">${escapeHtml(sermon.title)}</h3>
            <p class="card-subtitle">By: ${escapeHtml(sermon.pastorName)}</p>
        </div>
        <div class="card-content">
            <p>${escapeHtml(sermon.description)}</p>
        </div>
        <button class="btn btn-primary" data-id="${sermon.id}">
            Play
        </button>
    `;
    
    // 3. Add event listeners
    const playBtn = card.querySelector('.btn');
    playBtn.addEventListener('click', () => {
        openSermonPlayer(sermon);
    });
    
    // 4. Return the card
    return card;
}

// Usage:
const card = createSermonCard(sermon);
document.getElementById('sermonsContainer').appendChild(card);
```

### Rendering Multiple Cards
```javascript
function renderSermons() {
    const sermons = SermonStorage.getAll();
    const container = document.getElementById('sermonsContainer');
    
    // Clear old content
    container.innerHTML = '';
    
    // Create and add cards
    sermons.forEach(sermon => {
        const card = createSermonCard(sermon);
        container.appendChild(card);
    });
}
```

---

## 🎁 Event Delegation for Dynamic Content

Instead of adding listeners to each card (which might not exist yet):

```javascript
// Wrong way - doesn't work for dynamically created elements
document.querySelectorAll('.delete-sermon').forEach(btn => {
    btn.addEventListener('click', deleteSermon);
});

// Right way - use event delegation
document.getElementById('sermonsContainer').addEventListener('click', (e) => {
    // Check if clicked element is a delete button
    if (e.target.classList.contains('delete-sermon')) {
        const id = e.target.dataset.id;
        SermonStorage.delete(id);
        renderSermons();
    }
});
```

---

## 🔍 Understanding Date/Time Handling

### Relative Time ("2 hours ago")
```javascript
function getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;  // Milliseconds difference
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return formatDate(new Date(timestamp).toISOString());
}

// Usage:
const time = getTimeAgo(sermon.timestamp);  // "3h ago"
```

### Formatted Date ("January 15, 2024")
```javascript
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Usage:
const date = formatDate(sermon.date);  // "January 15, 2024"
```

---

## 🔒 Security: Preventing XSS Attacks

### The Problem
```javascript
// UNSAFE - Don't do this!
const userInput = "<script>alert('hacked')</script>";
card.innerHTML = `<p>${userInput}</p>`; // Script would run!
```

### The Solution
```javascript
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

// SAFE - Now the script is displayed as text
const userInput = "<script>alert('hacked')</script>";
const safe = escapeHtml(userInput);
card.innerHTML = `<p>${safe}</p>`; // Shows as text, won't execute
```

---

## 🎭 Modal (Popup) System

### Opening a Modal
```javascript
function openSermonPlayer(sermon) {
    // 1. Get modal element
    const modal = document.getElementById('audioModal');
    
    // 2. Set content
    document.getElementById('modalSermonTitle').textContent = sermon.title;
    document.getElementById('audioSource').src = sermon.mediaUrl;
    
    // 3. Show modal
    modal.classList.remove('hidden');
}
```

### Closing a Modal
```javascript
// Method 1: Using helper function
closeModal('audioModal');

// Method 2: Direct
document.getElementById('audioModal').classList.add('hidden');
```

### Modal Close Events
```javascript
// Close on button click
document.getElementById('closeAudioModal').addEventListener('click', () => {
    closeModal('audioModal');
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal('audioModal');
    }
});

// Close on outside click
document.addEventListener('click', (e) => {
    if (e.target.id === 'audioModal') {
        closeModal('audioModal');
    }
});
```

---

## 🌙 Dark Mode Implementation

### Toggle Function
```javascript
function toggleDarkMode() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    if (isDarkMode) {
        // Turn off dark mode
        document.body.classList.remove('dark-mode');
        document.getElementById('darkModeBtn').textContent = '🌙';
        localStorage.setItem('darkMode', 'false');
    } else {
        // Turn on dark mode
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeBtn').textContent = '☀️';
        localStorage.setItem('darkMode', 'true');
    }
}
```

### Restoring Saved Preference
```javascript
function initDarkMode() {
    // Check if dark mode was previously enabled
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeBtn').textContent = '☀️';
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', initDarkMode);
```

### CSS Variables for Dark Mode
```css
:root {
    --white: #ffffff;
    --dark-text: #2c3e50;
}

body.dark-mode {
    --white: #2d2d2d;      /* Dark background becomes card color */
    --dark-text: #f8f9fa;  /* Dark text becomes light */
}

/* Now this automatically adapts to dark mode */
.card {
    background: var(--white);
    color: var(--dark-text);
}
```

---

## 🔄 Sorting Examples

### Sort by Date
```javascript
// Newest first
sermons.sort((a, b) => new Date(b.date) - new Date(a.date));

// Oldest first
sermons.sort((a, b) => new Date(a.date) - new Date(b.date));
```

### Sort by Text (Alphabetical)
```javascript
// A to Z
sermons.sort((a, b) => a.title.localeCompare(b.title));

// Z to A
sermons.sort((a, b) => b.title.localeCompare(a.title));
```

### Sort by Numeric Value
```javascript
// Most likes first
testimonies.sort((a, b) => (b.likes || 0) - (a.likes || 0));

// Least likes first
testimonies.sort((a, b) => (a.likes || 0) - (b.likes || 0));
```

---

## 🔗 How Navigation Works

### Active Navigation Link
```javascript
function updateActiveNav() {
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Find all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Check if this is the current page
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');  // Highlight it
        } else {
            link.classList.remove('active');  // Remove highlight
        }
    });
}

// Run on page load
document.addEventListener('DOMContentLoaded', updateActiveNav);
```

---

## 📊 Data Flow Diagram

```
User Input (Form)
        ↓
Validation Check
        ↓
Create JavaScript Object
        ↓
Save to LocalStorage (JSON)
        ↓
Retrieve from LocalStorage
        ↓
Apply Filters & Sort
        ↓
Create HTML Cards (DOM)
        ↓
Display on Page
        ↓
User Interaction (Click, Like, etc.)
        ↓
Update LocalStorage
        ↓
Re-render Display
```

---

## 🎓 Key Concepts

### Array Methods Used

**map()** - Transform each item
```javascript
const titles = sermons.map(s => s.title);
```

**filter()** - Keep only matching items
```javascript
const available = talents.filter(t => t.availability === 'Available');
```

**find()** - Get first matching item
```javascript
const sermon = sermons.find(s => s.id === 123);
```

**forEach()** - Do something for each item
```javascript
sermons.forEach(s => console.log(s.title));
```

**sort()** - Arrange items
```javascript
sermons.sort((a, b) => new Date(b.date) - new Date(a.date));
```

### Destructuring - Unpacking Objects
```javascript
// Spread operator - combine objects
const newSermon = {
    id: Date.now(),
    timestamp: Date.now(),
    ...sermon  // All properties from sermon
};

// Destructuring - extract properties
const { title, pastor, date } = sermon;
```

### Template Literals - String Interpolation
```javascript
const name = "John";
const age = 30;

// Old way
const message = "Hello " + name + ", you are " + age;

// New way (template literal)
const message = `Hello ${name}, you are ${age}`;
```

---

## 💡 Common Patterns

### Pattern 1: Get or Empty Array
```javascript
const data = JSON.parse(localStorage.getItem('key')) || [];
```

### Pattern 2: Check and Update
```javascript
const item = data.find(item => item.id === id);
if (item) {
    item.property = newValue;
    localStorage.setItem('key', JSON.stringify(data));
}
```

### Pattern 3: Remove from Array
```javascript
const filtered = data.filter(item => item.id !== idToRemove);
localStorage.setItem('key', JSON.stringify(filtered));
```

### Pattern 4: Get Unique Values
```javascript
const unique = [...new Set(data.map(item => item.category))];
```

---

## 🧪 Testing in Browser Console

You can test functions directly in the browser console (F12):

```javascript
// Get all sermons
SermonStorage.getAll()

// Create and save a sermon
SermonStorage.save({
    pastorName: "Test Pastor",
    title: "Test Sermon",
    date: "2024-01-15",
    mediaUrl: "https://example.com/test.mp3",
    description: "This is a test"
})

// Delete a sermon
SermonStorage.delete(1234567890)

// Format a date
formatDate("2024-01-15")

// Get time ago
getTimeAgo(Date.now() - 3600000)  // 1 hour ago

// Clear all data
localStorage.clear()
```

---

**Ready to build with backend?** Replace all `SermonStorage.save()` calls with `fetch()` API calls, and you're ready to scale!
