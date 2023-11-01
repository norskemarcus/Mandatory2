<script>
  export let when;
  export let user;
</script>

<!-- <script>
	import { Route } from "svelte-navigator";
	import PrivateRouteGuard from "./PrivateRouteGuard.svelte";

	export let path;
</script>

<Route {path} let:params let:location let:navigate>
	<PrivateRouteGuard>
		<slot {params} {location} {navigate} />
	</PrivateRouteGuard>
</Route> -->
<!-- 
<script>
  import { Route } from 'svelte-navigator';
  import { user } from './store/stores.js';

  export let when;
  export let component;
  export let { ...restProps } = {};

  // Check if the user is authenticated
  let authenticated = false;

  // Subscribe to the user store to check if the user is authenticated
  $: {
    const userValue = $user;
    authenticated = userValue !== null; // Modify this condition based on your user store structure
  }
</script>

 Check if the user is authenticated; if not, redirect to a login page -->
<!-- {#if authenticated}
  <Route {when} {component} {...restProps} />
{:else}
  <Route path="/login" />
{/if} -->

{#if $user}
  <svelte:component this={when} />
{:else}
  <p>You must be logged in to access this page.</p>
{/if}
