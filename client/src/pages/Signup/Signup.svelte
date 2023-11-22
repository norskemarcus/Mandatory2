<script>
  let username = 'test1@test.com';
  let password = 'test1234';
  let message = '';
  let newUser = null;

  async function handleSubmit(event) {
    try {
      const response = await fetch('http://localhost:8080/auth/signup', {
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
        newUser = data.user;
      } else {
        console.error('Server error response:', data);
        message = 'Error: ' + data.message;
        newUser = null;
      }
    } catch (error) {
      console.error('Fetch error:', error);
      message = 'Error: Something went wrong';
      newUser = null;
    }
  }
</script>

<!-- preventDefault = shortcut for preventing the default form submission behavior, without having to explicitly call event.preventDefault(); -->
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

  {#if newUser}
    <div class="message">New user successfully registered</div>
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
  }

  button {
    background-color: green;
    color: #fff;
    padding: 7px 20px;
    margin-top: 3em;
    border: none;
    cursor: pointer;
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
</style>
