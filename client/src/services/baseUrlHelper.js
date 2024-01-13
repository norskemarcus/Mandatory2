import { BASE_URL } from '../stores/globalStore.js';

export function getBaseUrl() {
  let baseUrlValue;
  const unsubscribe = BASE_URL.subscribe(value => {
    baseUrlValue = value;
  });
  unsubscribe();
  return baseUrlValue;
}
