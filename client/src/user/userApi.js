export async function fetchUser() {
  try {
    const response = await fetch('/auth/check-login', {
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      return data.user;
    } else {
      return null;
    }
  } catch (error) {
    console.error('User fetch error:', error);
    return null;
  }
}

export async function fetchParentUsername(parentId) {
  try {
    const response = await fetch(`/api/children/${parentId}`, {
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      return data.username;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Parent fetch error:', error);
    return null;
  }
}

export async function fetchChildren() {
  try {
    const response = await fetch(`/api/children`, {
      credentials: 'include',
    });

    if (response.ok) {
      const children = await response.json();
      return children;
    } else {
      console.error('Failed to fetch children', await response.text());
      return [];
    }
  } catch (error) {
    console.error('Error fetching children:', error);
    return [];
  }
}

export async function deleteChildAccount(childId) {
  try {
    const response = await fetch(`/api/children/${childId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.ok) {
      return true;
    } else {
      const errorResponse = await response.text();
      console.error('Failed to delete child account', errorResponse);
      return false;
    }
  } catch (error) {
    console.error('Error deleting child account:', error);
    return false;
  }
}

export async function deleteAccount() {
  try {
    const response = await fetch(`/api/users`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.ok) {
      return true;
    } else {
      const errorResponse = await response.text();
      console.error('Failed to delete the account', errorResponse);
      return false;
    }
  } catch (error) {
    console.error('Error deleting account:', error);
    return false;
  }
}
