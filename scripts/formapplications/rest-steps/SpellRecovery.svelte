<script>
  import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';

  export let workflow;

  let spellData = workflow.spellData;

  function spendSpellPoint(event, level) {
    workflow.spendSpellPoint(level, event.target.checked);
    spellData = workflow.spellData;
  }

</script>


<div class="form-group">
  <label>
    {localize("REST-RECOVERY.Dialogs.RestSteps.SpellRecovery." + (spellData.feature ? "SpellSlotFeature" : "SpellSlotRule"), {
      featureName: spellData?.feature?.name ?? ""
    })}
  </label>
</div>

{#if spellData.missingSlots && spellData.feature && !spellData.has_feature_use}

  <p class="notes">{localize("REST-RECOVERY.Dialogs.RestSteps.SpellRecovery.NoFeatureUse", {
    featureName: spellData.feature.name
  })}</p>

{:else if spellData.missingSlots}

  {#each Object.entries(spellData.slots) as [level, slots], levelIndex (levelIndex)}
    <div class="form-group">
      <div class="form-fields" style="justify-content: flex-start;">
        <div style="margin-right:5px; flex:0 1 auto;">Level {level}:</div>
        <div style="flex:0 1 auto;">
          {#each slots as slot, slotIndex (slotIndex)}
            <input
              type='checkbox'
              disabled="{slot.disabled || slot.alwaysDisabled}"
              bind:checked="{slot.checked}"
              on:change="{(event) => { spendSpellPoint(event, level, slotIndex) }}"
            >
          {/each}
        </div>
      </div>
    </div>
  {/each}

  <p style="font-style: italic;">{localize("REST-RECOVERY.Dialogs.RestSteps.SpellRecovery.SpellSlotsLeft", {
    spellSlotsLeft: spellData.pointsTotal - spellData.pointsSpent,
  })}</p>

{:else}

  <p class="notes">{localize("REST-RECOVERY.Dialogs.RestSteps.SpellRecovery.FullSpells")}</p>

{/if}
