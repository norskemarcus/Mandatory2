<script>
  import { navigate } from 'svelte-navigator';

  let childData = {
    username: '',
    password: '',
  };

  let consentGiven = false;

  function addChild() {
    if (!consentGiven) {
      alert('You must provide consent to create an account for your child.');
      return;
    }
    // Add logic to create the child account here
    // ...

    navigate('/parent-dashboard');
  }
</script>

<main>
  <h1>Add a child account</h1>
  <form on:submit|preventDefault={addChild}>
    <input type="text" bind:value={childData.username} placeholder="Username for the child" required />
    <input type="password" bind:value={childData.password} placeholder="Password" required />

    <label>
      <input type="checkbox" bind:checked={consentGiven} />
      I am the parent or legal guardian of the child and I give consent to create an account for them, in compliance with GDPR requirements.
    </label>
    <button type="submit" disabled={!consentGiven}>Make a child account</button>
  </form>
</main>

<p>
  We collect a username and password to create a secure, personalized account for your child. Usernames allow for privacy and safety online. The password helps keep the account secure. As a parent or guardian, you have full control over this account and can manage it according to our <a
    href="/privacy-policy">Privacy Policy</a
  >.
</p>

<style>
  main {
    max-width: 500px;
    margin: auto;
    padding: 1rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background: white;
  }

  h1 {
    text-align: center;
    color: #333;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  input[type='text'],
  input[type='password'],
  button {
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 1rem;
  }

  input[type='checkbox'] {
    margin-right: 0.5rem;
  }

  label {
    display: flex;
    align-items: center;
    font-size: 0.9rem;
  }

  button {
    background-color: #5cb85c;
    color: white;
    border: none;
    cursor: pointer;
    padding: 0.7rem;
    font-weight: bold;
    margin-top: 1rem;
  }

  button:disabled {
    background-color: #cccccc;
  }

  p {
    font-size: 0.9rem;
    line-height: 1.5;
    color: #666;
    max-width: 500px;
    margin: auto;
    margin-top: 1rem;
  }

  a {
    color: #007bff;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
</style>
