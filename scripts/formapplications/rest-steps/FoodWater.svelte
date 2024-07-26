<script>

  import { localize } from '#runtime/svelte/helper';
  import CONSTANTS from "../../constants.js";
  import {
    capitalizeFirstLetter,
    evaluateFormula,
    getConsumableItemsFromActor,
    getSetting,
    roundHalf
  } from "../../lib/lib.js";
  import RestWorkflow from "../../rest-workflow.js";
  import { get, writable } from "svelte/store";

  export let workflow;
  export let canAfford;
  const actor = workflow.actor;

  const enableAutomatedExhaustion = getSetting(CONSTANTS.SETTINGS.AUTOMATE_EXHAUSTION)
    && getSetting(CONSTANTS.SETTINGS.AUTOMATE_FOODWATER_EXHAUSTION);

  const {
    actorRequiredFood,
    actorRequiredWater,
    actorFoodSatedValue,
    actorWaterSatedValue
  } = workflow.foodWaterRequirement;

  const halfWaterSaveDC = getSetting(CONSTANTS.SETTINGS.HALF_WATER_SAVE_DC);

  const actorExhaustion = foundry.utils.getProperty(actor, "system.attributes.exhaustion") ?? 0;
  const actorDaysWithoutFood = foundry.utils.getProperty(actor, CONSTANTS.FLAGS.STARVATION) ?? 0;
  // TODO: does this work?
  let actorExhaustionThreshold = 4;
  evaluateFormula(getSetting(CONSTANTS.SETTINGS.NO_FOOD_DURATION_MODIFIER), actor.getRollData()).then(res => {
    if (res?.total) actorExhaustionThreshold = res.total;
  })
  // const actorExhaustionThreshold = evaluateFormula(
  //   getSetting(CONSTANTS.SETTINGS.NO_FOOD_DURATION_MODIFIER),
  //   actor.getRollData()
  // )?.total ?? 4;

  let hasAccessToFood = false;
  let halfFood = false;
  let hasAccessToWater = false;
  let halfWater = false;

  let externalFoodSourceAccess = getSetting(CONSTANTS.SETTINGS.EXTERNAL_FOOD_ACCESS);
  let externalWaterSourceAccess = getSetting(CONSTANTS.SETTINGS.EXTERNAL_WATER_ACCESS);

  let externalFoodSourceHasCost = getSetting(CONSTANTS.SETTINGS.EXTERNAL_FOOD_HAS_COST);
  let externalWaterSourceHasCost = getSetting(CONSTANTS.SETTINGS.EXTERNAL_WATER_HAS_COST);
  
  let externalFoodSourceFullCost = getSetting(CONSTANTS.SETTINGS.EXTERNAL_FOOD_FULL_COST);
  let externalFoodSourceFullCurrency = getSetting(CONSTANTS.SETTINGS.EXTERNAL_FOOD_FULL_COST_CURRENCY);
  let externalWaterSourceFullCost = getSetting(CONSTANTS.SETTINGS.EXTERNAL_WATER_FULL_COST);
  let externalWaterSourceFullCurrency = getSetting(CONSTANTS.SETTINGS.EXTERNAL_WATER_FULL_COST_CURRENCY);
  let externalFoodSourceHalfCost = getSetting(CONSTANTS.SETTINGS.EXTERNAL_FOOD_HALF_COST);
  let externalFoodSourceHalfCurrency = getSetting(CONSTANTS.SETTINGS.EXTERNAL_FOOD_HALF_COST_CURRENCY);
  let externalWaterSourceHalfCost = getSetting(CONSTANTS.SETTINGS.EXTERNAL_WATER_HALF_COST);
  let externalWaterSourceHalfCurrency = getSetting(CONSTANTS.SETTINGS.EXTERNAL_WATER_HALF_COST_CURRENCY);

  let foodCost = 0;
  let foodCurrency = 'gp';
  let waterCost = 0;
  let waterCurrency = 'gp';

  let newFoodSatedValue = actorFoodSatedValue;
  let newWaterSatedValue = actorWaterSatedValue;

  let consumableItems = writable([]);

  let actorConsumableItems = [];
  let selectedItem = "";

  RestWorkflow.patchAllConsumableItems(actor).then(() => {
    refreshConsumableItems();
    calculateCanAfford();
  });

  function toggleAccessToFood() {
    halfFood = hasAccessToFood
      ? externalFoodSourceAccess
      : false;
    toggleAmountOfFood();
  }

  function toggleAmountOfFood() {
    if (halfFood === "full") {
      newFoodSatedValue = actorRequiredFood;
      foodCost = externalFoodSourceFullCost;
      foodCurrency = externalFoodSourceFullCurrency;
    } else {
      newFoodSatedValue = actorFoodSatedValue + (actorRequiredFood / 2);
      foodCost = externalFoodSourceHalfCost;
      foodCurrency = externalFoodSourceHalfCurrency;
    }

    calculateAmountOfItems();
    refreshConsumableItems();
    calculateCanAfford();
  }

  function toggleAccessToWater() {
    halfWater = hasAccessToWater
      ? externalWaterSourceAccess
      : false;
    toggleAmountOfWater();
  }

  function toggleAmountOfWater() {
    if (halfWater === "full") {
      newWaterSatedValue = actorRequiredWater;
      waterCost = externalWaterSourceFullCost;
      waterCurrency = externalWaterSourceFullCurrency;
    } else {
      newWaterSatedValue = actorWaterSatedValue + (actorRequiredWater / 2);
      waterCost = externalWaterSourceHalfCost;
      waterCurrency = externalWaterSourceHalfCurrency;
    }

    calculateAmountOfItems();
    refreshConsumableItems();
    calculateCanAfford();
  }

  async function dropData(event) {

    event.preventDefault();

    let drop;
    try {
      drop = JSON.parse(event.dataTransfer.getData('text/plain'));
    } catch (err) {
      return false;
    }

    if (drop.type !== 'Item') return;

    const dropSource = drop.uuid
      ? fromUuidSync(drop.uuid)
      : game.actors.get(drop.actorId);

    const actor = dropSource?.parent ?? dropSource;

    if (!actor) return;

    addConsumableItem(dropSource.id);

  }

  const typeIndex = { "both": 2, "food": 1, "water": 0 };

  function addConsumableItem(itemId) {

    const item = actor.items.get(itemId);

    if (!item) {
      return;
    }

    const consumable = foundry.utils.getProperty(item, CONSTANTS.FLAGS.CONSUMABLE);

    if (!consumable?.enabled) return;

    const foodRequired = Math.max(0.5, actorRequiredFood - newFoodSatedValue);
    const waterRequired = Math.max(0.5, actorRequiredWater - newWaterSatedValue);
    const maxBothRequired = Math.max(foodRequired, waterRequired);
    const consumeQuantity = foundry.utils.getProperty(item, 'system.uses.autoDestroy') ?? false;

    const maxUses = foundry.utils.getProperty(item, "system.uses.max") ?? 1;
    const usesLeft = foundry.utils.getProperty(item, "system.uses.value") ?? 1;
    const quantity = foundry.utils.getProperty(item, "system.quantity") ?? 1;
    let countsAs = 1;
    if(consumable.dayWorth){
      switch (consumable.type) {
        case "both":
          countsAs = Math.ceil(maxBothRequired / (workflow.restVariant === "gritty" ? 7 : 1));
          break;
        case "food":
          countsAs = Math.ceil(foodRequired / (workflow.restVariant === "gritty" ? 7 : 1));
          break;
        case "water":
          countsAs = Math.ceil(waterRequired / (workflow.restVariant === "gritty" ? 7 : 1));
          break;
      }
		}

    const totalUsesLeft = consumeQuantity ? ((maxUses * quantity) - (maxUses - usesLeft)) : usesLeft;

    if (totalUsesLeft <= 0) {
      ui.notifications.warn(localize("REST-RECOVERY.Warnings.ItemNoUses", { item: item.name }));
      return;
    }

    const existingItem = get(consumableItems).find(existingItem => existingItem.id === item.id);
    if (existingItem) {
      consumableItems.update(val => {
        const consumableItem = val.find(existingItem => existingItem.id === item.id);
        consumableItem.amount++;
        return val;
      });
      return;
    }

    const consumableItem = {
      id: item.id,
      item: item,
      index: typeIndex[consumable.type],
      fullName: `${item.name} (${localize("REST-RECOVERY.Misc." + capitalizeFirstLetter(consumable.type))}) - ${totalUsesLeft} left`,
      amount: 0,
			countsAs,
      totalUsesLeft,
      quantity,
      consumable
    };

		switch (consumable.type) {
			case "both":
				consumableItem['amount'] = Math.ceil(maxBothRequired / countsAs);
				break;
			case "food":
				consumableItem['amount'] = Math.ceil(foodRequired / countsAs);
				break;
			case "water":
				consumableItem['amount'] = Math.ceil(waterRequired / countsAs);
				break;
		}

    consumableItem['amount'] = Math.min(totalUsesLeft, consumableItem['amount']);

    consumableItems.update(val => {
      val.push(consumableItem);

      val.sort((a, b) => {
        if (a.index === b.index) {
          return b.name > a.name ? -1 : 1;
        }
        return b.index - a.index;
      });

      return val;
    });

    calculateAmountOfItems();
    refreshConsumableItems();

  }

  function calculateAmountOfItems() {

    if (!hasAccessToFood) {
      newFoodSatedValue = actorFoodSatedValue;
      foodCost = 0;
    }

    if (!hasAccessToWater) {
      newWaterSatedValue = actorWaterSatedValue;
      waterCost = 0;
    }

    for (const item of $consumableItems) {
      if (!hasAccessToFood && (item.consumable.type === "food" || item.consumable.type === "both")) {
        newFoodSatedValue += item.countsAs * item.amount;
      }
      if (!hasAccessToWater && (item.consumable.type === "water" || item.consumable.type === "both")) {
        newWaterSatedValue += item.countsAs * item.amount;
      }
    }

    workflow.consumableData = {
      items: $consumableItems,
      hasAccessToFood,
      hasAccessToWater,
      halfFood,
      halfWater
    }
  }

  function refreshConsumableItems() {
    actorConsumableItems = getConsumableItemsFromActor(actor)
      .filter(item => !$consumableItems.find(consumableItem => consumableItem.id === item.id))
      .sort((a, b) => {
        if (typeIndex[a.type] === typeIndex[b.type]) {
          return b.name > a.name ? -1 : 1;
        }
        return typeIndex[b.type] - typeIndex[a.type];
      });
    selectedItem = actorConsumableItems.find(item => item.id === selectedItem)
      ? selectedItem : actorConsumableItems[0]?.id ?? "";
  }

  function removeConsumableItem(index) {
    consumableItems.update(val => {
      val.splice(index, 1);
      return val;
    })
    calculateAmountOfItems();
    refreshConsumableItems();
  }

  function preventDefault(event) {
    event.preventDefault();
  }

  function calculateCanAfford() {
    let actorWealth = 0;
    let necessaryWealth = 0;
    for (let [currencyKey, currencyData] of Object.entries(CONFIG.DND5E.currencies)) {
      actorWealth += actor.system.currency[currencyKey] / currencyData.conversion;
      if (externalFoodSourceHasCost && foodCurrency == currencyKey) {
        necessaryWealth += foodCost / currencyData.conversion;
      }
      if (externalWaterSourceHasCost && waterCurrency == currencyKey) {
        necessaryWealth += waterCost / currencyData.conversion;
      }
    }
    canAfford = (actorWealth >= necessaryWealth);
    workflow.foodAndWaterCost = necessaryWealth;
  }

