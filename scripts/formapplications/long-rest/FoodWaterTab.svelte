<script>

    import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
    import CONSTANTS from "../../constants.js";
    import {
        capitalizeFirstLetter,
        evaluateFormula,
        getActorConsumableValues,
        getConsumableItemsFromActor,
        getSetting,
        roundHalf
    } from "../../lib/lib.js";

    export let actor;
    export let workflow;

    const enableAutomatedExhaustion = getSetting(CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION)
        && getSetting(CONSTANTS.SETTINGS.AUTOMATE_FOODWATER_EXHAUSTION);

    const halfWaterSaveDC = getSetting(CONSTANTS.SETTINGS.HALF_WATER_SAVE_DC);

    const actorExhaustion = getProperty(actor.data, "data.attributes.exhaustion") ?? 0;
    const actorDaysWithoutFood = getProperty(actor.data, CONSTANTS.FLAGS.STARVATION) ?? 0;
    const actorExhaustionThreshold = evaluateFormula(
        getSetting(CONSTANTS.SETTINGS.NO_FOOD_DURATION_MODIFIER),
        foundry.utils.deepClone(actor.data.data)
    )?.total ?? 4;

    let {
        actorRequiredFood,
        actorRequiredWater,
        actorFoodSatedValue,
        actorWaterSatedValue
    } = getActorConsumableValues(actor);

    let hasAccessToFood = false;
    let halfFood = false;
    let hasAccessToWater = false;
    let halfWater = false;

    let externalFoodSourceAccess = getSetting(CONSTANTS.SETTINGS.EXTERNAL_FOOD_ACCESS);
    let externalWaterSourceAccess = getSetting(CONSTANTS.SETTINGS.EXTERNAL_WATER_ACCESS);

    let newFoodSatedValue = actorFoodSatedValue;
    let newWaterSatedValue = actorWaterSatedValue;

    let consumableItems = [];

    let actorConsumableItems = [];
    let selectedItem = "";

    refreshConsumableItems();

    function toggleAccessToFood(){
        halfFood = hasAccessToFood
            ? externalFoodSourceAccess
            : false;
        toggleAmountOfFood();
    }

    function toggleAmountOfFood(){
        if(halfFood === "full"){
            newFoodSatedValue = actorRequiredFood;
        }else{
            newFoodSatedValue = actorFoodSatedValue + (actorRequiredFood/2);
        }

        calculateAmountOfItems();
        refreshConsumableItems();
    }

    function toggleAccessToWater(){
        halfWater = hasAccessToWater
            ? externalWaterSourceAccess
            : false;
        toggleAmountOfWater();
    }

    function toggleAmountOfWater(){
        if(halfWater === "full"){
            newWaterSatedValue = actorRequiredWater;
        }else{
            newWaterSatedValue = actorWaterSatedValue + (actorRequiredWater / 2);
        }

        calculateAmountOfItems();
        refreshConsumableItems();
    }

    async function dropData(event){

        event.preventDefault();

        let drop;
        try {
            drop = JSON.parse(event.dataTransfer.getData('text/plain'));
        } catch (err) {
            return false;
        }

        if(drop.type !== 'Item') return;

        const actor = drop.sceneId && drop.tokenId
            ? (await fromUuid(`Scene.${drop.sceneId}.Token.${drop.tokenId}`)).actor
            : game.actors.get(drop.actorId);

        if(!actor) return;

        addConsumableItem(drop.data._id);

    }

    function addConsumableItem(itemId){

        const item = actor.items.get(itemId);

        if(!item){
            // Todo: Notify couldn't find item
            return;
        }

        const consumable = getProperty(item.data, CONSTANTS.FLAGS.CONSUMABLE);

        if(!consumable?.enabled) return;

        const usesLeft = getProperty(item.data, "data.uses.value");
        const maxUses = getProperty(item.data, "data.uses.max");

        if(usesLeft < 0.5){
            // Todo: Notify item has no uses
            return;
        }

        if(consumableItems.find(existingItem => existingItem.id === item.id)){
            return;
        }

        const typeIndex = { "both": 2, "food": 1, "water": 0 };

        const foodRequired = Math.max(0.5, actorRequiredFood - newFoodSatedValue);
        const waterRequired = Math.max(0.5, actorRequiredWater - newWaterSatedValue);
        const maxBothRequired = Math.max(foodRequired, waterRequired);

        const consumableItem = {
            id: item.id,
            data: item,
            index: typeIndex[consumable.type],
            fullName: `${item.name} (${localize("REST-RECOVERY.Misc." + capitalizeFirstLetter(consumable.type))}) - ${usesLeft} / ${maxUses}`,
            baseAmount: 0,
            amount: 0,
            usesLeft,
            consumable
        };

        switch(consumable.type){
            case "both":
                consumableItem['baseAmount'] = maxBothRequired;
                consumableItem['amount'] = maxBothRequired;
                break;
            case "food":
                consumableItem['baseAmount'] = foodRequired;
                consumableItem['amount'] = foodRequired;
                break;
            case "water":
                consumableItem['baseAmount'] = waterRequired;
                consumableItem['amount'] = waterRequired;
                break;
        }

        consumableItem['amount'] = Math.min(usesLeft, consumableItem['amount']);

        consumableItems.push(consumableItem);

        consumableItems.sort((a, b) => {
            if(a.index === b.index){
                return b.name > a.name ? -1 : 1;
            }
            return b.index - a.index;
        });

        consumableItems = consumableItems;

        calculateAmountOfItems();
        refreshConsumableItems();

    }

    function calculateAmountOfItems(){

        if(!hasAccessToFood){
            newFoodSatedValue = actorFoodSatedValue;
        }

        if(!hasAccessToWater){
            newWaterSatedValue = actorWaterSatedValue;
        }

        for(const item of consumableItems){
            if(!hasAccessToFood && (item.consumable.type === "food" || item.consumable.type === "both")){
                newFoodSatedValue += item.amount;
            }
            if(!hasAccessToWater && (item.consumable.type === "water" || item.consumable.type === "both")){
                newWaterSatedValue += item.amount;
            }
        }

        workflow.consumableData = {
            items: consumableItems,
            hasAccessToFood,
            hasAccessToWater,
            halfFood,
            halfWater
        }
    }

    function refreshConsumableItems(){
        actorConsumableItems = getConsumableItemsFromActor(actor)
            .filter(item => !consumableItems.find(consumableItem => consumableItem.id === item.id));
        selectedItem = actorConsumableItems.find(item => item.id === selectedItem)
            ? selectedItem : actorConsumableItems[0]?.id ?? "";
    }

    function removeConsumableItem(index){
        consumableItems.splice(index, 1);
        consumableItems = consumableItems;

        calculateAmountOfItems();
        refreshConsumableItems();
    }

    function preventDefault(event){
        event.preventDefault();
    }

