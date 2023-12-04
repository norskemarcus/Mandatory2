<!-- 
  This component seems to be a wrapper for WishCard. It uses the wish prop and passes it down to WishCard. 

WishSetCard.svelte: This component should be responsible for displaying an individual wish and handling the selection of wishes. It should receive props from WishList.svelte for the wish, userRole, and isSelected properties.
-->
<script>
  import WishCard from './WishCard.svelte';
  export let wish;
  export let userRole;
  export let isSelected = false; // Prop for whether the wish is selected, false = optional prop
  export let onSelect = () => {};
  export let selectedChild = null;
  export let onSave = () => {};
</script>

<article class="wish-set-card">
  <WishCard {wish} {userRole} {isSelected} {onSelect} {onSave} {selectedChild}>
    <span slot="title">{wish.title}</span>
    <span slot="image">
      {#if wish.image_url}
        <a href={wish.url} target="_blank" rel="noopener noreferrer">
          <img src={wish.image_url} alt={wish.title} class="wish-image" />
        </a>
      {:else}
        <span class="placeholder-image">No Image Available</span>
      {/if}
    </span>
    <span slot="price">Price: {wish.currency} {wish.price}</span>
  </WishCard>
</article>

<style>
  .wish-image {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
  }
</style>
