<script>
  import { onMount } from 'svelte';

  let explanation = '';

  function tryagain() {
    vscode?.postMessage({ message: 'tryagain' });
  }

  function reset() {
    explanation = '';
  }

  onMount(async () => {
    // Listen to events
    window.addEventListener('message', async (event) => {
      const message = event.data.message;
      explanation = message;
    });
  });
</script>

<main>
  {#if explanation}
    <h1>Explanation:</h1>
    <p>{explanation}</p>
    <div id="container">
      <h2>Was it clear?</h2>
      <button on:click={reset}>Good 👍</button>
      <button on:click={tryagain}>Try again</button>
    </div>
  {/if}
</main>

<style>
  /* your styles go here */
  button {
    margin-top: 1rem;
  }
  h1 {
    color: yellow;
  }
  #container {
    margin-top: 3rem;
    color: yellow;
  }
</style>
