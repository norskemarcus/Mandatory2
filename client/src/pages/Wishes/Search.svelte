<script>
  import { onMount } from 'svelte';
  import { toast, Toaster } from 'svelte-french-toast';

  let searchQuery = '';
  let searchResults = [];
  let isLoading = false;

  onMount(() => {
    // Any initialization if needed
  });

  async function performSearch() {
    searchResults = []; // Clear previous results

    if (searchQuery.trim()) {
      // fjerner mellemrum
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
      console.log('Please enter a search query');
      toast.error('Please enter a search query');
    }
  }
  async function saveToWishlist(item) {
    try {
      const response = await fetch('/api/wishes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: item.title,
          description: item.snippet,
          price: item.pagemap?.offer?.[0]?.price,
          url: item.link,
          // Attempt to extract the image URL
          imageUrl: item.pagemap?.cse_image?.[0]?.src || '',
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error saving to wishlist');
      }

      toast.success('Item saved to wishlist');
    } catch (error) {
      toast.error('Failed to save item to wishlist');
      console.error('Error saving item:', error);
    }
  }
</script>

<div>
  <input type="text" bind:value={searchQuery} placeholder="Search for products" />
  <button on:click={performSearch} disabled={isLoading}>Search</button>
</div>

<!-- add is loading when it works -->
<div>
  {#each searchResults as item, index (item.cacheId || index)}
    <div>
      <h2>{item.title}</h2>
      <p>{item.snippet}</p>
      {#if item.pagemap?.cse_image?.[0]?.src}
        <img src={item.pagemap.cse_image[0].src} alt={item.title} class="search-result-image" />
      {/if}
      <a href={item.link} target="_blank">View Item</a>
      <button on:click={() => saveToWishlist(item)}>Save to Wishlist</button>
    </div>
  {/each}
</div>

<svelte:head>
  <script async src="https://cse.google.com/cse.js?cx=433462c853ba94cc2"></script>
</svelte:head>

<style>
  .search-result-image {
    max-width: 100px;
    height: auto;
  }
</style>
