<script>
  import { Router, Link, Route } from 'svelte-navigator';
  import Home from './pages/Home/Home.svelte';
  import Parent from './pages/Communication/Parent.svelte';
  import Child from './pages/Communication/Child.svelte';
  import Contact from './pages/Contact/Contact.svelte';
  import Login from './pages/Login/Login.svelte';
  import Signup from './pages/Signup/Signup.svelte';
  import PrivateRoute from './PrivateRoute.svelte';
  // import SecretPage from './pages/SecretPage/SecretPage.svelte';
  import AddLegoSet from './pages/Lego/AddLegoSet.svelte';
  import EditLegoSet from './pages/Lego/EditLegoSet.svelte';
  import LegoSetCard from './pages/Lego/LegoSetCard.svelte';
  import LegoSetList from './pages/Lego/LegoSetList.svelte';

  import { user } from './store/stores.js';
  import 'iconify-icon';

  let message = '';
  let showLegoDropdown = false;

  // get from local storage
  let storedUserId = localStorage.getItem('userId');

  // If a user ID is found, set it in the user store
  if (storedUserId) {
    user.set({ id: storedUserId });
  }

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
        credentials: 'include', // Include credentials (cookies) in the request
      });

      if (response.ok) {
        // update the user store
        user.set(null);
        storedUserId = null;
        localStorage.removeItem('userId');
        // window.location.href = '/';

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
    <Link to="/parent">Parent</Link>
    <Link to="/child">Child</Link>

    {#if $user}
      <!-- <Link to="/secretPage">Secret Page</Link> -->
      <Link to="/addLego">+ Lego</Link>
      <!-- <Link to="/legoDetails">Lego Details</Link> -->
      <Link to="/legoSetList">The Lego List</Link>
      <button on:click={handleLogout}>Log out</button>
    {:else}
      <Link to="/login" class="login">Log in</Link>
      <Link to="/signup" class="signup">Sign up</Link>
    {/if}
  </nav>

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

  <div class="mainRouter">
    <Route path="/" component={Home} />
    <Route path="/parent" component={Parent} />
    <Route path="/cihld" component={Child} />
    <Route path="/contact" primary={false} component={Contact} />
    <!-- <PrivateRoute when="/secretPage">
      <SecretPage />
    </PrivateRoute> -->
    <PrivateRoute path="/addLego">
      <AddLegoSet />
    </PrivateRoute>

    <PrivateRoute path="/editLego">
      <EditLegoSet />
    </PrivateRoute>

    <!-- <PrivateRoute path="/legoDetails">
      <LegoSetCard />
    </PrivateRoute> -->

    <PrivateRoute path="/legoSetList">
      <LegoSetList />
    </PrivateRoute>
    <Route path="/login" on:click={clearMessage} component={Login} />
    <Route path="/signup" component={Signup} />
  </div>
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
    position: fixed; /* Position the footer as fixed */
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
