import registerSettings from "./settings.js";
import registerLibwrappers from "./libwrapper.js";
import RestWorkflow from "./rest-workflow.js";
import SettingsShim from "./formapplications/settings/settings.js";

Hooks.once("init", () => {
    registerSettings();
    registerLibwrappers();
    console.log("Rest Recovery 5e | Initialized");
});

Hooks.once("ready", () => {
    //new SettingsShim().render(true);
    game.actors.getName("Jonathan").longRest();
})

Hooks.on('updateActor', (actor) => {
    const workflow = RestWorkflow.get(actor);
    if (workflow && workflow.finished && !foundry.utils.isObjectEmpty(workflow.recoveredSlots)) {
        workflow.preFinishRestMessage();
    }
});

Hooks.on("restCompleted", (actor) => {
    RestWorkflow.remove(actor);
});
