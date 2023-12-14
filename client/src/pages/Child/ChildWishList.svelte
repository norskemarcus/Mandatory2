<script>
  import { onMount } from 'svelte';
  import WishSetCard from '../Wishes/WishSetCard.svelte';
  import { fetchUser } from '../../user/userApi.js';
  import { user } from '../../stores/globalStore.js';
  import { deleteWish } from '../../services/wishService.js';
  import { toast, Toaster } from 'svelte-french-toast';
  import 'iconify-icon';

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
      try {
        const response = await deleteWish(toBeDeleted.id);

        if (response) {
          wishes = wishes.filter(w => w.id !== toBeDeleted.id);
          wishes = [...wishes];
          toBeDeleted = null;
        } else {
          toast.error('Failed to delete wish');
        }
      } catch (error) {
        console.error('Delete wish error:', error);
        toast.error('An error occurred while deleting the wish');
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
            <button on:click={() => handleDelete(wish)} class="del-btn"> <iconify-icon icon="bi-x" style="color: red; font-size: 24px;"></iconify-icon></button>
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
<Toaster />

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

  .wish-item {
    position: relative;
    margin-bottom: 20px;
  }

  .wish-item button {
    width: auto;
    margin: 5px;
    padding: 5px 10px;
  }

  .buttons {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    opacity: 0.9;
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
    background-color: transparent;
    color: black;
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
    border-color: #444;
    color: #ddd;
  }
</style>
