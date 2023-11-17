<script>
  import WishCard from './WishCard.svelte';
  export let wish;
  // is how the wish prop is declared, making it possible for the parent component to pass the wish data to WishSetCard.
</script>

<WishCard {wish}>
  <span slot="title">{wish.title}</span>

  <span slot="description">{wish.description}</span>

  <span slot="price">Price: {wish.currency} {wish.price}</span>
</WishCard>

<!-- 
The WishSetCard.svelte and WishCard.svelte components are designed to work together using Svelte's slot functionality, which allows you to create a placeholder within a component (WishCard) that you can fill with custom content from a parent or wrapping component (WishSetCard).

WishSetCard.svelte is a wrapper component for WishCard. It receives a wish object as a prop and passes different properties of this wish object to the slots in the WishCard. The slots are named according to the properties of a wish item like name, itemNumber, and price.

 -->
