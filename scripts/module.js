import "../styles/style.scss";

import registerHooks from "./hooks.js";
import migrate from "./migrations.js";
import registerSheetOverrides from "./sheet-overrides.js";
import SocketHandler from "./sockets.js";
import RestWorkflow from "./rest-workflow.js";
import API from "./api.js";
import { gameSettings } from "./settings.js";
import { configureOneDndExhaustion, updateTidy5e, configureExhaustionHooks } from "./helpers.js";
import { SvelteApplication } from "#runtime/svelte/application";
import { TJSPosition } from "#runtime/svelte/store/position";

Hooks.once("init", () => {
  SocketHandler.initialize();
  gameSettings.initialize();
  registerSheetOverrides();
  RestWorkflow.initialize();
  registerHooks();
  configureOneDndExhaustion();
  Object.defineProperty(SvelteApplication, 'defaultOptions', {
    get: () => {
      return foundry.utils.mergeObject(Application.defaultOptions, {
        // Copied directly from TRL except for minWidth and minHeight
        defaultCloseAnimation: true,
        draggable: true,
        focusAuto: true,
        focusKeep: false,
        focusSource: void 0,
        focusTrap: true,
        headerButtonNoClose: false,
        headerButtonNoLabel: false,
        headerIcon: void 0,
        headerNoTitleMinimized: false,
        minHeight: 50, // MIN_WINDOW_HEIGHT
        minWidth: 200, // MIN_WINDOW_WIDTH
        positionable: true,
        positionInitial: TJSPosition.Initial.browserCentered,
        positionOrtho: true,
        positionValidator: TJSPosition.Validators.transformWindow,
        sessionStorage: void 0,
        svelte: void 0,
        transformOrigin: "top left"
      }, { inPlace: false });
    }
  });
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