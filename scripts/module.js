import "../styles/style.scss";

import registerHooks from "./hooks.js";
import migrate from "./migrations.js";
import registerSheetOverrides from "./sheet-overrides.js";
import SocketHandler from "./sockets.js";
import RestWorkflow from "./rest-workflow.js";
import API from "./api.js";
import { gameSettings } from "./settings.js";
import { configureOneDndExhaustion, updateTidy5e, configureExhaustionHooks } from "./helpers.js";

Hooks.once("init", () => {
  SocketHandler.initialize();
  gameSettings.initialize();
  registerSheetOverrides();
  RestWorkflow.initialize();
  registerHooks();
  configureOneDndExhaustion();
  Handlebars.registerHelper({
    "rest-recovery-includes": (v1, v2) => Array.from(v1).includes(v2)
  });

  // TODO: move elsewhere
  const partialPaths = [
    "components/health-bar",
    "components/hit-die-roller",
    "steps/food-water",
    "steps/long-rest-default",
    "steps/short-rest-default",
    "steps/spell-recovery",
    "steps/steps"
  ];
  const paths = {};
  for (const partialPath of partialPaths) {
    const pathArr = partialPath.split("/");
    const partial = pathArr.pop();
    const path = pathArr.join("/");
    paths[`rest-recovery.${partial}`] = `modules/rest-recovery/templates/${path}/${partial}.hbs`;
  }
  foundry.applications.handlebars.loadTemplates(paths);

  console.log("Rest Recovery 5e | Initialized");
});

Hooks.once("i18nInit", () => {
  for (const [key, value] of Object.entries(CONFIG.DND5E.consumableTypes.food.subtypes)) {
    CONFIG.DND5E.consumableTypes.food.subtypes[key] = game.i18n.localize(value);
  }
  CONFIG.DND5E.conditionTypes.exhaustion.reference = game.i18n.localize(CONFIG.DND5E.conditionTypes.exhaustion.reference);
})

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