import { writable } from 'svelte/store';

export const suggestions = writable([]);

export const addSuggestion = suggestion => {
  suggestions.update(s => {
    console.log('Current notifications:', s);
    return [...s, suggestion];
  });
};

// export const addSuggestion = suggestion => {
//   suggestions.update(currentSuggestions => {
//     if (!Array.isArray(currentSuggestions)) {
//       console.warn('Suggestions store was not an array. Resetting to empty array.');
//       currentSuggestions = [];
//     }
//     console.log('Current suggestions:', currentSuggestions);
//     return [...currentSuggestions, suggestion];
//   });
// };

export const dismissSuggestion = index => {
  suggestions.update(currentSuggestions => currentSuggestions.filter((_, i) => i !== index));
};
