<script>
  import { onMount } from 'svelte';
  import WishSetCard from './WishSetCard.svelte';
  import ChildDropdown from '../Parent/ChildDropdown.svelte';
  import { user, BASE_URL } from '../../stores/globalStore.js';
  import { savedWishes } from '../../stores/savedWishesStore.js';
  import { toast, Toaster } from 'svelte-french-toast';

  let wishes = [];
  let selectedChild = null;
  let children = [];
  let isLoading = true;

  $: userRole = $user ? $user.role : '';

  onMount(() => {
    if (children.length > 0) {
      selectedChild = children[0];
    }
  });

  $: if (selectedChild) {
    isLoading = true;
    fetchSavedWishes(selectedChild.id);
    fetchWishesForChild(selectedChild.id).then(() => {
      isLoading = false;
    });
  }

  async function fetchSavedWishes(childId) {
    try {
      const response = await fetch(`${$BASE_URL}/api/parent/saved-wishes/${childId}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const wishIds = new Set(data.wishlist.map(wish => wish.wish_id));
        savedWishes.set(wishIds);
      } else {
        console.error('Error fetching saved wishes:', response.status);
      }
    } catch (error) {
      console.error('Error fetching saved wishes:', error);
    }
  }

  async function handleChildSelected(event) {
    selectedChild = event.detail;
  }

  async function fetchWishesForChild(childId) {
    try {
      const endpoint = `${$BASE_URL}/api/parent/child-wishlist/${childId}`;

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
      toast.error('Failed to load saved wishes. Please try again.');
    }
  }

  function handleToggleWish(childId, wishId) {
    if ($savedWishes.has(wishId)) {
      unsaveWish(childId, wishId);
    } else {
      saveSelectedWish(childId, wishId);
    }
  }

  async function saveSelectedWish(childId, wishId) {
    try {
      const response = await fetch(`${$BASE_URL}/api/parent/saved-wishes/${childId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wishId }),
        credentials: 'include',
      });

      if (response.ok) {
        savedWishes.update(currentSet => {
          currentSet.add(wishId);

          return new Set(currentSet);
        });
      } else {
        console.error('An error occurred while saving a wish');
      }
    } catch (error) {
      console.error('An error occurred while saving a wish');
    }
  }

  async function unsaveWish(childId, wishId) {
    try {
      const response = await fetch(`${$BASE_URL}/api/parent/unsave-wish/${childId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wishId }),
        credentials: 'include',
      });

      if (response.ok) {
        savedWishes.update(currentSet => {
          currentSet.delete(wishId);

          return new Set(currentSet);
        });
      } else {
        console.error('An error occurred while un-saving a wish');
      }
    } catch (error) {
      console.error('An error occurred while un-saving a wish');
    }
  }
</script>

<div class="dropdown">
  <ChildDropdown bind:selectedChild on:childSelected={handleChildSelected} />
</div>
{#if !isLoading}
  <div class="wishlist">
    {#each wishes as wish (wish.id)}
      <WishSetCard {wish} {userRole} onSave={() => handleToggleWish(selectedChild.id, wish.id)} {selectedChild} {handleToggleWish} />
    {/each}
  </div>
{:else}
  <p>Loading...</p>
{/if}

<Toaster />

<svelte:head>
  <title>Childs Wishlist</title>
</svelte:head>

<style>
  .dropdown {
    width: 50%;
  }

  .wishlist {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
</style>
