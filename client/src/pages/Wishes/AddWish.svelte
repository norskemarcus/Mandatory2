<script>
  import { onMount } from 'svelte';
  import { toast, Toaster } from 'svelte-french-toast';

  let title = '';
  let description = '';
  let price = '';
  let url = '';

  async function addWishForm() {
    if (!title) {
      toast.error('Please fill in at least a title.');
    } else {
      try {
        const response = await fetch('/api/form/wishes', {
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
    min-width: 50%;
    max-width: 80%;
    margin: 0 auto;
    padding: 20px;
    background-color: var(--form-bg-color);
    color: var(--text-color);
    border-color: var(--form-border-color);

    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    transition:
      background-color 0.3s,
      border-color 0.3s,
      box-shadow 0.3s;
  }

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    transition: color 0.3s;
  }

  input {
    color: var(--text-color);
    background-color: var(--input-bg-color);
    border-color: var(--input-border-color);
  }

  .small-input,
  input[type='text'],
  input[type='number'] {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    transition:
      background-color 0.3s,
      border-color 0.3s,
      color 0.3s;
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
    margin-top: 2rem;
  }

  button:hover {
    background-color: #0056aa;
  }

  .button-container {
    text-align: start;
  }

  :global(body.dark-mode) .wish-set-form {
    background-color: var(--form-bg-color);
    border-color: var(--form-border-color);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
  }

  :global(body.dark-mode) label {
    background-color: var(--label-bg-color);
  }

  :global(body.dark-mode) .small-input,
  :global(body.dark-mode) input[type='text'],
  :global(body.dark-mode) input[type='number'] {
    background-color: var(--input-bg-color);
    border-color: var(--input-border-color);
    color: var(--input-text-color);
  }

  :global(body.dark-mode) button {
    background-color: var(--button-bg-color);
  }

  :global(body.dark-mode) button:hover {
    background-color: var(--button-hover-bg-color);
  }
</style>
