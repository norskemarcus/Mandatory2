<script>
  import { onMount } from 'svelte';
  import { fetchUser } from '../../user/userApi.js';
  import { user } from '../../stores/globalStore.js';
  import { fetchParentByUsername } from '../../user/userApi.js';

  let loggedIn = false;
  let userRole = '';
  let authenticationChecked = false;
  let parentUsername = '';

  async function authenticateUser() {
    const fetchedUser = await fetchUser();
    if (fetchedUser) {
      user.set(fetchedUser);
      userRole = fetchedUser.role;
      loggedIn = true;
      return fetchedUser;
    }
    return null;
  }

  async function checkAuthentication() {
    if (!authenticationChecked) {
      const fetchedUser = await authenticateUser();
      if (fetchedUser && userRole === 'child') {
        parentUsername = await fetchParentUsername(fetchedUser.parent_id);
      }
      authenticationChecked = true;
    }
  }

  onMount(() => {
    checkAuthentication();
  });

  async function fetchParentUsername(parentId) {
    const parent = await fetchParentByUsername(parentId);
    if (parent) {
      return parent.username;
    }
    return '';
  }

  async function deleteUserAccount() {
    const confirmDelete = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmDelete) {
      try {
        const userId = $user.id;
        console.log('userId in frontend:', userId);

        const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          localStorage.clear();
          window.location.href = '/login';
        } else {
          alert('Error deleting account. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('An error occurred while trying to delete the account. Please try again.');
      }
    }
  }
</script>

<div>
  <h1>Your Account</h1>
  <p>Username: {$user.username}</p>
  <p>Role: {userRole}</p>
  {#if userRole === 'Parent'}
    <p>Number of children:</p>
    <!-- TODO: FIX THIS -->
  {:else if userRole === 'Child'}
    <!-- TODO: FIX THIS -->
    <p>Parent's Name:</p>
  {/if}
  <button on:click={deleteUserAccount}>Delete Account</button>
</div>
