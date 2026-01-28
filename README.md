# Solomon's Porch - Church Web Application

A modern, fully responsive church community web application built with vanilla HTML, CSS, and JavaScript. Features local data persistence using LocalStorage, eliminating the need for backend infrastructure.

## 🎯 Features Overview

### **Home Page**
- Welcome hero section with church branding
- Call-to-action buttons (View Sermons, Explore Talents)
- Latest sermons preview (3 most recent)
- Featured talents showcase (3 random available talents)
- Community info cards explaining church values
- Fully responsive design

### **About Page**
- Church history and mission statement
- Vision & mission cards
- Core values list
- Leadership team section with profiles
- Call-to-action to explore community

### **Sermons Page**
- Sermon submission form:
  - Pastor's name
  - Sermon title
  - Sermon date
  - Audio/video link (optional)
  - Description
- Sermon display as cards with:
  - Pastor name and sermon title
  - Sermon date
  - Audio player modal
  - Delete option
- Filtering by pastor
- Sorting options (newest, oldest, title A-Z)
- Full LocalStorage persistence

### **Talents Marketplace Page**
- Skill posting form:
  - Full name
  - Skill/talent type
  - Description
  - Contact (email or phone)
  - Availability status
- Talent display cards showing:
  - Skill name and person's name
  - Description
  - Availability badge
  - Contact button
- Search by skill name
- Filter by availability status
- Contact modal with copy-to-clipboard functionality
- Full LocalStorage persistence

### **Testimonies Page**
- Testimony submission form:
  - Name (optional - defaults to "Anonymous")
  - Testimony title
  - Message
- Testimony display cards with:
  - Title and author
  - Message content
  - Posted time (relative)
  - Like button with counter
  - Delete option
- Sorting options:
  - Newest first
  - Oldest first
  - Most liked
- Like/unlike functionality
- Full LocalStorage persistence

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server or backend required!

### Installation

1. **Download the project files:**
   - Ensure all files are in the correct folder structure

2. **Folder Structure:**
   ```
   solomon-porch/
   ├── index.html
   ├── about.html
   ├── sermons.html
   ├── talents.html
   ├── testimonials.html
   ├── css/
   │   └── styles.css
   ├── js/
   │   ├── main.js
   │   ├── sermons.js
   │   ├── talents.js
   │   └── testimonials.js
   └── README.md
   ```

3. **Open in browser:**
   - Simply open `index.html` in your web browser
   - Or use a local server (recommended for best experience):
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx http-server
     ```

## 🎨 Design System

### Color Palette
- **Primary:** #2c3e50 (Deep Navy Blue)
- **Secondary:** #3498db (Soft Blue)
- **Accent:** #f39c12 (Gold)
- **Success:** #27ae60 (Soft Green)
- **Danger:** #e74c3c (Soft Red)
- **Light Background:** #f8f9fa
- **Text:** #2c3e50 (dark), #7f8c8d (light)

### Typography
- **Font Family:** Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Heading Sizes:** 2.5rem (H1) down to 1rem (base)
- **Line Height:** 1.6 for comfortable reading

### Spacing System
Uses consistent spacing scale:
- xs: 0.5rem
- sm: 1rem
- md: 1.5rem
- lg: 2rem
- xl: 3rem
- 2xl: 4rem

### Responsive Breakpoints
- **Desktop:** 1200px+ (full layout)
- **Tablet:** 769px - 1199px (adjusted spacing, single column forms)
- **Mobile:** 480px - 768px (stacked layout, adjusted fonts)
- **Small Mobile:** < 480px (minimal spacing, touch-optimized)

## 📋 Code Architecture

### JavaScript Modules

#### **main.js** - Shared Functionality
```javascript
// Dark Mode Management
- initDarkMode()          // Load saved theme preference
- enableDarkMode()        // Apply dark mode
- disableDarkMode()       // Apply light mode
- toggleDarkMode()        // Switch between modes

// Utilities
- updateActiveNav()       // Highlight current page in nav
- formatDate()           // Format dates to readable string
- getTimeAgo()           // Human-readable time difference
- closeModal()           // Close modal by ID
- openModal()            // Open modal by ID
- escapeHtml()           // Prevent XSS attacks
```

#### **sermons.js** - Sermon Management
```javascript
// SermonStorage Object
SermonStorage.getAll()    // Retrieve all sermons
SermonStorage.save()      // Add new sermon
SermonStorage.delete()    // Remove sermon by ID
SermonStorage.getPastors() // Get unique pastor names

// Page Functions
initSermonsPage()         // Initialize sermons page
displayLatestSermons()    // Show 3 latest on home page
```

**Sermon Data Structure:**
```javascript
{
  id: 1234567890,        // Timestamp-based unique ID
  timestamp: 1234567890, // Creation time
  pastorName: "Rev. Dr. Marcus Johnson",
  title: "Finding Purpose in Faith",
  date: "2024-01-15",
  mediaUrl: "https://example.com/sermon.mp3",
  description: "A powerful sermon about..."
}
```

#### **talents.js** - Talents Marketplace
```javascript
// TalentStorage Object
TalentStorage.getAll()    // Retrieve all talents
TalentStorage.save()      // Post new talent
TalentStorage.delete()    // Remove talent by ID
TalentStorage.getSkills() // Get unique skill names

