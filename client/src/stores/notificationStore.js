import { writable } from 'svelte/store';

export const notifications = writable([]);

export const addNotification = notification => {
  notifications.update(currentNotifications => {
    return [...currentNotifications, notification];
  });
};

export const dismissNotification = index => {
  notifications.update(n => n.filter((_, i) => i !== index));
};
