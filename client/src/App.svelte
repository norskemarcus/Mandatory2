<script>
  import { Router, Link, Route } from 'svelte-navigator';
  import Home from './pages/Home/Home.svelte';
  import Contact from './pages/Contact/Contact.svelte';
  import Login from './pages/Login/Login.svelte';
  import Signup from './pages/Signup/Signup.svelte';
  import PrivateRoute from './PrivateRoute.svelte';
  import AddLegoSet from './pages/Lego/AddLegoSet.svelte';
  import EditLegoSet from './pages/Lego/EditLegoSet.svelte';
  import LegoSetCard from './pages/Lego/LegoSetCard.svelte';
  import LegoSetList from './pages/Lego/LegoSetList.svelte';
  import { fetchUser } from './user/userApi';
  import { user } from './store/stores.js';
  import { onMount } from 'svelte';
  import 'iconify-icon';

  let message = '';
  let showLegoDropdown = false;

  // Check the user's login status using the fetchUser function
  async function checkUserLoginStatus() {
    try {
      const response = await fetchUser(user);

      if (response) {
        user.set(response); // Update the user store with the user's data
      } else {
        user.set(null);
      }
    } catch (error) {
      console.error('User login status check error:', error);
    }
  }

  // Use the function to check the user's login status when the component mounts
  onMount(() => {
    checkUserLoginStatus();
  });

  function toggleLegoDropdown() {
    showLegoDropdown = !showLegoDropdown;
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
        credentials: 'include',
      });

      if (response.ok) {
        user.set(null);
        window.location.href = '/';

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
    <Link to="/">
      <iconify-icon icon="mdi:home" class="house-icon" />
    </Link>

    {#if $user}
      <Link to="/addLego">+ Lego</Link>

      <Link to="/legoSetList">The Lego List</Link>
      <Link to="/" on:click={handleLogout}>Log out</Link>
    {:else}
      <Link to="/login" class="login">Log in</Link>
      <Link to="/signup" class="signup">Sign up</Link>
    {/if}
  </nav>

  <div class="mainRouter">
    <Route path="/" component={Home} />
    <Route path="/contact" primary={false} component={Contact} />

    <PrivateRoute path="/addLego">
      <AddLegoSet />
    </PrivateRoute>

    <PrivateRoute path="/editLego">
      <EditLegoSet />
    </PrivateRoute>

    <PrivateRoute path="/legoSetList">
      <LegoSetList />
    </PrivateRoute>

    <Route path="/login" on:click={clearMessage} component={Login} />
    <Route path="/signup" component={Signup} />
  </div>

  <footer>
    <div class="footer-content">
      <div class="footer-links">
        <Link to="/contact">Contact Us</Link>
      </div>
      <div class="footer-links">
        <a href="https://kea.dk">KEA</a>
      </div>
    </div>
  </footer>
</Router>

<style>
  .house-icon {
    color: white;
    font-size: 24px;
  }

  .mainRouter {
    display: flex;
    flex-direction: column;
    min-height: 77vh;
  }

  footer {
    background-color: #333;
    color: white;
    padding: 20px 0;
    text-align: center;
    position: sticky; /* Position the footer as fixed */
    bottom: 0; /* Stick it to the bottom */
    width: 100%; /* Make it full-width */
  }

  .footer-content {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    max-width: 1200px;
    margin: 0 auto;
  }

  .footer-links a {
    color: white;
    margin-right: 20px;
    text-decoration: none;
  }
</style>
