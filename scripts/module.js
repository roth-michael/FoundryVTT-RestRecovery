import registerSettings from "./settings.js";
import registerLibwrappers from "./libwrapper.js";
import RestWorkflow from "./rest-workflow.js";
import SettingsShim from "./formapplications/settings/settings.js";
import registerSheetOverrides from "./sheet-overrides.js";

Hooks.once("init", () => {
    registerSettings();
    registerLibwrappers();
    registerSheetOverrides()
    console.log("Rest Recovery 5e | Initialized");
});

/*Hooks.on("ready", () => {
    new SettingsShim().render(true);
})*/

Hooks.on('updateActor', (actor) => {
    const workflow = RestWorkflow.get(actor);
    if (workflow && workflow.finished) {
        workflow.preFinishRestMessage();
    }
});

Hooks.on("restCompleted", (actor) => {
    RestWorkflow.remove(actor);
});