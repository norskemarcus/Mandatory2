<script>
  import { onMount } from 'svelte';
  import { toast, Toaster } from 'svelte-french-toast';
  import LegoSetList from './LegoSetList.svelte';
  import AddLegoSet from './AddLegoSet.svelte';

  let showAddEditForm = false;
  let selectedLegoSet = null;

  function showAddForm() {
    selectedLegoSet = null;
    showAddEditForm = true;
  }

  function showEditForm(legoSet) {
    selectedLegoSet = legoSet;
    showAddEditForm = true;
  }

  function closeForm() {
    showAddEditForm = false;
  }

  function handleLegoSetAdded() {
    toast.success('Lego set added successfully');
    closeForm();
  }

  function handleLegoSetUpdated() {
    toast.success('Lego set updated successfully');
    closeForm();
  }

  function handleLegoSetDeleted() {
    toast.success('Lego set deleted successfully');
    closeForm();
  }
</script>

<div class="lego-sets-page">
  <h1>Lego Sets</h1>

  <button on:click={showAddForm}>Add Lego Set</button>

  <LegoSetList on:edit={showEditForm} />

  {#if showAddForm}
    <AddLegoSet {selectedLegoSet} on:added={handleLegoSetAdded} on:updated={handleLegoSetUpdated} on:close={closeForm} />
  {/if}

  <Toaster />
</div>

<style>
</style>
