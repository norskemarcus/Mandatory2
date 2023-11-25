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

  const socket = io('http://localhost:8080');

  socket.on('parent-wish-added', data => {
    savedWishes = [...savedWishes, data];
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
  <ul>
    {#if savedWishes.length > 0}
      <ul>
        {#each savedWishes as wish}
          <li>
            <a href={wish.url} target="_blank" rel="noopener noreferrer">
              {wish.title}
            </a>
          </li>
        {/each}
      </ul>
    {:else}
      <p>No wishes are saved for this child.</p>
    {/if}
  </ul>
</div>
