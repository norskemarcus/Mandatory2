<!-- 
  This component seems to be a wrapper for WishCard. It uses the wish prop and passes it down to WishCard. -->

<script>
  import WishCard from './WishCard.svelte';
  export let wish;
  export let userRole;
  export let onSelect;
  // is how the wish prop is declared, making it possible for the parent component to pass the wish data to WishSetCard.

  function handleSelection(event) {
    const selected = event.target.checked;
    onSelect(wish.id, selected);
  }
</script>

<!-- WishSetCard then passes the selectWish function down to WishCard. -->
<WishCard {wish} {userRole} {onSelect}>
  <span slot="title">{wish.title}</span>
  <span slot="price">Price: {wish.currency} {wish.price}</span>
</WishCard>
