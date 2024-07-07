import { TJSDialog } from "#runtime/svelte/application";
import CustomDialog from "./formapplications/components/Dialog.svelte";
import { wait } from "./lib/lib.js";
import { localize } from "#runtime/svelte/helper";
import CONSTANTS from "./constants.js";

export default class SocketHandler {

  static PROMPT_REST = "prompt-rest";

  static handlers = {
    [this.PROMPT_REST]: this._promptRest
  }

  static initialize() {
    game.socket.on("module.rest-recovery", (data, senderId) => {
      if (this.handlers[data.type]) {
        this.handlers[data.type](data.payload, senderId);
      }
    });
  }

  static emit(handler, data) {
    game.socket.emit('module.rest-recovery', {
      type: handler,
      payload: data
    });
    if (this.handlers[handler]) {
      this.handlers[handler](data, game.user.id);
    }
  }

  static async _promptRest(data, senderId) {

    const sender = game.users.get(senderId);
    const actorsToRest = [];
    const offlineResters = [];
    const otherResters = [];
    const isLongRest = data.restType === "longRest";
    for(const userActorPair of data.userActors){
      const [userId, actorId] = userActorPair.split('-');
      const user = game.users.get(userId);
      const actor = game.actors.get(actorId);

      if(!actor) continue;

      const preventRest = foundry.utils.getProperty(actor, CONSTANTS.FLAGS.DAE.PREVENT + data.restType);

      if(preventRest){
        if(sender === game.user) {
          await ChatMessage.create({
            content: `<p>${localize("REST-RECOVERY.Chat.CouldNot" + (isLongRest ? "LongRest" : "ShortRest"), { actorName: actor.name })}</p>`,
            speaker: {
              alias: actor.name
            }
          });
        }
      }else if(user === game.user){
        actorsToRest.push(actor);
      } else if (!user.active) {
        if (sender === game.user) {
          offlineResters.push(actor);
        } else {
          otherResters.push(actor);
        }
      }

    }

		const allActorsResting = actorsToRest.concat(offlineResters).concat(otherResters);

    const width = 425;
    const midPoint = window.innerWidth / actorsToRest.length;
    const indexOffset = actorsToRest.length > 1 ? (actorsToRest.length / 2) * -1 : 0;

    actorsToRest.forEach((actor, index) => {
      actor[data.restType]({
          newDay: data.newDay,
          promptNewDay: data.promptNewDay,
          restPrompted: true,
	        options: { actorsToRest: allActorsResting.map(actor => actor.uuid) }
        },
        indexOffset ? { left: midPoint + (indexOffset + index) * width } : {}
      );
    })

    if (!offlineResters.length) return;

    await wait(250);

    const doContinue = await TJSDialog.confirm({
      title: game.i18n.localize("REST-RECOVERY.Dialogs.CharacterOwnersOffline.Title"),
      content: {
        class: CustomDialog,
        props: {
          icon: "fas fa-exclamation-triangle",
          header: game.i18n.localize("REST-RECOVERY.Dialogs.CharacterOwnersOffline.Title"),
          content: game.i18n.localize("REST-RECOVERY.Dialogs.CharacterOwnersOffline.Content"),
          extraContent: offlineResters.map(actor => actor.name).join(', ')
        }
      },
      modal: true,
      draggable: false,
      options: {
        height: "auto",
        headerButtonNoClose: true
      }
    });

    if (!doContinue) {
      return false;
    }

    const offlineMidPoint = window.innerWidth / 2;
    const offlineIndexOffset = offlineResters.length > 1 ? (offlineResters.length / 2) * -1 : 0;

    offlineResters.forEach((actor, index) => {
      actor[data.restType]({
          newDay: data.newDay,
          promptNewDay: data.promptNewDay,
          restPrompted: true,
          options: { actorsToRest: allActorsResting.map(actor => actor.uuid) } 
        },
	      offlineIndexOffset ? { left: offlineMidPoint + (offlineIndexOffset + index) * width } : {}
      );
    });

  }


}
