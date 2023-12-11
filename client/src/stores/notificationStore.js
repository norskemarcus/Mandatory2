import { writable } from 'svelte/store';

export const notifications = writable([]);

export const addNotification = notification => {
  notifications.update(n => {
    console.log('Current notifications:', n);
    return [...n, notification];
  });
};

export const dismissNotification = index => {
  notifications.update(n => n.filter((_, i) => i !== index));
};
