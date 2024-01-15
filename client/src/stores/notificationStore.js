import { writable } from 'svelte/store';

export const notifications = writable([]);

// export const addNotification = notification => {
//   notifications.update(currentNotifications => {
//     const exists = currentNotifications.some(n => n.id === notification.id);
//     if (!exists) {
//       return [...currentNotifications, notification];
//     }
//     return currentNotifications;
//   });
// };

export const addNotification = notification => {
  notifications.update(currentNotifications => {
    return [...currentNotifications, notification];
  });
};

export const dismissNotification = index => {
  notifications.update(n => n.filter((_, i) => i !== index));
};
