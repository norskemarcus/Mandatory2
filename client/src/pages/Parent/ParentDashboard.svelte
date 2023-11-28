<script>
  import { onMount, afterUpdate } from 'svelte';
  import ChildDropdown from './ChildDropdown.svelte';
  import { fetchUser } from '../../user/userApi.js';
  import { user } from '../../store/stores.js';
  import io from 'socket.io-client/dist/socket.io.js';
  import WishSetCard from '../Wishes/WishSetCard.svelte';

  let savedWishes = [];
  let loggedIn = false;
  let userRole = '';
  let selectedChild = null;
  let authenticationChecked = false;

  // const socket = io('http://localhost:8080');

  // socket.on('parent-wish-added', data => {
  //   savedWishes = [...savedWishes, data];
  // });

  function toggleBoughtStatus(wish) {
    wish.bought = !wish.bought;
    console.log('Toggle bought status for:', wish);
    savedWishes = [...savedWishes];
  }

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
          savedWishes = responseData.wishlist;
          console.log(savedWishes);
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
    console.log('Child selected:', selectedChild);
    if (selectedChild) {
      fetchSavedWishes(selectedChild.id);
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
        <tr>
          <td>
            <a class={wish.bought ? 'bought' : ''} href={wish.url} target="_blank" rel="noopener noreferrer">
              {wish.title}
            </a>
          </td>
          <td>
            <button on:click={() => toggleBoughtStatus(wish)} class={wish.bought ? 'bought' : ''}>
              {wish.bought ? 'Bought' : 'Buy'}
            </button>
          </td>
        </tr>
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
