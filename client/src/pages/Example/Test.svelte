
<script>
  // JavaScript logic for the component
  let message = "Hello, Svelte!";
</script>

<style>
  /* CSS styles specific to this component */
  h1 {
    color: #333;
  }
</style>

<div>
  <!-- HTML structure for the component -->
  <h1>{message}</h1>
  <button on:click={() => message = "Hello, this is the svelte way!"}>Click me</button>
</div>