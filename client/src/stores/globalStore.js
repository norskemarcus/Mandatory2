import { writable, readable } from 'svelte/store';

export const user = writable(null);

export const BASE_URL = readable('http://localhost:8080');

export const isDarkMode = writable(localStorage.getItem('isDarkMode') === 'true');

// Reactive statement to update local storage when isDarkMode changes
isDarkMode.subscribe(value => {
  localStorage.setItem('isDarkMode', value.toString());
});
