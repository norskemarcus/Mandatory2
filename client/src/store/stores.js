import { writable } from 'svelte/store';
import { readable } from 'svelte/store';

export const user = writable(null);
export const legoSets = writable([]);

// To the clock at the frontpage
export const time = readable(new Date(), function start(set) {
  const interval = setInterval(() => {
    set(new Date());
  }, 1000);

  return function stop() {
    clearInterval(interval);
  };
});

// You can update the store's value with set method
export const setLegoSets = data => {
  legoSets.set(data);
};
