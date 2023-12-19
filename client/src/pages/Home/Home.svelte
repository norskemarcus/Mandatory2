<script>
  import familyWishlistImage from '../../assets/ai_frontpagephoto.png';
  import { Link } from 'svelte-navigator';
  import { user } from '../../stores/globalStore.js';
</script>

<svelte:head>
  <title>The Wishing Wand</title>
</svelte:head>

<main>
  {#if $user && $user.role === 'Parent'}
    <div class="user-intro-container">
      <h1>Welcome back, {$user.username}!</h1>
      <p>See the latest from your family's wishlists, find new gift ideas, or manage your account.</p>
      <nav class="user-nav">
        <Link to="/parentDashboard" style="text-decoration: none; background-color: green; color: white; padding: 10px 20px; border-radius: 5px; cursor: pointer; display: inline-block; margin-right: 10px;">My saved wishes</Link>
        <Link to="/wishlist" style="text-decoration: none; background-color: green; color: white; padding: 10px 20px; border-radius: 5px; cursor: pointer; display: inline-block;">Family Wishlist</Link>

        <Link to="/account" style="text-decoration: none; background-color: green; color: white; padding: 10px 20px; border-radius: 5px;">My account</Link>
      </nav>
    </div>
  {:else if $user && $user.role === 'Child'}
    <div class="user-intro-container">
      <h1>Welcome back, {$user.username}!</h1>
      <p>Take a look of your wishlist, find new gift ideas, or manage your account.</p>
      <nav class="user-nav">
        <Link to="/childsWishlist" style="text-decoration: none; background-color: green; color: white; padding: 10px 20px; border-radius: 5px;">My wishlist</Link>

        <Link to="/search" style="text-decoration: none; background-color: green; color: white; padding: 10px 20px; border-radius: 5px;">Search & save</Link>

        <Link to="/account" style="text-decoration: none; background-color: green; color: white; padding: 10px 20px; border-radius: 5px;">My account</Link>
      </nav>
    </div>
  {:else}
    <div class="intro-container">
      <div class="intro-text">
        <h1>Welcome to the Wishing Wand</h1>

        <p>Creating and sharing wishlists has never been easier. Invite your family, add wishes, and see what your loved ones are dreaming of — all in one place. Start today and make gift-giving special and straightforward.</p>

        <Link to="/signup" class="btn-signup" style="text-decoration: none; background-color: #747bff; color: white; padding: 10px 20px; border-radius: 5px;">Get Started</Link>
      </div>
      <div class="intro-image">
        <img src={familyWishlistImage} alt="Family using WishLink app" />
      </div>
    </div>
  {/if}
</main>

<style>
  .intro-container {
    display: flex;
    align-items: center;
    padding: 2rem;
    gap: 1rem;
  }

  .intro-text {
    flex-basis: 50%;
  }

  .intro-text h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .intro-text p {
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  .intro-image {
    flex-basis: 50%;
    max-width: 100%;
  }

  .intro-image img {
    width: 100%;
    height: auto;
  }

  .user-nav {
    margin-top: 2rem;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  @media (max-width: 768px) {
    .intro-container {
      flex-direction: column-reverse;
      align-items: flex-start;
    }

    .intro-text,
    .intro-image {
      flex-basis: 100%;
    }
  }
</style>
