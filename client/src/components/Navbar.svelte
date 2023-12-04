<script lang="ts">
  import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, NavLink } from 'sveltestrap';

  import { Link } from 'svelte-navigator';
  import 'iconify-icon';
  import { fetchUser } from '../user/userApi';
  import { user } from '../stores/stores.js';
  import { onMount } from 'svelte';
  import { isDarkMode } from '../stores/stores.js';
  import { FormGroup, Input } from 'sveltestrap';
  import { notifications, dismissNotification, addNotification } from '../stores/notificationStore.js';
  import io from 'socket.io-client/dist/socket.io.js';
  let isOpen = false;

  const socket = io('http://localhost:8080');

  
  socket.on('new-wish', data => {
    addNotification(`New wish: ${data.wish.title}`);
  });

  onMount(() => {
    checkUserLoginStatus();
  });

  function toggleTheme(event) {
    isDarkMode.set(event.target.checked);
  }

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

<Navbar class={$isDarkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'} light={!$isDarkMode} dark={$isDarkMode} expand="md">
  <NavbarBrand href="/">
    <iconify-icon icon="mdi:home" class="house-icon" style="color: {$isDarkMode ? '#ccc' : 'rgb(31, 13, 13)'}" />
  </NavbarBrand>
  <NavbarToggler on:click={() => (isOpen = !isOpen)} />
  <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
    <Nav class="ms-auto" navbar>
      <!-- Only parents can see this  -->
      {#if $user}
        {#if $user.role === 'Parent'}
          <Dropdown nav inNavbar>
            <DropdownToggle nav caret>Parent</DropdownToggle>
            <DropdownMenu end>
              <DropdownItem as="div">
                <Link to="/parentDashboard" class="dropdown-item">Saved wishes</Link>
              </DropdownItem>

              <DropdownItem as="div">
                <Link to="/childAccounts" class="dropdown-item">Child Accounts</Link>
              </DropdownItem>

              <DropdownItem as="div">
                <Link to="/search" class="dropdown-item">Search & suggest</Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <!-- Notification Dropdown specifically for Parents -->
          {#if $user && $user.role === 'Parent' && $notifications.length > 0}
            <Dropdown nav inNavbar>
              <DropdownToggle nav caret>
                Notifications ({$notifications.length})
              </DropdownToggle>
              <DropdownMenu end>
                {#each $notifications as notification, index}
                  <DropdownItem as="div" class="notification-item">
                    {notification}
                    <button class="dismiss-btn" on:click={() => dismissNotification(index)}>Dismiss</button>
                  </DropdownItem>
                {/each}
              </DropdownMenu>
            </Dropdown>
          {/if}

          <!-- Child-specific options for parents -->
          <Dropdown nav inNavbar>
            <DropdownToggle nav caret>Children</DropdownToggle>
            <DropdownMenu end>
              <DropdownItem as="div">
                <Link to="/wishlist" class="dropdown-item">Child's Wishlist</Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        {:else}
          <!-- Child-specific options -->
          <Dropdown nav inNavbar>
            <DropdownToggle nav caret>Wishlist</DropdownToggle>
            <DropdownMenu end>
              <DropdownItem as="div">
                <Link to="/childsWishlist" class="dropdown-item">My wishlist</Link>
              </DropdownItem>
              <DropdownItem as="div">
                <Link to="/addwish" class="dropdown-item">Add a new wish</Link>
              </DropdownItem>
              <DropdownItem as="div">
                <Link to="/search" class="dropdown-item">Search & save</Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        {/if}

        <!-- Common account options for both parents and children -->
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
        <FormGroup>
          <Input id="c3" type="switch" label="Dark mode" on:change={toggleTheme} bind:checked={$isDarkMode} />
        </FormGroup>

        <!-- If you are not logged in -->
      {:else}
        <NavItem>
          <Link to="/login" class="nav-link">Log in</Link>
        </NavItem>
        <NavItem>
          <Link to="/signup" class="nav-link">Sign up</Link>
        </NavItem>
        <FormGroup>
          <Input id="c3" type="switch" label="Dark mode" on:change={toggleTheme} />
        </FormGroup>
      {/if}
    </Nav>
  </Collapse>
</Navbar>

<style>
  .house-icon {
    color: rgb(31, 13, 13);
    font-size: 24px;
  }
  .notification-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .dismiss-btn {
    border: none;
    background: none;
    cursor: pointer;
    color: #333; /* Adjust as per your theme */
  }
</style>