</script>

<div class="flex">

    {#if actorRequiredFood}
        {#if (actorRequiredFood - actorFoodSatedValue) > 0}
            <p>{@html localize("REST-RECOVERY.Dialogs.LongRest.FoodRequirement", {
                food: Math.max(0, actorRequiredFood - newFoodSatedValue)
            })}</p>

            {#if externalFoodSourceAccess === "half" || externalFoodSourceAccess === "full"}
                <label class="checkbox">
                    <input type="checkbox" bind:checked={hasAccessToFood} on:change={toggleAccessToFood}> {localize("REST-RECOVERY.Dialogs.LongRest.ExternalFood")}
                </label>

                {#if hasAccessToFood}
                <p>
                    <label class="checkbox">
                        <input type="radio" value="full" bind:group={halfFood} disabled={externalFoodSourceAccess === "half"} on:change={toggleAmountOfFood}> {localize("REST-RECOVERY.Dialogs.LongRest.ExternalFoodFull")}
                    </label>
                    <label class="checkbox">
                        <input type="radio" value="half" bind:group={halfFood} on:change={toggleAmountOfFood}> {localize("REST-RECOVERY.Dialogs.LongRest.ExternalFoodHalf")}
                    </label>
                </p>
                {/if}
            {/if}
        {:else}
            <p>{@html localize("REST-RECOVERY.Dialogs.LongRest.FoodSated")}</p>
        {/if}
    {/if}

    {#if actorRequiredWater}
        {#if (actorRequiredWater - actorWaterSatedValue) > 0}
            <p>{@html localize("REST-RECOVERY.Dialogs.LongRest.WaterRequirement", {
                water: Math.max(0, actorRequiredWater - newWaterSatedValue)
            })}</p>

            {#if externalWaterSourceAccess === "half" || externalWaterSourceAccess === "full"}
                <label class="checkbox">
                    <input type="checkbox" class="red" bind:checked={hasAccessToWater} on:change={toggleAccessToWater}> {localize("REST-RECOVERY.Dialogs.LongRest.ExternalWater")}
                </label>

                {#if hasAccessToWater}
                <p>
                    <label class="checkbox">
                        <input type="radio" value="full" bind:group={halfWater} disabled={externalWaterSourceAccess === "half"} on:change={toggleAmountOfWater}> {localize("REST-RECOVERY.Dialogs.LongRest.ExternalWaterFull")}
                    </label>
                    <label class="checkbox">
                        <input type="radio" value="half" bind:group={halfWater} on:change={toggleAmountOfWater}> {localize("REST-RECOVERY.Dialogs.LongRest.ExternalWaterHalf")}
                    </label>
                </p>
                {/if}
            {/if}
        {:else}
            <p>{@html localize("REST-RECOVERY.Dialogs.LongRest.WaterSated")}</p>
        {/if}
    {/if}

    {#if (!hasAccessToFood || !hasAccessToWater) && consumableItems.length}
        <div class="items-container">
            {#each consumableItems.filter(item => {
                return (item.consumable.type === "food" && !hasAccessToFood)
                    || (item.consumable.type === "water" && !hasAccessToWater)
                    || (item.consumable.type === "both" && (!hasAccessToFood || !hasAccessToWater))
            }) as item, index (item.id)}
            <div class="item-container">
                <div class="flexcol">
                    <span class="item-name">{item.fullName}</span>
                    {#if !item.consumable.dayWorth}
                    <label>
                        <input type="number" bind:value={item.amount} on:change={() => {
                            item.amount = Math.max(0.5, Math.min(item.usesLeft, roundHalf(item.amount)));
                            calculateAmountOfItems();
                        }}> {localize("REST-RECOVERY.Dialogs.LongRest.AmountToConsume")}
                    </label>
                    {:else}
                        <label>{localize("REST-RECOVERY.Dialogs.AbilityUse.DayWorthTitle" + capitalizeFirstLetter(item.consumable.type))}</label>
                    {/if}
                </div>

                <button type="button" on:click={() => { removeConsumableItem(index) }}><i class="fas fa-times"></i></button>
            </div>
            {/each}
        </div>
    {/if}

    {#if actorConsumableItems.length && ((actorRequiredFood && actorFoodSatedValue < actorRequiredFood && !hasAccessToFood) || (actorRequiredWater && actorWaterSatedValue < actorRequiredWater && !hasAccessToWater))}
        <div class="dragDropBox" on:dragstart={preventDefault} on:drop={dropData} on:dragover={preventDefault}>
            <div class="form-fields">
                <p>{localize("REST-RECOVERY.Dialogs.LongRest.DragDrop")}</p>
                <div class="flexrow">
                    <select bind:value={selectedItem}>
                        {#each actorConsumableItems as item, index (item.id)}
                            <option value={item.id}>{item.name}</option>
                        {/each}
                    </select>
                    <button class="consumable-add-button" type="button" on:click={() => { addConsumableItem(selectedItem) }}><i class="fas fa-plus"></i></button>
                </div>
            </div>
        </div>
    {/if}

    {#if enableAutomatedExhaustion}
        {#if actorRequiredFood && newFoodSatedValue < actorRequiredFood}
            {#if actorDaysWithoutFood < actorExhaustionThreshold}
                <p>{@html localize("REST-RECOVERY.Dialogs.LongRest.FoodAlmostExhaustion", {
                    days: (actorExhaustionThreshold - actorDaysWithoutFood) * (newFoodSatedValue > 0 && newFoodSatedValue <= (actorRequiredFood/2) ? 2 : 1)
                })}</p>
            {:else}
                <p>{@html localize("REST-RECOVERY.Dialogs.LongRest.FoodExhaustion")}</p>
            {/if}
        {/if}

        {#if actorRequiredWater}
            {#if newWaterSatedValue > 0 && newWaterSatedValue <= (actorRequiredWater/2)}
                <p>{@html localize("REST-RECOVERY.Dialogs.LongRest.HalfWater", { dc: halfWaterSaveDC, exhaustion: actorExhaustion > 0 ? 2 : 1 })}</p>
            {:else if newWaterSatedValue === 0}
                <p>{@html localize("REST-RECOVERY.Dialogs.LongRest.NoWater", { exhaustion: actorExhaustion > 0 ? 2 : 1 })}</p>
            {/if}
        {/if}
    {/if}


</div>

<style lang="scss">

    .items-container{
      margin: 0.5rem 0;

      .item-container {
        display:flex;
        border-radius: 5px;
        padding:5px;

        & > div {
          flex: 1;
        }

        .item-name{
          font-size: 1rem;
          flex:1;
        }

        label {
          flex:0 1 auto;
          input {
            font-size:0.75rem;
            height: 1rem;
            max-width: 2rem;
          }
        }

        button {
          line-height:0;
          flex: 0 1 43px;
          margin-left:1rem;
        }
      }

      .item-container:not(:last-child) {
        margin-bottom: 0.5rem;
      }

      .item-container:nth-child(even) {
        background: rgba(0,0,0, 0.15);
      }
      .item-container:nth-child(odd) {
        background: rgba(255,255,255, 0.25);
      }

    }

    .dragDropBox {
      position: relative;
      display: grid;
      place-items: center;
      width: 100%;
      min-height: 100px;
      border-radius: 5px;
      border: 2px dashed rgba(0,0,0,0.25);
      margin-top:0.5rem;

      button {
        flex: 0 1 30px;
        line-height: 0;
        font-size: 0.5rem;
      }
    }

</style>