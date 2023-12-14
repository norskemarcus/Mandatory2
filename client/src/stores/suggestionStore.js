import { writable } from 'svelte/store';

export const suggestions = writable([]);

export const addSuggestion = suggestion => {
  suggestions.update(currentSuggestions => {
    const exists = currentSuggestions.some(s => s.id === suggestion.id);
    if (!exists) {
      return [...currentSuggestions, suggestion];
    }
    return currentSuggestions;
  });
};

export const removeSuggestion = suggestionId => {
  suggestions.update(currentSuggestions => currentSuggestions.filter(s => s.id !== suggestionId));
};
