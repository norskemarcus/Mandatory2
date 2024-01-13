import { getBaseUrl } from '../services/baseUrlHelper.js';

const BASE_URL = getBaseUrl();

export async function deleteWish(wishId) {
  try {
    const response = await fetch(`${BASE_URL}/api/wishes/${wishId}`, {
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
