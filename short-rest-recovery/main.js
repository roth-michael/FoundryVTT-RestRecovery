import Actor5e from "../../systems/dnd5e/module/actor/entity.js";
import ShortRestDialog from "./new-short-rest.js";

Hooks.on("init", () => {

    patch_shortRest();

});

function ordinal_suffix_of(i) {
  var j, k;
  j = i % 10;
  k = i % 100;
  if(j === 1 && k !== 11) {
    return i + 'st';
  }
  if(j === 2 && k !== 12) {
    return i + 'nd';
  }
  if(j === 3 && k !== 13) {
    return i + 'rd';
  }
  return i + 'th';
};

function patch_shortRest() {

  Actor5e.prototype.shortRest = async function ({dialog=true, autoHD=false, autoHDThreshold=3}={}) {

    // Take note of the initial hit points and number of hit dice the Actor has
    const hp = this.data.data.attributes.hp;
    const hd0 = this.data.data.attributes.hd;
    const hp0 = hp.value;
    let rest_data = {
      newDay: false,
      levels_regained: false
    };
    
    let item = this.items.find(i => i.name.toLowerCase() === "arcane recovery" || i.name.toLowerCase() === "natural recovery");

    if(item && (item.data.data.activation.type != "special" || item.data.data.uses.value == null || item.data.data.uses.max == null || item.data.data.uses.per != "lr")){
      await this.updateEmbeddedEntity("OwnedItem", {
        _id: item._id,
        "data.activation.type": "special",
        "data.uses.value": 1,
        "data.uses.max": 1,
        "data.uses.per": "lr",
      });
      ui.notifications.info(`${this.name}'s ${item.name} has been patched, it now has 1/1 long rest uses.`);
    }

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

    let regained_spell_slots_string = false;

    if(rest_data.levels_regained){

      let spell_slots = ""
      let level = 0;
      for (let [k, v] of Object.entries(this.data.data.spells)) {

        if(!v.max && !v.override){
          continue;
        }
        level++;

        if(rest_data.levels_regained[level]){

          updateData[`data.spells.${k}.value`] = v.value + rest_data.levels_regained[level];
          spell_slots += `<li>${game.i18n.format('DND5E.SpellLevelSlotCount', { n: game.i18n.localize(`${rest_data.levels_regained[level]}`), level: ordinal_suffix_of(level) })}</li>`;

        }
      }

      regained_spell_slots_string = `<ul>${spell_slots}</ul>`;
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

    if(regained_spell_slots_string) {
      let item = this.items.find(i => i.name.toLowerCase() === "arcane recovery" || i.name.toLowerCase() === "natural recovery");
      updateItems.push({
        _id: item._id,
        "data.uses.value": 0
      })
    }

    await this.updateEmbeddedEntity("OwnedItem", updateItems);

    const chat = game.settings.get("short-rest-recovery", "showChatMessage");

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

      let content = game.i18n.format(srMessage, { name: this.name, dice: -dhd, health: dhp });

      if(regained_spell_slots_string){
        content += " " + game.i18n.format("DND5E.ShortRestSpellResult", { spellslots: regained_spell_slots_string });
      }

      // Create a chat message
      ChatMessage.create({
        user: game.user._id,
        speaker: {actor: this, alias: this.name},
        flavor: restFlavor,
        content: content
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
