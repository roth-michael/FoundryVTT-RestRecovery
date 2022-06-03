import registerSettings from "./settings.js";
import registerLibwrappers from "./libwrapper.js";
import RestWorkflow from "./rest-workflow.js";
import registerSheetOverrides from "./sheet-overrides.js";
import SettingsShim from "./formapplications/settings/settings.js";
import API from "./api.js";

Hooks.once("init", () => {
    registerSettings();
    registerLibwrappers();
    registerSheetOverrides();
    RestWorkflow.initialize();
    console.log("Rest Recovery 5e | Initialized");
});

Hooks.once("ready", () => {
    window.restrecovery = API;

    // game.actors.getName("Zanna").sheet.render(true);

    // game.actors.getName("Zanna").items.getName("Waterskin").sheet.render(true);

    new SettingsShim().render(true);

})