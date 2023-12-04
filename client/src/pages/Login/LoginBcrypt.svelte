<script>
  import { setContext } from 'svelte';
  // import { writable } from 'svelte/store';
  import { createEventDispatcher } from 'svelte';
  import { user } from '../../stores/stores.js';

  // Create an event dispatcher, to pass a signal from Login to App.svelte, to inform at the user has logged out, and the message should be cleared
  const dispatch = createEventDispatcher();

  export let username = 'test1@test.com';
  export let password = 'test1234';
  export let message = '';

  //const user = writable();
  // setContext('user', user);

  //setContext('currentUser', currentUser);

  async function login() {
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
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
        dispatch('logout');
        user.set(data.user);

        window.location.href = '/';
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
    <input id="password" required type="password" name="password" placeholder="Password" bind:value={password} />

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
</style>
