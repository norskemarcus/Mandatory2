<script>
  import { onMount } from 'svelte';
  export let children = [];
  export let selectedChild;
  let childWishlist = null;

  onMount(getAllChildren);

  async function getAllChildren() {
    try {
      const response = await fetch('http://localhost:8080/api/parent/family-children', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        children = data.children;
        console.log(children);
        if (children.length > 0) {
          selectedChild = children[0];
          getChildWishlist();
        }
      } else {
        console.error('Error fetching family children:', response.status);
      }
    } catch (error) {
      console.error('Fetch family children error:', error);
    }
  }

  async function getChildWishlist() {
    if (!selectedChild) {
      return;
    }

    // /api/parent/child-wishlist/:childId'
    try {
      const response = await fetch(`http://localhost:8080/api/parent/child-wishlist/${selectedChild.id}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        console.error('Failed to fetch child wishlist:', response.status);
        return;
      }

      const data = await response.json();
      childWishlist = data.wishlist;

      console.log('Child Wishlist:', childWishlist);
    } catch (error) {
      console.error('Fetch child wishlist error:', error);
    }
  }
</script>

<label for="child-dropdown">Select Child: </label>
<select id="child-dropdown" bind:value={selectedChild} on:change={getChildWishlist}>
  {#each children as child (child.id)}
    <option value={child}>{child.username}</option>
  {/each}
</select>
