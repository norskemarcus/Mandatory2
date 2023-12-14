<!-- wrapper component around WishCard. It imports WishCard and uses it within its own structure, potentially adding or altering certain aspects of how a wish is presented. -->

<script>
  import WishCard from './WishCard.svelte';
  import placeholderImage from '../../assets/placeholder_image.png';

  export let wish;
  export let userRole;
  export let onSelect = () => {};
  export let selectedChild = null;
  export let onSave = () => {};

  export let handleToggleWish = () => {}; //  default function = optional prop
</script>

<article class="wish-set-card">
  <WishCard {wish} {userRole} {onSelect} {onSave} {selectedChild} {handleToggleWish}>
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

  .wish-image {
    max-height: 100%;
    max-width: 100%;
    object-fit: cover; /* Cover the container without distorting the image */
  }

  .placeholder-image {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
