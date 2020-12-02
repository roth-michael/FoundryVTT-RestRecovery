import Actor5e from "../../systems/dnd5e/module/actor/entity.js";
import ShortRestDialog from "./new-short-rest.js";

Hooks.on("init", () => {

    patch_shortRest();

});

function patch_shortRest() {

  Actor5e.prototype.shortRest = async function ({dialog=true, chat=false, autoHD=false, autoHDThreshold=3}={}) {

    // Take note of the initial hit points and number of hit dice the Actor has
    const hp = this.data.data.attributes.hp;
    const hd0 = this.data.data.attributes.hd;
    const hp0 = hp.value;
    let rest_data = {
      newDay: false,
      levels_regained: false
    };

    // Display a Dialog for rolling hit dice
    if ( dialog ) {
      try {
        rest_data = await ShortRestDialog.shortRestDialog({actor: this, canRoll: hd0 > 0});
      } catch(err) {
        return;
      }
    }

    // Automatically spend hit dice
    else if ( autoHD ) {
      while ( (hp.value + autoHDThreshold) <= hp.max ) {
        const r = await this.rollHitDie(undefined, {dialog: false});
        if ( r === null ) break;
      }
    }

    // Note the change in HP and HD which occurred
    const dhd = this.data.data.attributes.hd - hd0;
    const dhp = this.data.data.attributes.hp.value - hp0;

    // Recover character resources
    const updateData = {};
    for ( let [k, r] of Object.entries(this.data.data.resources) ) {
      if ( r.max && r.sr ) {
        updateData[`data.resources.${k}.value`] = r.max;
      }
    }

    // Recover pact slots.
    const pact = this.data.data.spells.pact;
    updateData['data.spells.pact.value'] = pact.override || pact.max;

    if(rest_data.levels_regained){

      let level = 0;
      for (let [k, v] of Object.entries(this.data.data.spells)) {

          if(!v.max && !v.override){
              continue;
          }
          level++;

          if(rest_data.levels_regained[level]){

              updateData[`data.spells.${k}.value`] = v.value + rest_data.levels_regained[level];

          }
      }

    }

    await this.update(updateData);

    // Recover item uses
    const recovery = rest_data.newDay ? ["sr", "day"] : ["sr"];
    const items = this.items.filter(item => item.data.data.uses && recovery.includes(item.data.data.uses.per));
    const updateItems = items.map(item => {
      return {
        _id: item._id,
        "data.uses.value": item.data.data.uses.max
      };
    });

    if(rest_data.levels_regained){
      let item = this.items.find(i => i.name.toLowerCase() === "arcane recovery");
      updateItems.push({
        _id: item._id,
        "data.uses.value": 0
      })
    }

    await this.updateEmbeddedEntity("OwnedItem", updateItems);

    // Display a Chat Message summarizing the rest effects
    if ( chat ) {

      // Summarize the rest duration
      let restFlavor;
      switch (game.settings.get("dnd5e", "restVariant")) {
        case 'normal': restFlavor = game.i18n.localize("DND5E.ShortRestNormal"); break;
        case 'gritty': restFlavor = game.i18n.localize(rest_data.newDay ? "DND5E.ShortRestOvernight" : "DND5E.ShortRestGritty"); break;
        case 'epic':  restFlavor = game.i18n.localize("DND5E.ShortRestEpic"); break;
      }

      // Summarize the health effects
      let srMessage = "DND5E.ShortRestResultShort";
      if ((dhd !== 0) && (dhp !== 0)) srMessage = "DND5E.ShortRestResult";

      // Create a chat message
      ChatMessage.create({
        user: game.user._id,
        speaker: {actor: this, alias: this.name},
        flavor: restFlavor,
        content: game.i18n.format(srMessage, {name: this.name, dice: -dhd, health: dhp})
      });
    }

    // Return data summarizing the rest effects
    return {
      dhd: dhd,
      dhp: dhp,
      updateData: updateData,
      updateItems: updateItems,
      newDay: rest_data.newDay
    }
  }
}
