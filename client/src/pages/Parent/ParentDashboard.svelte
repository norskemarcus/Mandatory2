<script>
  import { onMount, afterUpdate } from 'svelte';
  import ChildDropdown from './ChildDropdown.svelte';
  import { fetchUser } from '../../user/userApi.js';
  import { user } from '../../store/stores.js';
  import io from 'socket.io-client/dist/socket.io.js';

  let savedWishes = [];
  let wishes = [];
  let editMode = false;
  let toBeDeleted = null;
  let dialogRef;
  let selectedWishes = new Set();
  let loggedIn = false;
  let userRole = '';
  let children = []; // skal findes begge steder, forklare dette
  let selectedChild = null;

  const socket = io('http://localhost:8080');

  // socket.on('parent-wish-added', data => {
  //   savedWishes = [...savedWishes, data];
  // });

  onMount(async () => {
    const fetchedUser = await fetchUser();
    if (fetchedUser) {
      user.set(fetchedUser);
      userRole = fetchedUser.role;
      loggedIn = true;
      //children = fetchedUser.children;
      fetchSavedWishes();
    }
  });

  afterUpdate(() => {
    // Fetch saved wishes whenever the selected child changes
    fetchSavedWishes();
  });

  async function fetchSavedWishes() {
    if (selectedChild) {
      try {
        const response = await fetch(`http://localhost:8080/api/parent/saved-wishes/${selectedChild.id}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        savedWishes = await response.json();
      } catch (error) {
        console.error('Failed to fetch saved wishes:', error);
      }
    }
  }
</script>

<div class="parent-dashboard">
  <h3>Your Saved Wishes</h3>

  <ChildDropdown {children} {selectedChild} />

  <!-- Display saved wishes for the selected child -->
  <ul>
    {#each savedWishes as wish}
      <li>
        <span>{wish.childUsername}</span>
      </li>
    {/each}
  </ul>
</div>
