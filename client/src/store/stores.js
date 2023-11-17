import { writable } from 'svelte/store';
import { readable } from 'svelte/store';

export const user = writable(null);
export const legoSets = writable([]);

// Initialize the store with the value from localStorage if available, otherwise default to false
export const isDarkMode = writable(localStorage.getItem('isDarkMode') === 'true');
// export const isDarkMode = writable(false);

// Subscribe to changes in the store and update localStorage accordingly
isDarkMode.subscribe(value => {
  localStorage.setItem('isDarkMode', value);
});

// You can update the store's value with set method
// export const setLegoSets = data => {
//   legoSets.set(data);
// };
