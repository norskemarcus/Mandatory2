<script lang="ts">
  import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, NavLink } from 'sveltestrap';

  import { Link } from 'svelte-navigator';
  import 'iconify-icon';
  import { fetchUser } from '../user/userApi';
  import { user } from '../store/stores.js';
  import { onMount } from 'svelte';

  let isOpen = false;

  function handleUpdate(event) {
    isOpen = event.detail.isOpen;
  }

  async function checkUserLoginStatus() {
    try {
      const response = await fetchUser();

      if (response) {
        user.set(response);
      } else {
        user.set(null);
      }
    } catch (error) {
      console.error('User login status check error:', error);
    }
  }

  onMount(() => {
    checkUserLoginStatus();
  });

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

<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
</svelte:head>

<Navbar color="success-subtle" light expand="md">
  <NavbarBrand href="/"><iconify-icon icon="mdi:home" class="house-icon" /></NavbarBrand>
  <NavbarToggler on:click={() => (isOpen = !isOpen)} />
  <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
    <Nav class="ms-auto" navbar>
      {#if $user}
        <NavItem>
          <Link to="/secret" class="nav-link">Secret page</Link>
        </NavItem>

        <Dropdown nav inNavbar>
          <DropdownToggle nav caret>Lego</DropdownToggle>
          <DropdownMenu end>
            <DropdownItem as="div">
              <Link to="/legoSetList" class="dropdown-item">My lego list</Link>
            </DropdownItem>
            <DropdownItem as="div">
              <Link to="/addLego" class="dropdown-item">Add a new lego set</Link>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Dropdown nav inNavbar>
          <DropdownToggle nav caret>Account</DropdownToggle>
          <DropdownMenu end>
            <DropdownItem as="div">
              <Link to="/profile" class="dropdown-item">My profile</Link>
            </DropdownItem>

            <DropdownItem divider />
            <DropdownItem><Link to="/" on:click={handleLogout} class="dropdown-item">Log out</Link></DropdownItem>
          </DropdownMenu>
        </Dropdown>
      {:else}
        <NavItem>
          <Link to="/login" class="nav-link">Log in</Link>
        </NavItem>
        <NavItem>
          <Link to="/signup" class="nav-link">Sign up</Link>
        </NavItem>
      {/if}
    </Nav>
  </Collapse>
</Navbar>

<style>
  .house-icon {
    color: rgb(31, 13, 13);
    font-size: 24px;
  }

  /* .nav-link {
    color: inherit;
    text-decoration: none;
    padding: 0.5rem 1rem;
  }
  .dropdown-item {
    color: inherit;
    text-decoration: none;
    padding: 0.25rem 1.5rem;
  } */
</style>
