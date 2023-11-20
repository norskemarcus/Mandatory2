<!-- 

ChildWishlist components. Each ChildWishlist component represents the wishlist of one child and includes the child's name and the list of wishes. -->

<!-- 
include options for finalizing the list, such as placing orders or sending notifications to children. -->

<!-- total sum?? -->

<!-- 
Real-Time Updates with WebSockets
Once you set up the WebSocket server, you will handle messages for:

New wish added by a child (child to parent update).
Wish selected by a parent (parent to parent update across devices).
Invitation accepted by a child (parent to child update). -->

<script>
  import { onMount } from 'svelte';
  let savedWishes = [];

  // Fetch saved wishes on mount
  onMount(async () => {
    try {
      const response = await fetch('/api/parent/saved-wishes');
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      savedWishes = await response.json();
    } catch (error) {
      console.error('Failed to fetch saved wishes:', error);
    }
  });

  async function updateSavedWishName(wishId, newName) {
    try {
      const response = await fetch(`/api/parent/saved-wishes/${wishId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // Update the local state to reflect the change
      const wish = savedWishes.find(w => w.id === wishId);
      if (wish) {
        wish.name = newName;
      }
    } catch (error) {
      console.error('Failed to update saved wish name:', error);
    }
  }
</script>

<div class="parent-dashboard">
  <h3>Your Saved Wishes</h3>
  <ul>
    {#each savedWishes as wish}
      <li>
        <span>{wish.name || 'Unnamed Wish list'}</span>
        <input type="text" placeholder="Enter a name for this wish" on:blur={e => updateSavedWishName(wish.id, e.target.value)} />
      </li>
    {/each}
  </ul>
</div>
