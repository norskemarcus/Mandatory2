<!-- <script>
  import loginWithGoogle from '../../Google/google.client.js';

  async function loginGoogle() {
    try {
      const user = await loginWithGoogle();
      console.log(user);
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        return;
      }
      console.log(error.message);
    }
  }
  window.location.href = 'http://localhost:8080/auth/google/';
</script>

<div class="row">
  <div class="col">
    <button on:click={loginGoogle} class="btn btn-primary w-100">Login With Google</button>
  </div>
</div> -->
