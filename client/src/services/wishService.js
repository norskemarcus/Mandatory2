export async function deleteWish(wishId) {
  try {
    const response = await fetch(`http://localhost:8080/api/wishes/${wishId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      console.error('Error deleting wish:', response.status);
      return false;
    }

    console.log('Success deleting wish');
    return true;
  } catch (error) {
    console.error('Delete wish error:', error);
    return false;
  }
}
