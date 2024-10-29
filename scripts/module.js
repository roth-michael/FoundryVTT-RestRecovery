import "../styles/style.scss";

import registerHooks from "./hooks.js";
import migrate from "./migrations.js";
import registerSheetOverrides from "./sheet-overrides.js";
import SocketHandler from "./sockets.js";
import RestWorkflow from "./rest-workflow.js";
import API from "./api.js";
import { gameSettings } from "./settings.js";
import SettingsShim from "./formapplications/settings/settings.js";
import { QuickSetup } from "./formapplications/quick-setup/quick-setup.js";
import { configureOneDndExhaustion, updateTidy5e, updateStatusEffects, configureExhaustionHooks } from "./helpers.js";

Hooks.once("init", () => {
  SocketHandler.initialize();
  gameSettings.initialize();
  registerSheetOverrides();
  RestWorkflow.initialize();
  registerHooks();
  configureOneDndExhaustion();
  console.log("Rest Recovery 5e | Initialized");
});

Hooks.once("ready", () => {
  migrate();
  game.restrecovery = API;
  gameSettings.cleanup();
  setTimeout(RestWorkflow.ready, 1000);
  setTimeout(configureExhaustionHooks, 1000);
  console.log("Rest Recovery 5e | Ready");
  // QuickSetup.show();
  //new SettingsShim().render(true);
  // game.actors.getName("Akra (Dragonborn Cleric)").longRest()
});

Hooks.once("tidy5e-sheet.ready", updateTidy5e);
Hooks.once("dfreds-convenient-effects.ready", updateStatusEffects);