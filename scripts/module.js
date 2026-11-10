import "../styles/style.scss";

import registerHooks from "./hooks.js";
import migrate from "./migrations.js";
import registerSheetOverrides from "./sheet-overrides.js";
import RestWorkflow from "./rest-workflow.js";
import API from "./api.js";
import { gameSettings } from "./settings.js";
import { configureOneDndExhaustion, updateTidy5e, configureExhaustionHooks } from "./helpers.js";
import CONSTANTS from "./constants.js";

Hooks.once("init", () => {
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

  CONFIG.DND5E.itemProperties.daysWorth = {
    label: "REST-RECOVERY.DaysWorth"
  };
  CONFIG.DND5E.validProperties.consumable.food.add("daysWorth");

  console.log("Rest Recovery 5e | Initialized");
});

Hooks.once("i18nInit", () => {
  CONFIG.DND5E.conditionTypes.exhaustion.reference = game.i18n.localize(CONFIG.DND5E.conditionTypes.exhaustion.reference);
});

Hooks.on("dnd5e.initializeItemSource", (item, source, options) => {
  if (source.type !== "consumable") return;
  if (source.system?.type?.value !== "food") return;
  const isFood = ["food", "both"].includes(source.system.type.subtype);
  const isWater = ["water", "both"].includes(source.system.type.subtype);
  const isDaysWorth = foundry.utils.getProperty(source, CONSTANTS.FLAGS.CONSUMABLE_DAY_WORTH);
  if (!isFood && !isWater && !isDaysWorth) return;
  source.system.properties ??= [];
  if (isFood) {
    source.system.type.subtype = "";
    source.system.properties.push("nutritious");
  }
  if (isWater) {
    source.system.type.subtype = "";
    source.system.properties.push("hydrating");
  }
  if (isDaysWorth) source.system.properties.push("daysWorth");
});

Hooks.once("ready", () => {
  if (game.user.isGM) migrate();
  game.restrecovery = API;
  gameSettings.cleanup();
  setTimeout(RestWorkflow.ready, 1000);
  setTimeout(configureExhaustionHooks, 1000);
  console.log("Rest Recovery 5e | Ready");
});

Hooks.once("tidy5e-sheet.ready", updateTidy5e);