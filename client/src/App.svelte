<script>
  import { Router, Route } from 'svelte-navigator';
  import Home from './pages/Home/Home.svelte';
  import Contact from './pages/Contact/Contact.svelte';
  import Login from './pages/Login/LoginBcrypt.svelte';
  import Signup from './pages/Signup/Signup.svelte';
  import PrivateRoute from './PrivateRoute.svelte';
  import AddWish from './pages/Wishes/AddWish.svelte';
  import WishList from './pages/Wishes/WishList.svelte';
  import Search from './pages/Wishes/Search.svelte';
  import 'iconify-icon';
  import Footer from './components/Footer.svelte';
  import Navbar from './components/Navbar.svelte';
  import { isDarkMode } from './stores/stores.js';
  import { onMount } from 'svelte';
  import ParentDashboard from './pages/Parent/ParentDashboard.svelte';
  import CookiePolicy from './pages/Home/CookiePolicy.svelte';
  import ChildAccounts from './pages/Parent/ChildAccounts.svelte';
  import ChildWishList from './pages/Child/ChildWishList.svelte';

  let message = '';

  onMount(() => {
    const unsubscribe = isDarkMode.subscribe(value => {
      if (value) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    });
    return unsubscribe;
  });

  function clearMessage() {
    message = '';
  }
</script>

<Router>
  <Navbar />

  <div class="mainRouter">
    <Route path="/" component={Home} />
    <Route path="/contact" primary={false} component={Contact} />

    <PrivateRoute path="/parentDashboard">
      <ParentDashboard />
    </PrivateRoute>

    <PrivateRoute path="/childAccounts">
      <ChildAccounts />
    </PrivateRoute>

    <PrivateRoute path="/addWish">
      <AddWish />
    </PrivateRoute>

    <PrivateRoute path="/childsWishlist">
      <ChildWishList />
    </PrivateRoute>

    <PrivateRoute path="/wishlist">
      <WishList />
    </PrivateRoute>

    <PrivateRoute path="/search">
      <Search />
    </PrivateRoute>

    <Route path="/login" on:click={clearMessage} component={Login} />
    <Route path="/signup" component={Signup} />
    <Route path="/cookie-policy" component={CookiePolicy} />
  </div>

  <Footer />
</Router>

<style>
  .mainRouter {
    display: flex;
    flex-direction: column;
    min-height: 77vh;
  }
</style>
