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

// Path to data file (stored in Netlify's persistent storage)
const DATA_DIR = '/tmp';
const DATA_FILE = path.join(DATA_DIR, 'testimonies.json');

/**
 * Ensure data directory exists and initialize data file if needed
 */
function ensureDataFile() {
    try {
        // Create directory if it doesn't exist
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }

        // Initialize testimonies file if it doesn't exist
        if (!fs.existsSync(DATA_FILE)) {
            fs.writeFileSync(DATA_FILE, JSON.stringify([]));
        }
    } catch (error) {
        console.error('Error ensuring data file:', error);
    }
}

/**
 * Read all testimonies from file
 */
function readTestimonies() {
    try {
        ensureDataFile();
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading testimonies:', error);
        return [];
    }
}

/**
 * Write testimonies to file
 */
function writeTestimonies(testimonies) {
    try {
        ensureDataFile();
        fs.writeFileSync(DATA_FILE, JSON.stringify(testimonies, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing testimonies:', error);
        return false;
    }
}

/**
 * Main handler function
 */
exports.handler = async (event, context) => {
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
            const testimonies = readTestimonies();
            
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

            // Read existing testimonies
            const testimonies = readTestimonies();

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

            // Write back to file
            const success = writeTestimonies(testimonies);

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
