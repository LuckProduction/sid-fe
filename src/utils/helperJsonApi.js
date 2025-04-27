async function helperJsonApi(url, jsonData, token) {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(jsonData)
    });

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export default helperJsonApi;
