<script>
  import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'sveltestrap';
  import { Link } from 'svelte-navigator';
  import 'iconify-icon';
  import { user } from '../stores/globalStore.js';
  import { isDarkMode } from '../stores/globalStore.js';
  import { Input } from 'sveltestrap';
  import { notifications, addNotification } from '../stores/notificationStore.js';
  import { initializeSocketListeners } from '../sockets/eventHandlers.js';
  import { fetchSuggestions } from '../services/suggestionService.js';
  import { deleteNotification, fetchNotifications } from '../services/notificationService.js';
  import socket from '../sockets/socket.js';
  import { useNavigate } from 'svelte-navigator';
  import { suggestions, addSuggestion, removeSuggestion } from '../stores/suggestionStore';
  import { handleSuggestionResponse } from '../services/suggestionService.js';
  import { toast, Toaster } from 'svelte-french-toast';
  import { onMount } from 'svelte';
  import { fetchUser } from '../user/userApi';

  let isOpen = false;
  const navigate = useNavigate();

  // onMount(async () => {
  //   await checkUserLoginStatus();

  //   if ($user) {
  //     initializeSocketListeners(addNotification, addSuggestion);
  //   }

  //   if ($user && $user.role === 'Parent') {
  //     fetchNotifications($user.id)
  //       .then(fetchedNotifications => {
  //         notifications.set(fetchedNotifications);
  //       })
  //       .catch(error => {
  //         console.error('Error fetching notifications:', error);
  //       });
  //   }

  //   if ($user && $user.role === 'Child') {
  //     fetchSuggestions($user.id)
  //       .then(fetchSuggestions => {
  //         suggestions.set(fetchSuggestions);
  //       })
  //       .catch(error => {
  //         console.error('Error fetching suggestions:', error);
  //       });
  //   }
  // });

  $: if ($user) {
    initializeSocketListeners(addNotification, addSuggestion);

    if ($user && $user.role === 'Parent') {
      console.log('I have logged in as parent');

      fetchNotifications($user.id)
        .then(fetchedNotifications => {
          console.log('fetched notifications', fetchedNotifications);
          notifications.set(fetchedNotifications);
        })
        .catch(error => {
          console.error('Error fetching notifications:', error);
        });
    }

    if ($user && $user.role === 'Child') {
      fetchSuggestions($user.id)
        .then(fetchSuggestions => {
          suggestions.set(fetchSuggestions);
        })
        .catch(error => {
          console.error('Error fetching suggestions:', error);
        });
    }
  }

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

  // $: if ($user) {
  //   initializeSocketListeners(addNotification, addSuggestion);

  //   if ($user && $user.role === 'Parent') {
  //     fetchNotifications($user.id)
  //       .then(fetchedNotifications => {
  //         notifications.set(fetchedNotifications);
  //       })
  //       .catch(error => {
  //         console.error('Error fetching notifications:', error);
  //       });
  //   }

  //   if ($user && $user.role === 'Child') {
  //     fetchSuggestions($user.id)
  //       .then(fetchSuggestions => {
  //         suggestions.set(fetchSuggestions);
  //       })
  //       .catch(error => {
  //         console.error('Error fetching suggestions:', error);
  //       });
  //   }
  // }

  async function handleResponseToSuggestion(suggestionId, response) {
    const result = await handleSuggestionResponse(suggestionId, response);
    if (result.ok) {
      removeSuggestion(suggestionId);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  function toggleTheme(event) {
    isDarkMode.set(event.target.checked);
  }

  function handleUpdate(event) {
    isOpen = event.detail.isOpen;
  }

  async function handleLogout() {
    try {
      const response = await fetch('/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        user.set(null);
        socket.emit('user-logout');
        navigate('/');
      } else {
        console.error('Error logging out:', response.status);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async function handleDismissParent(notificationId) {
    console.log('notificationId in handleDismissParent:', notificationId);

    try {
      await deleteNotification(notificationId);
      //dismissNotification her
      notifications.update(n => n.filter(notification => notification.id !== notificationId));
    } catch (error) {
      console.error('Error in handleDismissParent:', error);
    }
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
</svelte:head>

<Navbar class={$isDarkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'} light={!$isDarkMode} dark={$isDarkMode} expand="md"
  ><NavbarBrand>
    <Link to="/">
      <iconify-icon icon="mdi:home" class="house-icon" style="color: {$isDarkMode ? '#ccc' : 'rgb(31, 13, 13)'}" />
    </Link>
  </NavbarBrand>

  <NavbarToggler on:click={() => (isOpen = !isOpen)} />
  <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
    <Nav class="ms-auto" navbar>
      <!-- Child notifications    -->
      {#if $user && $user.role === 'Child' && $suggestions && $suggestions.length > 0}
        <Dropdown nav inNavbar>
          <DropdownToggle nav caret>
            Suggestions ({$suggestions.length})
          </DropdownToggle>
          <DropdownMenu end class="suggestions-dropdown">
            {#each $suggestions as suggestion}
              <div class="suggestion-item">
                <a href={suggestion.url} target="_blank" class="suggestion-title">
                  {suggestion.title}
                </a>
                <div class="suggestion-actions">
                  <button class="btn btn-success btn-sm" on:click={() => handleResponseToSuggestion(suggestion.id, 'accept')}>Accept</button>
                  <button class="btn btn-danger btn-sm" on:click={() => handleResponseToSuggestion(suggestion.id, 'deny')}>Deny</button>
                </div>
              </div>
            {/each}
          </DropdownMenu>
        </Dropdown>
      {/if}
      <!-- Only parents  -->
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
                <Link to="/searchSuggest" class="dropdown-item">Search & suggest</Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <!-- Notifications Parents -->
          {#if $user && $user.role === 'Parent' && $notifications && $notifications.length > 0}
            <Dropdown nav inNavbar>
              <DropdownToggle nav caret>
                Notifications ({$notifications.length})
              </DropdownToggle>
              <DropdownMenu end class="notifications-dropdown">
                {#each $notifications as notification}
                  <div class="notification-item {notification.type}">
                    {#if notification.link}
                      <a href={notification.link}>{notification.message}</a>
                    {:else}
                      <span>{notification.message}</span>
                    {/if}

                    <button
                      class="dismiss-btn"
                      on:click={() => {
                        handleDismissParent(notification.id);
                      }}>Dismiss</button
                    >
                  </div>
                {/each}
              </DropdownMenu>
            </Dropdown>
          {/if}

          <!-- Child pages for parents -->
          <Dropdown nav inNavbar>
            <DropdownToggle nav caret>Children</DropdownToggle>
            <DropdownMenu end>
              <DropdownItem as="div">
                <Link to="/wishlist" class="dropdown-item">Child's Wishlist</Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        {:else}
          <!-- Childrens options -->
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

        <!-- Common for both parents and children -->
        <Dropdown nav inNavbar>
          <DropdownToggle nav caret>Account</DropdownToggle>
          <DropdownMenu end>
            <DropdownItem as="div">
              <Link to="/account" class="dropdown-item">My account</Link>
            </DropdownItem>

            <DropdownItem divider />
            <DropdownItem><Link to="/" on:click={handleLogout} class="dropdown-item">Log out</Link></DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <div class="switch-container">
          <Input id="c3" type="switch" on:change={toggleTheme} />
          <iconify-icon icon="mdi:moon-waning-crescent" style="font-size: 1.5em; color: silver;"></iconify-icon>
        </div>

        <!-- Not logged in -->
      {:else}
        <NavItem>
          <Link to="/login" class="nav-link">Log in</Link>
        </NavItem>
        <NavItem>
          <Link to="/signup" class="nav-link">Sign up</Link>
        </NavItem>

        <div class="switch-container">
          <Input id="c3" type="switch" on:change={toggleTheme} />
          <iconify-icon icon="mdi:moon-waning-crescent" style="font-size: 1.5em; color: silver;"></iconify-icon>
        </div>
      {/if}
    </Nav>
  </Collapse>
</Navbar>

<Toaster />

<style>
  .switch-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-left: 3rem;
  }

  .house-icon {
    color: rgb(31, 13, 13);
    font-size: 24px;
  }

  .nav {
    align-items: center;
  }

  .notification-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 800px;

    background-color: #ffffff;
    color: #000;
  }

  .notification-item.alert {
    background-color: #ffd5d5;
    color: red;
  }

  .dismiss-btn {
    border: none;
    background: none;
    cursor: pointer;
    color: #333;
    margin-left: 10px;
  }

  .suggestions-dropdown {
    max-width: 400px;
  }

  .suggestion-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    min-width: 600px;
    border-bottom: 1px solid #ddd;
  }

  .suggestion-title {
    flex-grow: 1;
    margin-right: 1rem;
  }

  .suggestion-actions button {
    margin-left: 0.5rem;
    margin-top: 0.5rem;
  }

  .dark-mode-switch {
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: center;
  }

  :global(body.dark-mode) .house-icon {
    color: #ccc;
  }

  :global(body.dark-mode) .notification-item {
    background-color: #242424;
    color: #fff;
  }

  :global(body.dark-mode) .dismiss-btn {
    color: #fff;
  }

  @media (max-width: 1150px) {
    .switch-container {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-left: 1rem;
    }
  }

  @media (max-width: 768px) {
    .notification-item {
      flex-direction: column;
      align-items: flex-start;
      min-width: 0;
      width: 100%;
    }

    .notification-item span {
      max-width: 100%;
      white-space: normal;
    }
  }

  @media (max-width: 480px) {
    .notification-item {
      font-size: 14px;
    }
  }
</style>
