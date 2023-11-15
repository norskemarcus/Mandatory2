<script>
  import LegoCard from './LegoCard.svelte';
  export let legoSet;
</script>

<LegoCard>
  <span slot="name">{legoSet.name}</span>

  <span slot="itemNumber">{legoSet.itemNumber}</span>

  <span slot="age">{legoSet.age}</span>
</LegoCard>
