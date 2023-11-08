<script>
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { createEventDispatcher } from 'svelte';

  // Create an event dispatcher, to pass a signal from Login to App.svelte, to inform at the user has logged out, and the message should be cleared
  const dispatch = createEventDispatcher();

  export let email = 'test1@test.com';
  export let password = 'test1234';
  export let message = '';

  // Create a writable store for user login state
  const user = writable();

  // ...and add it to the context for child components to access
  setContext('user', user);

  // async function handlePasswordReset() {
  //   try {
  //     const response = await fetch('http://localhost:8080/auth/reset-password', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ email }),
  //     });

  //     if (response.ok) {
  //       console.log('Password reset email sent successfully.');
  //     } else {
  //       console.error('Error sending password reset email:', response.status);
  //     }
  //   } catch (error) {
  //     console.error('Error sending password reset email:', error);
  //   }
  // }

  async function handleSubmit() {
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email: email, password: password }),
      });

      if (response.ok) {
        const data = await response.json();
        message = data.message;
        console.log('Data user uid in handleSubmit (Login.svelte)', data.user.uid);
        dispatch('logout');
        user.set(data.user); // Update the user store with the user's data
        window.location.href = '/';
      } else {
        message = 'Error: Something went wrong';
        user.set(null);
      }
    } catch (error) {
      console.error(error);
      message = 'Error: Something went wrong';
      user.set(null);
    }
  }
</script>

<main>
  <form on:submit|preventDefault={handleSubmit}>
    <label for="email">Your email</label>
    <input id="email" required type="email" name="email" placeholder="Your email" bind:value={email} />

    <label for="password">Password</label>
    <input id="password" required type="password" name="password" placeholder="Password" bind:value={password} />

    <div class="button-container">
      <button type="submit">Log in</button>
    </div>
    {#if message}
      <div>{message}</div>
    {/if}
  </form>
  <!-- <button on:click={handlePasswordReset} class="forgot-btn">Forgot password</button> -->
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
    background-color: #5f26a8;
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
    /* justify-content: space-between; */
    align-items: center;
  }

  .forgot-btn {
    background-color: #34303a;
    color: #fff;
  }
</style>
