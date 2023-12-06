<!-- 
This component should only be responsible for displaying an individual wish. Since you are using slots, the parent component will determine the content of each slot.
-->
<script>
  import { FaHeart } from 'svelte-icons/fa';
  import { savedWishes } from '../../stores/savedWishesStore.js';

  export let wish;
  export let userRole;
  export let onSelect; // Prop for the function to call when the checkbox is changed
  export let onSave;
  export let selectedChild;
  export let handleToggleWish;
  let buttonClass = 'save-button';

  let isSaved;

  // Manual Subscription = Subscribe to changes in the saved wishes store, However, it's important to manually unsubscribe when the component is destroyed to prevent memory leaks. Svelte doesn't automatically clean up manual subscriptions!
  // savedWishes.subscribe(currentSet => {
  //   isSaved = currentSet.has(wish.id);
  // });

  // Reactive subscription to the store
  //$: isCurrentlySaved = $savedWishes;

  // Auto-subscribe to the store
  $: isSaved = $savedWishes.has(wish.id);

  // Reactive statement to update the heart class based on isSaved
  $: heartClass = isSaved ? 'saved' : '';

  function saveWish() {
    handleToggleWish(selectedChild.id, wish.id);
    console.log('WishCard is saved:', isSaved);
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

  <div class="button-container">
    {#if userRole === 'Parent'}
      <button on:click={saveWish} class={buttonClass}>
        <FaHeart class={'heart-icon ' + heartClass} />
        {isSaved ? 'Save' : 'Unsave'}
      </button>
    {/if}
  </div>
</article>

<style>
  .wish-set-card {
    display: flex;
    flex-direction: column;
    width: 200px;
    border: 1px solid #aaa;
    border-radius: 2px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
    padding: 1em;
    margin: 1em;
    transition:
      background-color 0.3s,
      border-color 0.3s,
      color 0.3s;
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

  .button-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .save-button {
    color: red;
    display: flex;
    align-items: center;
    background-color: transparent;
    border: none;
    cursor: pointer;
    outline: none;
    width: auto;
    height: 20px;
    padding: 0;
  }

  .heart-icon {
    margin-right: 0.5em;
  }

  .saved {
    color: rgb(184, 117, 117);
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
