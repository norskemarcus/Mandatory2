export async function fetchUser() {
  try {
    const response = await fetch('http://localhost:8080/auth/check-login', {
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

export async function fetchParentByUsername(username) {
  try {
    const response = await fetch(`http://localhost:8080/api/get-parent-by-username/${username}`, {
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
