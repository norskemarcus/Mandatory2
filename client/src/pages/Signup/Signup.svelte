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

<form action="http://localhost:8080/auth/signup" method="POST">
  <label for="email">Email</label>
  <input required type="email" id="email" name="email" value="test1@test.com"/>

  <label for="password">Password</label>
  <input required type="password" name="password" id="password" placeholder="Password" value="test1234"/>
  
  <button type="submit">Create account</button>
</form>


