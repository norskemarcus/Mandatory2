<script>
  import { Router, Link, Route } from 'svelte-navigator';
  import Home from './pages/Home/Home.svelte';
  import Contact from './pages/Contact/Contact.svelte';
  import Login from './pages/Login/Login.svelte';
  import Signup from './pages/Signup/Signup.svelte';
  import PrivateRoute from './PrivateRoute.svelte';
  import AddLegoSet from './pages/Lego/AddLegoSet.svelte';
  import EditLegoSet from './pages/Lego/EditLegoSet.svelte';
  // import LegoSetCard from './pages/Lego/LegoSetCard.svelte';
  import LegoSetList from './pages/Lego/LegoSetList.svelte';
  import 'iconify-icon';
  import Footer from './components/Footer.svelte';
  import Navbar from './components/Navbar.svelte';

  let message = '';
  // let showLegoDropdown = false;

  // async function checkUserLoginStatus() {
  //   try {
  //     const response = await fetchUser();

  //     if (response) {
  //       user.set(response);
  //     } else {
  //       user.set(null);
  //     }
  //   } catch (error) {
  //     console.error('User login status check error:', error);
  //   }
  // }

  // onMount(() => {
  //   checkUserLoginStatus();
  // });

  // function toggleLegoDropdown() {
  //   showLegoDropdown = !showLegoDropdown;
  // }

  function clearMessage() {
    message = '';
  }
</script>

<Router>
  <Navbar />

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

  <Footer />
</Router>

<style>
  .mainRouter {
    display: flex;
    flex-direction: column;
    min-height: 77vh;
  }
</style>
