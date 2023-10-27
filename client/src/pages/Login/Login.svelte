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
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .button-container {
    display: flex;
    justify-content: space-between;
    width: 100%; 
  }

  .signup-btn{
    background-color:  #34303a;
    color: #fff;
  }
</style>

<script>

  function navigateToSignup() {
    window.location.href = '/auth/signup';
  }
</script>

<form action="/auth/login" method="POST">

  <label for="email">Your email</label>
  <input id="email" required type="email"  name="email" placeholder="Your email" value="test@test.com">

  <label for="password">Password</label>
  <input id="password" required type="password" name="password" placeholder="Password" value="test1234" >

  <div class="button-container">
     <button type="submit">Log in</button>
  <button on:click={navigateToSignup} class="signup-btn">Signup</button>
  </div>
 
</form>

