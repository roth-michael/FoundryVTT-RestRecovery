<script>

  import { localize } from '../../lib/lib.js';
  export let steps;
  export let activeStep;

</script>

<div class="steps">
  {#each steps as step, index (index)}
    <a class:active={activeStep === index} on:click={() => { activeStep = index; }}>{localize(step.title)}</a>
    {#if index < steps.length - 1}
      <i class="fas fa-arrow-right"></i>
    {/if}
  {/each}
</div>

<style lang="scss">

  .steps {

    display: flex;
    text-align:center;
    align-items: center;
    justify-content: center;

    & > * {
      flex:0 1 auto;
      opacity: 0.5;
    }

    a {
      font-size: 1rem;
      &:hover {
        opacity: 0.75;
      }
    }

    i {
      margin: 0 0.5rem;
    }

    .active {
      opacity: 1.0 !important;
      text-decoration: underline;
    }

  }

</style>
