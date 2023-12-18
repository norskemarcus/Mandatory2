<script>
  import { onMount, createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  import { user } from '../../stores/globalStore.js';

  let children = [];
  export let selectedChild = null;

  onMount(async () => {
    if ($user && $user.role === 'Parent') {
      await fetchChildren();
    }
  });

  function handleChange() {
    dispatch('childSelected', selectedChild);
  }

  async function fetchChildren() {
    try {
      const response = await fetch('/api/parent/family-children', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        children = data.children;

        if (children.length > 0) {
          selectedChild = children[0];
          handleChange();
        }
      } else {
        console.error('Error fetching family children:', response.status);
      }
    } catch (error) {
      console.error('Fetch family children error:', error);
    }
  }
</script>

<label for="child-dropdown">Select Child: </label>
<select id="child-dropdown" bind:value={selectedChild} on:change={handleChange}>
  {#each children as child (child.id)}
    <option value={child}>{child.username}</option>
  {/each}
</select>

<style>
  #child-dropdown {
    max-width: 200 px;
  }
</style>
