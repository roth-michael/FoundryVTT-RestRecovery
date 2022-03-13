import registerSettings from "./settings.js";
import registerLibwrappers from "./libwrapper.js";
import SettingsShim from "./formapplications/settings/settings.js";
import { ordinalSuffixOf } from "./lib/lib.js";
import RestWorkflow from "./rest-workflow.js";

Hooks.once("init", () => {
    registerSettings();
    registerLibwrappers();
    console.log("Rest Recovery | Initialized");
});

Hooks.once("ready", () => {
    new SettingsShim().render(true)
    //ShortRestDialog.show(game.actors.getName("Jonathan"), true);
    game.actors.getName("Jonathan").shortRest();
})

Hooks.on('updateActor', (actor) => {
    const workflow = RestWorkflow.get(actor);
    if(workflow && !foundry.utils.isObjectEmpty(workflow.recoveredSlots)){
        Hooks.once("preCreateChatMessage", (message, data) => {
            let newContent = `<p>${data.content}</p><p>${game.i18n.localize("REST-RECOVERY.Chat.RegainedSpellSlots")}</p>`;
            newContent += "<ul>";
            for(const [level, num] of Object.entries(workflow.recoveredSlots)){
                const numText = game.i18n.localize("REST-RECOVERY.NumberToText."+num);
                const levelText = ordinalSuffixOf(level);
                const localization = "REST-RECOVERY.Chat.SpellSlotList" + (num > 1 ? "Plural" : "");
                newContent += `<li>${game.i18n.format(localization, { number: numText, level: levelText })}</li>`
            }
            newContent += "</ul>";
            message.data.update({
                content: newContent
            })
        })
    }
});

Hooks.on("restCompleted", (actor) => {
    RestWorkflow.remove(actor);
});