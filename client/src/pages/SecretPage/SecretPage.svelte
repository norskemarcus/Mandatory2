<script>
  // add export let user so that it can accept the user prop when you use it in your PrivateRoute.
  // export let user; // Define the user prop
  let message = 'Hello, Svelte!';
</script>

<div>
  <h1>{message}</h1>
  <button on:click={() => (message = 'Hello, this is a secret page, just for logged in users!')}>Click me</button>
</div>

<style>
  h1 {
    color: #333;
  }
</style>
