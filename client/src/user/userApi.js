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
