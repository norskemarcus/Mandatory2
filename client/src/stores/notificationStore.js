import { writable } from 'svelte/store';

export const notifications = writable([]);

// export const addNotification = notification => {
//   notifications.update(n => {
//     console.log('Current notifications:', n);
//     return [...n, notification];
//   });
// };

export const addNotification = notification => {
  notifications.update(n => {
    // Check if n is an array. If not, initialize it as an empty array
    if (!Array.isArray(n)) {
      console.warn('Notifications store was not an array. Resetting to empty array.');
      n = [];
    }
    console.log('Current notifications:', n);
    return [...n, notification];
  });
};

export const dismissNotification = index => {
  notifications.update(n => n.filter((_, i) => i !== index));
};
