<script>
  import axios from 'axios';
  import { handleSubmit } from './contact.js';
  import toastr from 'toastr';
  import 'toastr/build/toastr.css';
  import toast, { Toaster } from 'svelte-french-toast';

  let name = '';
  let email = '';
  let subject = '';
  let message = '';

  // toastr.options = {
  //   closeButton: true,
  //   debug: false,
  //   newestOnTop: false,
  //   progressBar: false,
  //   positionClass: 'toast-top-center',
  //   preventDuplicates: false,
  //   onclick: null,
  //   showDuration: '1000',
  //   hideDuration: '1000',
  //   timeOut: '5000',
  //   extendedTimeOut: '1000',
  //   showEasing: 'swing',
  //   hideEasing: 'linear',
  //   showMethod: 'fadeIn',
  //   hideMethod: 'fadeOut',
  // };

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
  /* @import './contact.css'; */
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
  }

  button {
    background-color: #5f26a8;
    color: #fff;
    padding: 7px 10px;
    margin-top: 1em;
    border: none;
    cursor: pointer;
  }

  .message {
    width: 100%;
    margin-top: 10px;
  }
</style>
