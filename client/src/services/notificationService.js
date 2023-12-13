export async function fetchNotifications(parentId) {
  try {
    const response = await fetch(`http://localhost:8080/notifications/${parentId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
}

export async function deleteNotification(notificationId) {
  try {
    const response = await fetch(`http://localhost:8080/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.ok) {
      return { message: 'Notification deleted successfully' };
    } else {
      const responseBody = await response.json();
      throw new Error(`Failed to delete notification: ${responseBody.error}`);
    }
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw new Error('Failed to delete notification');
  }
}
