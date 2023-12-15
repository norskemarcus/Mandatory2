<script>
  import { useNavigate, useLocation } from 'svelte-navigator';
  import { user } from './stores/globalStore.js';

  const navigate = useNavigate();
  const location = useLocation();

  $: if (!$user) {
    navigate('/login', {
      state: { from: $location.pathname },
      replace: true,
    });
  }
</script>

{#if $user}
  <slot />
{:else}
  <p>You must be logged in to access this page.</p>
{/if}
