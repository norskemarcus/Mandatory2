export async function fetchSuggestions(childId) {
  try {
    const response = await fetch(`/api/child/suggestions/${childId}`, { credentials: 'include' });
    if (!response.ok) {
      throw new Error('Failed to fetch suggestions');
    }
    const data = await response.json();

    return data.suggestions;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    throw error;
  }
}

export async function handleSuggestionResponse(suggestionId, response) {
  console.log('suggestionId', suggestionId);

  try {
    const result = await fetch('/api/child/respond-to-suggestion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ suggestionId, response }),
      credentials: 'include',
    });

    const data = await result.json();
    return { ok: result.ok, message: data.message || data.error };
  } catch (error) {
    console.error('Failed to send suggestion response:', error);
    return { ok: false, message: 'Error processing suggestion response' };
  }
}
