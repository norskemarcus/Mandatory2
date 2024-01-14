export async function deleteWish(wishId) {
  try {
    const response = await fetch(`/api/wishes/${wishId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      console.error('Error deleting wish:', response.status);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete wish error:', error);
    return false;
  }
}