</script>

<div class="flex">

	{#if actorRequiredFood}
		{#if (actorRequiredFood - actorFoodSatedValue) > 0}
			<p>{@html localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.FoodRequirement", {
        food: Math.max(0, actorRequiredFood - newFoodSatedValue)
      })}</p>

			{#if externalFoodSourceAccess === "half" || externalFoodSourceAccess === "full"}
				<label class="checkbox">
					<input type="checkbox" bind:checked={hasAccessToFood} on:change={toggleAccessToFood}/>
					{localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.ExternalFood")}
				</label>

				{#if hasAccessToFood}
					<p>
						<label class="checkbox">
							<input type="radio" value="full" bind:group={halfFood} disabled={externalFoodSourceAccess === "half"}
										 on:change={toggleAmountOfFood}/>
							{localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.ExternalFoodFull")}
						</label>
						<label class="checkbox">
							<input type="radio" value="half" bind:group={halfFood} on:change={toggleAmountOfFood}/>
							{localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.ExternalFoodHalf")}
						</label>
            {#if externalFoodSourceHasCost && foodCost > 0}
              <p class="notes">{@html localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.ExternalCost", {
                cost: foodCost,
                currency: foodCurrency
              })}</p>
            {/if}
					</p>
				{/if}
			{/if}
		{:else}
			<p>{@html localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.FoodSated")}</p>
		{/if}
	{/if}

	{#if actorRequiredWater}
		{#if (actorRequiredWater - actorWaterSatedValue) > 0}
			<p>{@html localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.WaterRequirement", {
        water: Math.max(0, actorRequiredWater - newWaterSatedValue)
      })}</p>

			{#if externalWaterSourceAccess === "half" || externalWaterSourceAccess === "full"}
				<label class="checkbox">
					<input type="checkbox" class="red" bind:checked={hasAccessToWater} on:change={toggleAccessToWater}/>
					{localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.ExternalWater")}
				</label>

				{#if hasAccessToWater}
					<p>
						<label class="checkbox">
							<input type="radio" value="full" bind:group={halfWater} disabled={externalWaterSourceAccess === "half"}
										 on:change={toggleAmountOfWater}/>
							{localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.ExternalWaterFull")}
						</label>
						<label class="checkbox">
							<input type="radio" value="half" bind:group={halfWater} on:change={toggleAmountOfWater}/>
							{localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.ExternalWaterHalf")}
						</label>
            {#if externalWaterSourceHasCost && waterCost > 0}
              <p class="notes">{@html localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.ExternalCost", {
                cost: waterCost,
                currency: waterCurrency
              })}</p>
            {/if}
					</p>
				{/if}
			{/if}
		{:else}
			<p>{@html localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.WaterSated")}</p>
		{/if}
	{/if}

	{#if (!hasAccessToFood || !hasAccessToWater) && $consumableItems.length}
		<div class="items-container">
			{#each $consumableItems as item, index (item.id)}
				<div class="item-container">
					<div class="flexcol">
						<span class="item-name">{item.fullName}</span>
						<label>
							<input type="number" bind:value={item.amount} step="0.5" on:change={() => {
                            item.amount = Math.max(0.5, Math.min(item.totalUsesLeft, roundHalf(item.amount)));
                            calculateAmountOfItems();
                        }}/>
							{#if !item.consumable.dayWorth}
								{localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.AmountToConsume")}
							{:else}
								{localize("REST-RECOVERY.Dialogs.AbilityUse.DayWorthTitle" + capitalizeFirstLetter(item.consumable.type))}
							{/if}
						</label>
					</div>

					<button type="button" on:click={() => { removeConsumableItem(index) }}>
						<i class="fas fa-times"></i>
					</button>
				</div>
			{/each}
		</div>
	{/if}

	{#if actorConsumableItems.length && ((actorRequiredFood && actorFoodSatedValue < actorRequiredFood && !hasAccessToFood) || (actorRequiredWater && actorWaterSatedValue < actorRequiredWater && !hasAccessToWater))}
		<div class="dragDropBox" on:dragstart={preventDefault} on:drop={dropData} on:dragover={preventDefault}>
			<div class="form-fields">
				<p>{localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.DragDrop")}</p>
				<div class="flexrow">
					<select bind:value={selectedItem}>
						{#each actorConsumableItems as item, index (item.id)}
							<option value={item.id}>{item.name}</option>
						{/each}
					</select>
					<button class="consumable-add-button" type="button" on:click={() => { addConsumableItem(selectedItem) }}><i
						class="fas fa-plus"></i></button>
				</div>
			</div>
		</div>
	{/if}

	{#if enableAutomatedExhaustion}
		{#if actorRequiredFood && newFoodSatedValue < actorRequiredFood}
			{#if actorDaysWithoutFood < actorExhaustionThreshold}
				<p>{@html localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.FoodAlmostExhaustion", {
          days: (actorExhaustionThreshold - actorDaysWithoutFood) * (newFoodSatedValue > 0 && newFoodSatedValue <= (actorRequiredFood / 2) ? 2 : 1)
        })}</p>
			{:else}
				<p>{@html localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.FoodExhaustion")}</p>
			{/if}
		{/if}

		{#if actorRequiredWater}
			{#if newWaterSatedValue > 0 && newWaterSatedValue <= (actorRequiredWater / 2)}
				<p>{@html localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.HalfWater", {
          dc: halfWaterSaveDC,
          exhaustion: actorExhaustion > 0 ? 2 : 1
        })}</p>
			{:else if newWaterSatedValue === 0}
				<p>{@html localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.NoWater", { exhaustion: actorExhaustion > 0 ? 2 : 1 })}</p>
			{/if}
		{/if}
	{/if}
  {#if !canAfford}
        <p>{@html localize("REST-RECOVERY.Dialogs.RestSteps.FoodWater.CantAfford")}</p>
  {/if}


</div>

<style lang="scss">

  .items-container {
    margin: 0.5rem 0;

    .item-container {
      display: flex;
      border-radius: 5px;
      padding: 5px;

      & > div {
        flex: 1;
      }

      .item-name {
        font-size: 1rem;
        flex: 1;
      }

      label {
        flex: 0 1 auto;

        input {
          font-size: 0.75rem;
          height: 1rem;
          max-width: 2rem;
        }
      }

      button {
        line-height: 0;
        flex: 0 1 43px;
        margin-left: 1rem;
      }
    }

    .item-container:not(:last-child) {
      margin-bottom: 0.5rem;
    }

    .item-container:nth-child(even) {
      background: rgba(0, 0, 0, 0.15);
    }

    .item-container:nth-child(odd) {
      background: rgba(255, 255, 255, 0.25);
    }

  }

  .dragDropBox {
    position: relative;
    display: grid;
    place-items: center;
    width: 100%;
    min-height: 100px;
    border-radius: 5px;
    border: 2px dashed rgba(0, 0, 0, 0.25);
    margin-top: 0.5rem;

    button {
      flex: 0 1 30px;
      line-height: 0;
      font-size: 0.5rem;
    }
  }

</style>