// Page Functions
initTalentsPage()         // Initialize talents page
displayFeaturedTalents()  // Show 3 random available on home
```

**Talent Data Structure:**
```javascript
{
  id: 1234567890,
  timestamp: 1234567890,
  name: "John Smith",
  skill: "Web Developer",
  description: "Experienced in HTML, CSS, JavaScript...",
  contact: "john@email.com",
  availability: "Available" // or "Limited" or "Unavailable"
}
```

#### **testimonials.js** - Testimonies Management
```javascript
// TestimonyStorage Object
TestimonyStorage.getAll()   // Retrieve all testimonies
TestimonyStorage.save()     // Submit new testimony
TestimonyStorage.update()   // Modify testimony (likes, etc)
TestimonyStorage.delete()   // Remove testimony by ID
TestimonyStorage.getById()  // Get single testimony

// Page Functions
initTestimoniesPage()       // Initialize testimonies page
```

**Testimony Data Structure:**
```javascript
{
  id: 1234567890,
  timestamp: 1234567890,
  name: "Sarah Johnson",
  title: "How God Healed My Family",
  message: "This is my testimony...",
  likes: 5,
  liked: false             // User's like status
}
```

### LocalStorage Keys
```javascript
'darkMode'           // boolean - theme preference
'church_sermons'     // JSON array of sermon objects
'church_talents'     // JSON array of talent objects
'church_testimonies' // JSON array of testimony objects
```

## 🎯 Key Features Explained

### Dark Mode Toggle
- Located in top-right of navigation bar
- Preference saved to LocalStorage
- Applies to entire application
- Uses CSS custom properties for smooth transition

### Form Validation
- Required field validation
- Email and phone number validation for talents
- HTML5 input types for date picker
- User-friendly error messages

### Search & Filter
- **Sermons:** Filter by pastor, sort by date or title
- **Talents:** Real-time search by skill/name, filter by availability
- **Testimonies:** Sort by newest, oldest, or most liked

### Modal System
- Audio player modal for sermons
- Contact information modal for talents
- Escape key closes modals
- Click outside closes modals
- Smooth animations

### Accessibility Features
- Semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`)
- ARIA labels on buttons
- Readable font sizes and colors
- High contrast for better readability
- Keyboard navigation support

## 🔒 Data Security

### XSS Prevention
All user input is escaped using `escapeHtml()` function before display:
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
```

### Data Validation
- Client-side validation on all forms
- File size checks for media (in production)
- Phone number and email format validation

## 📱 Responsive Design Details

### Breakpoints
- **1200px+:** Full desktop layout with two-column forms
- **769px-1199px:** Tablet - adjusted spacing, responsive grids
- **480px-768px:** Mobile - stacked layout, single column
- **<480px:** Small mobile - minimal spacing, touch-optimized buttons

### Mobile Optimizations
- Touch-friendly button sizes (44px minimum)
- Flexible image sizing
- Stack navigation menu on smaller screens
- Adjusted padding and margins
- Readable font sizes (minimum 16px on mobile)

## 🚀 Future Enhancements

### Backend Integration
1. **Server Setup:**
   - Replace LocalStorage with API calls
   - Use MongoDB/PostgreSQL for data persistence
   - Implement authentication system

2. **API Endpoints Needed:**
   ```
   POST   /api/sermons      // Add sermon
   GET    /api/sermons      // Get all sermons
   DELETE /api/sermons/:id  // Delete sermon
   
   POST   /api/talents      // Add talent
   GET    /api/talents      // Get all talents
   DELETE /api/talents/:id  // Delete talent
   
   POST   /api/testimonies  // Add testimony
   GET    /api/testimonies  // Get all testimonies
   PUT    /api/testimonies/:id // Update testimony (likes)
   DELETE /api/testimonies/:id // Delete testimony
   ```

### Admin Features
- Admin dashboard for sermon approval
- Analytics (view counts, likes distribution)
- Spam filtering
- User authentication
- Email notifications for engagement

### Additional Features
- Sermon search full-text capability
- Sermon categories/tags
- Advanced talent filtering (skills, experience level)
- Testimony moderation queue
- Comment system on testimonies
- Social media sharing
- Email newsletter signup
- Event calendar

### Performance Optimization
- Pagination for large datasets
- Image lazy loading
- Service Worker for offline capability
- Compression and minification
- CDN for static assets

## 🐛 Troubleshooting

### Data Not Persisting
- Check if LocalStorage is enabled in browser
- Ensure cookies/storage is not being cleared
- Check browser console for errors

### Styling Issues
- Clear browser cache (Ctrl+Shift+Del or Cmd+Shift+Delete)
- Ensure all CSS file is loaded
- Check for browser compatibility

### Forms Not Submitting
- Verify required fields are filled
- Check browser console for JavaScript errors
- Ensure localStorage has available space

### Dark Mode Not Saving
- Check if LocalStorage is enabled
- Verify 'darkMode' key is being saved
- Clear LocalStorage and toggle dark mode again

## 📝 Best Practices Implemented

✅ **HTML5 Semantic Elements**
- `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- Proper heading hierarchy
- Form labels and fieldsets

✅ **CSS Best Practices**
- CSS custom properties for maintainability
- Mobile-first responsive design
- BEM-like naming conventions
- Organized with clear sections

✅ **JavaScript Best Practices**
- DRY (Don't Repeat Yourself) principle
- Separation of concerns (modular code)
- Event delegation where appropriate
- Consistent naming conventions
- Comprehensive comments and documentation

✅ **Accessibility**
- ARIA labels on interactive elements
- Semantic HTML structure
- Color contrast compliance
- Keyboard navigation support

✅ **Performance**
- Vanilla JavaScript (no framework overhead)
- Minimal CSS file size
- Efficient DOM queries
- Optimized animations

## 📄 License

This church web application is provided as-is for community use.

## 🙏 Credits

Built with care for Solomon's Porch Community Church.

---

**Need Help?** Check the browser console (F12) for error messages. All functions include detailed comments explaining their purpose and parameters.
