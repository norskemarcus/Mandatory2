<script>
  import toast, { Toaster } from 'svelte-french-toast';
  import { BASE_URL } from '../../stores/globalStore.js';

  let name = '';
  let email = '';
  let subject = '';
  let message = '';

  async function submitForm() {
    if (!name || !email || !message) {
      toast.error('Please fill in name, mail and message');
    } else {
      try {
        const response = await fetch(`${$BASE_URL}/api/contacts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ name, email, subject, message }),
        });

        if (response.ok) {
          toast.success('Message sent successfully');
        } else {
          toast.error('Form submission failed. Try again later');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error('An error occurred while submitting the form');
      }
    }
  }
</script>

<div class="contact-container">
  <div class="contact-info-container">
    <form on:submit|preventDefault={submitForm} class="contact-form">
      <label for="name">Your name</label>
      <input id="name" name="name" placeholder="Your name" bind:value={name} />

      <label for="email">Email</label>
      <input id="email" type="email" name="email" bind:value={email} />

      <label for="subject">Subject</label>
      <input id="subject" type="subject" name="subject" bind:value={subject} />

      <label for="message">Message</label>
      <textarea class="message" id="message" name="message" cols="100" rows="10" bind:value={message} placeholder="Write your question here" />

      <div class="profile-buttons">
        <button type="submit">Send</button>
        <button>Cancel</button>
      </div>
    </form>
  </div>
  <Toaster />
</div>

<svelte:head>
  <title>Contact us</title>
</svelte:head>

<style>
  .contact-container {
    display: flex;
    max-width: 500px;
    margin: 0 auto;
  }

  .contact-info-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-grow: 1;
    padding: 2em;
  }

  label {
    font-weight: bold;
    margin-top: 10px;
  }

  input {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  button {
    background-color: #5f26a8;
    color: #fff;
    padding: 7px 10px;
    margin-top: 1em;
    border: none;
    cursor: pointer;
    border-radius: 5px;
  }

  .message {
    width: 100%;
    margin-top: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
  }

  :global(body.dark-mode) .contact-container {
    color: #ccc;
  }

  :global(body.dark-mode) input,
  :global(body.dark-mode) .message {
    background-color: #333;
    border-color: #555;
    color: #ddd;
  }

  :global(body.dark-mode) button {
    background-color: #444;
    color: #fff;
  }

  :global(body.dark-mode) button:hover {
    background-color: #555;
  }
</style>
