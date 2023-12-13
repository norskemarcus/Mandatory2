<script>
  import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'sveltestrap';
  import { Link } from 'svelte-navigator';
  import 'iconify-icon';
  import { fetchUser } from '../user/userApi';
  import { user } from '../stores/globalStore.js';
  import { onMount } from 'svelte';
  import { isDarkMode } from '../stores/globalStore.js';
  import { FormGroup, Input } from 'sveltestrap';
  import { notifications, addNotification } from '../stores/notificationStore.js';
  import { initializeSocketListeners, respondToSuggestion } from '../sockets/eventHandlers.js';
  import { fetchSuggestions } from '../services/suggestionService.js';
  import { deleteNotification, fetchNotifications } from '../services/notificationService.js';
  import socket from '../sockets/socket.js';
  import { suggestions, addSuggestion } from '../stores/suggestionStore';
  import { handleSuggestionResponse } from '../services/suggestionService.js';
  import { toast, Toaster } from 'svelte-french-toast';
  let isOpen = false;

  onMount(async () => {
    await checkUserLoginStatus();

    if ($user) {
      initializeSocketListeners(addNotification, addSuggestion);
    }

    if ($user && $user.role === 'Parent') {
      fetchNotifications($user.id)
        .then(fetchedNotifications => {
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
  });

  async function handleResponseToSuggestion(suggestionId, response) {
    console.log('suggestionId in Navbar:', suggestionId);

    const result = await handleSuggestionResponse(suggestionId, response);
    if (result.ok) {
      suggestions.update(suggestions => suggestions.filter(s => s.id !== suggestionId));
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
        socket.emit('user-logout');
        window.location.href = '/';
      } else {
        console.error('Error logging out:', response.status);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async function handleDismissParent(notificationId) {
    try {
      const result = await deleteNotification(notificationId);
      //TODO error handling here ********************************************?
      notifications.update(n => n.filter(notification => notification.id !== notificationId));
    } catch (error) {
      console.error('Error in handleDismissParent:', error);
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
      <!-- Child notifications    -->
      {#if $user && $user.role === 'Child' && $suggestions && $suggestions.length > 0}
        <Dropdown nav inNavbar>
          <DropdownToggle nav caret>
            Suggestions ({$suggestions.length})
          </DropdownToggle>
          <DropdownMenu end class="suggestions-dropdown">
            {#each $suggestions as suggestion}
              <div class="suggestion-item">
                {#if suggestion.title}
                  <span class="suggestion-title">{suggestion.title}</span>
                {:else if suggestion.message}
                  <span>{suggestion.message}</span>
                {/if}
                <div class="suggestion-actions">
                  <button class="btn btn-success btn-sm" on:click={() => handleResponseToSuggestion(suggestion.id || suggestion.suggestionId, 'accept')}>Accept</button>
                  <button class="btn btn-danger btn-sm" on:click={() => handleResponseToSuggestion(suggestion.id || suggestion.suggestionId, 'deny')}>Deny</button>
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
                {#each $notifications as notification, index}
                  <div class="notification-item {notification.type}">
                    {#if notification.link}
                      <a href={notification.link}>{notification.message}</a>
                    {:else}
                      <span>{notification.message}</span>
                    {/if}

                    <button
                      class="dismiss-btn"
                      on:click={() => {
                        console.log(notification.id);
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
        <FormGroup>
          <Input id="c3" type="switch" label="Dark mode" on:change={toggleTheme} bind:checked={$isDarkMode} />
        </FormGroup>

        <!-- Not logged in -->
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

<Toaster />

<style>
  .house-icon {
    color: rgb(31, 13, 13);
    font-size: 24px;
  }
  .notification-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 800px;
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

  @media (max-width: 1150px) {
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
