<script>
  import axios from 'axios';
  import { handleSubmit } from './contact.js';
  import toast, { Toaster } from 'svelte-french-toast';

  let name = '';
  let email = '';
  let subject = '';
  let message = '';

  async function submitForm() {
    if (!name || !email || !message) {
      toast.error('Please fill in name, mail and message');
    } else {
      try {
        const response = await fetch('http://localhost:8080/api/contact', {
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
      <textarea class="message" id="message" name="message" cols="100" rows="10" bind:value={message} placeholder="I wonder why..." />

      <div class="profile-buttons">
        <button type="submit">Send</button>
        <button>Cancel</button>
      </div>
    </form>
  </div>
  <Toaster />
</div>

<style>
  @import './contact.css';
</style>
