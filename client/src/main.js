import './app.css'
import App from './App.svelte'
import 'bootstrap/dist/css/bootstrap.min.css'; // npm install sveltestrap svelte, Sveltestrap is a Bootstrap wrapper for Svelte.

const app = new App({
  target: document.getElementById('app'),
})

export default app;
