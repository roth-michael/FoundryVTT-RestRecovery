<script>
    import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
    export let activeTab;
    export let tabs;
</script>


<div>
    <nav class="tabs" data-group="primary">
        {#each tabs as tab, index (tab.value)}
            <a on:click={() => { activeTab = tab.value}} class="item" class:active={activeTab === tab.value} data-tab="rest">
                {#if tab.icon} <i class={tab.icon}></i> {/if}
                {localize(tab.label)}
            </a>
        {/each}
    </nav>
</div>


<style lang="scss">

  .tabs {
    border-bottom: 1px solid rgba(0, 0, 0, 0.25);
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
  }

</style>