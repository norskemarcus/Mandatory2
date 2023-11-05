<script>
  import { createEventDispatcher } from 'svelte';

  let message = '';

  const dispatch = createEventDispatcher();

  function sendMessage() {
    dispatch('messageSent', { text: message });
  }
</script>

<input type="text" bind:value={message} />
<button on:click={sendMessage}>Send Message</button>
