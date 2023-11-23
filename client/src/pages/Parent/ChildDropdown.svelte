<script>
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let children = [];
  //export let selectedChild;
  export let selectedChild = null;

  onMount(async () => {
    await fetchChildren();
  });

  function handleChange() {
    console.log('Selected child:', selectedChild);
    dispatch('childSelected', selectedChild); // Emit the childSelected event with the selected child
  }

  async function fetchChildren() {
    try {
      const response = await fetch('http://localhost:8080/api/parent/family-children', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        children = data.children;

        if (children.length > 0) {
          selectedChild = children[0];
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
