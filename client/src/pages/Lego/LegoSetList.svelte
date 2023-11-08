<script>
  //import { writable } from 'svelte/store';
  import { onMount } from 'svelte';
  import LegoSetCard from './LegoSetCard.svelte';
  import { fetchUser } from '../../user/userApi.js';
  import { user } from '../../store/stores.js';

  // import { legoSets, setLegoSets } from '../../store/stores'; // Import the legoSets store
  // let user = null;
  let legoSets = [];
  let edit = false;
  // export let deleteLegoSet = null;
  let toBeDeleted = null;
  //let legoSets = writable([]);

  function handleEdit(legoSet) {
    edit = legoSet;
  }

  function handleDelete(legoSet) {
    toBeDeleted = legoSet; // Set the Lego set to be deleted
  }

  async function handleConfirmDelete() {
    if (toBeDeleted) {
      try {
        const response = await fetch(`http://localhost:8080/api/legosets/${toBeDeleted.itemNumber}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (response.ok) {
          legoSets = legoSets.filter(lego => lego !== toBeDeleted);
          toBeDeleted = null;
        } else {
          console.error('Error deleting Lego set:', response.status);
        }
      } catch (error) {
        console.error('Delete Lego set error:', error);
      }
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

      if (!response.ok) {
        throw new Error('Error fetching Lego sets: ' + response.status);
      }
      const data = await response.json();
      legoSets = data.legoSets;
      console.log(legoSets);
    } catch (error) {
      console.error('Lego sets fetch error:', error);
    }
  }

  onMount(async () => {
    const fetchedUser = await fetchUser();
    if (fetchedUser) {
      user.set(fetchedUser); // Update the user store with the fetched user data
      fetchLegoSets();
    }
  });
</script>

<h3>My lego sets:</h3>

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
          <!-- <span>{legoSet.name}</span> -->
          <LegoSetCard {legoSet} />
          <div class="buttons">
            <button on:click={() => handleEdit(legoSet)} id="edit-btn">Edit</button>
            <button on:click={() => handleDelete(legoSet)} class="del-btn">Delete</button>
          </div>
        </div>
      {/if}
    {/each}
  </div>

  {#if edit}
    <button on:click={handleConfirmDelete} class="del-btn">Confirm Delete</button>
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

  .buttons {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 1em;
  }

  .lego-set-item button {
    width: auto;
    margin: 5px;
    padding: 5px 10px;
  }

  .display-btn {
    width: 50%;
    align-items: center;
  }

  .del-btn {
    background-color: rgb(179, 86, 86);
  }

  #edit-btn {
    background-color: grey;
  }
</style>
