import { getSetting } from "./lib/lib.js";
import CONSTANTS from "./constants.js";
import { PromptRestApplication } from "./apps/promptRest.js";

export default function registerHooks(){
  Hooks.on("renderPlayers", (app, html) => {

    if (!game.user.isGM || !getSetting(CONSTANTS.SETTINGS.SHOW_PLAYER_LIST_REST_BUTTON)) return;

    const minimalUI = game.modules.get('minimal-ui')?.active;
    const itemPiles = game.modules.get('item-piles')?.active;

    const classes = "rest-recovery-prompt-rest-button" + (minimalUI ? " minimal-ui-button" : "");

    let targetElement = html.querySelector('#players-active .players-list');
    // TODO: remove extra selector once item piles fixes
    const tradeButton = html.querySelector(".item-piles-player-list-trade-button,.item-piles-player-list-trade-buttonitem-piles-v13");
    if (itemPiles && tradeButton && !minimalUI) {
      tradeButton.innerHTML = `<i class="fas fa-handshake"></i> ${game.i18n.localize("ITEM-PILES.PlayerList.TradeButton")}`;
      tradeButton.classList.add(classes);
      const parent = document.createElement("div");
      parent.classList.add("rest-recovery-button-parent");
      parent.append(tradeButton);
      targetElement.after(parent);
      targetElement = tradeButton;
    }
    const text = !minimalUI ? (itemPiles && tradeButton ? game.i18n.localize("REST-RECOVERY.Dialogs.PromptRest.PlayerListShort") : game.i18n.localize("REST-RECOVERY.Dialogs.PromptRest.PlayerListFull")) : "";
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.classList.add(classes);
    button.innerHTML = `<i class="fa-solid fa-bed"></i>${text}`;

    button.addEventListener("click", () => {
      new PromptRestApplication().render(true);
    });

    targetElement.after(button);

  });
}
