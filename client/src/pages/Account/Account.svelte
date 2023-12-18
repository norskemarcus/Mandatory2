<script>
  import { fetchParentUsername, fetchChildren, deleteChildAccount } from '../../user/userApi.js';
  import { user } from '../../stores/globalStore.js';
  import { navigate } from 'svelte-navigator';
  import { onMount } from 'svelte';

  let loggedIn = false;
  let userRole = '';
  let parentUsername = '';
  let children = [];

  $: {
    if ($user) {
      userRole = $user.role;
      loggedIn = true;
      if (userRole === 'Parent') {
        fetchChildrenData();
      } else if (userRole === 'Child') {
        fetchParentData();
      }
    }
  }

  async function fetchChildrenData() {
    try {
      const fetchedChildren = await fetchChildren();
      if (fetchedChildren) {
        children = fetchedChildren;
      }
    } catch (error) {
      console.error('Error fetching children:', error);
    }
  }

  async function fetchParentData() {
    try {
      parentUsername = await fetchParentUsername($user.parent_id);
    } catch (error) {
      console.error('Error fetching parent data:', error);
    }
  }

  async function handleDeleteChild(childId) {
    const confirmDelete = confirm('Are you sure you want to delete this child account? This action cannot be undone.');
    if (confirmDelete) {
      try {
        await deleteChildAccount(childId);
        children = children.filter(child => child.id !== childId);
      } catch (error) {
        console.error('Error deleting child account:', error);
        alert('An error occurred while trying to delete the child account. Please try again.');
      }
    }
  }

  async function deleteUserAccount() {
    let confirmDeleteMessage = 'Are you sure you want to delete your account? This action cannot be undone.';
    if (userRole === 'Parent') {
      confirmDeleteMessage += " Deleting your account will affect your children's access to the app.";
    }

    const confirmDelete = confirm(confirmDeleteMessage);
    if (confirmDelete) {
      navigate('/');
      user.set(null);
    }
  }
</script>

<div class="account-container">
  <h1 class="account-header">Your Account</h1>
  <p class="account-info">Username: {$user.username}</p>
  <p class="account-info">Role: {userRole}</p>
  {#if userRole === 'Parent'}
    <ul class="children-list">
      {#each children as child}
        <li class="children-item">
          {child.username}
          <button class="delete-child-btn" on:click={() => handleDeleteChild(child.id)}>Delete Child</button>
        </li>
      {/each}
    </ul>
  {:else if userRole === 'Child'}
    <p class="account-info">Parent: {parentUsername}</p>
  {/if}
  <button class="delete-account-btn" on:click={deleteUserAccount}>Delete Account</button>
  {#if userRole === 'Parent'}
    <p class="warning-message">Deleting your account will affect your children's access to the app.</p>
  {/if}
</div>

<style>
  .account-container {
    max-width: 600px;
    margin: auto;
    padding: 20px;
    background: #f7f7f7;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .account-header {
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 20px;
    color: #333;
  }

  .account-info {
    font-size: 1.1rem;
    margin-bottom: 10px;
    color: #444;
  }

  .children-list,
  .children-item {
    list-style: none;
    padding: 0;
  }

  .children-item {
    background: #fff;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .delete-child-btn {
    background-color: #d60f23;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .delete-account-btn {
    background-color: #d60f23;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    display: block;
    width: 100%;
    font-size: 1rem;
    margin-top: 20px;
  }

  .delete-account-btn:hover {
    background-color: #d84251;
  }

  .warning-message {
    color: #d60f23;
    font-size: 0.9rem;
    margin-top: 10px;
  }

  :global(body.dark-mode) .account-container {
    background: #2a2b2d;
    color: #f7f7f7;
    box-shadow: 0 2px 4px rgba(255, 255, 255, 0.1);
  }

  :global(body.dark-mode) .account-header,
  :global(body.dark-mode) .account-info {
    color: #f7f7f7;
  }

  :global(body.dark-mode) .delete-child-btn,
  :global(body.dark-mode) .delete-account-btn {
    background-color: #a60f23;
    color: #fff;
  }

  :global(body.dark-mode) .children-item {
    background: #3b3c3e;
    border: 1px solid #444;
    color: #f7f7f7;
  }

  :global(body.dark-mode) .warning-message {
    color: #ffb3b3;
  }

  :global(body.dark-mode) .delete-account-btn:hover,
  :global(body.dark-mode) .delete-child-btn:hover {
    background-color: #d84251;
  }

  @media (max-width: 768px) {
    .account-container {
      padding: 10px;
    }

    .delete-account-btn {
      padding: 8px 15px;
    }
  }
</style>
