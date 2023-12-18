<script>
  import familyWishlistImage from '../../assets/ai_frontpagephoto.png';
  import { Link } from 'svelte-navigator';
</script>

<main>
  <div class="intro-container">
    <div class="intro-text">
      <h1>Welcome to the Wishing Wand</h1>

      <p>Creating and sharing wishlists has never been easier. Invite your family, add wishes, and see what your loved ones are dreaming of — all in one place. Start today and make gift-giving special and straightforward.</p>

      <Link to="/signup" class="btn-signup">Get Started</Link>
    </div>
    <div class="intro-image">
      <img src={familyWishlistImage} alt="Family using WishLink app" />
    </div>
  </div>
</main>

<svelte:head>
  <title>Welcome to the Wishing Wand</title>
</svelte:head>

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
