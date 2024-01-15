import { writable } from 'svelte/store';

export const suggestions = writable([]);

export const addSuggestion = suggestion => {
  suggestions.update(currentSuggestions => {
    return [...currentSuggestions, suggestion];
  });
};

export const removeSuggestion = suggestionId => {
  suggestions.update(currentSuggestions => currentSuggestions.filter(s => s.id !== suggestionId));
};
