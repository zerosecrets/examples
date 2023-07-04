<script lang="ts">
  let email = '';
  let resultMessage: string | undefined;

  async function onSubmit(e: SubmitEvent) {
    e.preventDefault();

    resultMessage = undefined;

    try {
      const response = await fetch('http://localhost:3000/api/lead', {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          `The API returned an error status code: ${response.status}.`
        );
      }

      resultMessage = 'Success!';
      email = '';
    } catch (e) {
      resultMessage = `An error occurred: ${(e as Error).message}`;
      console.error(e);
    }
  }
</script>

<main>
  <h1>Our product is launching soon!</h1>

  <p>Enter your email below to start a conversation:</p>

  <form on:submit={onSubmit}>
    <input
      bind:value={email}
      placeholder="Email address"
      type="email"
      required
    />
    <button type="submit">Submit</button>
  </form>

  {#if resultMessage}
    <p>{resultMessage}</p>
  {/if}
</main>

<style>
  :global(body) {
    font-family: sans-serif;
  }

  main {
    max-width: 500px;
    margin: 0 auto;
  }

  form {
    display: flex;
    column-gap: 0.5rem;
    margin-bottom: 2rem;
  }
</style>
