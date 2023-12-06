<script>
  import { onMount } from 'svelte';
  import WishSetCard from '../Wishes/WishSetCard.svelte';
  import { fetchUser } from '../../user/userApi.js';
  import { user } from '../../stores/globalStore.js';

  let wishes = [];
  let editMode = false;
  let toBeDeleted = null;
  let dialogRef;
  let loggedIn = false;
  let userRole = '';
  let selectedWishId = null;

  onMount(async () => {
    const fetchedUser = await fetchUser();
    if (fetchedUser) {
      user.set(fetchedUser);
      userRole = fetchedUser.role;
      loggedIn = true;
      fetchWishes();
    }
  });

  function toggleEditMode() {
    editMode = !editMode;
  }

  function handleDelete(wish) {
    selectedWishId = wish.id;
    toBeDeleted = wish;
    dialogRef.showModal();
  }

  async function handleConfirmDelete() {
    if (toBeDeleted) {
      console.log('toBeDeleted in handleConfirmDelete:', toBeDeleted.id);
      try {
        const response = await fetch(`http://localhost:8080/api/wishes/${toBeDeleted.id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (response.ok) {
          console.log('success deleting wish');
          wishes = wishes.filter(w => w.id !== toBeDeleted.id);
          wishes = [...wishes];
          toBeDeleted = null;
        } else {
          console.error('Error deleting wish:', response.status);
        }
      } catch (error) {
        console.error('Delete wish error:', error);
      }
    }
    dialogRef.close();
  }

  async function fetchWishes() {
    try {
      const endpoint = 'http://localhost:8080/api/wishes';

      const response = await fetch(endpoint, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error fetching wishes: ' + response.status);
      }

      const data = await response.json();
      wishes = data.wishlist;
    } catch (error) {
      console.error('Wishes fetch error:', error);
    }
  }
</script>

<h3>My Wishlist:</h3>

<div class="wishlist-container">
  <button on:click={toggleEditMode} class="display-btn">
    {#if editMode}
      Display Cards
    {:else}
      Display Edit/Delete Buttons
    {/if}
  </button>

  <div class="wishlist">
    {#each wishes as wish (wish.id)}
      <div class="wish-item">
        <WishSetCard {wish} {userRole} />
        {#if editMode}
          <div class="buttons">
            <button on:click={() => handleDelete(wish)} class="del-btn">Delete</button>
          </div>
        {/if}
      </div>
    {/each}
  </div>

  {#if editMode}
    <dialog id="confirm-delete" bind:this={dialogRef}>
      <button on:click={handleConfirmDelete} class="del-btn">Confirm Delete</button>
    </dialog>
  {/if}
</div>

<svelte:head>
  <title>My Wishlist</title>
</svelte:head>

<style>
  .wishlist-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .wishlist {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .buttons {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 1em;
  }

  .wish-item button {
    width: auto;
    margin: 5px;
    padding: 5px 10px;
  }

  .display-btn {
    width: 50%;
    padding: 5px 10px;
    margin-bottom: 20px;
    background-color: #5f26a8;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
  }

  .del-btn {
    background-color: #d9534f;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
  }

  dialog {
    border-radius: 5px;
    padding: 20px;
    border: 1px solid #ccc;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
  }

  :global(body.dark-mode) .wish-item {
    background-color: #333;
    border-color: #444;
    color: #ddd;
  }
</style>
