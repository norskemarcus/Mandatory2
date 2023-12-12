// export async function fetchSuggestions(id, answer, handleResponseCallback) {
//   try {
//     const response = await fetch('/api/child/suggestions', { credentials: 'include' });
//     if (!response.ok) {
//       throw new Error('Error fetching suggestions');
//     }
//     const data = await response.json();
//     handleResponseCallback(id, answer, data);
//   } catch (error) {
//     console.error('Error fetching suggestions:', error);
//   }
// }

export async function fetchSuggestions(childId) {
  console.log('childId:', childId);
  try {
    const response = await fetch('http://localhost:8080/api/child/suggestions', { credentials: 'include' });
    if (!response.ok) {
      throw new Error('Failed to fetch suggestions');
    }
    const data = await response.json();
    console.log('data:', data);
    return data.suggestions;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    throw error;
  }
}
