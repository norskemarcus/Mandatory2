<script>
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-navigator';
  import { user } from '../../stores/globalStore.js';

  let username = 'test1@test.com';
  let password = 'test1234';
  let message = '';

  onMount(() => {
    message = '';
  });

  async function handleSubmit() {
    try {
      const response = await fetch('/auth/signup', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password }),
      });

      const data = await response.json();
      if (response.ok) {
        message = data.message;
        user.set(data.user);

        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        console.error('Server error response:', data);
        message = 'Error: ' + data.message;
        user.set(null);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      message = 'Error: Something went wrong';
      user.set(null);
    }
  }
</script>

<main>
  <div class="form-container">
    <form on:submit|preventDefault={handleSubmit}>
      <label for="username">Username</label>
      <input required type="text" id="username" name="username" bind:value={username} />

      <label for="password">Password</label>
      <input required type="password" name="password" id="password" placeholder="Password" bind:value={password} />

      <button type="submit">Create account</button>
    </form>
  </div>

  {#if message}
    <div class="message">{message}</div>
  {/if}
</main>

<svelte:head>
  <title>Signup</title>
</svelte:head>

<style>
  label {
    font-weight: bold;
    display: block;
    margin-top: 10px;
  }

  input {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    color: var(--text-color);
    background-color: var(--input-bg-color);
    border-color: var(--input-border-color);
  }

  button {
    background-color: green;
    color: #fff;
    padding: 7px 20px;
    margin-top: 3em;
    border: none;
    cursor: pointer;
    border-radius: 5px;
  }

  .form-container {
    text-align: center;
  }

  .message {
    text-align: center;
    margin-top: 1em;
  }

  form {
    max-width: 15em;
    min-width: auto;
    margin: 0 auto;
  }

  :global(body.dark-mode) input {
    background-color: lightgrey;
    color: black;
  }
</style>
