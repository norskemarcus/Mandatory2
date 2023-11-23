<!-- 
This component should only be responsible for displaying an individual wish. Since you are using slots, the parent component will determine the content of each slot.
-->
<script>
  export let wish;
  export let userRole;
  export let isSelected;
  export let onSelect; // Prop for the function to call when the checkbox is changed

  // This function will be called when a checkbox changes state
  function handleSelection(event) {
    const selected = event.target.checked;
    onSelect(wish.id, selected); // Call the onSelect function with the wish ID and the selected state
  }
</script>

<article class="wish-set-card">
  <h2>
    <slot name="title">
      <span class="missing-title">{wish.title}</span>
    </slot>
  </h2>
  <div class="wish-description">
    <slot name="description">
      <span class="missing-description" />
    </slot>
  </div>

  <div class="wish-image">
    <slot name="image">
      {#if wish.image_url}
        <a href={wish.url} target="_blank" rel="noopener noreferrer">
          <img src={wish.image_url} alt={wish.title} class="wish-image" />
        </a>
      {:else}
        <span class="placeholder-image">No Image Available</span>
      {/if}
    </slot>
  </div>

  <div class="wish-price">
    <slot name="price">
      <span class="missing-price" />
    </slot>
  </div>

  {#if userRole === 'Parent'}
    <label>
      <!--
      you use the on:change event on the checkbox to call the handleSelection function, which in turn calls the passed-in selectWish function with the wish ID and whether the wish is selected or not. -->
      <!-- <input type="checkbox" on:change={handleSelection} /> -->

      <input type="checkbox" bind:checked={isSelected} on:change={handleSelection} />
      Select for parent's list
    </label>
  {/if}
</article>

<style>
  .wish-set-card {
    width: 200px;
    border: 1px solid #aaa;
    border-radius: 2px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
    padding: 1em;
    margin: 1em;
    transition: background-color 0.3s, border-color 0.3s, color 0.3s;
  }

  h2 {
    padding: 0 0 0.2em 0;
    margin: 0 0 1em 0;
    border-bottom: 1px solid black;
    font-size: 1rem;
    transition: border-color 0.3s;
  }

  .wish-description,
  .wish-price {
    margin-bottom: 0.5em;
  }

  .missing-title,
  .missing-description,
  .missing-price {
    color: #999;
  }

  :global(body.dark-mode) h2 {
    border-color: #555;
  }

  :global(body.dark-mode) .missing-title,
  :global(body.dark-mode) .missing-description,
  :global(body.dark-mode) .missing-price {
    color: #666;
  }
  /* }
  :global(body.dark-mode) .lego-set-card {
    background-color: #333;
    border-color: #444;
    color: #ddd;
  }

  :global(body.dark-mode) h2 {
    border-color: #555;
  }

  :global(body.dark-mode) .lego-item-number::before,
  :global(body.dark-mode) .lego-age::before {
    color: #ccc;
  }

  :global(body.dark-mode) .missing-name,
  :global(body.dark-mode) .missing-item-number,
  :global(body.dark-mode) .missing-age {
    color: #666;
  } */
</style>
