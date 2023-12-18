import { writable } from 'svelte/store';

export const user = writable(null);

export const isDarkMode = writable(localStorage.getItem('isDarkMode') === 'true');

isDarkMode.subscribe(value => {
  localStorage.setItem('isDarkMode', value);
});
