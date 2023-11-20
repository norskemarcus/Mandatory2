import { writable } from 'svelte/store';
import { readable } from 'svelte/store';

export const user = writable(null);
// export const legoSets = writable([]);
export const showModal = writable(false);
export const isDarkMode = writable(localStorage.getItem('isDarkMode') === 'true');

export const isConsentGiven = writable(false);

// Subscribe to changes in the store and update localStorage accordingly
isDarkMode.subscribe(value => {
  if (isConsentGiven) {
    localStorage.setItem('isDarkMode', value);
  }
});

// You can update the store's value with set method
// export const setLegoSets = data => {
//   legoSets.set(data);
// };
