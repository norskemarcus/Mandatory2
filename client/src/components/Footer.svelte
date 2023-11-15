<script>
  export let contactLink = '/contact';
</script>

<footer>
  <div class="footer-content">
    <div class="footer-links">
      <a href={contactLink}>Contact me</a>
    </div>
    <div class="footer-links">
      <a href="https://kea.dk">KEA</a>
    </div>
  </div>
</footer>

<style>
  footer {
    background-color: #333;
    color: white;
    padding: 20px 0;
    text-align: center;
    position: sticky;
    bottom: 0;
    width: 100%;
  }

  .footer-content {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    max-width: 1200px;
    margin: 0 auto;
  }

  .footer-links a {
    color: white;
    margin-right: 20px;
    text-decoration: none;
  }
</style>
