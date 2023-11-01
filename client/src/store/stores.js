import { writable } from 'svelte/store';
import { readable } from 'svelte/store';

export const user = writable(null);

export const time = readable(new Date(), function start(set) {
  const interval = setInterval(() => {
    set(new Date());
  }, 1000);

  return function stop() {
    clearInterval(interval);
  };
});
