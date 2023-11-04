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
  }

  h2 {
    padding: 0 0 0.2em 0;
    margin: 0 0 1em 0;
    border-bottom: 1px solid #5f26a8;
    font-size: 1rem;
  }

  .lego-item-number::before {
    content: '#';
    color: #5f26a8;
    font-weight: bold;
    margin-right: 5px;
  }

  .lego-age::before {
    content: 'Years:';
    color: #5f26a8;
    font-size: 1em;
    margin-right: 5px;
  }

  .missing-name,
  .missing-item-number,
  .missing-age {
    color: #999;
  }
</style>
