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
    background-color:  #5f26a8;
    color: #fff;
    padding: 7px 20px;
    margin-top: 3em;
    border: none;
    cursor: pointer;
  }

  form {
    max-width: 15em;
    min-width: auto;
    margin: 0 auto;
  }
</style>

<script>
let email = "test1@test.com";
let password = "test1234";
let message = "";
let newUser = null;




async function handleSubmit(event) {

//   event.preventDefault(); // Prevent the default form submission behavior: By default, when you submit a form, the browser performs a full-page refresh or redirects to the URL specified in the action attribute of the <form> element.

//   const formData = new FormData();
//   formData.append('email', email);
//   formData.append('password', password);

  try {
    const response = await fetch('http://localhost:8080/auth/signup', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: email, password: password})
    });

    if (response.ok) {

      const data = await response.json();
      message = data.message;
      newUser = data.newUser;


    } else {
      message = 'Error: Something went wrong';
      newUser = null;
    }
  } catch (error) {
    console.error(error);
    message = 'Error: Something went wrong';
    newUser = null;
  }
};
</script>

<main>
<form on:submit|preventDefault={handleSubmit}>
  <label for="email">Email</label>
  <input required type="email" id="email" name="email" bind:value={email} />

  <label for="password">Password</label>
  <input required type="password" name="password" id="password" placeholder="Password" bind:value={password} />

  <button type="submit">Create account</button>
</form>

{#if message}
  <!-- <div>{message}</div> -->
{/if}

{#if newUser}
 <div>New user successfully registered</div>
{/if}
</main>
