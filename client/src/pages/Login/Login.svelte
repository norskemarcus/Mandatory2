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

<!-- form on:submit={handleSubmit} -->
<form action="/login" method="POST">
  <label for="name">Your name</label>
  <input id="name" name="name" placeholder="Your name" value="TestPerson" >

  <label for="email">Your email</label>
  <input id="email" type="email" name="email" placeholder="Your email" value="example@gmail.com">

  <button type="submit">Log in</button>
</form>
