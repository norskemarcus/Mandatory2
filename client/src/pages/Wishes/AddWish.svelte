<script>
  import { onMount } from 'svelte';
  import { toast, Toaster } from 'svelte-french-toast';
  import { BASE_URL } from '../../stores/globalStore.js';

  let title = '';
  let description = '';
  let price = '';
  let url = '';

  async function addWishForm() {
    if (!title) {
      toast.error('Please fill in at least a title.');
    } else {
      try {
        const response = await fetch(`${$BASE_URL}/api/wishes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, description, price, url }),
          credentials: 'include',
        });

        if (response.ok) {
          toast.success('Wish added successfully');
        } else {
          const errorResponse = await response.json();
          if (errorResponse && errorResponse.error) {
            toast.error(`Failed to add a wish: ${errorResponse.error}`);
          } else {
            toast.error('Failed to add a wish');
          }
        }
      } catch (error) {
        toast.error('An error occurred while adding a wish');
      }
    }
  }

  onMount(() => {
    title = '';
    description = '';
    price = '';
    url = '';
  });
</script>

<div class="wish-set-form">
  <form on:submit|preventDefault={addWishForm}>
    <label for="title">Title:</label>
    <input type="text" id="title" bind:value={title} class="small-input" />

    <label for="description">Description:</label>
    <input type="text" id="description" bind:value={description} />

    <label for="price">Price</label>
    <input type="number" id="price" bind:value={price} class="small-input" />

    <label for="url">URL</label>
    <input type="link" id="url" bind:value={url} class="link" />

    <div class="button-container">
      <button type="submit">Add a wish</button>
    </div>
  </form>
</div>

<Toaster />

<svelte:head>
  <title>Add a wish</title>
</svelte:head>

<style>
  .wish-set-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 700px;
    margin: 20px auto;
    padding: 20px;
    background-color: #fff;
    color: #333;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  label {
    margin-top: 10px;
    margin-bottom: 5px;
    font-weight: bold;
    align-self: flex-start;
  }

  input,
  button {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  input {
    background-color: #f7f7f7;
    color: #333;
  }

  button {
    background-color: #0077cc;
    color: white;
    cursor: pointer;
    border: none;
  }

  button:hover {
    background-color: #0056aa;
  }

  :global(body.dark-mode) .wish-set-form {
    background-color: #333;
    color: #ccc;
    border-color: #555;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
  }

  :global(body.dark-mode) label {
    color: #ccc;
  }

  :global(body.dark-mode) input {
    background-color: #444;
    color: #ccc;
    border-color: #555;
  }

  :global(body.dark-mode) button {
    background-color: #0056aa;
    color: #fff;
  }

  :global(body.dark-mode) button:hover {
    background-color: #003f88;
  }
</style>
