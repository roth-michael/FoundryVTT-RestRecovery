import registerSettings from "./settings.js";
import registerLibwrappers from "./libwrapper.js";
import RestWorkflow from "./rest-workflow.js";
import registerSheetOverrides from "./sheet-overrides.js";
import SettingsShim from "./formapplications/settings/settings.js";
import API from "./api.js";
import migrate from "./migrations.js";

Hooks.once("init", () => {
  registerSettings();
  registerLibwrappers();
  registerSheetOverrides();
  RestWorkflow.initialize();
  console.log("Rest Recovery 5e | Initialized");
});

Hooks.once("ready", () => {
  migrate();
  game.restrecovery = API;
  //new SettingsShim().render(true);
  //game.actors.getName("Krusk (Half-Orc Paladin)").longRest()
})