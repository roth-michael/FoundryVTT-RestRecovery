import registerSettings from "./settings.js";
import registerLibwrappers from "./libwrapper.js";
import RestWorkflow from "./rest-workflow.js";
import registerSheetOverrides from "./sheet-overrides.js";

Hooks.once("init", () => {
    registerSettings();
    registerLibwrappers();
    registerSheetOverrides();
    RestWorkflow.intitialize();
    console.log("Rest Recovery 5e | Initialized");
});