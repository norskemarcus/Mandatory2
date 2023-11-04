<script>
  import { onMount } from 'svelte';
  import { toast, Toaster } from 'svelte-french-toast';

  let itemNumber = '';
  let name = '';
  let age = '';

  async function addLegoSet() {
    if (!itemNumber || !name || !age) {
      toast.error('Please fill in item number, name, and age');
    } else {
      try {
        const response = await fetch('http://localhost:8080/api/legosets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ itemNumber, name, age }),
        });

        if (response.ok) {
          toast.success('Lego set added successfully');
          console.log('Lego set added successfully');
        } else {
          toast.error('Failed to add Lego set');
          console.log('Failed to add Lego set');
        }
      } catch (error) {
        console.error('Error adding Lego set:', error);
        toast.error('An error occurred while adding the Lego set');
      }
    }
  }

  onMount(() => {
    itemNumber = '';
    name = '';
    age = '';
  });
</script>

<div class="lego-set-form">
  <form on:submit={addLegoSet}>
    <label for="name">Name:</label>
    <input type="text" id="name" bind:value={name} class="small-input" />

    <label for="itemNumber">Item Number:</label>
    <input type="number" id="itemNumber" bind:value={itemNumber} class="small-input" />

    <label for="age">Age Limit:</label>
    <input type="number" id="age" bind:value={age} class="small-input" />

    <div class="button-container">
      <button type="submit">Add Lego Set</button>
    </div>
  </form>
  <Toaster />
</div>

<style>
  .lego-set-form {
    min-width: 50%;
    max-width: 80%;
    margin: 0 auto;
    padding: 20px;
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  .small-input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  input[type='text'] {
    width: 80%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    min-width: 50px;
  }

  input[type='number'] {
    width: 50%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  button {
    padding: 10px 20px;
    background-color: #0077cc;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056aa;
  }

  .button-container {
    text-align: start;
  }
</style>
