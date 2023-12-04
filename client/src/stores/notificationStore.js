import { writable } from 'svelte/store';

export const notifications = writable([]);

export const addNotification = notification => {
  notifications.update(n => [...n, notification]);
};

export const dismissNotification = index => {
  notifications.update(n => n.filter((_, i) => i !== index));
};
