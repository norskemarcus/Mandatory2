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

          savedWishes = responseData.wishlist.map(savedWish => ({
            ...savedWish,
            id: savedWish.wish_id,
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

  {#each savedWishes as wish (wish.id)}
    {#if wish.id !== undefined}
      <div class="wish-item">
        <a class={wish.bought ? 'bought' : ''} href={wish.url} target="_blank" rel="noopener noreferrer">
          {wish.title}
        </a>
        <button on:click={() => toggleBoughtStatus(wish, selectedChild.id)} class={wish.bought ? 'bought-button' : 'buy-button'}>
          {wish.bought ? 'Bought' : 'Buy'}
        </button>
      </div>
      <hr />
    {/if}
  {/each}

  <!-- <table>
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
            <td class="button-cell">
              <button on:click={() => toggleBoughtStatus(wish, selectedChild.id)} class={wish.bought ? 'bought' : ''}>
                {wish.bought ? 'Bought' : 'Buy'}
              </button>
            </td>
          </tr>
        {/if}
      {/each}
    </tbody>
  </table> -->

  {#if savedWishes.length === 0}
    <p>No wishes are saved for this child.</p>
  {/if}
</div>

<style>
  .parent-dashboard {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }

  .wish-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding: 0.2rem;
  }

  a {
    color: #007bff;
    text-decoration: none;
    flex-grow: 1;
  }

  a.bought,
  .bought-button {
    color: #888;
    text-decoration: line-through;
  }

  button {
    background-color: #5cb85c;
    color: white;
    border: none;
    padding: 8px 15px;
    width: 80px;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
  }

  .bought-button {
    background-color: #ccc;
  }

  hr {
    border: none;
    height: 1px;
    background-color: #ccc;
    margin: 10px 0;
  }

  @media (max-width: 768px) {
    .wish-item {
      flex-direction: column;
      align-items: flex-start;
    }

    button {
      margin-top: 5px;
    }
  }
  /* 
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    color: var(--text-color);
  }

  th,
  td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
    background-color: var(--table-bg-color);
  }

  .button-cell {
    text-align: center;
  }

  a {
    color: var(--link-color);
  }

  th {
    background-color: var(--table-header-bg-color);
  }

  button {
    background-color: rgb(89, 226, 89);
    padding: 10px 15px;
    width: 100px;
    height: 50px;
    text-align: center;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 20px;
  }

  a.bought {
    color: #888;
    text-decoration: line-through;
  }

  button.bought {
    background-color: #ccc;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    button {
      padding: 5px 10px;
      font-size: 0.8em;
      width: 70px;
      height: 40px;
    }
  } */
</style>
