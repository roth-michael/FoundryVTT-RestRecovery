import "../styles/style.scss";

import registerSettings from "./settings.js";
import SocketHandler from "./sockets.js";
import registerLibwrappers from "./libwrapper.js";
import RestWorkflow from "./rest-workflow.js";
import registerSheetOverrides from "./sheet-overrides.js";
import SettingsShim from "./formapplications/settings/settings.js";
import API from "./api.js";
import migrate from "./migrations.js";
import RequestRestDialog from "./formapplications/prompt-rest/prompt-rest.js";

Hooks.once("init", () => {
  SocketHandler.initialize();
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