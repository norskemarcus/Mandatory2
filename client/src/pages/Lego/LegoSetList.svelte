<script>
  //import { writable } from 'svelte/store';
  import { onMount } from 'svelte';
  import LegoSetCard from './LegoSetCard.svelte';
  // import { legoSets, setLegoSets } from '../../store/stores'; // Import the legoSets store

  let legoSets = [];
  //let legoSets = writable([]);
  // let legoSets = [{ itemNumber: 75978, name: 'Diagonalstræde', age: 16 }];

  let edit = false;
  export let deleteLegoSet = null;

  function handleEdit(legoSet) {
    edit = legoSet;
  }

  function handleDelete(legoSet) {
    deleteLegoSet = legoSet;
  }

  function handleConfirmDelete() {
    if (deleteLegoSet) {
      legoSets = legoSets.filter(lego => lego !== deleteLegoSet);
      deleteLegoSet = null;
    }
  }

  function toggleView() {
    edit = !edit;
  }

  async function fetchLegoSets() {
    try {
      const response = await fetch('http://localhost:8080/api/legosets', {
        credentials: 'include',
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();

          if (Array.isArray(data.legoSets)) {
            legoSets = data.legoSets;
          } else {
            console.error('Received data is not an array:', data);
          }
        } else {
          console.error('Received non-JSON response:', contentType);
        }
      } else {
        console.error('Error fetching Lego sets:', response.status);
      }
    } catch (error) {
      console.error('Lego sets fetch error:', error);
    }
  }

  onMount(() => {
    fetchLegoSets();
  });
</script>

<h3>My lego sets:</h3>

<!-- <ul>
  {#each legoSets as legoSet (legoSet.itemNumber)}
    <LegoSetCard {legoSet} />
  {/each}
</ul> -->

<div class="lego-set-container">
  <button on:click={toggleView} class="display-btn">
    {#if edit}
      Display Cards
    {:else}
      Display Edit/Delete Buttons
    {/if}
  </button>

  <div class="lego-set-list">
    {#each legoSets as legoSet (legoSet.id)}
      {#if !edit}
        <LegoSetCard {legoSet} />
      {:else}
        <div class="lego-set-item">
          <span>{legoSet.name}</span>
          <button on:click={() => handleEdit(legoSet)}>Edit</button>
          <button on:click={() => handleDelete(legoSet)}>Delete</button>
        </div>
      {/if}
    {/each}
  </div>

  {#if edit}
    <button on:click={handleConfirmDelete}>Confirm Delete</button>
  {/if}
</div>

<style>
  .lego-set-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .lego-set-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .lego-set-item {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    margin: 10px;
    flex: 1;
    position: relative;
  }

  .edit-buttons {
    display: flex;
    gap: 10px;
    position: absolute;
    bottom: 10px;
    right: 10px;
  }

  .lego-set-item button {
    width: 50%;
    margin-top: 10px;
  }

  .display-btn {
    width: 50%;
    align-items: center;
  }
</style>
