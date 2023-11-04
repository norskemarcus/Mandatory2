<script>
  import { onMount } from 'svelte';

  export let selectedLegoSet;

  let itemNumber = selectedLegoSet ? selectedLegoSet.itemNumber : '';
  let name = selectedLegoSet ? selectedLegoSet.name : '';
  let age = selectedLegoSet ? selectedLegoSet.age : '';

  function resetForm() {
    itemNumber = '';
    name = '';
    age = '';
  }

  function addLegoSet() {
    // Implement your logic to add a new Lego set
    const newLegoSet = {
      id: Date.now(), 
      itemNumber,
      name,
      age,
    };

    // Add the new Lego set to the list
    $legoSets = [...$legoSets, newLegoSet];
    resetForm();
  }

  function updateLegoSet() {
    // Implement your logic to update an existing Lego set
    if (selectedLegoSet) {
      selectedLegoSet.itemNumber = itemNumber;
      selectedLegoSet.name = name;
      selectedLegoSet.age = age;
    }

    // Reset the selected Lego set
    $selectedLegoSet = null;
    resetForm();
  }

  function closeForm() {
    resetForm();
    $selectedLego
