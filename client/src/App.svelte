<style>
  @import 'bootstrap/dist/css/bootstrap.min.css';

</style>

<script>
	import { Router, Link, Route } from "svelte-navigator";
  import Home from "./pages/Home/Home.svelte"
  import Contact from "./pages/Contact/Contact.svelte";
  import Login from "./pages/Login/Login.svelte";
  import Test from "./pages/Example/Test.svelte";
  import PrivateRouteGuard from "./PrivateRouteGuard.svelte";
  import PrivateRoute from "./PrivateRoute.svelte";
  import bootstrap from './main.js'

  // OBS use this one when security is implemented!!
  //import { user } from "./store/stores.js";

  let user = { loggedIn: false };

	// function handleLogout() {
	// 	$user = null;
	// }


  import { onMount } from 'svelte';

  onMount(() => {
  
    const dropdownElement = document.querySelector('.dropdown');
    new bootstrap.Dropdown(dropdownElement);
  });


  function toggle() {
		user.loggedIn = !user.loggedIn;
	}
</script>


<Router>
  <nav>
    <Link to="/">Home</Link>
    <Link to="/contact">Contact us</Link>
    <!-- <Link to="/examples">Useful functions</Link> -->
    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
        Useful functions
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <li class="dropdown-item">Converter temperature</li>
        <li class="dropdown-item">Map</li>
        <li class="dropdown-item">Dropdown Item 3</li>
      </ul>
    </div>

    {#if user.loggedIn}
    <button on:click={toggle}> Log out </button>
    {:else}
    <Link to="/login" class="login">Log in</Link>
  {/if}

  </nav>

  <div class="mainRouter">
    <Route path="/" component={Home}></Route>
    <!-- <PrivateRoute path="profile let:location"> -->
      <Route path="/contact" component={Contact}></Route>
      <Route path="/examples" component={Test}></Route>
      <!-- <button on:click={handleLogout}>Logout</button> -->
    <!-- </PrivateRoute> -->
  
    <Route path="/login" component={Login}></Route>
  </div>


</Router>