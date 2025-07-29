import CONSTANTS from "../constants";
import { getRestFlavor } from "../helpers";
import { getSetting, getTimeChanges, localize, setSetting, settingsDialog } from "../lib/lib";
import { gameSettings } from "../settings";
import SocketHandler from "../sockets";
import { SettingsApplication } from "./settings";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class PromptRestApplication extends HandlebarsApplicationMixin(ApplicationV2) {
  forceNewDay = false;
  advanceBastionTurn = false;

  static PARTS = {
    dialog: {
      classes: ["dialog"],
      template: "modules/rest-recovery/templates/prompt-rest.hbs"
    }
  }

  static DEFAULT_OPTIONS = {
    tag: "form",
    classes: ["rest-recovery-request-app", "standard-form"],
    window: {
      title: "REST-RECOVERY.Dialogs.PromptRest.Title",
      resizable: true
    },
    position: {
      width: 350
    },
    actions: {
      addPlayer: PromptRestApplication.#onAddPlayer,
      removePlayer: PromptRestApplication.#onRemovePlayer,
      showCustomRules: PromptRestApplication.#onShowCustomRules,
      shortRest: PromptRestApplication.#onShortRest,
      longRest: PromptRestApplication.#onLongRest,
      showSettings: PromptRestApplication.#onShowSettings
    }
  };

  constructor(options = {}) {
    super(options);
    const maybeSavedConfig = options.actorList?.flatMap(curr => curr[0]) ?? foundry.utils.getProperty(game.user, CONSTANTS.FLAGS.PROMPT_REST_CONFIG);
    const savedConfig = maybeSavedConfig ?? Array.from(getSetting(CONSTANTS.SETTINGS.PROMPT_REST_CONFIG));
    this.groupActor = options.groupActor;
    this.configuration = new Set(savedConfig.filter(entry => {
      return game.users.get(entry.split("-")[0]) && game.actors.get(entry.split("-")[1]);
    }));
    this.profiles = Object.keys(gameSettings.profiles);
    this.activeProfile = gameSettings.activeProfile;
    this.actorList = options.actorList ?? [];
    this.priorityActors = Array.from(game.scenes.get(game.user.viewedScene)?.tokens?.values()).map(t => t?.actor).filter(a => !!a) ?? [];
    this.otherActors = Array.from(game.actors).filter(a => !this.priorityActors.some(priActor => priActor.id === a.id));
    const allPlayers = game.users.filter(user => !user.isGM);
    this.validActors = [...this.priorityActors, ...this.otherActors].reduce((acc, actor) => {
      for (const [userId, permissions] of Object.entries(actor.ownership)) {
        if (userId === "default") {
          if (permissions < 3) continue;
          if (!allPlayers.length) continue;
          for (const currPlayer of allPlayers) {
            const combinedId = `${currPlayer.id}-${actor.id}`;
            acc.push([combinedId, `${actor.name} (${currPlayer.name})`]);
          }
          break;
        }
        const user = game.users.get(userId);
        if (!user) continue;
        const combinedId = `${user.id}-${actor.id}`;
        if (user.isGM || permissions < 3) continue;
        acc.push([combinedId, `${actor.name} (${user.name})`]);
      }
      return acc;
    }, []);
    for (const [currCombined, currName] of this.actorList) {
      if (!this.validActors.some(curr => curr[0] === currCombined)) this.validActors.push([currCombined, currName]);
    }
    this.simpleCalendarActive = getSetting(CONSTANTS.SETTINGS.ENABLE_SIMPLE_CALENDAR_INTEGRATION);
    this.longRestWouldBeNewDay = getTimeChanges(true).isNewDay;
    this.shortRestWouldBeNewDay = getTimeChanges(false).isNewDay;
    const { enabled: bastionsEnabled, duration: bastionDays } = game.settings.get("dnd5e", "bastionConfiguration");
    this.bastionsEnabled = bastionsEnabled;
    this.bastionDays = bastionDays;
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.configuration = [...this.configuration];
    context.validActors = Array.from(this.validActors);
    context.profiles = this.profiles;
    context.activeProfile = this.activeProfile;
    context.simpleCalendarActive = this.simpleCalendarActive;
    context.longRestWouldBeNewDay = this.longRestWouldBeNewDay;
    context.shortRestWouldBeNewDay = this.shortRestWouldBeNewDay;
    const noNewDay = context.simpleCalendarActive && !context.longRestWouldBeNewDay && !context.shortRestWouldBeNewDay;
    const newDayTitleLocalization = `REST-RECOVERY.Dialogs.PromptRest.${noNewDay ? "No" : ""}NewDayTitle`;
    const newDayHintLocalization = `REST-RECOVERY.Dialogs.PromptRest.${noNewDay ? "No" : ""}NewDay${context.simpleCalendarActive ? "SimpleCalendar" : ""}Hint`;
    context.newDayTitle = localize(newDayTitleLocalization);
    context.newDayHint = localize(newDayHintLocalization);
    context.forceNewDay = this.forceNewDay;
    context.bastionsEnabled = this.bastionsEnabled;
    context.bastionDays = this.bastionDays;
    context.advanceBastionTurn = this.advanceBastionTurn;
    return context;
  }

  _onChangeForm(formConfig, event) {
    super._onChangeForm(formConfig, event);
    const target = event.target;
    if (target.id?.startsWith("config-actor-")) {
      this.configuration.delete(target.getAttribute("value"));
      this.configuration.add(target.value);
      return this.updateRestConfig();
    } else if (target.id === "active-profile") {
      this.activeProfile = target.value;
      gameSettings.setActiveProfile(this.activeProfile, true);
    } else if (target.type === "checkbox") {
      this[target.name] = target.checked;
    }
    this.render();
  }

  async updateRestConfig(rerender=true) {
    if (!this.actorList) return;
    await game.user.update({[CONSTANTS.FLAGS.PROMPT_REST_CONFIG]: [...this.configuration]});
    setSetting(CONSTANTS.SETTINGS.PROMPT_REST_CONFIG, [...this.configuration]);
    if (rerender) this.render();
  }

  get validRemainingIds() {
    return this.validActors.map(entry => entry[0]).filter(id => !this.configuration.has(id));
  }

  static #onAddPlayer() {
    if (!this.validRemainingIds.length) return;
    this.configuration.add(this.validRemainingIds[0]);
    this.updateRestConfig();
  }

  static #onRemovePlayer(event) {
    const comboId = event.target?.dataset?.combo;
    if (!comboId) return;
    this.configuration.delete(comboId);
    this.updateRestConfig();
  }

  static #onShowCustomRules() {
    if (this.activeProfile === "Default") return;
    settingsDialog(localize("REST-RECOVERY.Dialogs.LongRestSettingsDialog.Title"), gameSettings.activeProfileData);
  }

  static #onShowSettings() {
    new SettingsApplication().render(true);
  }

  static #onShortRest() {
    this.doRest("short");
  }
  
  static #onLongRest() {
    this.doRest("long");
  }

  async doRest(restType) {
    await gameSettings.setActiveProfile(this.activeProfile);
    await this.updateRestConfig(false);
    const timeChanges = getTimeChanges(restType === "long");

    if (getSetting(CONSTANTS.SETTINGS.ENABLE_PROMPT_REST_TIME_PASSING)) {
      await game.time.advance(timeChanges.restTime);
    }

    if (this.advanceBastionTurn) {
      await dnd5e.bastion.advanceAllBastions();
    }

    const trueNewDay = this.simpleCalendarActive ? timeChanges.isNewDay : this.forceNewDay;

    const useChatCard = getSetting(CONSTANTS.SETTINGS.USE_CHAT_CARD);
    if (this.configuration.size) {
      if (useChatCard) {
        const restConfig = CONFIG.DND5E.restTypes[restType];
        const speaker = this.groupActor
          ? ChatMessage.getSpeaker({ actor: this.groupActor, alias: this.groupActor.name })
          : ChatMessage.getSpeaker({ alias: game.user.name });
        const messageData = {
          flavor: getRestFlavor(timeChanges.restTime / 60, trueNewDay, restType === "long"),
          speaker,
          system: {
            button: {
              icon: restConfig?.icon ?? "fa-solid fa-bed",
              label: restConfig?.label ?? "Rest"
            },
            data: {
              newDay: trueNewDay,
              type: restType
            },
            handler: "rest",
            targets: Array.from(this.configuration).map(i => ({actor: game.actors.get(i.split("-")[1]) })).filter(i => i.actor),
          },
          type: "request"
        };
        await ChatMessage.create(messageData);
      } else {
        SocketHandler.emit(SocketHandler.PROMPT_REST, {
          userActors: [...this.configuration],
          restType: `${restType}Rest`,
          newDay: trueNewDay,
          promptNewDay: false
        });
      }
    }

    this.close();
  }
}