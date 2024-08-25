import { getSetting } from "./lib/lib.js";
import CONSTANTS from "./constants.js";
import PromptRestDialog from "./formapplications/prompt-rest/prompt-rest.js";
import ResourceConfig from "./formapplications/resource-config/resource-config.js";

export default function registerHooks(){

  Hooks.on("renderPlayerList", (app, html) => {

    if (!game.user.isGM || !getSetting(CONSTANTS.SETTINGS.SHOW_PLAYER_LIST_REST_BUTTON)) return;

    const minimalUI = game.modules.get('minimal-ui')?.active;
    const itemPiles = game.modules.get('item-piles')?.active;

    const classes = "rest-recovery-prompt-rest-button" + (minimalUI ? " minimal-ui-button" : "");

    let parent = html;
    const tradeButton = html.find(".item-piles-player-list-trade-button");
    if (itemPiles && tradeButton.length && !minimalUI) {
      tradeButton.html(`<i class="fas fa-handshake"></i> ${game.i18n.localize("ITEM-PILES.PlayerList.TradeButton")}`);
      tradeButton.addClass(classes);
      parent = $(`<div class="rest-recovery-button-parent"></div>`);
      parent.append(tradeButton);
      html.append(parent);
    }
    const text = !minimalUI ? (itemPiles && tradeButton.length ? game.i18n.localize("REST-RECOVERY.Dialogs.PromptRest.PlayerListShort") : game.i18n.localize("REST-RECOVERY.Dialogs.PromptRest.PlayerListFull")) : "";
    const button = $(`<button type="button" class="${classes}"><i class="fas fa-bed"></i>${text}</button>`);

    button.click(() => {
      PromptRestDialog.show();
    });

    parent.append(button);

  });

  Hooks.once("tidy5e-sheet.ready", (api) => {
    api.config.actorTraits.registerActorTrait({
      title: game.i18n.localize("REST-RECOVERY.Dialogs.Resources.Configure"),
      iconClass: "fas fa-cog",
      alwaysShow: true,
      openConfiguration: ({app, data, element, event}) => {
        ResourceConfig.show({actor: app.actor});
      },
      openConfigurationTooltip: "Module: Rest Recovery for 5e",
    });
  });

}
