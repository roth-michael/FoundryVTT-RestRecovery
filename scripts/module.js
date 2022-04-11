import registerSettings from "./settings.js";
import registerLibwrappers from "./libwrapper.js";
import RestWorkflow from "./rest-workflow.js";
import SettingsShim from "./formapplications/settings/settings.js";
import ResourceConfig from "./formapplications/resource-config/resource-config.js";

Hooks.once("init", () => {
    registerSettings();
    registerLibwrappers();
    console.log("Rest Recovery 5e | Initialized");
});

Hooks.on("ready", () => {
    new ResourceConfig(game.actors.getName("Another Player")).render(true)
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
