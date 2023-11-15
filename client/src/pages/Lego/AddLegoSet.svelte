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
          credentials: 'include',
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

<svelte:head>
  <title>Add a lego set</title>
</svelte:head>

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
    transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s;
  }

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    transition: color 0.3s;
  }

  .small-input,
  input[type='text'],
  input[type='number'] {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    transition: background-color 0.3s, border-color 0.3s, color 0.3s;
  }

  input[type='text'] {
    width: 100%;
  }

  input[type='number'] {
    width: calc(50% - 20px);
    display: inline-block;
  }

  button {
    padding: 10px 20px;
    background-color: #0077cc;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: #0056aa;
  }

  .button-container {
    text-align: start;
  }

  :global(body.dark-mode) .lego-set-form {
    background-color: #333;
    border-color: #444;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
  }

  :global(body.dark-mode) label {
    color: #ddd;
  }

  :global(body.dark-mode) .small-input,
  :global(body.dark-mode) input[type='text'],
  :global(body.dark-mode) input[type='number'] {
    background-color: #444;
    border-color: #555;
    color: #ddd;
  }

  :global(body.dark-mode) button {
    background-color: #6c757d; /* Bootstrap's gray */
  }

  :global(body.dark-mode) button:hover {
    background-color: #5a6268; /* A darker shade of bootstrap's gray for hover */
  }
</style>
