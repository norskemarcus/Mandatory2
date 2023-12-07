export async function fetchSuggestions(handleResponseCallback) {
  try {
    const response = await fetch('/api/child/suggestions', { credentials: 'include' });
    if (!response.ok) {
      throw new Error('Error fetching suggestions');
    }
    const data = await response.json();
    // Handle the fetched suggestions
    // You can pass the handleResponseCallback here to handle child responses
    handleResponseCallback(data);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
  }
}
