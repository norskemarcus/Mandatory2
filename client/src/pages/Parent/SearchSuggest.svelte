<script>
  import { onMount } from 'svelte';
  import ChildDropdown from './ChildDropdown.svelte';
  import { fetchUser } from '../../user/userApi.js';
  import { user } from '../../stores/globalStore.js';
  import { toast } from 'svelte-french-toast';
  import socket from '../../sockets/socket.js';

  let loggedIn = false;
  let userRole = '';
  let selectedChild = null;
  let authenticationChecked = false;

  let searchQuery = '';
  let searchResults = [];
  let isLoading = false;

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

  function onChildSelected(event) {
    selectedChild = event.detail;
    console.log('selected child: ', selectedChild.username);
  }

  function suggestWishToChild(wish) {
    if (!selectedChild) {
      return;
    }
    socket.emit('suggest-wish', { childId: selectedChild.id, wish: wish });
  }

  async function performSearch() {
    searchResults = [];

    if (searchQuery.trim()) {
      isLoading = true;
      try {
        // This request is made to the Vite server, which will proxy it to Express
        const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) {
          throw new Error('Error fetching search results');
        }
        const data = await response.json();
        searchResults = data.items || [];
        isLoading = false;
      } catch (error) {
        toast.error('Failed to load search results');
        console.error('Search error:', error);
        isLoading = false;
      }
    } else {
      // TODO: WHY DOES THIS NOT WORK???
      toast.error('Please enter a search query');
    }
  }
</script>

<ChildDropdown bind:selectedChild on:childSelected={onChildSelected} />

<form on:submit|preventDefault={performSearch} class="search-form">
  <input type="text" bind:value={searchQuery} placeholder="Search for products" class="search-input" />
  <button type="submit" class="search-icon-button" aria-label="Search">
    <i class="fas fa-search search-icon" />
  </button>
</form>

<div class="search-results">
  {#each searchResults as item, index (item.cacheId || index)}
    <div class="search-result-card">
      <a href={item.link} target="_blank" class="search-result-link">
        {#if item.pagemap?.cse_image?.[0]?.src}
          <div class="search-result-image-container">
            <img src={item.pagemap.cse_image[0].src} alt={item.title} class="search-result-image" />
          </div>
        {:else}
          <div class="placeholder-image">No Image Available</div>
        {/if}
        <div class="search-result-details">
          <h2 class="search-result-title">{item.title}</h2>
          {#if item.pagemap?.offer?.[0]?.price}
            <p class="search-result-price">
              {item.pagemap.offer[0].pricecurrency}
              {item.pagemap.offer[0].price}
            </p>
          {/if}
        </div>
      </a>

      <button on:click={() => suggestWishToChild(item)} class="save-button"> Suggest </button>
    </div>
  {/each}
</div>

<svelte:head>
  <script async src="https://cse.google.com/cse.js?cx=433462c853ba94cc2"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
</svelte:head>

<style>
  .search-form {
    display: flex;
    align-items: center;
    background-color: #fff;
    padding: 0.5em 1em;
    border-radius: 24px;
    box-shadow: 0 1px 6px 0 rgba(32, 33, 36, 0.28);
    margin-top: 2rem;
  }

  .search-input {
    flex-grow: 1;
    border: none;
    padding: 0.5em;
    border-radius: 24px;
    outline: none;
  }

  .search-icon-button {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
  }

  .search-icon {
    color: #5f6368;
    font-size: 1.5em;
  }

  .search-icon-button:hover .search-icon {
    color: #202124;
  }

  .search-icon-button:disabled .search-icon {
    color: #5f6368;
  }
  .search-result-image {
    max-width: 100px;
    height: auto;
  }

  .search-results {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 2rem;
  }

  .search-result-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .search-result-link {
    text-decoration: none;
    color: inherit;
  }

  .search-result-image-container {
    text-align: center;
    background-color: #f7f7f7;
  }

  .search-result-image {
    max-width: 100%; /* Limit image width to not exceed the container */
    max-height: 150px;
    margin: auto;
    display: block;
  }

  .placeholder-image {
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f7f7f7;
  }

  .search-result-details {
    padding: 0.5rem;
  }

  .search-result-title {
    font-size: 1rem;
    margin: 0.5rem 0;
  }

  .search-result-price {
    font-weight: bold;
    margin: 0;
  }

  .save-button {
    background-color: green; /* example pink color */
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .save-button:hover {
    background-color: #0056b3;
  }

  .save-button i.fas.fa-heart {
    margin-right: 8px;
  }

  :global(body.dark-mode) .search-result-image-container {
    background-color: #000;
  }
</style>