<script>
  import { Router, Route } from 'svelte-navigator';
  import Home from './pages/Home/Home.svelte';
  import Contact from './pages/Contact/Contact.svelte';
  import Login from './pages/Login/LoginBcrypt.svelte';
  import Signup from './pages/Signup/Signup.svelte';
  import PrivateRoute from './PrivateRoute.svelte';
  import AddWish from './pages/Wishes/AddWish.svelte';
  import WishList from './pages/Wishes/WishListToParent.svelte';
  import Search from './pages/Child/ChildSearchWish.svelte';
  import SearchSuggest from './pages/Parent/SearchSuggest.svelte';
  import 'iconify-icon';
  import Footer from './components/Footer.svelte';
  import Navbar from './components/Navbar.svelte';
  import { isDarkMode } from './stores/globalStore.js';
  import ParentDashboard from './pages/Parent/ParentDashboard.svelte';
  import ChildAccounts from './pages/Parent/ChildAccounts.svelte';
  import ChildWishList from './pages/Child/ChildWishList.svelte';
  import Account from './pages/Account/Account.svelte';

  let message = '';

  $: {
    if ($isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

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

    <PrivateRoute path="/addwish">
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

    <PrivateRoute path="/searchSuggest">
      <SearchSuggest />
    </PrivateRoute>

    <PrivateRoute path="/account">
      <Account />
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
    margin-left: 2rem;
    min-height: 77vh;
  }
</style>
