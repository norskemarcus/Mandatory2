<script>
  import Child from './Child.svelte';

  let receivedMessage = '';

  function handleReceivedMessage(event) {
    receivedMessage = event.detail.text;
  }
</script>

<Child on:messageSent={handleReceivedMessage} />
<p>Received Message in Parent: {receivedMessage}</p>
