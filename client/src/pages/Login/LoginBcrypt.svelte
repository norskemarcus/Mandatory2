<script>
  import { createEventDispatcher } from 'svelte';
  import { user, BASE_URL } from '../../stores/globalStore.js';
  import { useNavigate } from 'svelte-navigator';
  import socket from '../../sockets/socket.js';

  const navigate = useNavigate();
  const dispatch = createEventDispatcher();

  export let username = 'test1@test.com';
  export let password = 'test1234';
  export let message = '';

  async function login() {
    try {
      const response = await fetch(`${$BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        message = data.message;
        dispatch('login');
        user.set(data.user);

        if ($user && $user.id) {
          socket.emit('user-login', { userId: $user.id });
        }

        navigate('/');
      } else {
        message = data.message || 'Error: Something went wrong';
        user.set(null);
      }
    } catch (error) {
      console.error(error);
      message = error.message || 'Error: Something went wrong';
      user.set(null);
    }
  }
</script>

<main>
  <form on:submit|preventDefault={login}>
    <label for="username">Username</label>
    <input id="username" required type="username" name="username" placeholder="Your username" bind:value={username} />

    <label for="password">Password</label>
    <input id="password" required type="password" name="password" placeholder="Password" bind:value={password} autocomplete="new-password" />

    <div class="button-container">
      <button type="submit">Log in</button>
    </div>
    {#if message}
      <div>{message}</div>
    {/if}
  </form>
</main>

<svelte:head>
  <title>Login</title>
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
  }

  button {
    background-color: green;
    color: #fff;
    padding: 7px 20px;
    margin-top: 1em;
    border: none;
    cursor: pointer;
    margin-top: 3em;
    border-radius: 5px;
  }

  form {
    max-width: 15em;
    min-width: auto;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .button-container {
    align-items: center;
  }

  :global(body.dark-mode) input {
    background-color: lightgrey;
    color: black;
  }
</style>
