<script>
  import { navigate } from 'svelte-navigator';
  import { isDarkMode } from '../../stores/globalStore.js';
  import { toast, Toaster } from 'svelte-french-toast';
  import { Link } from 'svelte-navigator';

  let childUsername = '';
  let childPassword = '';
  let consentGiven = false;

  async function addChild() {
    if (!consentGiven) {
      alert('You must provide consent to create an account for your child.');
      return;
    }
    try {
      const response = await fetch('/auth/signup/child', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: childUsername,
          password: childPassword,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        navigate('/parentDashboard');
      } else {
        throw new Error('Server responded with an error');
      }
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to signup the child');
    }
  }
</script>

<main>
  <h2>Add a child account</h2>
  <form on:submit|preventDefault={addChild}>
    <input type="text" bind:value={childUsername} placeholder="Username for the child" required />
    <input type="password" bind:value={childPassword} placeholder="Password" required />

    <label class:dark-text={$isDarkMode}>
      <input type="checkbox" bind:checked={consentGiven} />
      I am the parent or legal guardian of the child and I give consent to create an account for them, in compliance with GDPR requirements.
    </label>
    <button type="submit" disabled={!consentGiven}>Make a child account</button>
  </form>
</main>

<p>
  We collect a username and password to create a secure, personalized account for your child. Usernames allow for privacy and safety online. The password helps keep the account secure. As a parent or guardian, you have full control over this account and can delete it whenever you want <Link
    to="/account">here</Link
  >
</p>

<Toaster />

<style>
  main {
    max-width: 500px;
    margin: auto;
    padding: 1rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background: var(--main-bg-color);
    color: var(--text-color);
  }

  h2 {
    text-align: center;
    color: var(--header-text-color);
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

  .dark-text {
    color: var(--dark-text-color);
  }

  :global(body.dark-mode) input[type='text'],
  :global(body.dark-mode) input[type='password'] {
    background-color: #444;
    color: #ccc;
    border-color: #555;
  }

  :global(body.dark-mode) label {
    color: #ccc;
  }

  :global(body.dark-mode) .dark-text {
    color: #ccc;
  }

  :global(body.dark-mode) button {
    color: #fff;
  }

  :global(body.dark-mode) button:disabled {
    background-color: #555;
    color: #777;
  }
</style>
