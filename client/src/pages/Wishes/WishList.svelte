<script>
  import { onMount } from 'svelte';
  import WishSetCard from './WishSetCard.svelte';
  import ChildDropdown from '../Parent/ChildDropdown.svelte';
  import { fetchUser } from '../../user/userApi.js';
  import { user } from '../../stores/globalStore.js';
  import { savedWishes } from '../../stores/savedWishesStore.js';

  let wishes = [];
  let loggedIn = false;
  let userRole = '';
  let selectedChild = null;
  let authenticationChecked = false;
  let children = [];
  let isCurrentlySaved;

  let isLoading = true;

  savedWishes.subscribe(currentSet => {
    isCurrentlySaved = currentSet;
  });

  onMount(async () => {
    if (children.length > 0) {
      await fetchWishesForChild(children[0].id);
    }
    await checkAuthentication();

    isLoading = false;
  });

  async function checkAuthentication() {
    if (!authenticationChecked) {
      const fetchedUser = await fetchUser();
      if (fetchedUser) {
        user.set(fetchedUser);
        userRole = fetchedUser.role;
        loggedIn = true;
      }
      authenticationChecked = true;
    }
  }

  async function fetchSavedWishes(childId) {
    try {
      const response = await fetch(`http://localhost:8080/api/parent/saved-wishes/${childId}`, {
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
    isLoading = true;
    await fetchSavedWishes(selectedChild.id);
    await fetchWishesForChild(selectedChild.id);
    isLoading = false;
  }

  async function fetchWishesForChild(childId) {
    try {
      const endpoint = `http://localhost:8080/api/parent/child-wishlist/${childId}`;

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

  // function handleToggleWish(childId, wishId) {
  //   if (isCurrentlySaved.has(wishId)) {
  //     unsaveWish(childId, wishId);
  //   } else {
  //     saveSelectedWish(childId, wishId);
  //   }
  // }

  function handleToggleWish(childId, wishId) {
    if ($savedWishes.has(wishId)) {
      console.log('unsave handle');
      unsaveWish(childId, wishId);
    } else {
      console.log('save handle');
      saveSelectedWish(childId, wishId);
    }
  }

  async function saveSelectedWish(childId, wishId) {
    try {
      const response = await fetch(`http://localhost:8080/api/parent/saved-wishes/${childId}`, {
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
        // Handle error response
      }
    } catch (error) {
      console.error('An error occurred while saving a wish');
    }
  }

  async function unsaveWish(childId, wishId) {
    try {
      const response = await fetch(`http://localhost:8080/api/parent/unsave-wish/${childId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wishId }),
        credentials: 'include',
      });

      console.log('savedWishes outside', savedWishes);

      if (response.ok) {
        savedWishes.update(currentSet => {
          console.log('currentSet:', currentSet);
          currentSet.delete(wishId);
          console.log('currentSet after delete:', currentSet);

          console.log('savedWishes after update in unsaveWish:', isCurrentlySaved);
          return new Set(currentSet);
        });
      } else {
        // Handle error response
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

<svelte:head>
  <title>My Wishlist</title>
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

  /* .wish-item {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    margin: 10px;
    position: relative;
    width: 200px;
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

  .save-btn {
    padding: 5px 10px;
    margin-bottom: 20px;
    background-color: #28a745;
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

  #edit-btn {
    background-color: #5bc0de;
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
  } */
</style>
