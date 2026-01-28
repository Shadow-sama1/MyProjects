# Quick Start Guide - Solomon's Porch

## 🚀 Getting Started in 30 Seconds

### Option 1: Direct Browser Open (Simplest)
1. Open **`index.html`** directly in your web browser
2. That's it! Everything works from there.

### Option 2: Using a Local Server (Recommended)

#### Using Python (Most Computers Have This)
```bash
cd "path/to/Solomon's Porch Area"
python -m http.server 8000
# Then open http://localhost:8000 in your browser
```

#### Using Node.js
```bash
cd "path/to/Solomon's Porch Area"
npx http-server
# Then open the URL shown in terminal
```

#### Using VS Code Live Server Extension
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

---

## 📖 What Can You Do?

### 🏠 Home Page
- See latest sermons
- See featured talents
- Learn about church

### ✝️ About Page
- Read church history
- See leadership team
- Learn mission & vision

### 📖 Sermons Page
1. **Add a sermon:**
   - Enter pastor name
   - Enter sermon title
   - Pick sermon date
   - Add audio link (optional)
   - Write description
   - Click "Share Sermon"

2. **Listen to sermons:**
   - Click "▶️ Play Sermon" button
   - Audio player opens in modal

3. **Filter & Sort:**
   - Filter by pastor
   - Sort by newest/oldest/title
   - Clear filters

### 💼 Talents Marketplace
1. **Post your skill:**
   - Enter full name
   - Enter skill type
   - Write description
   - Add email or phone
   - Select availability
   - Click "Post My Skill"

2. **Find talents:**
   - Search by skill name
   - Filter by availability
   - Click "✉️ Contact" to see their info
   - Copy their contact with button

### 💬 Testimonies Page
1. **Share your story:**
   - Enter name (optional)
   - Write testimony title
   - Write your message
   - Click "Post Testimony"

2. **Engage:**
   - Click heart (❤️) to like
   - Sort by newest/oldest/most liked
   - Delete your own testimonies

---

## 🌙 Dark Mode

Click the **🌙** button in top-right corner to toggle dark mode.
Your preference is saved automatically!

---

## 💾 Where is Data Saved?

All data is saved in your **browser's LocalStorage**:
- No login needed
- No server needed
- No accounts required
- Data stays on YOUR computer

### Clearing Data (If Needed)
Open browser DevTools (F12) → Application → LocalStorage → Delete entries

---

## 🎨 Customizing Colors

To change church colors, edit [css/styles.css](css/styles.css):

```css
:root {
    --primary-color: #2c3e50;      /* Change me! */
    --secondary-color: #3498db;    /* Change me! */
    --accent-color: #f39c12;       /* Change me! */
    /* ... more colors ... */
}
```

Popular color schemes:
- **Traditional Blue & Gold:** `#1a3a52` & `#d4af37`
- **Modern Purple:** `#6c5ce7` & `#0984e3`
- **Warm Orange:** `#e17055` & `#fdcb6e`

---

## 📱 Works on All Devices

- ✅ Desktop computers
- ✅ Tablets
- ✅ Smartphones
- ✅ Landscape & portrait modes

---

## 🐛 Troubleshooting

### "Styles aren't loading"
- Make sure `css/styles.css` is in the right folder
- Clear browser cache (Ctrl+Shift+Delete)

### "Data disappeared"
- Check if LocalStorage was cleared
- Try accessing from same device/browser

### "Forms aren't working"
- Check browser console (F12)
- Ensure all required fields are filled

### "Audio won't play"
- Check if URL is correct
- Try different audio format
- Ensure file is publicly accessible

---

## 📚 File Structure Reference

```
Solomon's Porch Area/
├── 📄 index.html           ← Home page
├── 📄 about.html           ← About page
├── 📄 sermons.html         ← Sermons page
├── 📄 talents.html         ← Talents page
├── 📄 testimonials.html    ← Testimonies page
├── 📁 css/
│   └── 📄 styles.css       ← All styling
├── 📁 js/
│   ├── 📄 main.js          ← Shared functions
│   ├── 📄 sermons.js       ← Sermon logic
│   ├── 📄 talents.js       ← Talents logic
│   └── 📄 testimonials.js  ← Testimonies logic
└── 📄 README.md            ← Full documentation
```

---

## 🎓 Learning the Code

### Start Here:
1. **main.js** - Understand shared functions
2. **sermons.js** - See how data is stored & displayed
3. **talents.js** - Understand search & filter
4. **testimonials.js** - See like/unlike system

### Key Concepts:
- **LocalStorage:** Stores data in browser
- **JSON:** Format for storing objects
- **Event Listeners:** How forms are submitted
- **DOM Manipulation:** How content is updated

---

## 🚀 Future: Backend Integration

To add a real server later:
1. Replace `SermonStorage.save()` with `fetch('/api/sermons', ...)`
2. Replace `SermonStorage.getAll()` with API calls
3. Same for talents and testimonies

Example:
```javascript
// Current (LocalStorage)
SermonStorage.save(sermon);

// Future (Backend API)
fetch('/api/sermons', {
    method: 'POST',
    body: JSON.stringify(sermon)
});
```

---

## 💡 Tips

- **Backup data:** Export LocalStorage before clearing browser cache
- **Test on mobile:** Use browser DevTools (F12) device emulation
- **Share stories:** Encourage congregation to share testimonies!
- **Admin access:** Can be added later with authentication

---

**Questions?** Check the full [README.md](README.md) for detailed documentation!
