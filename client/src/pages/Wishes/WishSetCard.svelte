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
