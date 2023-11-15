<script>
  import { time } from '../../store/stores.js';

  const formatter = new Intl.DateTimeFormat('da-DK', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
</script>

<div class="d-flex">
  <div class="flex-grow-1 ms-3">
    <h3 class="mt-0">Are you ready to learn some svelte?</h3>

    <p>This is my little tutorial for understanding svelte and maybe you can learn some as well? Play around</p>
  </div>
  <div class="flex-shrink-0">
    <img src="#" alt="" width="" />
  </div>
</div>

<svelte:head>
  <title>Mandatory 2</title>
</svelte:head>

<style>
</style>
