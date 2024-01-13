<script>
  import ChildDropdown from './ChildDropdown.svelte';
  import { user, BASE_URL } from '../../stores/globalStore.js';
  let savedWishes = [];
  let selectedChild = null;

  async function fetchSavedWishes(childId) {
    if (childId && $user && $user.role === 'Parent') {
      try {
        const response = await fetch(`${$BASE_URL}/api/parent/saved-wishes/${childId}`, {
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
      const response = await fetch(`${$BASE_URL}/api/parent/saved-wishes/${childId}`, {
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

  {#if savedWishes.length === 0}
    <p>No wishes are saved for this child.</p>
  {/if}
</div>

<style>
  .parent-dashboard {
    max-width: 90%;
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
    color: black;
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

  :global(body.dark-mode) .parent-dashboard {
    background-color: #333;
    color: #ccc;
  }

  :global(body.dark-mode) a,
  :global(body.dark-mode) a.bought {
    color: #ccc;
  }

  :global(body.dark-mode) button,
  :global(body.dark-mode) .bought-button {
    background-color: #6c757d;
  }

  :global(body.dark-mode) hr {
    background-color: #ccc;
  }
</style>
