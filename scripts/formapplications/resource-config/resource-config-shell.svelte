<script>

    import { getContext } from 'svelte';
    import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
    import { ApplicationShell } from '@typhonjs-fvtt/runtime/svelte/component/core';

    import { getSetting } from "../../lib/lib.js";
    import CONSTANTS from "../../constants.js";

    const { application } = getContext('external');

    export let elementRoot;
    export let actor;
    let form;

    const count = actor.data.data.resources['count']?.value ?? 3;

    const resources = Object.entries(actor.data.data.resources)
        .map(entry => {
            let resource = entry[1];
            resource.path = entry[0];
            resource.flags = {
                formula: "",
                evaluated_formula: ""
            };
            return resource;
        })
        .filter((resource, index) => resource.path !== "count" && index < count);

    function requestSubmit(){
        form.requestSubmit();
    }

    function updateSettings(){

    }

</script>


<svelte:options accessors={true}/>

<ApplicationShell bind:elementRoot>

    <form bind:this={form} on:submit|preventDefault={updateSettings} autocomplete="off">

        <div class="container">

            <table>

                <tr>
                    <th style="width:auto;">Name</th>
                    <th style="width:20%;">Value</th>
                    <th style="width:auto;">Short Rest</th>
                    <th style="width:auto;">Long Rest</th>
                    <th style="width:auto;">Recovery Formula</th>
                </tr>

                {#each resources as resource, index (index)}
                <tr>
                    <td>
                        <input type="text" bind:value={resource.label}/>
                    </td>
                    <td>
                        <div class="flexrow">
                            <input type="number" style="text-align: right;" bind:value={resource.value}/>
                            <span class="sep">/</span>
                            <input type="number" bind:value={resource.max}/>
                        </div>
                    </td>
                    <td class="text-center">
                        <input type="checkbox" bind:value={resource.lr}>
                    </td>
                    <td class="text-center">
                        <input type="checkbox" bind:value={resource.sr}>
                    </td>
                    <td>
                        <input type="text" bind:value={resource.flags.formula}>
                    </td>
                </tr>
                {/each}

            </table>

        </div>

        <footer class="flexrow" style="margin-top:0.5rem;">
            <button type="button" class="dialog-button" on:click={requestSubmit}><i class="fas fa-check"></i> {localize("Submit")}</button>
        </footer>

    </form>
</ApplicationShell>

<style>

    .container {
        max-height:400px;
        overflow: auto;
    }

    .sep {
        flex: 0;
        margin: 0 3px;
    }

    .text-center{
        text-align: center;
    }
</style>