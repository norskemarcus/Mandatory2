export async function fetchSuggestions(id, answer, handleResponseCallback) {
  try {
    const response = await fetch('/api/child/suggestions', { credentials: 'include' });
    if (!response.ok) {
      throw new Error('Error fetching suggestions');
    }
    const data = await response.json();
    handleResponseCallback(id, answer, data);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
  }
}
