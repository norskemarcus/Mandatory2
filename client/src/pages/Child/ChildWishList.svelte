<script>
  import WishSetCard from '../Wishes/WishSetCard.svelte';
  import { user } from '../../stores/globalStore.js';
  import { deleteWish } from '../../services/wishService.js';
  import { toast, Toaster } from 'svelte-french-toast';
  import 'iconify-icon';
  import { onMount } from 'svelte';

  let wishes = [];
  let toBeDeleted = null;
  let dialogRef;
  let userRole = '';
  let selectedWishId = null;

  onMount(async () => {
    if ($user) {
      await fetchWishes();
    }
  });

  function handleDelete(wish) {
    selectedWishId = wish.id;
    toBeDeleted = wish;
    dialogRef.showModal();
  }

  function handleDialogCancel() {
    dialogRef.close();
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
      const endpoint = '/api/wishes';

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
  <div class="wishlist">
    {#each wishes as wish (wish.id)}
      <WishSetCard {wish} {userRole} onDelete={handleDelete} />
    {/each}
  </div>

  <dialog id="confirm-delete" bind:this={dialogRef}>
    <div class="dialog-content">
      Are you sure you want to delete this wish?
      <button on:click={handleConfirmDelete} class="del-btn">Confirm Delete</button>
      <button on:click={handleDialogCancel} class="cancel-btn">Cancel</button>
    </div>
  </dialog>
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

  dialog {
    border-radius: 5px;
    padding: 20px;
    border: 1px solid #ccc;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
  }

  .del-btn {
    background-color: #d83e3e;
    border: none;
    padding: 10px 15px;
    margin-left: 10px;
    cursor: pointer;
    border-radius: 5px;
  }
  .cancel-btn {
    background-color: #ccc;
    border: none;
    padding: 10px 15px;
    margin-left: 10px;
    cursor: pointer;
    border-radius: 5px;
  }
</style>
