import "../styles/style.scss";

import registerLibwrappers from "./libwrapper.js";
import registerHooks from "./hooks.js";
import migrate from "./migrations.js";
import registerSheetOverrides from "./sheet-overrides.js";
import SocketHandler from "./sockets.js";
import RestWorkflow from "./rest-workflow.js";
import API from "./api.js";
import { gameSettings } from "./settings.js";
import SettingsShim from "./formapplications/settings/settings.js";
import { QuickSetup } from "./formapplications/quick-setup/quick-setup.js";

Hooks.once("init", () => {
  SocketHandler.initialize();
  gameSettings.initialize();
  registerLibwrappers();
  registerSheetOverrides();
  RestWorkflow.initialize();
  registerHooks();
  console.log("Rest Recovery 5e | Initialized");
});

Hooks.once("ready", () => {
  migrate();
  game.restrecovery = API;
  gameSettings.cleanup();
  gameSettings.configureOneDndExhaustion();
  // QuickSetup.show();
  //new SettingsShim().render(true);
  // game.actors.getName("Akra (Dragonborn Cleric)").longRest()
})
