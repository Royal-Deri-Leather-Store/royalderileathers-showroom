// netlify/functions/verify-admin.js

export async function handler(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const authHeader = event.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ authenticated: false, error: 'Unauthorized: Missing token' })
      };
    }

    const token = authHeader.substring(7);
    const expectedPassword = process.env.ADMIN_PASSWORD || 'DeriPremiumSecure2026!';

    if (token === expectedPassword) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ authenticated: true })
      };
    } else {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ authenticated: false, error: 'Invalid credentials' })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message })
    };
  }
}
