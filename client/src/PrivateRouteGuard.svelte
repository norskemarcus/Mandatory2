<script>
  import { user } from './stores/globalStore.js';
</script>

{#if $user}
  <slot />
{:else}
  <p>You must be logged in to access this page.</p>
{/if}
