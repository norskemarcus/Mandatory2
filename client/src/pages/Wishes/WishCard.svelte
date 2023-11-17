<!-- 
Inside the WishCard, the <span slot="name"> is where the wish's name is inserted into the WishCard's slot for the name. 
 
WishCard.svelte
This component represents the card layout of an individual wish. It defines the slots where the content provided by WishSetCard will be displayed.
-->
<script>
  export let wish;
</script>

<article class="wish-set-card">
  <h2>
    <slot name="title">
      <span class="missing-title" />
    </slot>
  </h2>

  <div class="wish-description">
    <slot name="description">
      <span class="missing-description" />
    </slot>
  </div>

  <div class="wish-price">
    <slot name="price">
      <span class="missing-price" />
    </slot>
  </div>

  <div class="wish-image">
    <slot name="image">
      {#if wish.image_url}
        <img src={wish.image_url} alt={wish.title} class="wish-image" />
      {:else}
        <span class="placeholder-image">No Image Available</span>
      {/if}
    </slot>
  </div>
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

  .wish-image {
    max-width: 100%;
  }
  /* .lego-item-number::before {
    content: '#';
    color: black;
    font-weight: bold;
    margin-right: 5px;
  }

  .lego-age::before {
    content: 'Years:';
    color: black;
    font-size: 1em;
    margin-right: 5px;
  } */

  /* .missing-name,
  .missing-item-number,
  .missing-age {
    color: #999;
  } */

  .wish-description,
  .wish-price {
    margin-bottom: 0.5em;
  }

  .missing-title,
  .missing-description,
  .missing-price {
    color: #999;
  }

  /* :global(body.dark-mode) .wish-card {
    background-color: #333;
    border-color: #444;
    color: #ddd;
  } */

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
