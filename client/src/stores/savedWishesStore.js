import { writable } from 'svelte/store';

export const savedWishes = writable(new Set());
