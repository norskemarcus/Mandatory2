<script>
  import LegoSetCard from './LegoSetCard.svelte';

  export let legoSets;
</script>

<h3>Displays a list of Lego sets using data retrieved from the server.</h3>

<ul>
  {#each legoSets as legoSet (legoSet.id)}
    <LegoSetCard {legoSet} />
  {/each}
</ul>
