import { writable } from 'svelte/store';

export const user = writable(null);

export const isDarkMode = writable(localStorage.getItem('isDarkMode') === 'true');

// Reactive statement to update local storage when isDarkMode changes
isDarkMode.subscribe(value => {
  localStorage.setItem('isDarkMode', value.toString());
});
