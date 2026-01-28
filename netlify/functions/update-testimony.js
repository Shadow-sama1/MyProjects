/**
 * Netlify Function: Update Testimony
 * Handles PUT requests to update likes and other testimony data
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = '/tmp';
const DATA_FILE = path.join(DATA_DIR, 'testimonies.json');

function ensureDataFile() {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        if (!fs.existsSync(DATA_FILE)) {
            fs.writeFileSync(DATA_FILE, JSON.stringify([]));
        }
    } catch (error) {
        console.error('Error ensuring data file:', error);
    }
}

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

exports.handler = async (event, context) => {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: 'OK'
        };
    }

    try {
        const pathParts = event.path.split('/');
        const testimonyId = pathParts[pathParts.length - 1];

        // PUT: Update testimony (likes)
        if (event.httpMethod === 'PUT') {
            if (!testimonyId || testimonyId === 'update') {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        success: false,
                        error: 'Testimony ID is required'
                    })
                };
            }

            const body = JSON.parse(event.body || '{}');
            const id = parseInt(testimonyId, 10);
            
            let testimonies = readTestimonies();
            const index = testimonies.findIndex(t => t.id === id);

            if (index === -1) {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({
                        success: false,
                        error: 'Testimony not found'
                    })
                };
            }

            // Update the testimony
            testimonies[index] = {
                ...testimonies[index],
                ...body
            };

            const success = writeTestimonies(testimonies);

            if (!success) {
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({
                        success: false,
                        error: 'Failed to update testimony'
                    })
                };
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    data: testimonies[index],
                    message: 'Testimony updated successfully'
                })
            };
        }

        // DELETE: Delete testimony
        if (event.httpMethod === 'DELETE') {
            if (!testimonyId || testimonyId === 'delete') {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        success: false,
                        error: 'Testimony ID is required'
                    })
                };
            }

            const id = parseInt(testimonyId, 10);
            let testimonies = readTestimonies();
            
            const index = testimonies.findIndex(t => t.id === id);
            if (index === -1) {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({
                        success: false,
                        error: 'Testimony not found'
                    })
                };
            }

            testimonies.splice(index, 1);
            const success = writeTestimonies(testimonies);

            if (!success) {
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({
                        success: false,
                        error: 'Failed to delete testimony'
                    })
                };
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'Testimony deleted successfully'
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
