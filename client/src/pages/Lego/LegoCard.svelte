<article class="lego-set-card">
  <h2>
    <slot name="name">
      <span class="missing-name">Unknown name</span>
    </slot>
  </h2>

  <div class="lego-item-number">
    <slot name="itemNumber">
      <span class="missing-item-number">#Unknown</span>
    </slot>
  </div>

  <div class="lego-age">
    <slot name="age">
      <span class="missing-age">Unknown age</span>
    </slot>
  </div>
</article>

<style>
  .lego-set-card {
    width: 200px;
    border: 1px solid #aaa;
    border-radius: 2px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
    padding: 1em;
    margin: 1em;
    transition: background-color 0.3s, border-color 0.3s, color 0.3s;
  }

  h2 {
    padding: 0 0 0.2em 0;
    margin: 0 0 1em 0;
    border-bottom: 1px solid black;
    font-size: 1rem;
    transition: border-color 0.3s;
  }

  .lego-item-number::before {
    content: '#';
    color: black;
    font-weight: bold;
    margin-right: 5px;
  }

  .lego-age::before {
    content: 'Years:';
    color: black;
    font-size: 1em;
    margin-right: 5px;
  }

  .missing-name,
  .missing-item-number,
  .missing-age {
    color: #999;
  }

  :global(body.dark-mode) .lego-set-card {
    background-color: #333;
    border-color: #444;
    color: #ddd;
  }

  :global(body.dark-mode) h2 {
    border-color: #555;
  }

  :global(body.dark-mode) .lego-item-number::before,
  :global(body.dark-mode) .lego-age::before {
    color: #ccc;
  }

  :global(body.dark-mode) .missing-name,
  :global(body.dark-mode) .missing-item-number,
  :global(body.dark-mode) .missing-age {
    color: #666;
  }
</style>
