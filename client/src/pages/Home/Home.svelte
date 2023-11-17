<script>
  import familyWishlistImage from '../../assets/ai_frontpagephoto.png';
</script>

<main>
  <div class="intro-container">
    <div class="intro-text">
      <h1>Welcome to Wishes & Hopes</h1>
      <p>Creating and sharing wishlists has never been easier. Invite your family, add wishes, and see what your loved ones are dreaming of — all in one place. Start today and make gift-giving special and straightforward.</p>
      <a href="/signup" class="btn-signup">Get Started</a>
    </div>
    <div class="intro-image">
      <img src={familyWishlistImage} alt="Family using WishLink app" />
    </div>
  </div>
</main>

<svelte:head>
  <title>Welcome to Wishes & hopes</title>
</svelte:head>

<style>
  .intro-container {
    display: flex;
    align-items: center;
    padding: 2rem;
    gap: 1rem; /* Adds a gap between text and image */
  }

  .intro-text {
    flex-basis: 50%; /* Text takes up half the container's width */
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

  .btn-signup {
    padding: 10px 20px;
    background-color: #5f26a8;
    color: white;
    text-decoration: none;
    border-radius: 5px;
  }

  .intro-image {
    flex-basis: 50%; /* Image takes up half the container's width */
    max-width: 100%; /* Image doesn't exceed its container's width */
  }

  .intro-image img {
    width: 100%; /* Image width matches its container's width */
    height: auto; /* Image height is adjusted automatically */
  }

  @media (max-width: 768px) {
    .intro-container {
      flex-direction: column-reverse; /* Image is moved below text on small screens */
      align-items: flex-start; /* Aligns items to the start of the flex container */
    }

    .intro-text,
    .intro-image {
      flex-basis: 100%; /* Text and image each take the full container's width on small screens */
    }
  }
</style>
