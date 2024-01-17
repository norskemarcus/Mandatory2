<!-- WishSetCard:
 * - Purpose: Initially, this component acted as a container for multiple WishCard components, 
 *   including additional functionalities like edit and delete buttons for each wish.
 * - Evolution: The design was modified to integrate the delete button directly within each WishCard for a cleaner UI.
 * - Current Role: While its initial role as a container with extra controls has diminished, 
 *   it still serves as a wrapper or aggregator for groups of wishes, particularly in different user contexts.
 *   -->
<script>
  import WishCard from './WishCard.svelte';
  import placeholderImage from '../../assets/placeholder_image.png';

  export let wish;
  export let userRole;
  export let onSelect = () => {};
  export let selectedChild = null;
  export let onSave = () => {};
  export let onDelete = () => {};
  export let handleToggleWish = () => {};
</script>

<article class="wish-set-card">
  <WishCard {wish} {userRole} {onSelect} {onSave} {selectedChild} {handleToggleWish} {onDelete}>
    <span slot="title">{wish.title}</span>
    <span slot="image">
      {#if wish.image_url}
        <div class="wish-image-container">
          <a href={wish.url} target="_blank" rel="noopener noreferrer">
            <img src={wish.image_url} alt={wish.title} class="wish-image" />
          </a>
        </div>
      {:else}
        <div class="wish-image-container">
          <img src={placeholderImage} alt="placeholder" class="placeholder-image" />
        </div>
      {/if}
    </span>

    <span slot="price">Price: {wish.price} </span>
  </WishCard>
</article>

<style>
  .wish-image-container {
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .wish-set-card {
    margin-bottom: 20px;
  }

  .wish-image {
    max-height: 100%;
    max-width: 100%;
    object-fit: cover;
  }

  .placeholder-image {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 768px) {
    .wish-image-container {
      height: 100px;
    }
  }
</style>
