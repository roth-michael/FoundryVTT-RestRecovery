import CONSTANTS from "./constants.js";
import SettingsShim from "./formapplications/settings/settings.js";
import { getSetting } from "./lib/lib.js";
import PromptRestDialog from "./formapplications/prompt-rest/prompt-rest.js";

export default function registerSettings() {

  game.settings.registerMenu(CONSTANTS.MODULE_NAME, "configureRest", {
    name: "REST-RECOVERY.Settings.Configure.Title",
    label: "REST-RECOVERY.Settings.Configure.Label",
    hint: "REST-RECOVERY.Settings.Configure.Hint",
    icon: "fas fa-bed",
    type: SettingsShim,
    restricted: true
  });

  for (const [name, data] of Object.entries(CONSTANTS.GET_DEFAULT_SETTINGS())) {
    game.settings.register(CONSTANTS.MODULE_NAME, name, data);
  }

  let customSettings = !!Object.entries(CONSTANTS.GET_DEFAULT_SETTINGS()).find(setting => {
    return getSetting(setting[0]) !== setting[1].default;
  })

  game.settings.register(CONSTANTS.MODULE_NAME, CONSTANTS.SETTINGS.ACTIVE_MODULE_PROFILE, {
    scope: "world",
    config: false,
    default: customSettings ? "Custom" : "Default",
    type: String
  });

  const moduleProfiles = {
    "Default": Object.fromEntries(Object.entries(CONSTANTS.GET_DEFAULT_SETTINGS()).map(entry => {
      return [entry[0], entry[1].default];
    }))
  };

  if (customSettings) {
    moduleProfiles["Custom"] = Object.fromEntries(Object.keys(CONSTANTS.GET_DEFAULT_SETTINGS()).map(key => {
      return [key, getSetting(key)];
    }));
  }

  game.settings.register(CONSTANTS.MODULE_NAME, CONSTANTS.SETTINGS.MODULE_PROFILES, {
    scope: "world",
    config: false,
    default: moduleProfiles,
    type: Object
  });

  game.settings.register(CONSTANTS.MODULE_NAME, CONSTANTS.SETTINGS.SHOW_PLAYER_LIST_REST_BUTTON, {
    name: "REST-RECOVERY.Settings.ShowPlayerListRestButton.Title",
    hint: "REST-RECOVERY.Settings.ShowPlayerListRestButton.Hint",
    scope: "client",
    config: true,
    default: true,
    type: Boolean
  });

  game.settings.register(CONSTANTS.MODULE_NAME, CONSTANTS.SETTINGS.QUICK_HD_ROLL, {
    name: "REST-RECOVERY.Settings.QuickHDRoll.Title",
    hint: "REST-RECOVERY.Settings.QuickHDRoll.Hint",
    scope: "client",
    config: true,
    default: true,
    type: Boolean
  });

  Hooks.on("renderPlayerList", (app, html) => {

    if(!game.user.isGM || !getSetting(CONSTANTS.SETTINGS.SHOW_PLAYER_LIST_REST_BUTTON)) return;

    const minimalUI = game.modules.get('minimal-ui')?.active;
    const itemPiles = game.modules.get('item-piles')?.active;

    const classes = "rest-recovery-prompt-rest-button" + (minimalUI ? " minimal-ui-button" : "");

    let parent = html;
    const tradeButton = html.find(".item-piles-player-list-trade-button");
    if(itemPiles && tradeButton.length && !minimalUI){
      tradeButton.html(`<i class="fas fa-handshake"></i> Trade`);
      tradeButton.addClass(classes);
      parent = $(`<div class="rest-recovery-button-parent"></div>`);
      parent.append(tradeButton);
      html.append(parent);
    }
    const text = !minimalUI ? (itemPiles && tradeButton.length ? "Rest" : "Prompt Rest") : "";
    const button = $(`<button type="button" class="${classes}"><i class="fas fa-bed"></i>${text}</button>`);

    button.click(() => {
      PromptRestDialog.show();
    });

    parent.append(button);

  });

}