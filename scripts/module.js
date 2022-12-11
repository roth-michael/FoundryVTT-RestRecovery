import "../styles/style.scss";

import SocketHandler from "./sockets.js";
import registerLibwrappers from "./libwrapper.js";
import RestWorkflow from "./rest-workflow.js";
import registerSheetOverrides from "./sheet-overrides.js";
import API from "./api.js";
import migrate from "./migrations.js";
import SettingsShim from "./formapplications/settings/settings.js";
import { gameSettings } from "./settings.js";
import { getSetting } from "./lib/lib.js";
import CONSTANTS from "./constants.js";
import PromptRestDialog from "./formapplications/prompt-rest/prompt-rest.js";

Hooks.once("init", () => {
  SocketHandler.initialize();
  gameSettings.initialize();
  registerLibwrappers();
  registerSheetOverrides();
  RestWorkflow.initialize();
  console.log("Rest Recovery 5e | Initialized");

  Hooks.on("renderPlayerList", (app, html) => {

    if (!game.user.isGM || !getSetting(CONSTANTS.SETTINGS.SHOW_PLAYER_LIST_REST_BUTTON)) return;

    const minimalUI = game.modules.get('minimal-ui')?.active;
    const itemPiles = game.modules.get('item-piles')?.active;

    const classes = "rest-recovery-prompt-rest-button" + (minimalUI ? " minimal-ui-button" : "");

    let parent = html;
    const tradeButton = html.find(".item-piles-player-list-trade-button");
    if (itemPiles && tradeButton.length && !minimalUI) {
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
});

Hooks.once("ready", () => {
  migrate();
  game.restrecovery = API;
  // new SettingsShim().render(true);
  // game.actors.getName("Akra (Dragonborn Cleric)").longRest()
})
