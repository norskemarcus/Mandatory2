
<script>
	import { Router, Link, Route } from "svelte-navigator";
  import Home from "./pages/Home/Home.svelte"
  import Contact from "./pages/Contact/Contact.svelte";
  import Login from "./pages/Login/Login.svelte";
  import Test from "./pages/Example/SecretPage.svelte";
  import PrivateRouteGuard from "./PrivateRouteGuard.svelte";
  import PrivateRoute from "./PrivateRoute.svelte";
  import SecretPage from "./pages/Example/SecretPage.svelte";


  // OBS use this one when security is implemented!!
  //import { user } from "./store/stores.js";

  let user = { loggedIn: true };

	function handleLogout() {
		//$user = null;
	}


  function toggle() {
		user.loggedIn = !user.loggedIn;
	}
</script>


<Router>
  <nav>
    <Link to="/">Home</Link>
    <Link to="/contact">Contact us</Link>
    <Link to="/secretPage">Secret Page</Link>
   
   

    {#if user.loggedIn}
    <button on:click={toggle}> Log out </button>
    {:else}
    <Link to="/login" class="login">Log in</Link>
  {/if}

  </nav>

  <div class="mainRouter">
    <Route path="/" component={Home}></Route>
    <Route path="/contact" component={Contact}></Route>

    <PrivateRoute path="profile let:location"> 
      <Route path="/secretPage" component={SecretPage}></Route>
      <button on:click={handleLogout}>Logout</button>
    </PrivateRoute>
  
    <Route path="/login" component={Login}></Route>
  </div>


</Router>