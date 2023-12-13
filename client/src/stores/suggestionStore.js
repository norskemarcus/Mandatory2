import { writable } from 'svelte/store';

export const suggestions = writable([]);

export const addSuggestion = suggestion => {
  suggestions.update(s => {
    return [...s, suggestion];
  });
};

export const dismissSuggestion = index => {
  suggestions.update(currentSuggestions => currentSuggestions.filter((_, i) => i !== index));
};
