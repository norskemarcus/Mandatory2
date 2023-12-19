<script>
  import { FaHeart, FaTrash } from 'svelte-icons/fa';
  import { savedWishes } from '../../stores/savedWishesStore.js';
  import { user } from '../../stores/globalStore.js';

  export let wish;
  export let userRole;
  export let onSelect;
  export let onSave;
  export let selectedChild;
  export let handleToggleWish;
  let buttonClass = 'save-button';
  export let onDelete;
  let isSaved;

  savedWishes.subscribe(currentSet => {
    isSaved = currentSet.has(wish.id);
  });

  $: heartClass = isSaved ? 'saved' : '';

  function saveWish() {
    handleToggleWish(selectedChild.id, wish.id);
  }

  function handleDelete() {
    if (onDelete) {
      onDelete(wish);
    }
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
    {#if wish.price != null}
      <slot name="price">
        <span>{wish.price}</span>
      </slot>
    {/if}
  </div>

  <div class="button-container">
    {#if $user.role === 'Parent'}
      <button on:click={saveWish} class={buttonClass}>
        <FaHeart class={'heart-icon ' + heartClass} />
        {isSaved ? 'Unsave' : 'Save'}
      </button>
    {/if}
    {#if $user.role === 'Child'}
      <button on:click={handleDelete} class={buttonClass}>
        <FaTrash class="trash-icon" />
      </button>
    {/if}
  </div>
</article>

<style>
  .wish-set-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 200px;
    border: 1px solid #aaa;
    border-radius: 2px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
    padding: 1em;
    margin: 0.7em;

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
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: auto;
  }

  .trash-icon {
    height: 20px;
    color: grey;
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
    gap: 5px;
  }

  .saved {
    color: rgb(184, 117, 117);
  }

  :global(body.dark-mode) .wish-set-card {
    color: #cac4c4;
    border-color: #555;
    background-color: #333;
  }
</style>
