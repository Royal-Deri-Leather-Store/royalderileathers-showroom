// netlify/functions/update-catalog.js

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
    // 1. Verify Admin Credentials
    const authHeader = event.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized: Missing token' })
      };
    }

    const token = authHeader.substring(7);
    const expectedPassword = process.env.ADMIN_PASSWORD || 'DeriPremiumSecure2026!';

    if (token !== expectedPassword) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized: Invalid credentials' })
      };
    }

    // 2. Parse Request Body
    const data = JSON.parse(event.body);
    const { action, product, productId } = data;

    if (!action) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Bad Request: Missing action parameter' })
      };
    }

    // 3. Read GitHub Configs
    const pat = process.env.GITHUB_PAT;
    const repo = process.env.GITHUB_REPO; // e.g. "owner/repo"
    const branch = process.env.GITHUB_BRANCH || 'main';
    const filePath = 'src/products.json';

    if (!pat || !repo) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Configuration Error: GITHUB_PAT or GITHUB_REPO environment variables not set in Netlify dashboard.'
        })
      };
    }

    const getUrl = `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}`;

    // 4. Fetch current file from GitHub Content API
    const getRes = await fetch(getUrl, {
      method: 'GET',
      headers: {
        'Authorization': `token ${pat}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Netlify-Function'
      }
    });

    if (!getRes.ok) {
      const errMsg = await getRes.text();
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Failed to retrieve products.json from GitHub repository.',
          details: errMsg
        })
      };
    }

    const getJson = await getRes.json();
    const fileSha = getJson.sha;
    
    // Decode base64 file content securely
    const base64Content = getJson.content.replace(/\s/g, '');
    const decodedText = Buffer.from(base64Content, 'base64').toString('utf-8');
    let productsList = JSON.parse(decodedText);

    // 5. Update catalog based on action
    let commitMessage = '';

    if (action === 'add') {
      if (!product) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing product details' }) };
      }
      productsList.push(product);
      commitMessage = `Admin CMS: Added product card '${product.name}'`;
    } 
    else if (action === 'edit') {
      if (!product) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing product details' }) };
      }
      const idx = productsList.findIndex(p => p.id === product.id);
      if (idx === -1) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Product not found in catalog' }) };
      }
      productsList[idx] = product;
      commitMessage = `Admin CMS: Updated product card '${product.name}'`;
    } 
    else if (action === 'delete') {
      if (!productId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing productId parameter' }) };
      }
      const originalLength = productsList.length;
      productsList = productsList.filter(p => p.id !== productId);
      if (productsList.length === originalLength) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Product not found to delete' }) };
      }
      commitMessage = `Admin CMS: Deleted product card ID '${productId}'`;
    } 
    else {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unsupported action type' }) };
    }

    // 6. Encode content to base64
    const updatedContentText = JSON.stringify(productsList, null, 2);
    const updatedBase64 = Buffer.from(updatedContentText, 'utf-8').toString('base64');

    // 7. Write changes back to GitHub Content API
    const putUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;
    const putBody = {
      message: commitMessage,
      content: updatedBase64,
      sha: fileSha,
      branch: branch
    };

    const putRes = await fetch(putUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${pat}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Netlify-Function'
      },
      body: JSON.stringify(putBody)
    });

    if (!putRes.ok) {
      const errMsg = await putRes.text();
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Failed to write updated products.json to GitHub repository.',
          details: errMsg
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Successfully committed changes to GitHub. Netlify is auto-deploying the updates.'
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message })
    };
  }
}
