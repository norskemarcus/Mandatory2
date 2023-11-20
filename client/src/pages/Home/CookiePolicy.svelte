<script>
  import { isConsentGiven } from '../../store/stores';
  import { navigate } from 'svelte-navigator';

  function updateConsent(allCookies = false) {
    isConsentGiven.set(true);
    localStorage.setItem('cookieConsent', allCookies ? 'all' : 'necessary');
    location.reload(); // OBS NOT THE BEST WAY!
    navigate('/');
  }
</script>

<main>
  <h1>Cookie Policy</h1>
  <p>
    We use session cookies to maintain your session state as you navigate our website. These cookies are essential for our website to function correctly and securely. They allow us to recognize your login status and provide you with the services you have requested. These cookies do not contain
    personal information and are deleted once you log out or close your browser.
  </p>
  <p>
    In addition to session cookies, we use functionality-related storage to remember your preferences on our website. For example, we save your theme preference (such as <strong>dark mode</strong>) to enhance your experience on subsequent visits. This preference is stored locally on your device in
    your browser's local storage and is not used for tracking purposes.
  </p>

  <button class="green-button" on:click={() => updateConsent(true)}>Accept all cookies</button>
  <button class="gray-button" on:click={() => updateConsent(false)}>Accept necessary cookies</button>
</main>

<style>
  main {
    padding: 1rem;
  }
  .green-button {
    background-color: #4caf50;
    border: none;
    color: white;
    padding: 15px 32px;
    font-size: 16px;
    margin: 4px 2px;

    border-radius: 20px;
  }

  .gray-button {
    background-color: #e7e7e7;
    border: none;
    color: black;
    padding: 15px 32px;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 20px;
  }
</style>
