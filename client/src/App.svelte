<script>
  // @ts-nocheck

  import { Router, Link, Route } from 'svelte-navigator';
  import Home from './pages/Home/Home.svelte';
  import Contact from './pages/Contact/Contact.svelte';
  import Login from './pages/Login/Login.svelte';
  import Signup from './pages/Signup/Signup.svelte';
  import Test from './pages/SecretPage/SecretPage.svelte';
  import PrivateRouteGuard from './PrivateRouteGuard.svelte';
  import PrivateRoute from './PrivateRoute.svelte';
  import SecretPage from './pages/SecretPage/SecretPage.svelte';
  import { user } from './store/stores.js';

  let message = '';

  // get from local storage
  let storedUserId = localStorage.getItem('userId');

  // If a user ID is found, set it in the user store
  if (storedUserId) {
    user.set({ id: storedUserId });
  }

  function clearMessage() {
    message = '';
  }

  async function handleLogout() {
    try {
      const response = await fetch('http://localhost:8080/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include credentials (cookies) in the request
      });

      if (response.ok) {
        // update the user store
        user.set(null);
        storedUserId = null;

        // Clear the user ID from local storage
        localStorage.removeItem('userId');
        // window.location.href = '/';

        // Reset the message and user variables
        //message = '';
        user.set(null);
      } else {
        console.error('Error logging out:', response.status);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
</script>

<Router>
  <nav>
    <Link to="/">Home</Link>
    <Link to="/contact">Contact us</Link>

    {#if $user}
      <Link to="/secretPage">Secret Page</Link>
      <button on:click={handleLogout}>Log out</button>
    {:else}
      <Link to="/login" class="login">Log in</Link>
      <Link to="/signup" class="signup">Sign up</Link>
    {/if}
  </nav>

  <div class="mainRouter">
    <Route path="/" component={Home} />
    <Route path="/contact" primary={false} component={Contact} />
    <PrivateRoute when="/secretPage">
      <SecretPage />
    </PrivateRoute>
    <Route path="/login" on:click={clearMessage} component={Login} />
    <Route path="/signup" component={Signup} />
  </div>
</Router>
