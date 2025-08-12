import CONSTANTS from "../constants";
import { getRestFlavor } from "../helpers";
import { getSetting, getTimeChanges, localize, setSetting, settingsDialog } from "../lib/lib";
import { gameSettings } from "../settings";
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
    this.configuration = new Set(savedConfig.filter(actorId => game.actors.get(actorId)));
    this.profiles = Object.keys(gameSettings.profiles);
    this.activeProfile = gameSettings.activeProfile;
    this.actorList = options.actorList ?? [];
    this.priorityActors = Array.from(game.scenes.get(game.user.viewedScene)?.tokens?.values()).map(t => t?.actor).filter(a => !!a) ?? [];
    this.otherActors = Array.from(game.actors).filter(a => !this.priorityActors.some(priActor => priActor.id === a.id));
    this.validActors = [...this.priorityActors, ...this.otherActors].map(a => [a.id, a.name]);
    for (const [currId, currName] of this.actorList) {
      if (!this.validActors.some(curr => curr[0] === currId)) this.validActors.push([currId, currName]);
    }
    this.useCalendar = getSetting(CONSTANTS.SETTINGS.ENABLE_CALENDAR_INTEGRATION);
    this.longRestWouldBeNewDay = getTimeChanges(true).isNewDay;
    this.shortRestWouldBeNewDay = getTimeChanges(false).isNewDay;
    const { enabled: bastionsEnabled, duration: bastionDays } = game.settings.get("dnd5e", "bastionConfiguration");
    this.bastionsEnabled = bastionsEnabled;
    this.bastionDays = bastionDays;
    this.forcedType = options.forcedType;
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.configuration = [...this.configuration];
    context.validActors = Array.from(this.validActors);
    context.profiles = this.profiles;
    context.activeProfile = this.activeProfile;
    context.useCalendar = this.useCalendar;
    context.longRestWouldBeNewDay = this.longRestWouldBeNewDay;
    context.shortRestWouldBeNewDay = this.shortRestWouldBeNewDay;
    const noNewDay = context.useCalendar && !context.longRestWouldBeNewDay && !context.shortRestWouldBeNewDay;
    const newDayTitleLocalization = `REST-RECOVERY.Dialogs.PromptRest.${noNewDay ? "No" : ""}NewDayTitle`;
    const newDayHintLocalization = `REST-RECOVERY.Dialogs.PromptRest.${noNewDay ? "No" : ""}NewDay${context.useCalendar ? "Calendar" : ""}Hint`;
    context.newDayTitle = localize(newDayTitleLocalization);
    context.newDayHint = localize(newDayHintLocalization);
    context.forceNewDay = this.forceNewDay;
    context.bastionsEnabled = this.bastionsEnabled;
    context.bastionDays = this.bastionDays;
    context.advanceBastionTurn = this.advanceBastionTurn;
    context.forcedType = this.forcedType;
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
    const actorId = event.target?.dataset?.actorId;
    if (!actorId) return;
    this.configuration.delete(actorId);
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

    const trueNewDay = this.useCalendar ? timeChanges.isNewDay : this.forceNewDay;

    if (this.configuration.size) {
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
          targets: Array.from(this.configuration).map(i => ({ actor: game.actors.get(i)?.uuid })).filter(i => i.actor),
        },
        type: "request"
      };
      await ChatMessage.create(messageData);
    }

    this.close();
  }
}