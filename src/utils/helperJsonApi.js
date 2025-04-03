async function helperJsonApi(url, jsonData) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonData)
    });

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export default helperJsonApi;
