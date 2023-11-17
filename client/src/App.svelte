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
  import { isDarkMode } from './store/stores.js';
  import { onMount } from 'svelte';

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

    <PrivateRoute path="/addWish">
      <AddWish />
    </PrivateRoute>

    <PrivateRoute path="/wishlist">
      <WishList />
    </PrivateRoute>

    <PrivateRoute path="/search">
      <Search />
    </PrivateRoute>

    <Route path="/login" on:click={clearMessage} component={Login} />
    <Route path="/signup" component={Signup} />
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
