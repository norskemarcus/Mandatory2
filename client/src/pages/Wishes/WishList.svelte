<!-- 
  This is the top-level parent component that fetches and lists all wishes, passing down the necessary props to WishSetCard.

  To access selectedChild within the WishSetCard.svelte component, you should pass it as a prop from the parent component, which is WishList.svelte.

WishList.svelte: This component is responsible for managing the wishlist, fetching wishes, and handling interactions like editing, deleting, and selecting wishes for a parent's list. It should pass down the necessary props to WishSetCard.svelte for displaying individual wishes.-->

<script>
  import { onMount } from 'svelte';
  import WishSetCard from './WishSetCard.svelte';
  import ChildDropdown from '../Parent/ChildDropdown.svelte';
  import { fetchUser } from '../../user/userApi.js';
  import { user } from '../../stores/stores.js';
  import io from 'socket.io-client/dist/socket.io.js';

  let wishes = [];
  let selectedWishes = new Set();
  let loggedIn = false;
  let userRole = '';
  let selectedChild = null;
  let authenticationChecked = false;
  let children = [];

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

  onMount(() => {
    if (children.length > 0) {
      fetchWishesForChild(children[0].id);
    }
    checkAuthentication();
  });

  function handleChildSelected(event) {
    const selectedChild = event.detail;

    fetchWishesForChild(selectedChild.id);
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

  function handleOnSave(childId, wishId, isSelected) {
    if (isSelected) {
      selectedWishes.add(wishId);
      saveSelectedWish(childId, wishId);
    } else {
      //TODO: Add code to handle un-saving the wish if needed
      console.log('Wish un-saved:', wishId);
      // selectedWishes.delete(wishId);
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
        console.log('Wishes saved successfully!');
      }

      const errorResponse = await response.json();

      if (errorResponse && errorResponse.error) {
        console.error(`Failed to save a wish: ${errorResponse.error}`);
      }
    } catch (error) {
      console.error('An error occurred while saving a wish');
    }
  }

  function selectWish() {
    console.log('What should be here in selectWish???');
  }
</script>

<div class="dropdown">
  <ChildDropdown bind:selectedChild on:childSelected={handleChildSelected} />
</div>

<div class="wishlist">
  {#each wishes as wish (wish.id)}
    <WishSetCard {wish} {userRole} isSelected={selectedWishes.has(wish.id)} onSave={handleOnSave} onSelect={selectWish} {selectedChild} />
  {/each}
</div>

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

  .wish-item {
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
  }
</style>
