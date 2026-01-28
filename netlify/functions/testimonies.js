/**
 * Netlify Function: Testimonies API
 * Handles GET and POST requests for testimonies
 * 
 * This function provides:
 * - GET: Retrieve all testimonies
 * - POST: Create a new testimony
 */

const fs = require('fs');
const path = require('path');

// In-memory storage (loaded from file on each invocation)
let testimoniesData = [];
const DATA_FILE = path.join(process.env.NETLIFY_BUILD_DIR || '/tmp', 'testimonies.json');

/**
 * Load testimonies from file into memory
 */
function loadTestimonies() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            testimoniesData = JSON.parse(data) || [];
        } else {
            testimoniesData = [];
        }
    } catch (error) {
        console.error('Error loading testimonies:', error);
        testimoniesData = [];
    }
}

/**
 * Get all testimonies from memory
 */
function getTestimonies() {
    return testimoniesData;
}

/**
 * Save testimonies to memory and file
 */
function saveTestimonies(testimonies) {
    try {
        testimoniesData = testimonies;
        // Try to persist to file
        try {
            const dir = path.dirname(DATA_FILE);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(DATA_FILE, JSON.stringify(testimonies, null, 2));
        } catch (fileError) {
            console.warn('File persistence unavailable:', fileError.message);
        }
        return true;
    } catch (error) {
        console.error('Error saving testimonies:', error);
        return false;
    }
}

/**
 * Main handler function
 */
exports.handler = async (event, context) => {
    // Load testimonies at start of invocation
    loadTestimonies();
    
    // Enable CORS
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: 'OK'
        };
    }

    try {
        // GET: Retrieve all testimonies
        if (event.httpMethod === 'GET') {
            const testimonies = getTestimonies();
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    data: testimonies,
                    count: testimonies.length
                })
            };
        }

        // POST: Create a new testimony
        if (event.httpMethod === 'POST') {
            const body = JSON.parse(event.body || '{}');
            
            // Validate required fields
            if (!body.title || !body.message) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        success: false,
                        error: 'Title and message are required'
                    })
                };
            }

            // Get existing testimonies
            const testimonies = getTestimonies();

            // Create new testimony object
            const newTestimony = {
                id: Date.now(),
                timestamp: Date.now(),
                name: body.name || 'Anonymous',
                title: body.title.trim(),
                message: body.message.trim(),
                likes: 0,
                liked: false
            };

            // Add to array
            testimonies.push(newTestimony);

            // Save testimonies
            const success = saveTestimonies(testimonies);

            if (!success) {
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({
                        success: false,
                        error: 'Failed to save testimony'
                    })
                };
            }

            return {
                statusCode: 201,
                headers,
                body: JSON.stringify({
                    success: true,
                    data: newTestimony,
                    message: 'Testimony saved successfully'
                })
            };
        }

        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Method not allowed'
            })
        };

    } catch (error) {
        console.error('Handler error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Internal server error'
            })
        };
    }
};
