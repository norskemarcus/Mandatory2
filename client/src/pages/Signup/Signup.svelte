<script>
  let email = 'test1@test.com';
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
        body: JSON.stringify({ email: email, password: password }),
      });

      if (response.ok) {
        const data = await response.json();
        message = data.message;
        newUser = data.newUser;
      } else {
        const errorData = await response.json();
        console.error('Server error response:', errorData);

        if (errorData.errorMessage == 'auth/email-already-in-use') {
          message = 'A user with this email already exists';
        } else {
          message = 'Error: Something went wrong';
        }
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
      <label for="email">Email</label>
      <input required type="email" id="email" name="email" bind:value={email} />

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
    margin-top: 3em;
    border: none;
    cursor: pointer;
  }

  .form-container {
    text-align: center; /* Center the form content horizontally */
  }

  .message {
    text-align: center; /* Center the message content horizontally */
    margin-top: 1em; /* Add some space between the form and the message */
  }

  form {
    max-width: 15em;
    min-width: auto;
    margin: 0 auto;
  }
</style>
