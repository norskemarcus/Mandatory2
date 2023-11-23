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

  afterUpdate(() => {
    if (selectedChild) {
      fetchSavedWishes(selectedChild.id);
      console.log(selectedChild.id);
      console.log(selectedChild.username);
    }
  });

  async function fetchSavedWishes(childId) {
    if (childId) {
      try {
        const response = await fetch(`http://localhost:8080/api/parent/saved-wishes/${childId}`, {
          credentials: 'include',
        });
        if (response.ok) {
          savedWishes = await response.json();
          console.log(savedWishes);
        } else {
          console.error('Error fetching saved wishes:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch saved wishes:', error);
      }
    }
  }
</script>

<div class="parent-dashboard">
  <h3>Your Saved Wishes</h3>

  <ChildDropdown bind:selectedChild />

  <ul>
    {#if savedWishes.length > 0}
      {#each savedWishes as wish}
        <li>{wish.title}</li>
      {/each}
    {:else}
      <p>No wishes are saved for this child.</p>
    {/if}
  </ul>
</div>
