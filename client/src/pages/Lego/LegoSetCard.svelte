<script>
  import LegoCard from './LegoCard.svelte';
  export let legoSet;
</script>

<!-- This component represents the individual card or details for a single Lego set. It's designed to display information about a single Lego set, including its name, item number, and age limit. You can think of it as a reusable component that takes a single Lego set as input and displays its details. -->

<LegoCard>
  <span slot="name">{legoSet.name}</span>

  <span slot="itemNumber">{legoSet.itemNumber}</span>

  <span slot="age">{legoSet.age}</span>
</LegoCard>
