
<style>
 @import './contact.css';
</style>

<script>
  import axios from 'axios';
  import { handleSubmit } from './contact.js'; 
  import toastr from 'toastr';
  import 'toastr/build/toastr.css';

  let name = '';
  let email = '';
  let message = '';

  
  async function submitForm() {
    if (!name || !email || !message) {
   
      toastr.info('Please fill in all fields');
    } else {
   
      await handleSubmit(name, email, message);
    }
  }

</script>

<div class="contact-container">
  <div class="contact-info-container">
    <form on:submit={() => handleSubmit(name, email, message)} class="contact-form" action="/api/submit" method="POST">
      <label for="name">Your name</label>
      <input id="name" name="name" placeholder="Your name" bind:value={name}> 
      

      <label for="email">Email</label>
      <input id="email" type="email" name="email" bind:value={email}>
      <!--value="example@gmail.com" -->

      <label for="message">Message</label>
      <textarea class="message" id="message" name="message" cols="100" rows="10" bind:value={message} placeholder="I wonder why..."></textarea>
      <!-- bind:value={message} -->

      <div class="profile-buttons">
        <button type="submit">Send</button>
        <button>Cancel</button>
      </div>
    </form>
  </div>
  

</div>
