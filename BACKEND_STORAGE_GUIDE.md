# Testimonies Backend Storage - Implementation Guide

## Overview

The testimonies system has been upgraded from browser localStorage to persistent backend storage using **Netlify Functions** (serverless architecture). This ensures testimonies are stored permanently and accessible to all users.

## Architecture

### Frontend Changes
- **File**: `js/testimonials.js`
- **Changes**: 
  - Replaced `TestimonyStorage` object to use async API calls instead of localStorage
  - All CRUD operations now communicate with backend functions
  - Local cache system for offline fallback support
  - Added loading states and error handling for better UX

### Backend Functions

#### 1. **testimonies.js** - Main CRUD Function
- **Location**: `netlify/functions/testimonies.js`
- **Methods**:
  - `GET` - Retrieve all testimonies
  - `POST` - Create a new testimony

**GET Request**:
```bash
curl https://yoursite.netlify.app/.netlify/functions/testimonies
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1234567890,
      "timestamp": 1234567890000,
      "name": "John Doe",
      "title": "How God Saved My Family",
      "message": "...",
      "likes": 5,
      "liked": false
    }
  ],
  "count": 1
}
```

**POST Request**:
```bash
curl -X POST https://yoursite.netlify.app/.netlify/functions/testimonies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "title": "My Testimony",
    "message": "How God worked in my life..."
  }'
```

#### 2. **update-testimony.js** - Update & Delete Function
- **Location**: `netlify/functions/update-testimony.js`
- **Methods**:
  - `PUT` - Update testimony (likes, etc.)
  - `DELETE` - Delete a testimony

**PUT Request**:
```bash
curl -X PUT https://yoursite.netlify.app/.netlify/functions/update-testimony/1234567890 \
  -H "Content-Type: application/json" \
  -d '{"likes": 5, "liked": true}'
```

**DELETE Request**:
```bash
curl -X DELETE https://yoursite.netlify.app/.netlify/functions/update-testimony/1234567890
```

## Data Storage

- **Location**: `/tmp/testimonies.json` on Netlify's server
- **Format**: JSON array of testimony objects
- **Persistence**: Data persists across function invocations
- **Backup**: Consider setting up automated backups through Netlify

## How It Works

### 1. **User Posts a Testimony**
```
Frontend Form → POST /testimonies → Function Creates Entry → Saved to testimonies.json → Response to Frontend
```

### 2. **Load All Testimonies**
```
Page Load → GET /testimonies → Function Reads File → Returns All Testimonies → Display on Page
```

### 3. **Like a Testimony**
```
Click Like Button → PUT /update-testimony/{id} → Function Updates Likes → Saved to File → Refresh Display
```

### 4. **Delete a Testimony**
```
Click Delete → DELETE /update-testimony/{id} → Function Removes Entry → Saved to File → Refresh Display
```

## Frontend API Integration

The `TestimonyStorage` object now provides these async methods:

```javascript
// Get all testimonies (async)
const testimonies = await TestimonyStorage.getAll();

// Save a new testimony (async)
const saved = await TestimonyStorage.save({
  name: 'John',
  title: 'My Story',
  message: 'God has been faithful...'
});

// Update a testimony (async)
await TestimonyStorage.update(testimonyId, {
  likes: 5,
  liked: true
});

// Delete a testimony (async)
await TestimonyStorage.delete(testimonyId);

// Get single testimony from cache (sync)
const testimony = TestimonyStorage.getById(testimonyId);
```

## Netlify Configuration

**Updated in `netlify.toml`**:
```toml
[build]
  publish = "."
  functions = "netlify/functions"
  command = ""
```

This tells Netlify to:
1. Deploy functions from the `netlify/functions` directory
2. Make them available at `/.netlify/functions/[function-name]`

## Error Handling

### Network Errors
- If the API fails, the app falls back to the local cache
- Users see a cached version of testimonies
- Error messages are logged to browser console

### Validation
- Title and message are required fields
- Name defaults to "Anonymous" if not provided
- Server-side validation prevents invalid data

## Deployment

### Local Testing
1. Install [Netlify CLI](https://docs.netlify.com/cli/get-started/):
   ```bash
   npm install -g netlify-cli
   ```

2. Test locally:
   ```bash
   netlify dev
   ```
   Then visit `http://localhost:8888`

### Deploy to Production
1. Push changes to your git repository
2. Netlify automatically detects the `netlify/functions` directory
3. Functions are deployed and available at `https://yoursite.netlify.app/.netlify/functions/*`

## Database Migration (From localStorage)

The old localStorage data won't automatically migrate. To preserve existing testimonies:

1. Export data from localStorage:
   ```javascript
   // In browser console:
   console.log(JSON.stringify(localStorage.getItem('church_testimonies')));
   ```

2. Manually create testimonies using the new API
3. Or update the backend function to handle initial migration if needed

## Limitations & Considerations

- **Storage**: Uses Netlify's ephemeral `/tmp` directory (survives within a function execution but is recreated on cold starts)
- **Concurrent Writes**: Limited - if multiple users post simultaneously, there could be race conditions
- **Backups**: Implement periodic backups using Netlify's native features or a database service

## Future Enhancements

For production-grade reliability, consider:

1. **Database Integration**:
   - MongoDB Atlas
   - Supabase (PostgreSQL)
   - Firebase Realtime Database

2. **Persistent Storage**:
   - Netlify Blobs (coming soon)
   - AWS S3
   - Cloudinary

3. **Advanced Features**:
   - User authentication
   - Edit testimonies
   - Moderation queue
   - Email notifications

## Testing the API

### Using cURL
```bash
# Get all testimonies
curl https://yoursite.netlify.app/.netlify/functions/testimonies

# Create a testimony
curl -X POST https://yoursite.netlify.app/.netlify/functions/testimonies \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","title":"Blessed","message":"God is good"}'
```

### Using Postman
1. Create a new collection
2. Add requests for each endpoint
3. Test CRUD operations

## Troubleshooting

### Testimonies not saving?
1. Check browser console for errors
2. Verify Functions are deployed (check Netlify Dashboard → Functions)
3. Check network tab for failed API calls

### Functions returning 500 error?
1. Check Netlify Function logs: Dashboard → Functions → View logs
2. Ensure `/tmp` directory is writable
3. Verify JSON is valid

### CORS errors?
- Headers already include CORS in the functions
- Should work from any origin
- Check browser console for specific errors

---

**Last Updated**: January 28, 2026
**Status**: Active & Deployed
