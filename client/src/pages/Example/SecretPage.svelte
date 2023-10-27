<script>
  let message = "Hello, Svelte!";
</script>

<style>
  h1 {
    color: #333;
  }
</style>

<div>
  <h1>{message}</h1>
  <button on:click={() => message = "Hello, this is a secret page, just for logged in users!"}>Click me</button>
</div>