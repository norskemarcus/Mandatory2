import { writable } from 'svelte/store';

export const user = writable(null);

export const showModal = writable(false);
export const isDarkMode = writable(localStorage.getItem('isDarkMode') === 'true');

export const isConsentGiven = writable(false);

isDarkMode.subscribe(value => {
  if (isConsentGiven) {
    localStorage.setItem('isDarkMode', value);
  }
});
