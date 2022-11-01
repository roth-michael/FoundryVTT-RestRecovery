<script>

    export let icon;
    export let header;
    export let content;
    export let extraContent = "";

</script>


<div>

    {#if icon}
    <p class="header-icon"><i class="{icon}"></i></p>
    {/if}
    <p class="header"><strong>{header}</strong></p>
    <p>{@html content}</p>
    {#if extraContent}
      <div>{@html extraContent}</div>
    {/if}

</div>

<style lang="scss">

    div {

      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      text-align: center;

      .header-icon {
        font-size:3rem;
        margin: 0;
      }

      .header {
        margin-bottom: 0.5rem;
        font-size: 1.2rem;
      }

    }

</style>
