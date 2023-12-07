<script>
  import { onMount } from 'svelte';
  import ChildDropdown from './ChildDropdown.svelte';
  import { fetchUser } from '../../user/userApi.js';
  import { user } from '../../stores/globalStore.js';

  let savedWishes = [];
  let loggedIn = false;
  let userRole = '';
  let selectedChild = null;
  let authenticationChecked = false;

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
    checkAuthentication();
  });

  async function fetchSavedWishes(childId) {
    if (childId) {
      try {
        const response = await fetch(`http://localhost:8080/api/parent/saved-wishes/${childId}`, {
          credentials: 'include',
        });
        if (response.ok) {
          const responseData = await response.json();

          savedWishes = responseData.wishlist.map((savedWish, index) => ({
            ...savedWish,
            id: `wish_${index}`, // Use a unique identifier
            bought: savedWish.bought,
            statusText: savedWish.bought ? 'Bought' : 'Buy',
          }));
        } else {
          console.error('Error fetching saved wishes:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch saved wishes:', error);
      }
    }
  }
  function handleChildSelected(event) {
    const selectedChild = event.detail;
    if (selectedChild) {
      fetchSavedWishes(selectedChild.id);
    }
  }

  async function toggleBoughtStatus(wish, childId) {
    let newBoughtStatus = !wish.bought;

    savedWishes = savedWishes.map(wishItem => {
      if (wishItem.id === wish.id) {
        return { ...wishItem, bought: newBoughtStatus, statusText: newBoughtStatus ? 'Bought' : 'Buy' };
      }
      return wishItem;
    });

    try {
      const response = await fetch(`http://localhost:8080/api/parent/saved-wishes/${childId}`, {
        method: 'PATCH',
        body: JSON.stringify({ wishId: wish.wish_id, bought: newBoughtStatus }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        console.error('Error updating saved wish status:', response.status);
      }
    } catch (error) {
      console.error('Failed to update saved wish status:', error);
    }
  }
</script>

<div class="parent-dashboard">
  <h3>Your Saved Wishes</h3>

  <ChildDropdown bind:selectedChild on:childSelected={handleChildSelected} />

  <table>
    <thead>
      <tr>
        <th>Wish</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {#each savedWishes as wish (wish.id)}
        {#if wish.id !== undefined}
          <tr>
            <td>
              <a class={wish.bought ? 'bought' : ''} href={wish.url} target="_blank" rel="noopener noreferrer">
                {wish.title}
              </a>
            </td>
            <td>
              <button on:click={() => toggleBoughtStatus(wish, selectedChild.id)} class={wish.bought ? 'bought' : ''}>
                {wish.bought ? 'Bought' : 'Buy'}
              </button>
            </td>
          </tr>
        {/if}
      {/each}
    </tbody>
  </table>

  {#if savedWishes.length === 0}
    <p>No wishes are saved for this child.</p>
  {/if}
</div>

<style>
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  th,
  td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }

  a.bought {
    color: #888;
    text-decoration: line-through;
  }

  button.bought {
    background-color: #ccc;
    cursor: not-allowed;
  }
</style>
