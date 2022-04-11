const CONSTANTS = {
  MODULE_NAME: "rest-recovery",
  FLAG_NAME: "data",
  SETTINGS: {
    /*-------------------------------------------*
     *           General Rest Settings           *
     *-------------------------------------------*/
    ENABLE_AUTO_ROLL_HIT_DICE: "enable-auto-roll-hit-dice",

    /*-------------------------------------------*
     *            Short Rest Settings            *
     *-------------------------------------------*/
    IGNORE_INACTIVE_PLAYERS: "ignore-inactive-players",
    MAX_SHORT_RESTS: "max-short-rests-per-long-rest",

    /*-------------------------------------------*
     *             Long Rest Settings            *
     *-------------------------------------------*/
    LONG_REST_ROLL_HIT_DICE: "long-rest-roll-hit-dice",
    PRE_REST_REGAIN_HIT_DICE: "pre-rest-regain-hit-dice",
    PRE_REST_REGAIN_BUFFER: "pre-rest-regain-hit-dice-buffer",
    HD_ROUNDING: "recovery-rounding",
    HP_MULTIPLIER: "recovery-hitpoints",
    HD_MULTIPLIER: "recovery-hitdice",
    RESOURCES_MULTIPLIER: "recovery-resources",
    SPELLS_MULTIPLIER: "recovery-spells",
    USES_OTHERS_MULTIPLIER: "recovery-uses-others",
    USES_FEATS_MULTIPLIER: "recovery-uses-feats",
    USES_DAILY_MULTIPLIER: "recovery-day",
    HP_MULTIPLIER_FORMULA: "recovery-hitpoints-formula",
    HD_MULTIPLIER_FORMULA: "recovery-hitdice-formula",
    RESOURCES_MULTIPLIER_FORMULA: "recovery-resources-formula",
    SPELLS_MULTIPLIER_FORMULA: "recovery-spells-formula",
    USES_OTHERS_MULTIPLIER_FORMULA: "recovery-uses-others-formula",
    USES_FEATS_MULTIPLIER_FORMULA: "recovery-uses-feats-formula",
    USES_DAILY_MULTIPLIER_FORMULA: "recovery-day-formula",

    /*-------------------------------------------*
     *               Item names                  *
     *-------------------------------------------*/
    WIZARD_CLASS: "wizard-class-name",
    DRUID_CLASS: "druid-class-name",
    BARD_CLASS: "bard-class-name",
    ARCANE_RECOVERY: "arcane-recovery-feature-name",
    NATURAL_RECOVERY: "natural-recovery-feature-name",
    SONG_OF_REST: "song-of-rest-name",
    CHEF_FEAT: "chef-feat-name",
    CHEF_TOOLS: "chef-tools-name",
    DURABLE_FEAT: "durable-feat-name",
    PERIAPT_ITEM: "periapt-item-name",
    WOUND_CLOSURE_BLESSING: "wound-closure-blessing-name",
    BLACK_BLOOD_FEATURE: "black-blood-feature-name"
  },
  RECOVERY: {
    FULL: "full",
    HALF: "half",
    QUARTER: "quarter",
    NONE: "none",
    CUSTOM: "custom_formula",
    UP: "up",
    DOWN: "down"
  },

  USING_DEFAULT_LONG_REST_SETTINGS() {
    const settings = this.GET_DEFAULT_SETTINGS();

    for (const [key, setting] of Object.entries(settings)) {
      if (setting.group !== "longrest") continue;
      if (game.settings.get(this.MODULE_NAME, key) !== setting.default) return false;
    }

    return true;
  },

  GET_DEFAULT_SETTINGS() {
    return foundry.utils.deepClone(CONSTANTS.DEFAULT_SETTINGS);
  }

};
CONSTANTS.DEFAULT_SETTINGS = {
  /*-------------------------------------------*
   *           General Rest Settings           *
   *-------------------------------------------*/
  [CONSTANTS.SETTINGS.ENABLE_AUTO_ROLL_HIT_DICE]: {
    name: "REST-RECOVERY.Settings.LongRest.EnableAutoRollButton.Title",
    hint: "REST-RECOVERY.Settings.LongRest.EnableAutoRollButton.Hint",
    scope: "world",
    group: "general",
    config: false,
    default: true,
    type: Boolean
  },

  /*-------------------------------------------*
   *            Short Rest Settings            *
   *-------------------------------------------*/
  [CONSTANTS.SETTINGS.IGNORE_INACTIVE_PLAYERS]: {
    name: "REST-RECOVERY.Settings.ShortRest.IgnoreInactive.Title",
    hint: "REST-RECOVERY.Settings.ShortRest.IgnoreInactive.Hint",
    scope: "world",
    group: "shortrest",
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.MAX_SHORT_RESTS]: {
    name: "REST-RECOVERY.Settings.ShortRest.MaxShortRests.Title",
    hint: "REST-RECOVERY.Settings.ShortRest.MaxShortRests.Hint",
    scope: "world",
    group: "shortrest",
    customSettingsDialog: true,
    config: false,
    default: 0,
    type: Number
  },

  /*-------------------------------------------*
   *             Long Rest Settings            *
   *-------------------------------------------*/
  [CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE]: {
    name: "REST-RECOVERY.Settings.LongRest.RollHitDice.Title",
    hint: "REST-RECOVERY.Settings.LongRest.RollHitDice.Hint",
    scope: "world",
    group: "longrest",
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE]: {
    name: "REST-RECOVERY.Settings.LongRest.PreRegainHitDice.Title",
    hint: "REST-RECOVERY.Settings.LongRest.PreRegainHitDice.Hint",
    scope: "world",
    group: "longrest",
    validate: CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE,
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.PRE_REST_REGAIN_BUFFER]: {
    name: "REST-RECOVERY.Settings.LongRest.PreRegainHitDiceBuffer.Title",
    hint: "REST-RECOVERY.Settings.LongRest.PreRegainHitDiceBuffer.Hint",
    scope: "world",
    group: "longrest",
    validate: CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE,
    config: false,
    default: false,
    type: Boolean
  },
  [CONSTANTS.SETTINGS.HP_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.LongRest.HitPointsRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.LongRest.HitPointsRecoveryFraction.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    customFormula: CONSTANTS.SETTINGS.HP_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.RECOVERY.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.RECOVERY.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.RECOVERY.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.RECOVERY.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.RECOVERY.CUSTOM]: "REST-RECOVERY.Fractions.Custom"
    },
    default: "full"
  },
  [CONSTANTS.SETTINGS.HP_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "longrest",
    config: false,
    hidden: true,
    type: String,
    default: "@attributes.hp.max"
  },
  [CONSTANTS.SETTINGS.HD_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.LongRest.HitDiceRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.LongRest.HitDiceRecoveryFraction.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    customFormula: CONSTANTS.SETTINGS.HD_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.RECOVERY.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.RECOVERY.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.RECOVERY.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.RECOVERY.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.RECOVERY.CUSTOM]: "REST-RECOVERY.Fractions.Custom"
    },
    default: "half"
  },
  [CONSTANTS.SETTINGS.HD_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "longrest",
    config: false,
    hidden: true,
    type: String,
    default: "@details.level / 2"
  },
  [CONSTANTS.SETTINGS.HD_ROUNDING]: {
    name: "REST-RECOVERY.Settings.LongRest.HitDiceRecoveryRounding.Title",
    hint: "REST-RECOVERY.Settings.LongRest.HitDiceRecoveryRounding.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    config: false,
    type: String,
    choices: {
      down: "REST-RECOVERY.Rounding.RoundDown",
      up: "REST-RECOVERY.Rounding.RoundUp"
    },
    default: "down"
  },
  [CONSTANTS.SETTINGS.RESOURCES_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.LongRest.ResourcesRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.LongRest.ResourcesRecoveryFraction.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    customFormula: CONSTANTS.SETTINGS.RESOURCES_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.RECOVERY.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.RECOVERY.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.RECOVERY.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.RECOVERY.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.RECOVERY.CUSTOM]: "REST-RECOVERY.Fractions.Custom"
    },
    default: "full"
  },
  [CONSTANTS.SETTINGS.RESOURCES_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "longrest",
    config: false,
    hidden: true,
    type: String,
    default: "@resource.max"
  },
  [CONSTANTS.SETTINGS.SPELLS_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.LongRest.SpellSlotsRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.LongRest.SpellSlotsRecoveryFraction.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    customFormula: CONSTANTS.SETTINGS.SPELLS_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.RECOVERY.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.RECOVERY.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.RECOVERY.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.RECOVERY.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.RECOVERY.CUSTOM]: "REST-RECOVERY.Fractions.Custom"
    },
    default: "full"
  },
  [CONSTANTS.SETTINGS.SPELLS_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "longrest",
    config: false,
    hidden: true,
    type: String,
    default: "@slot.max"
  },
  [CONSTANTS.SETTINGS.USES_OTHERS_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.LongRest.ItemUsesRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.LongRest.ItemUsesRecoveryFraction.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    customFormula: CONSTANTS.SETTINGS.USES_OTHERS_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.RECOVERY.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.RECOVERY.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.RECOVERY.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.RECOVERY.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.RECOVERY.CUSTOM]: "REST-RECOVERY.Fractions.Custom"
    },
    default: "full"
  },
  [CONSTANTS.SETTINGS.USES_OTHERS_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "longrest",
    config: false,
    hidden: true,
    type: String,
    default: "@uses.max"
  },
  [CONSTANTS.SETTINGS.USES_FEATS_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.LongRest.FeatUsesRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.LongRest.FeatUsesRecoveryFraction.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    customFormula: CONSTANTS.SETTINGS.USES_FEATS_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.RECOVERY.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.RECOVERY.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.RECOVERY.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.RECOVERY.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.RECOVERY.CUSTOM]: "REST-RECOVERY.Fractions.Custom"
    },
    default: "full"
  },
  [CONSTANTS.SETTINGS.USES_FEATS_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "longrest",
    config: false,
    hidden: true,
    type: String,
    default: "@uses.max"
  },
  [CONSTANTS.SETTINGS.USES_DAILY_MULTIPLIER]: {
    name: "REST-RECOVERY.Settings.LongRest.DailyUsesRecoveryFraction.Title",
    hint: "REST-RECOVERY.Settings.LongRest.DailyUsesRecoveryFraction.Hint",
    scope: "world",
    group: "longrest",
    customSettingsDialog: true,
    customFormula: CONSTANTS.SETTINGS.USES_DAILY_MULTIPLIER_FORMULA,
    config: false,
    type: String,
    choices: {
      [CONSTANTS.RECOVERY.NONE]: "REST-RECOVERY.Fractions.None",
      [CONSTANTS.RECOVERY.QUARTER]: "REST-RECOVERY.Fractions.Quarter",
      [CONSTANTS.RECOVERY.HALF]: "REST-RECOVERY.Fractions.Half",
      [CONSTANTS.RECOVERY.FULL]: "REST-RECOVERY.Fractions.Full",
      [CONSTANTS.RECOVERY.CUSTOM]: "REST-RECOVERY.Fractions.Custom"
    },
    default: "full"
  },
  [CONSTANTS.SETTINGS.USES_DAILY_MULTIPLIER_FORMULA]: {
    scope: "world",
    group: "longrest",
    config: false,
    hidden: true,
    type: String,
    default: "@uses.max"
  },

  /*-------------------------------------------*
   *               Item names                  *
   *-------------------------------------------*/
  [CONSTANTS.SETTINGS.WIZARD_CLASS]: {
    name: "REST-RECOVERY.Settings.ItemNames.WizardClassName.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.WizardClassName.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    default: "REST-RECOVERY.ClassNames.Wizard",
    type: String
  },
  [CONSTANTS.SETTINGS.DRUID_CLASS]: {
    name: "REST-RECOVERY.Settings.ItemNames.DruidClassName.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.DruidClassName.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    default: "REST-RECOVERY.ClassNames.Druid",
    type: String
  },
  [CONSTANTS.SETTINGS.BARD_CLASS]: {
    name: "REST-RECOVERY.Settings.ItemNames.BardClassName.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.BardClassName.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    default: "REST-RECOVERY.ClassNames.Bard",
    type: String
  },
  [CONSTANTS.SETTINGS.ARCANE_RECOVERY]: {
    name: "REST-RECOVERY.Settings.ItemNames.ArcaneRecovery.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.ArcaneRecovery.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    default: "REST-RECOVERY.FeatureNames.ArcaneRecovery",
    type: String
  },
  [CONSTANTS.SETTINGS.NATURAL_RECOVERY]: {
    name: "REST-RECOVERY.Settings.ItemNames.NaturalRecovery.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.NaturalRecovery.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    default: "REST-RECOVERY.FeatureNames.NaturalRecovery",
    type: String
  },
  [CONSTANTS.SETTINGS.SONG_OF_REST]: {
    name: "REST-RECOVERY.Settings.ItemNames.SongOfRest.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.SongOfRest.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    default: "REST-RECOVERY.FeatureNames.SongOfRest",
    type: String
  },
  [CONSTANTS.SETTINGS.CHEF_FEAT]: {
    name: "REST-RECOVERY.Settings.ItemNames.ChefFeat.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.ChefFeat.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    default: "REST-RECOVERY.FeatureNames.ChefFeat",
    type: String
  },
  [CONSTANTS.SETTINGS.CHEF_TOOLS]: {
    name: "REST-RECOVERY.Settings.ItemNames.ChefTools.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.ChefTools.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    default: "REST-RECOVERY.FeatureNames.ChefTools",
    type: String
  },
  [CONSTANTS.SETTINGS.DURABLE_FEAT]: {
    name: "REST-RECOVERY.Settings.ItemNames.DurableFeat.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.DurableFeat.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    default: "REST-RECOVERY.FeatureNames.DurableFeat",
    type: String
  },
  [CONSTANTS.SETTINGS.PERIAPT_ITEM]: {
    name: "REST-RECOVERY.Settings.ItemNames.PeriaptItem.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.PeriaptItem.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    default: "REST-RECOVERY.FeatureNames.PeriaptItem",
    type: String
  },
  [CONSTANTS.SETTINGS.WOUND_CLOSURE_BLESSING]: {
    name: "REST-RECOVERY.Settings.ItemNames.WoundClosureBlessing.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.WoundClosureBlessing.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    default: "REST-RECOVERY.FeatureNames.WoundClosureBlessing",
    type: String
  },
  [CONSTANTS.SETTINGS.BLACK_BLOOD_FEATURE]: {
    name: "REST-RECOVERY.Settings.ItemNames.BlackBloodFeature.Title",
    hint: "REST-RECOVERY.Settings.ItemNames.BlackBloodFeature.Hint",
    scope: "world",
    group: "itemnames",
    config: false,
    default: "REST-RECOVERY.FeatureNames.BlackBloodFeature",
    type: String
  }
};
CONSTANTS.PATH = `modules/${CONSTANTS.MODULE_NAME}/`;

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }

      return desc.value;
    };
  }

  return _get.apply(this, arguments);
}

function _classPrivateFieldGet(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");

  return _classApplyDescriptorGet(receiver, descriptor);
}

function _classPrivateFieldSet(receiver, privateMap, value) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");

  _classApplyDescriptorSet(receiver, descriptor, value);

  return value;
}

function _classPrivateFieldDestructureSet(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");

  return _classApplyDescriptorDestructureSet(receiver, descriptor);
}

function _classExtractFieldDescriptor(receiver, privateMap, action) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to " + action + " private field on non-instance");
  }

  return privateMap.get(receiver);
}

function _classApplyDescriptorGet(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }

  return descriptor.value;
}

function _classApplyDescriptorSet(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }

    descriptor.value = value;
  }
}

function _classApplyDescriptorDestructureSet(receiver, descriptor) {
  if (descriptor.set) {
    if (!("__destrObj" in descriptor)) {
      descriptor.__destrObj = {
        set value(v) {
          descriptor.set.call(receiver, v);
        }

      };
    }

    return descriptor.__destrObj;
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }

    return descriptor;
  }
}

function _classPrivateMethodGet(receiver, privateSet, fn) {
  if (!privateSet.has(receiver)) {
    throw new TypeError("attempted to get private field on non-instance");
  }

  return fn;
}

function _checkPrivateRedeclaration(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}

function _classPrivateFieldInitSpec(obj, privateMap, value) {
  _checkPrivateRedeclaration(obj, privateMap);

  privateMap.set(obj, value);
}

function _classPrivateMethodInitSpec(obj, privateSet) {
  _checkPrivateRedeclaration(obj, privateSet);

  privateSet.add(obj);
}

function noop() {}

const identity = x => x;

function assign(tar, src) {
  // @ts-ignore
  for (const k in src) tar[k] = src[k];

  return tar;
}

function run(fn) {
  return fn();
}

function blank_object() {
  return Object.create(null);
}

function run_all(fns) {
  fns.forEach(run);
}

function is_function(thing) {
  return typeof thing === 'function';
}

function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a && typeof a === 'object' || typeof a === 'function';
}

function is_empty(obj) {
  return Object.keys(obj).length === 0;
}

function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop;
  }

  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}

function get_store_value(store) {
  let value;
  subscribe(store, _ => value = _)();
  return value;
}

function component_subscribe(component, store, callback) {
  component.$$.on_destroy.push(subscribe(store, callback));
}

function create_slot(definition, ctx, $$scope, fn) {
  if (definition) {
    const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
    return definition[0](slot_ctx);
  }
}

function get_slot_context(definition, ctx, $$scope, fn) {
  return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
}

function get_slot_changes(definition, $$scope, dirty, fn) {
  if (definition[2] && fn) {
    const lets = definition[2](fn(dirty));

    if ($$scope.dirty === undefined) {
      return lets;
    }

    if (typeof lets === 'object') {
      const merged = [];
      const len = Math.max($$scope.dirty.length, lets.length);

      for (let i = 0; i < len; i += 1) {
        merged[i] = $$scope.dirty[i] | lets[i];
      }

      return merged;
    }

    return $$scope.dirty | lets;
  }

  return $$scope.dirty;
}

function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
  if (slot_changes) {
    const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
    slot.p(slot_context, slot_changes);
  }
}

function get_all_dirty_from_scope($$scope) {
  if ($$scope.ctx.length > 32) {
    const dirty = [];
    const length = $$scope.ctx.length / 32;

    for (let i = 0; i < length; i++) {
      dirty[i] = -1;
    }

    return dirty;
  }

  return -1;
}

function null_to_empty(value) {
  return value == null ? '' : value;
}

function action_destroyer(action_result) {
  return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}

const is_client = typeof window !== 'undefined';
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? cb => requestAnimationFrame(cb) : noop; // used internally for testing

const tasks = new Set();

function run_tasks(now) {
  tasks.forEach(task => {
    if (!task.c(now)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0) raf(run_tasks);
}
/**
 * Creates a new task that runs on each raf frame
 * until it returns a falsy value or is aborted
 */


function loop(callback) {
  let task;
  if (tasks.size === 0) raf(run_tasks);
  return {
    promise: new Promise(fulfill => {
      tasks.add(task = {
        c: callback,
        f: fulfill
      });
    }),

    abort() {
      tasks.delete(task);
    }

  };
} // Track which nodes are claimed during hydration. Unclaimed nodes can then be removed from the DOM

function append(target, node) {
  target.appendChild(node);
}

function append_styles(target, style_sheet_id, styles) {
  const append_styles_to = get_root_for_style(target);

  if (!append_styles_to.getElementById(style_sheet_id)) {
    const style = element('style');
    style.id = style_sheet_id;
    style.textContent = styles;
    append_stylesheet(append_styles_to, style);
  }
}

function get_root_for_style(node) {
  if (!node) return document;
  const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;

  if (root && root.host) {
    return root;
  }

  return node.ownerDocument;
}

function append_empty_stylesheet(node) {
  const style_element = element('style');
  append_stylesheet(get_root_for_style(node), style_element);
  return style_element.sheet;
}

function append_stylesheet(node, style) {
  append(node.head || node, style);
}

function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}

function detach(node) {
  node.parentNode.removeChild(node);
}

function destroy_each(iterations, detaching) {
  for (let i = 0; i < iterations.length; i += 1) {
    if (iterations[i]) iterations[i].d(detaching);
  }
}

function element(name) {
  return document.createElement(name);
}

function text(data) {
  return document.createTextNode(data);
}

function space() {
  return text(' ');
}

function empty() {
  return text('');
}

function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}

function prevent_default(fn) {
  return function (event) {
    event.preventDefault(); // @ts-ignore

    return fn.call(this, event);
  };
}

function stop_propagation(fn) {
  return function (event) {
    event.stopPropagation(); // @ts-ignore

    return fn.call(this, event);
  };
}

function attr(node, attribute, value) {
  if (value == null) node.removeAttribute(attribute);else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
}

function to_number(value) {
  return value === '' ? null : +value;
}

function children(element) {
  return Array.from(element.childNodes);
}

function set_data(text, data) {
  data = '' + data;
  if (text.wholeText !== data) text.data = data;
}

function set_input_value(input, value) {
  input.value = value == null ? '' : value;
}

function set_style(node, key, value, important) {
  if (value === null) {
    node.style.removeProperty(key);
  } else {
    node.style.setProperty(key, value, important ? 'important' : '');
  }
}

function select_option(select, value) {
  for (let i = 0; i < select.options.length; i += 1) {
    const option = select.options[i];

    if (option.__value === value) {
      option.selected = true;
      return;
    }
  }

  select.selectedIndex = -1; // no option should be selected
}

function select_value(select) {
  const selected_option = select.querySelector(':checked') || select.options[0];
  return selected_option && selected_option.__value;
}
// so we cache the result instead


let crossorigin;

function is_crossorigin() {
  if (crossorigin === undefined) {
    crossorigin = false;

    try {
      if (typeof window !== 'undefined' && window.parent) {
        void window.parent.document;
      }
    } catch (error) {
      crossorigin = true;
    }
  }

  return crossorigin;
}

function add_resize_listener(node, fn) {
  const computed_style = getComputedStyle(node);

  if (computed_style.position === 'static') {
    node.style.position = 'relative';
  }

  const iframe = element('iframe');
  iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' + 'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.tabIndex = -1;
  const crossorigin = is_crossorigin();
  let unsubscribe;

  if (crossorigin) {
    iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
    unsubscribe = listen(window, 'message', event => {
      if (event.source === iframe.contentWindow) fn();
    });
  } else {
    iframe.src = 'about:blank';

    iframe.onload = () => {
      unsubscribe = listen(iframe.contentWindow, 'resize', fn);
    };
  }

  append(node, iframe);
  return () => {
    if (crossorigin) {
      unsubscribe();
    } else if (unsubscribe && iframe.contentWindow) {
      unsubscribe();
    }

    detach(iframe);
  };
}

function toggle_class(element, name, toggle) {
  element.classList[toggle ? 'add' : 'remove'](name);
}

function custom_event(type, detail, bubbles = false) {
  const e = document.createEvent('CustomEvent');
  e.initCustomEvent(type, bubbles, false, detail);
  return e;
}

class HtmlTag {
  constructor() {
    this.e = this.n = null;
  }

  c(html) {
    this.h(html);
  }

  m(html, target, anchor = null) {
    if (!this.e) {
      this.e = element(target.nodeName);
      this.t = target;
      this.c(html);
    }

    this.i(anchor);
  }

  h(html) {
    this.e.innerHTML = html;
    this.n = Array.from(this.e.childNodes);
  }

  i(anchor) {
    for (let i = 0; i < this.n.length; i += 1) {
      insert(this.t, this.n[i], anchor);
    }
  }

  p(html) {
    this.d();
    this.h(html);
    this.i(this.a);
  }

  d() {
    this.n.forEach(detach);
  }

}
// https://github.com/sveltejs/svelte/issues/3624


const managed_styles = new Map();
let active = 0; // https://github.com/darkskyapp/string-hash/blob/master/index.js

function hash(str) {
  let hash = 5381;
  let i = str.length;

  while (i--) hash = (hash << 5) - hash ^ str.charCodeAt(i);

  return hash >>> 0;
}

function create_style_information(doc, node) {
  const info = {
    stylesheet: append_empty_stylesheet(node),
    rules: {}
  };
  managed_styles.set(doc, info);
  return info;
}

function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
  const step = 16.666 / duration;
  let keyframes = '{\n';

  for (let p = 0; p <= 1; p += step) {
    const t = a + (b - a) * ease(p);
    keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
  }

  const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
  const name = `__svelte_${hash(rule)}_${uid}`;
  const doc = get_root_for_style(node);
  const {
    stylesheet,
    rules
  } = managed_styles.get(doc) || create_style_information(doc, node);

  if (!rules[name]) {
    rules[name] = true;
    stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
  }

  const animation = node.style.animation || '';
  node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
  active += 1;
  return name;
}

function delete_rule(node, name) {
  const previous = (node.style.animation || '').split(', ');
  const next = previous.filter(name ? anim => anim.indexOf(name) < 0 // remove specific animation
  : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
  );
  const deleted = previous.length - next.length;

  if (deleted) {
    node.style.animation = next.join(', ');
    active -= deleted;
    if (!active) clear_rules();
  }
}

function clear_rules() {
  raf(() => {
    if (active) return;
    managed_styles.forEach(info => {
      const {
        stylesheet
      } = info;
      let i = stylesheet.cssRules.length;

      while (i--) stylesheet.deleteRule(i);

      info.rules = {};
    });
    managed_styles.clear();
  });
}

let current_component;

function set_current_component(component) {
  current_component = component;
}

function get_current_component() {
  if (!current_component) throw new Error('Function called outside component initialization');
  return current_component;
}

function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}

function getContext(key) {
  return get_current_component().$$.context.get(key);
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;

function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}

function add_render_callback(fn) {
  render_callbacks.push(fn);
}

function add_flush_callback(fn) {
  flush_callbacks.push(fn);
} // flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.


const seen_callbacks = new Set();
let flushidx = 0; // Do *not* move this inside the flush() function

function flush() {
  const saved_component = current_component;

  do {
    // first, call beforeUpdate functions
    // and update components
    while (flushidx < dirty_components.length) {
      const component = dirty_components[flushidx];
      flushidx++;
      set_current_component(component);
      update(component.$$);
    }

    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;

    while (binding_callbacks.length) binding_callbacks.pop()(); // then, once components are updated, call
    // afterUpdate functions. This may cause
    // subsequent updates...


    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];

      if (!seen_callbacks.has(callback)) {
        // ...so guard against infinite loops
        seen_callbacks.add(callback);
        callback();
      }
    }

    render_callbacks.length = 0;
  } while (dirty_components.length);

  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }

  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}

function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}

let promise;

function wait() {
  if (!promise) {
    promise = Promise.resolve();
    promise.then(() => {
      promise = null;
    });
  }

  return promise;
}

function dispatch(node, direction, kind) {
  node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
}

const outroing = new Set();
let outros;

function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros // parent group

  };
}

function check_outros() {
  if (!outros.r) {
    run_all(outros.c);
  }

  outros = outros.p;
}

function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}

function transition_out(block, local, detach, callback) {
  if (block && block.o) {
    if (outroing.has(block)) return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);

      if (callback) {
        if (detach) block.d(1);
        callback();
      }
    });
    block.o(local);
  }
}

const null_transition = {
  duration: 0
};

function create_in_transition(node, fn, params) {
  let config = fn(node, params);
  let running = false;
  let animation_name;
  let task;
  let uid = 0;

  function cleanup() {
    if (animation_name) delete_rule(node, animation_name);
  }

  function go() {
    const {
      delay = 0,
      duration = 300,
      easing = identity,
      tick = noop,
      css
    } = config || null_transition;
    if (css) animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
    tick(0, 1);
    const start_time = now() + delay;
    const end_time = start_time + duration;
    if (task) task.abort();
    running = true;
    add_render_callback(() => dispatch(node, true, 'start'));
    task = loop(now => {
      if (running) {
        if (now >= end_time) {
          tick(1, 0);
          dispatch(node, true, 'end');
          cleanup();
          return running = false;
        }

        if (now >= start_time) {
          const t = easing((now - start_time) / duration);
          tick(t, 1 - t);
        }
      }

      return running;
    });
  }

  let started = false;
  return {
    start() {
      if (started) return;
      started = true;
      delete_rule(node);

      if (is_function(config)) {
        config = config();
        wait().then(go);
      } else {
        go();
      }
    },

    invalidate() {
      started = false;
    },

    end() {
      if (running) {
        cleanup();
        running = false;
      }
    }

  };
}

function create_out_transition(node, fn, params) {
  let config = fn(node, params);
  let running = true;
  let animation_name;
  const group = outros;
  group.r += 1;

  function go() {
    const {
      delay = 0,
      duration = 300,
      easing = identity,
      tick = noop,
      css
    } = config || null_transition;
    if (css) animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
    const start_time = now() + delay;
    const end_time = start_time + duration;
    add_render_callback(() => dispatch(node, false, 'start'));
    loop(now => {
      if (running) {
        if (now >= end_time) {
          tick(0, 1);
          dispatch(node, false, 'end');

          if (! --group.r) {
            // this will result in `end()` being called,
            // so we don't need to clean up here
            run_all(group.c);
          }

          return false;
        }

        if (now >= start_time) {
          const t = easing((now - start_time) / duration);
          tick(1 - t, t);
        }
      }

      return running;
    });
  }

  if (is_function(config)) {
    wait().then(() => {
      // @ts-ignore
      config = config();
      go();
    });
  } else {
    go();
  }

  return {
    end(reset) {
      if (reset && config.tick) {
        config.tick(1, 0);
      }

      if (running) {
        if (animation_name) delete_rule(node, animation_name);
        running = false;
      }
    }

  };
}

const globals = typeof window !== 'undefined' ? window : typeof globalThis !== 'undefined' ? globalThis : global;

function destroy_block(block, lookup) {
  block.d(1);
  lookup.delete(block.key);
}

function outro_and_destroy_block(block, lookup) {
  transition_out(block, 1, 1, () => {
    lookup.delete(block.key);
  });
}

function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
  let o = old_blocks.length;
  let n = list.length;
  let i = o;
  const old_indexes = {};

  while (i--) old_indexes[old_blocks[i].key] = i;

  const new_blocks = [];
  const new_lookup = new Map();
  const deltas = new Map();
  i = n;

  while (i--) {
    const child_ctx = get_context(ctx, list, i);
    const key = get_key(child_ctx);
    let block = lookup.get(key);

    if (!block) {
      block = create_each_block(key, child_ctx);
      block.c();
    } else if (dynamic) {
      block.p(child_ctx, dirty);
    }

    new_lookup.set(key, new_blocks[i] = block);
    if (key in old_indexes) deltas.set(key, Math.abs(i - old_indexes[key]));
  }

  const will_move = new Set();
  const did_move = new Set();

  function insert(block) {
    transition_in(block, 1);
    block.m(node, next);
    lookup.set(block.key, block);
    next = block.first;
    n--;
  }

  while (o && n) {
    const new_block = new_blocks[n - 1];
    const old_block = old_blocks[o - 1];
    const new_key = new_block.key;
    const old_key = old_block.key;

    if (new_block === old_block) {
      // do nothing
      next = new_block.first;
      o--;
      n--;
    } else if (!new_lookup.has(old_key)) {
      // remove old block
      destroy(old_block, lookup);
      o--;
    } else if (!lookup.has(new_key) || will_move.has(new_key)) {
      insert(new_block);
    } else if (did_move.has(old_key)) {
      o--;
    } else if (deltas.get(new_key) > deltas.get(old_key)) {
      did_move.add(new_key);
      insert(new_block);
    } else {
      will_move.add(old_key);
      o--;
    }
  }

  while (o--) {
    const old_block = old_blocks[o];
    if (!new_lookup.has(old_block.key)) destroy(old_block, lookup);
  }

  while (n) insert(new_blocks[n - 1]);

  return new_blocks;
}

function get_spread_update(levels, updates) {
  const update = {};
  const to_null_out = {};
  const accounted_for = {
    $$scope: 1
  };
  let i = levels.length;

  while (i--) {
    const o = levels[i];
    const n = updates[i];

    if (n) {
      for (const key in o) {
        if (!(key in n)) to_null_out[key] = 1;
      }

      for (const key in n) {
        if (!accounted_for[key]) {
          update[key] = n[key];
          accounted_for[key] = 1;
        }
      }

      levels[i] = n;
    } else {
      for (const key in o) {
        accounted_for[key] = 1;
      }
    }
  }

  for (const key in to_null_out) {
    if (!(key in update)) update[key] = undefined;
  }

  return update;
}

function get_spread_object(spread_props) {
  return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
} // source: https://html.spec.whatwg.org/multipage/indices.html

function bind(component, name, callback) {
  const index = component.$$.props[name];

  if (index !== undefined) {
    component.$$.bound[index] = callback;
    callback(component.$$.ctx[index]);
  }
}

function create_component(block) {
  block && block.c();
}

function mount_component(component, target, anchor, customElement) {
  const {
    fragment,
    on_mount,
    on_destroy,
    after_update
  } = component.$$;
  fragment && fragment.m(target, anchor);

  if (!customElement) {
    // onMount happens before the initial afterUpdate
    add_render_callback(() => {
      const new_on_destroy = on_mount.map(run).filter(is_function);

      if (on_destroy) {
        on_destroy.push(...new_on_destroy);
      } else {
        // Edge case - component was destroyed immediately,
        // most likely as a result of a binding initialising
        run_all(new_on_destroy);
      }

      component.$$.on_mount = [];
    });
  }

  after_update.forEach(add_render_callback);
}

function destroy_component(component, detaching) {
  const $$ = component.$$;

  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching); // TODO null out other refs, including component.$$ (but need to
    // preserve final state?)

    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}

function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }

  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}

function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: null,
    // state
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    // everything else
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance ? instance(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;

    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
      if (ready) make_dirty(component, i);
    }

    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update); // `false` as a special case of no DOM component

  $$.fragment = create_fragment ? create_fragment($$.ctx) : false;

  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      $$.fragment && $$.fragment.c();
    }

    if (options.intro) transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor, options.customElement);
    flush();
  }

  set_current_component(parent_component);
}
/**
 * Base class for Svelte components. Used when dev=false.
 */


class SvelteComponent {
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }

  $on(type, callback) {
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1) callbacks.splice(index, 1);
    };
  }

  $set($$props) {
    if (this.$$set && !is_empty($$props)) {
      this.$$.skip_bound = true;
      this.$$set($$props);
      this.$$.skip_bound = false;
    }
  }

}

/**
 * Provides a method to determine if the passed in Svelte component has a getter accessor.
 *
 * @param {*}        component - Svelte component.
 *
 * @param {string}   accessor - Accessor to test.
 *
 * @returns {boolean} Whether the component has the getter for accessor.
 */


function hasGetter(component, accessor) {
  if (component === null || component === void 0) {
    return false;
  } // Get the prototype which is the parent SvelteComponent that has any getter / setters.


  const prototype = Object.getPrototypeOf(component);
  const descriptor = Object.getOwnPropertyDescriptor(prototype, accessor);
  return !(descriptor === void 0 || descriptor.get === void 0);
}
/**
 * Defines the application shell contract. If Svelte components export getter / setters for the following properties
 * then that component is considered an application shell.
 *
 * @type {string[]}
 */


const applicationShellContract = ['elementRoot'];
Object.freeze(applicationShellContract);
/**
 * Provides a method to determine if the passed in object is ApplicationShell or TJSApplicationShell.
 *
 * @param {*}  component - Object / component to test.
 *
 * @returns {boolean} Whether the component is a ApplicationShell or TJSApplicationShell.
 */

function isApplicationShell(component) {
  if (component === null || component === void 0) {
    return false;
  } // Get the prototype which is the parent SvelteComponent that has any getter / setters.


  const prototype = Object.getPrototypeOf(component); // Verify the application shell contract. If the accessors (getters / setters) are defined for
  // `applicationShellContract`.

  for (const accessor of applicationShellContract) {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, accessor);

    if (descriptor === void 0 || descriptor.get === void 0 || descriptor.set === void 0) {
      return false;
    }
  }

  return true;
}
/**
 * Provides basic duck typing to determine if the provided function is a constructor function for a Svelte component.
 *
 * @param {*}  comp - Data to check as a Svelte component.
 *
 * @returns {boolean} Whether basic duck typing succeeds.
 */


function isSvelteComponent(comp) {
  if (comp === null || comp === void 0 || typeof comp !== 'function') {
    return false;
  }

  return typeof window !== void 0 ? typeof comp.prototype.$destroy === 'function' && typeof comp.prototype.$on === 'function' : // client-side
  typeof comp.render === 'function'; // server-side
}
/**
 * Runs outro transition then destroys Svelte component.
 *
 * Workaround for https://github.com/sveltejs/svelte/issues/4056
 *
 * @param {*}  instance - A Svelte component.
 */


async function outroAndDestroy(instance) {
  return new Promise(resolve => {
    if (instance.$$.fragment && instance.$$.fragment.o) {
      group_outros();
      transition_out(instance.$$.fragment, 0, 0, () => {
        instance.$destroy();
        resolve();
      });
      check_outros();
    } else {
      instance.$destroy();
      resolve();
    }
  });
}
/**
 * Parses a TyphonJS Svelte config object ensuring that classes specified are Svelte components and props are set
 * correctly.
 *
 * @param {object}   config - Svelte config object.
 *
 * @param {*}        [thisArg] - `This` reference to set for invoking any props function.
 *
 * @returns {object} The processed Svelte config object.
 */


function parseSvelteConfig(config, thisArg = void 0) {
  if (typeof config !== 'object') {
    throw new TypeError(`parseSvelteConfig - 'config' is not an object:\n${JSON.stringify(config)}.`);
  }

  if (!isSvelteComponent(config.class)) {
    throw new TypeError(`parseSvelteConfig - 'class' is not a Svelte component constructor for config:\n${JSON.stringify(config)}.`);
  }

  if (config.hydrate !== void 0 && typeof config.hydrate !== 'boolean') {
    throw new TypeError(`parseSvelteConfig - 'hydrate' is not a boolean for config:\n${JSON.stringify(config)}.`);
  }

  if (config.intro !== void 0 && typeof config.intro !== 'boolean') {
    throw new TypeError(`parseSvelteConfig - 'intro' is not a boolean for config:\n${JSON.stringify(config)}.`);
  }

  if (config.target !== void 0 && typeof config.target !== 'string' && !(config.target instanceof HTMLElement) && !(config.target instanceof ShadowRoot) && !(config.target instanceof DocumentFragment)) {
    throw new TypeError(`parseSvelteConfig - 'target' is not a string, HTMLElement, ShadowRoot, or DocumentFragment for config:\n${JSON.stringify(config)}.`);
  }

  if (config.anchor !== void 0 && typeof config.anchor !== 'string' && !(config.anchor instanceof HTMLElement) && !(config.anchor instanceof ShadowRoot) && !(config.anchor instanceof DocumentFragment)) {
    throw new TypeError(`parseSvelteConfig - 'anchor' is not a string, HTMLElement, ShadowRoot, or DocumentFragment for config:\n${JSON.stringify(config)}.`);
  }

  if (config.context !== void 0 && typeof config.context !== 'function' && !(config.context instanceof Map) && typeof config.context !== 'object') {
    throw new TypeError(`parseSvelteConfig - 'context' is not a Map, function or object for config:\n${JSON.stringify(config)}.`);
  } // Validate extra TyphonJS options --------------------------------------------------------------------------------
  // `selectorTarget` optionally stores a target element found in main element.


  if (config.selectorTarget !== void 0 && typeof config.selectorTarget !== 'string') {
    throw new TypeError(`parseSvelteConfig - 'selectorTarget' is not a string for config:\n${JSON.stringify(config)}.`);
  } // `options` stores `injectApp`, `injectEventbus`, and `selectorElement`.


  if (config.options !== void 0 && typeof config.options !== 'object') {
    throw new TypeError(`parseSvelteConfig - 'options' is not an object for config:\n${JSON.stringify(config)}.`);
  } // Validate TyphonJS standard options.


  if (config.options !== void 0) {
    if (config.options.injectApp !== void 0 && typeof config.options.injectApp !== 'boolean') {
      throw new TypeError(`parseSvelteConfig - 'options.injectApp' is not a boolean for config:\n${JSON.stringify(config)}.`);
    }

    if (config.options.injectEventbus !== void 0 && typeof config.options.injectEventbus !== 'boolean') {
      throw new TypeError(`parseSvelteConfig - 'options.injectEventbus' is not a boolean for config:\n${JSON.stringify(config)}.`);
    } // `selectorElement` optionally stores a main element selector to be found in a HTMLElement target.


    if (config.options.selectorElement !== void 0 && typeof config.options.selectorElement !== 'string') {
      throw new TypeError(`parseSvelteConfig - 'selectorElement' is not a string for config:\n${JSON.stringify(config)}.`);
    }
  }

  const svelteConfig = _objectSpread2({}, config); // Delete extra Svelte options.


  delete svelteConfig.options;
  let externalContext = {}; // If a context callback function is provided then invoke it with `this` being the Foundry app.
  // If an object is returned it adds the entries to external context.

  if (typeof svelteConfig.context === 'function') {
    const contextFunc = svelteConfig.context;
    delete svelteConfig.context;
    const result = contextFunc.call(thisArg);

    if (typeof result === 'object') {
      externalContext = _objectSpread2({}, result);
    } else {
      throw new Error(`parseSvelteConfig - 'context' is a function that did not return an object for config:\n${JSON.stringify(config)}`);
    }
  } else if (svelteConfig.context instanceof Map) {
    externalContext = Object.fromEntries(svelteConfig.context);
    delete svelteConfig.context;
  } else if (typeof svelteConfig.context === 'object') {
    externalContext = svelteConfig.context;
    delete svelteConfig.context;
  } // If a props is a function then invoke it with `this` being the Foundry app.
  // If an object is returned set it as the props.


  svelteConfig.props = s_PROCESS_PROPS(svelteConfig.props, thisArg, config); // Process children components attaching to external context.

  if (Array.isArray(svelteConfig.children)) {
    const children = [];

    for (let cntr = 0; cntr < svelteConfig.children.length; cntr++) {
      const child = svelteConfig.children[cntr];

      if (!isSvelteComponent(child.class)) {
        throw new Error(`parseSvelteConfig - 'class' is not a Svelte component for child[${cntr}] for config:\n${JSON.stringify(config)}`);
      }

      child.props = s_PROCESS_PROPS(child.props, thisArg, config);
      children.push(child);
    }

    if (children.length > 0) {
      externalContext.children = children;
    }

    delete svelteConfig.children;
  } else if (typeof svelteConfig.children === 'object') {
    if (!isSvelteComponent(svelteConfig.children.class)) {
      throw new Error(`parseSvelteConfig - 'class' is not a Svelte component for children object for config:\n${JSON.stringify(config)}`);
    }

    svelteConfig.children.props = s_PROCESS_PROPS(svelteConfig.children.props, thisArg, config);
    externalContext.children = [svelteConfig.children];
    delete svelteConfig.children;
  }

  if (!(svelteConfig.context instanceof Map)) {
    svelteConfig.context = new Map();
  }

  svelteConfig.context.set('external', externalContext);
  return svelteConfig;
}
/**
 * Processes Svelte props. Potentially props can be a function to invoke with `thisArg`.
 *
 * @param {object|Function}   props - Svelte props.
 *
 * @param {*}                 thisArg - `This` reference to set for invoking any props function.
 *
 * @param {object}            config - Svelte config
 *
 * @returns {object|void}     Svelte props.
 */


function s_PROCESS_PROPS(props, thisArg, config) {
  // If a props is a function then invoke it with `this` being the Foundry app.
  // If an object is returned set it as the props.
  if (typeof props === 'function') {
    const result = props.call(thisArg);

    if (typeof result === 'object') {
      return result;
    } else {
      throw new Error(`parseSvelteConfig - 'props' is a function that did not return an object for config:\n${JSON.stringify(config)}`);
    }
  } else if (typeof props === 'object') {
    return props;
  } else if (props !== void 0) {
    throw new Error(`parseSvelteConfig - 'props' is not a function or an object for config:\n${JSON.stringify(config)}`);
  }

  return {};
}
/**
 * Provides common object manipulation utilities including depth traversal, obtaining accessors, safely setting values /
 * equality tests, and validation.
 */


const s_TAG_OBJECT = '[object Object]';
/**
 * Recursively deep merges all source objects into the target object in place. Like `Object.assign` if you provide `{}`
 * as the target a copy is produced. If the target and source property are object literals they are merged.
 * Deleting keys is supported by specifying a property starting with `-=`.
 *
 * @param {object}      target - Target object.
 *
 * @param {...object}   sourceObj - One or more source objects.
 *
 * @returns {object}    Target object.
 */

function deepMerge(target = {}, ...sourceObj) {
  if (Object.prototype.toString.call(target) !== s_TAG_OBJECT) {
    throw new TypeError(`deepMerge error: 'target' is not an 'object'.`);
  }

  for (let cntr = 0; cntr < sourceObj.length; cntr++) {
    if (Object.prototype.toString.call(sourceObj[cntr]) !== s_TAG_OBJECT) {
      throw new TypeError(`deepMerge error: 'sourceObj[${cntr}]' is not an 'object'.`);
    }
  }

  return _deepMerge(target, ...sourceObj);
}
/**
 * Tests for whether an object is iterable.
 *
 * @param {object} object - An object.
 *
 * @returns {boolean} Whether object is iterable.
 */


function isIterable(object) {
  if (object === null || object === void 0 || typeof object !== 'object') {
    return false;
  }

  return typeof object[Symbol.iterator] === 'function';
}
/**
 * Tests for whether object is not null and a typeof object.
 *
 * @param {object} object - An object.
 *
 * @returns {boolean} Is it an object.
 */


function isObject(object) {
  return object !== null && typeof object === 'object';
}
/**
 * Provides a way to safely access an objects data / entries given an accessor string which describes the
 * entries to walk. To access deeper entries into the object format the accessor string with `.` between entries
 * to walk.
 *
 * @param {object}   data - An object to access entry data.
 *
 * @param {string}   accessor - A string describing the entries to access.
 *
 * @param {*}        defaultValue - (Optional) A default value to return if an entry for accessor is not found.
 *
 * @returns {object} The data object.
 */


function safeAccess(data, accessor, defaultValue = void 0) {
  if (typeof data !== 'object') {
    return defaultValue;
  }

  if (typeof accessor !== 'string') {
    return defaultValue;
  }

  const access = accessor.split('.'); // Walk through the given object by the accessor indexes.

  for (let cntr = 0; cntr < access.length; cntr++) {
    // If the next level of object access is undefined or null then return the empty string.
    if (typeof data[access[cntr]] === 'undefined' || data[access[cntr]] === null) {
      return defaultValue;
    }

    data = data[access[cntr]];
  }

  return data;
}
/**
 * Provides a way to safely set an objects data / entries given an accessor string which describes the
 * entries to walk. To access deeper entries into the object format the accessor string with `.` between entries
 * to walk.
 *
 * @param {object}   data - An object to access entry data.
 *
 * @param {string}   accessor - A string describing the entries to access.
 *
 * @param {*}        value - A new value to set if an entry for accessor is found.
 *
 * @param {string}   [operation='set'] - Operation to perform including: 'add', 'div', 'mult', 'set',
 *                                       'set-undefined', 'sub'.
 *
 * @param {boolean}  [createMissing=true] - If true missing accessor entries will be created as objects
 *                                          automatically.
 *
 * @returns {boolean} True if successful.
 */


function safeSet(data, accessor, value, operation = 'set', createMissing = true) {
  if (typeof data !== 'object') {
    throw new TypeError(`safeSet Error: 'data' is not an 'object'.`);
  }

  if (typeof accessor !== 'string') {
    throw new TypeError(`safeSet Error: 'accessor' is not a 'string'.`);
  }

  const access = accessor.split('.'); // Walk through the given object by the accessor indexes.

  for (let cntr = 0; cntr < access.length; cntr++) {
    // If data is an array perform validation that the accessor is a positive integer otherwise quit.
    if (Array.isArray(data)) {
      const number = +access[cntr];

      if (!Number.isInteger(number) || number < 0) {
        return false;
      }
    }

    if (cntr === access.length - 1) {
      switch (operation) {
        case 'add':
          data[access[cntr]] += value;
          break;

        case 'div':
          data[access[cntr]] /= value;
          break;

        case 'mult':
          data[access[cntr]] *= value;
          break;

        case 'set':
          data[access[cntr]] = value;
          break;

        case 'set-undefined':
          if (typeof data[access[cntr]] === 'undefined') {
            data[access[cntr]] = value;
          }

          break;

        case 'sub':
          data[access[cntr]] -= value;
          break;
      }
    } else {
      // If createMissing is true and the next level of object access is undefined then create a new object entry.
      if (createMissing && typeof data[access[cntr]] === 'undefined') {
        data[access[cntr]] = {};
      } // Abort if the next level is null or not an object and containing a value.


      if (data[access[cntr]] === null || typeof data[access[cntr]] !== 'object') {
        return false;
      }

      data = data[access[cntr]];
    }
  }

  return true;
}
/**
 * Internal implementation for `deepMerge`.
 *
 * @param {object}      target - Target object.
 *
 * @param {...object}   sourceObj - One or more source objects.
 *
 * @returns {object}    Target object.
 */


function _deepMerge(target = {}, ...sourceObj) {
  // Iterate and merge all source objects into target.
  for (let cntr = 0; cntr < sourceObj.length; cntr++) {
    const obj = sourceObj[cntr];

    for (const prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        var _target$prop, _obj$prop;

        // Handle the special property starting with '-=' to delete keys.
        if (prop.startsWith('-=')) {
          delete target[prop.slice(2)];
          continue;
        } // If target already has prop and both target[prop] and obj[prop] are object literals then merge them
        // otherwise assign obj[prop] to target[prop].


        target[prop] = Object.prototype.hasOwnProperty.call(target, prop) && ((_target$prop = target[prop]) === null || _target$prop === void 0 ? void 0 : _target$prop.constructor) === Object && ((_obj$prop = obj[prop]) === null || _obj$prop === void 0 ? void 0 : _obj$prop.constructor) === Object ? _deepMerge({}, target[prop], obj[prop]) : obj[prop];
      }
    }
  }

  return target;
}

function cubicOut(t) {
  const f = t - 1.0;
  return f * f * f + 1.0;
}

/**
 * Performs linear interpolation between a start & end value by given amount between 0 - 1 inclusive.
 *
 * @param {number}   start - Start value.
 *
 * @param {number}   end - End value.
 *
 * @param {number}   amount - Current amount between 0 - 1 inclusive.
 *
 * @returns {number} Linear interpolated value between start & end.
 */
function lerp$5(start, end, amount) {
  return (1 - amount) * start + amount * end;
}
/**
 * Converts the given number from degrees to radians.
 *
 * @param {number}   deg - Degree number to convert
 *
 * @returns {number} Degree as radians.
 */


function degToRad(deg) {
  return deg * (Math.PI / 180.0);
}
/**
 * Common utilities
 * @module glMatrix
 */
// Configuration Constants


var EPSILON$1 = 0.000001;
var ARRAY_TYPE$1 = typeof Float32Array !== 'undefined' ? Float32Array : Array;
var RANDOM = Math.random;

if (!Math.hypot) Math.hypot = function () {
  var y = 0,
      i = arguments.length;

  while (i--) {
    y += arguments[i] * arguments[i];
  }

  return Math.sqrt(y);
};
/**
 * 3x3 Matrix
 * @module mat3
 */

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */

function create$6$1() {
  var out = new ARRAY_TYPE$1(9);

  if (ARRAY_TYPE$1 != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
  }

  out[0] = 1;
  out[4] = 1;
  out[8] = 1;
  return out;
}
/**
 * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */

function create$5() {
  var out = new ARRAY_TYPE$1(16);

  if (ARRAY_TYPE$1 != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }

  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {ReadonlyMat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */


function clone$5(a) {
  var out = new ARRAY_TYPE$1(16);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */


function copy$5(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Create a new mat4 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} A new mat4
 */


function fromValues$5(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  var out = new ARRAY_TYPE$1(16);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
/**
 * Set the components of a mat4 to the given values
 *
 * @param {mat4} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} out
 */


function set$5(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */


function identity$2(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */


function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    var a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    var a12 = a[6],
        a13 = a[7];
    var a23 = a[11];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a01;
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a02;
    out[9] = a12;
    out[11] = a[14];
    out[12] = a03;
    out[13] = a13;
    out[14] = a23;
  } else {
    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];
  }

  return out;
}
/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */


function invert$2(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
}
/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the source matrix
 * @returns {mat4} out
 */


function adjoint(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
  out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
  out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
  out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
  out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
  out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
  out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
  out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
  out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
  out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
  out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
  out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
  out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
  out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
  out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
  out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
  return out;
}
/**
 * Calculates the determinant of a mat4
 *
 * @param {ReadonlyMat4} a the source matrix
 * @returns {Number} determinant of a
 */


function determinant(a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
}
/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */


function multiply$5(out, a, b) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3];
  var a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7];
  var a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11];
  var a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15]; // Cache only the current line of the second matrix

  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}
/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to translate
 * @param {ReadonlyVec3} v vector to translate by
 * @returns {mat4} out
 */


function translate$1(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }

  return out;
}
/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to scale
 * @param {ReadonlyVec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/


function scale$5(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2];
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {ReadonlyVec3} axis the axis to rotate around
 * @returns {mat4} out
 */


function rotate$1(out, a, rad, axis) {
  var x = axis[0],
      y = axis[1],
      z = axis[2];
  var len = Math.hypot(x, y, z);
  var s, c, t;
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  var b00, b01, b02;
  var b10, b11, b12;
  var b20, b21, b22;

  if (len < EPSILON$1) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11]; // Construct the elements of the rotation matrix

  b00 = x * x * t + c;
  b01 = y * x * t + z * s;
  b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;
  b11 = y * y * t + c;
  b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;
  b21 = y * z * t - x * s;
  b22 = z * z * t + c; // Perform rotation-specific matrix multiplication

  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  return out;
}
/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */


function rotateX$3(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}
/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */


function rotateY$3(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
}
/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */


function rotateZ$3(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication


  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}
/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyVec3} v Translation vector
 * @returns {mat4} out
 */


function fromTranslation$1(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.scale(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyVec3} v Scaling vector
 * @returns {mat4} out
 */


function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = v[1];
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = v[2];
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotate(dest, dest, rad, axis);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {ReadonlyVec3} axis the axis to rotate around
 * @returns {mat4} out
 */


function fromRotation$1(out, rad, axis) {
  var x = axis[0],
      y = axis[1],
      z = axis[2];
  var len = Math.hypot(x, y, z);
  var s, c, t;

  if (len < EPSILON$1) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c; // Perform rotation-specific matrix multiplication

  out[0] = x * x * t + c;
  out[1] = y * x * t + z * s;
  out[2] = z * x * t - y * s;
  out[3] = 0;
  out[4] = x * y * t - z * s;
  out[5] = y * y * t + c;
  out[6] = z * y * t + x * s;
  out[7] = 0;
  out[8] = x * z * t + y * s;
  out[9] = y * z * t - x * s;
  out[10] = z * z * t + c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from the given angle around the X axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateX(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */


function fromXRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad); // Perform axis-specific matrix multiplication

  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = c;
  out[6] = s;
  out[7] = 0;
  out[8] = 0;
  out[9] = -s;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from the given angle around the Y axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateY(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */


function fromYRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad); // Perform axis-specific matrix multiplication

  out[0] = c;
  out[1] = 0;
  out[2] = -s;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = s;
  out[9] = 0;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from the given angle around the Z axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateZ(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */


function fromZRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad); // Perform axis-specific matrix multiplication

  out[0] = c;
  out[1] = s;
  out[2] = 0;
  out[3] = 0;
  out[4] = -s;
  out[5] = c;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @returns {mat4} out
 */


function fromRotationTranslation$1(out, q, v) {
  // Quaternion math
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - (yy + zz);
  out[1] = xy + wz;
  out[2] = xz - wy;
  out[3] = 0;
  out[4] = xy - wz;
  out[5] = 1 - (xx + zz);
  out[6] = yz + wx;
  out[7] = 0;
  out[8] = xz + wy;
  out[9] = yz - wx;
  out[10] = 1 - (xx + yy);
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
/**
 * Creates a new mat4 from a dual quat.
 *
 * @param {mat4} out Matrix
 * @param {ReadonlyQuat2} a Dual Quaternion
 * @returns {mat4} mat4 receiving operation result
 */


function fromQuat2(out, a) {
  var translation = new ARRAY_TYPE$1(3);
  var bx = -a[0],
      by = -a[1],
      bz = -a[2],
      bw = a[3],
      ax = a[4],
      ay = a[5],
      az = a[6],
      aw = a[7];
  var magnitude = bx * bx + by * by + bz * bz + bw * bw; //Only scale if it makes sense

  if (magnitude > 0) {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
  } else {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
  }

  fromRotationTranslation$1(out, a, translation);
  return out;
}
/**
 * Returns the translation vector component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslation,
 *  the returned vector will be the same as the translation vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive translation component
 * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */


function getTranslation$1(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];
  return out;
}
/**
 * Returns the scaling factor component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslationScale
 *  with a normalized Quaternion paramter, the returned vector will be
 *  the same as the scaling vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive scaling factor component
 * @param  {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */


function getScaling(out, mat) {
  var m11 = mat[0];
  var m12 = mat[1];
  var m13 = mat[2];
  var m21 = mat[4];
  var m22 = mat[5];
  var m23 = mat[6];
  var m31 = mat[8];
  var m32 = mat[9];
  var m33 = mat[10];
  out[0] = Math.hypot(m11, m12, m13);
  out[1] = Math.hypot(m21, m22, m23);
  out[2] = Math.hypot(m31, m32, m33);
  return out;
}
/**
 * Returns a quaternion representing the rotational component
 *  of a transformation matrix. If a matrix is built with
 *  fromRotationTranslation, the returned quaternion will be the
 *  same as the quaternion originally supplied.
 * @param {quat} out Quaternion to receive the rotation component
 * @param {ReadonlyMat4} mat Matrix to be decomposed (input)
 * @return {quat} out
 */


function getRotation(out, mat) {
  var scaling = new ARRAY_TYPE$1(3);
  getScaling(scaling, mat);
  var is1 = 1 / scaling[0];
  var is2 = 1 / scaling[1];
  var is3 = 1 / scaling[2];
  var sm11 = mat[0] * is1;
  var sm12 = mat[1] * is2;
  var sm13 = mat[2] * is3;
  var sm21 = mat[4] * is1;
  var sm22 = mat[5] * is2;
  var sm23 = mat[6] * is3;
  var sm31 = mat[8] * is1;
  var sm32 = mat[9] * is2;
  var sm33 = mat[10] * is3;
  var trace = sm11 + sm22 + sm33;
  var S = 0;

  if (trace > 0) {
    S = Math.sqrt(trace + 1.0) * 2;
    out[3] = 0.25 * S;
    out[0] = (sm23 - sm32) / S;
    out[1] = (sm31 - sm13) / S;
    out[2] = (sm12 - sm21) / S;
  } else if (sm11 > sm22 && sm11 > sm33) {
    S = Math.sqrt(1.0 + sm11 - sm22 - sm33) * 2;
    out[3] = (sm23 - sm32) / S;
    out[0] = 0.25 * S;
    out[1] = (sm12 + sm21) / S;
    out[2] = (sm31 + sm13) / S;
  } else if (sm22 > sm33) {
    S = Math.sqrt(1.0 + sm22 - sm11 - sm33) * 2;
    out[3] = (sm31 - sm13) / S;
    out[0] = (sm12 + sm21) / S;
    out[1] = 0.25 * S;
    out[2] = (sm23 + sm32) / S;
  } else {
    S = Math.sqrt(1.0 + sm33 - sm11 - sm22) * 2;
    out[3] = (sm12 - sm21) / S;
    out[0] = (sm31 + sm13) / S;
    out[1] = (sm23 + sm32) / S;
    out[2] = 0.25 * S;
  }

  return out;
}
/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @param {ReadonlyVec3} s Scaling vector
 * @returns {mat4} out
 */


function fromRotationTranslationScale(out, q, v, s) {
  // Quaternion math
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     mat4.translate(dest, origin);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *     mat4.translate(dest, negativeOrigin);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {ReadonlyVec3} v Translation vector
 * @param {ReadonlyVec3} s Scaling vector
 * @param {ReadonlyVec3} o The origin vector around which to scale and rotate
 * @returns {mat4} out
 */


function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
  // Quaternion math
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  var ox = o[0];
  var oy = o[1];
  var oz = o[2];
  var out0 = (1 - (yy + zz)) * sx;
  var out1 = (xy + wz) * sx;
  var out2 = (xz - wy) * sx;
  var out4 = (xy - wz) * sy;
  var out5 = (1 - (xx + zz)) * sy;
  var out6 = (yz + wx) * sy;
  var out8 = (xz + wy) * sz;
  var out9 = (yz - wx) * sz;
  var out10 = (1 - (xx + yy)) * sz;
  out[0] = out0;
  out[1] = out1;
  out[2] = out2;
  out[3] = 0;
  out[4] = out4;
  out[5] = out5;
  out[6] = out6;
  out[7] = 0;
  out[8] = out8;
  out[9] = out9;
  out[10] = out10;
  out[11] = 0;
  out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
  out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
  out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
  out[15] = 1;
  return out;
}
/**
 * Calculates a 4x4 matrix from the given quaternion
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {ReadonlyQuat} q Quaternion to create matrix from
 *
 * @returns {mat4} out
 */


function fromQuat(out, q) {
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var yx = y * x2;
  var yy = y * y2;
  var zx = z * x2;
  var zy = z * y2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - yy - zz;
  out[1] = yx + wz;
  out[2] = zx - wy;
  out[3] = 0;
  out[4] = yx - wz;
  out[5] = 1 - xx - zz;
  out[6] = zy + wx;
  out[7] = 0;
  out[8] = zx + wy;
  out[9] = zy - wx;
  out[10] = 1 - xx - yy;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */


function frustum(out, left, right, bottom, top, near, far) {
  var rl = 1 / (right - left);
  var tb = 1 / (top - bottom);
  var nf = 1 / (near - far);
  out[0] = near * 2 * rl;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = near * 2 * tb;
  out[6] = 0;
  out[7] = 0;
  out[8] = (right + left) * rl;
  out[9] = (top + bottom) * tb;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = far * near * 2 * nf;
  out[15] = 0;
  return out;
}
/**
 * Generates a perspective projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
 * which matches WebGL/OpenGL's clip volume.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */


function perspectiveNO(out, fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2),
      nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;

  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = (far + near) * nf;
    out[14] = 2 * far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -2 * near;
  }

  return out;
}
/**
 * Alias for {@link mat4.perspectiveNO}
 * @function
 */


var perspective = perspectiveNO;
/**
 * Generates a perspective projection matrix suitable for WebGPU with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
 * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */

function perspectiveZO(out, fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2),
      nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;

  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = far * nf;
    out[14] = far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -near;
  }

  return out;
}
/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */


function perspectiveFromFieldOfView(out, fov, near, far) {
  var upTan = Math.tan(fov.upDegrees * Math.PI / 180.0);
  var downTan = Math.tan(fov.downDegrees * Math.PI / 180.0);
  var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0);
  var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0);
  var xScale = 2.0 / (leftTan + rightTan);
  var yScale = 2.0 / (upTan + downTan);
  out[0] = xScale;
  out[1] = 0.0;
  out[2] = 0.0;
  out[3] = 0.0;
  out[4] = 0.0;
  out[5] = yScale;
  out[6] = 0.0;
  out[7] = 0.0;
  out[8] = -((leftTan - rightTan) * xScale * 0.5);
  out[9] = (upTan - downTan) * yScale * 0.5;
  out[10] = far / (near - far);
  out[11] = -1.0;
  out[12] = 0.0;
  out[13] = 0.0;
  out[14] = far * near / (near - far);
  out[15] = 0.0;
  return out;
}
/**
 * Generates a orthogonal projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1],
 * which matches WebGL/OpenGL's clip volume.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */


function orthoNO(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}
/**
 * Alias for {@link mat4.orthoNO}
 * @function
 */


var ortho = orthoNO;
/**
 * Generates a orthogonal projection matrix with the given bounds.
 * The near/far clip planes correspond to a normalized device coordinate Z range of [0, 1],
 * which matches WebGPU/Vulkan/DirectX/Metal's clip volume.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */

function orthoZO(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = near * nf;
  out[15] = 1;
  return out;
}
/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis.
 * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {ReadonlyVec3} eye Position of the viewer
 * @param {ReadonlyVec3} center Point the viewer is looking at
 * @param {ReadonlyVec3} up vec3 pointing up
 * @returns {mat4} out
 */


function lookAt(out, eye, center, up) {
  var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
  var eyex = eye[0];
  var eyey = eye[1];
  var eyez = eye[2];
  var upx = up[0];
  var upy = up[1];
  var upz = up[2];
  var centerx = center[0];
  var centery = center[1];
  var centerz = center[2];

  if (Math.abs(eyex - centerx) < EPSILON$1 && Math.abs(eyey - centery) < EPSILON$1 && Math.abs(eyez - centerz) < EPSILON$1) {
    return identity$2(out);
  }

  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;
  len = 1 / Math.hypot(z0, z1, z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;
  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = Math.hypot(x0, x1, x2);

  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;
  len = Math.hypot(y0, y1, y2);

  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;
  return out;
}
/**
 * Generates a matrix that makes something look at something else.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {ReadonlyVec3} eye Position of the viewer
 * @param {ReadonlyVec3} center Point the viewer is looking at
 * @param {ReadonlyVec3} up vec3 pointing up
 * @returns {mat4} out
 */


function targetTo(out, eye, target, up) {
  var eyex = eye[0],
      eyey = eye[1],
      eyez = eye[2],
      upx = up[0],
      upy = up[1],
      upz = up[2];
  var z0 = eyex - target[0],
      z1 = eyey - target[1],
      z2 = eyez - target[2];
  var len = z0 * z0 + z1 * z1 + z2 * z2;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
    z0 *= len;
    z1 *= len;
    z2 *= len;
  }

  var x0 = upy * z2 - upz * z1,
      x1 = upz * z0 - upx * z2,
      x2 = upx * z1 - upy * z0;
  len = x0 * x0 + x1 * x1 + x2 * x2;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  out[0] = x0;
  out[1] = x1;
  out[2] = x2;
  out[3] = 0;
  out[4] = z1 * x2 - z2 * x1;
  out[5] = z2 * x0 - z0 * x2;
  out[6] = z0 * x1 - z1 * x0;
  out[7] = 0;
  out[8] = z0;
  out[9] = z1;
  out[10] = z2;
  out[11] = 0;
  out[12] = eyex;
  out[13] = eyey;
  out[14] = eyez;
  out[15] = 1;
  return out;
}
/**
 * Returns a string representation of a mat4
 *
 * @param {ReadonlyMat4} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */


function str$5(a) {
  return "mat4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")";
}
/**
 * Returns Frobenius norm of a mat4
 *
 * @param {ReadonlyMat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */


function frob(a) {
  return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
}
/**
 * Adds two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */


function add$5(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  out[9] = a[9] + b[9];
  out[10] = a[10] + b[10];
  out[11] = a[11] + b[11];
  out[12] = a[12] + b[12];
  out[13] = a[13] + b[13];
  out[14] = a[14] + b[14];
  out[15] = a[15] + b[15];
  return out;
}
/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @returns {mat4} out
 */


function subtract$3(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  out[9] = a[9] - b[9];
  out[10] = a[10] - b[10];
  out[11] = a[11] - b[11];
  out[12] = a[12] - b[12];
  out[13] = a[13] - b[13];
  out[14] = a[14] - b[14];
  out[15] = a[15] - b[15];
  return out;
}
/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat4} out the receiving matrix
 * @param {ReadonlyMat4} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat4} out
 */


function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  out[9] = a[9] * b;
  out[10] = a[10] * b;
  out[11] = a[11] * b;
  out[12] = a[12] * b;
  out[13] = a[13] * b;
  out[14] = a[14] * b;
  out[15] = a[15] * b;
  return out;
}
/**
 * Adds two mat4's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat4} out the receiving vector
 * @param {ReadonlyMat4} a the first operand
 * @param {ReadonlyMat4} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat4} out
 */


function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  out[4] = a[4] + b[4] * scale;
  out[5] = a[5] + b[5] * scale;
  out[6] = a[6] + b[6] * scale;
  out[7] = a[7] + b[7] * scale;
  out[8] = a[8] + b[8] * scale;
  out[9] = a[9] + b[9] * scale;
  out[10] = a[10] + b[10] * scale;
  out[11] = a[11] + b[11] * scale;
  out[12] = a[12] + b[12] * scale;
  out[13] = a[13] + b[13] * scale;
  out[14] = a[14] + b[14] * scale;
  out[15] = a[15] + b[15] * scale;
  return out;
}
/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyMat4} a The first matrix.
 * @param {ReadonlyMat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */


function exactEquals$5(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
}
/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {ReadonlyMat4} a The first matrix.
 * @param {ReadonlyMat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */


function equals$5(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var a4 = a[4],
      a5 = a[5],
      a6 = a[6],
      a7 = a[7];
  var a8 = a[8],
      a9 = a[9],
      a10 = a[10],
      a11 = a[11];
  var a12 = a[12],
      a13 = a[13],
      a14 = a[14],
      a15 = a[15];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  var b4 = b[4],
      b5 = b[5],
      b6 = b[6],
      b7 = b[7];
  var b8 = b[8],
      b9 = b[9],
      b10 = b[10],
      b11 = b[11];
  var b12 = b[12],
      b13 = b[13],
      b14 = b[14],
      b15 = b[15];
  return Math.abs(a0 - b0) <= EPSILON$1 * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON$1 * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON$1 * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= EPSILON$1 * Math.max(1.0, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= EPSILON$1 * Math.max(1.0, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= EPSILON$1 * Math.max(1.0, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= EPSILON$1 * Math.max(1.0, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= EPSILON$1 * Math.max(1.0, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= EPSILON$1 * Math.max(1.0, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= EPSILON$1 * Math.max(1.0, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= EPSILON$1 * Math.max(1.0, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= EPSILON$1 * Math.max(1.0, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= EPSILON$1 * Math.max(1.0, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= EPSILON$1 * Math.max(1.0, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= EPSILON$1 * Math.max(1.0, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= EPSILON$1 * Math.max(1.0, Math.abs(a15), Math.abs(b15));
}
/**
 * Alias for {@link mat4.multiply}
 * @function
 */


var mul$5 = multiply$5;
/**
 * Alias for {@link mat4.subtract}
 * @function
 */

var sub$3 = subtract$3;
var mat4 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create$5,
  clone: clone$5,
  copy: copy$5,
  fromValues: fromValues$5,
  set: set$5,
  identity: identity$2,
  transpose: transpose,
  invert: invert$2,
  adjoint: adjoint,
  determinant: determinant,
  multiply: multiply$5,
  translate: translate$1,
  scale: scale$5,
  rotate: rotate$1,
  rotateX: rotateX$3,
  rotateY: rotateY$3,
  rotateZ: rotateZ$3,
  fromTranslation: fromTranslation$1,
  fromScaling: fromScaling,
  fromRotation: fromRotation$1,
  fromXRotation: fromXRotation,
  fromYRotation: fromYRotation,
  fromZRotation: fromZRotation,
  fromRotationTranslation: fromRotationTranslation$1,
  fromQuat2: fromQuat2,
  getTranslation: getTranslation$1,
  getScaling: getScaling,
  getRotation: getRotation,
  fromRotationTranslationScale: fromRotationTranslationScale,
  fromRotationTranslationScaleOrigin: fromRotationTranslationScaleOrigin,
  fromQuat: fromQuat,
  frustum: frustum,
  perspectiveNO: perspectiveNO,
  perspective: perspective,
  perspectiveZO: perspectiveZO,
  perspectiveFromFieldOfView: perspectiveFromFieldOfView,
  orthoNO: orthoNO,
  ortho: ortho,
  orthoZO: orthoZO,
  lookAt: lookAt,
  targetTo: targetTo,
  str: str$5,
  frob: frob,
  add: add$5,
  subtract: subtract$3,
  multiplyScalar: multiplyScalar,
  multiplyScalarAndAdd: multiplyScalarAndAdd,
  exactEquals: exactEquals$5,
  equals: equals$5,
  mul: mul$5,
  sub: sub$3
});
/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */

function create$4$1() {
  var out = new ARRAY_TYPE$1(3);

  if (ARRAY_TYPE$1 != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  return out;
}
/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {ReadonlyVec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */


function clone$4(a) {
  var out = new ARRAY_TYPE$1(3);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
/**
 * Calculates the length of a vec3
 *
 * @param {ReadonlyVec3} a vector to calculate length of
 * @returns {Number} length of a
 */


function length$4$1(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return Math.hypot(x, y, z);
}
/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */


function fromValues$4$1(x, y, z) {
  var out = new ARRAY_TYPE$1(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the source vector
 * @returns {vec3} out
 */


function copy$4(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */


function set$4(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */


function add$4(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */


function subtract$2(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}
/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */


function multiply$4(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}
/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */


function divide$2(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}
/**
 * Math.ceil the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to ceil
 * @returns {vec3} out
 */


function ceil$2(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  return out;
}
/**
 * Math.floor the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to floor
 * @returns {vec3} out
 */


function floor$2(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  return out;
}
/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */


function min$2(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  return out;
}
/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */


function max$2(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  return out;
}
/**
 * Math.round the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to round
 * @returns {vec3} out
 */


function round$2(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  return out;
}
/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */


function scale$4(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}
/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */


function scaleAndAdd$2(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  return out;
}
/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} distance between a and b
 */


function distance$2(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return Math.hypot(x, y, z);
}
/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} squared distance between a and b
 */


function squaredDistance$2(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return x * x + y * y + z * z;
}
/**
 * Calculates the squared length of a vec3
 *
 * @param {ReadonlyVec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */


function squaredLength$4(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return x * x + y * y + z * z;
}
/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to negate
 * @returns {vec3} out
 */


function negate$2(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}
/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to invert
 * @returns {vec3} out
 */


function inverse$2(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
}
/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to normalize
 * @returns {vec3} out
 */


function normalize$4$1(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var len = x * x + y * y + z * z;

  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }

  out[0] = a[0] * len;
  out[1] = a[1] * len;
  out[2] = a[2] * len;
  return out;
}
/**
 * Calculates the dot product of two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} dot product of a and b
 */


function dot$4$1(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */


function cross$2$1(out, a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2];
  var bx = b[0],
      by = b[1],
      bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */


function lerp$4(out, a, b, t) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}
/**
 * Performs a hermite interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {ReadonlyVec3} c the third operand
 * @param {ReadonlyVec3} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */


function hermite(out, a, b, c, d, t) {
  var factorTimes2 = t * t;
  var factor1 = factorTimes2 * (2 * t - 3) + 1;
  var factor2 = factorTimes2 * (t - 2) + t;
  var factor3 = factorTimes2 * (t - 1);
  var factor4 = factorTimes2 * (3 - 2 * t);
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
/**
 * Performs a bezier interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {ReadonlyVec3} c the third operand
 * @param {ReadonlyVec3} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */


function bezier(out, a, b, c, d, t) {
  var inverseFactor = 1 - t;
  var inverseFactorTimesTwo = inverseFactor * inverseFactor;
  var factorTimes2 = t * t;
  var factor1 = inverseFactorTimesTwo * inverseFactor;
  var factor2 = 3 * t * inverseFactorTimesTwo;
  var factor3 = 3 * factorTimes2 * inverseFactor;
  var factor4 = factorTimes2 * t;
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */


function random$3(out, scale) {
  scale = scale || 1.0;
  var r = RANDOM() * 2.0 * Math.PI;
  var z = RANDOM() * 2.0 - 1.0;
  var zScale = Math.sqrt(1.0 - z * z) * scale;
  out[0] = Math.cos(r) * zScale;
  out[1] = Math.sin(r) * zScale;
  out[2] = z * scale;
  return out;
}
/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec3} out
 */


function transformMat4$2(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2];
  var w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}
/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyMat3} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */


function transformMat3$1(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}
/**
 * Transforms the vec3 with a quat
 * Can also be used for dual quaternions. (Multiply it with the real part)
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyQuat} q quaternion to transform with
 * @returns {vec3} out
 */


function transformQuat$1(out, a, q) {
  // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
  var qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3];
  var x = a[0],
      y = a[1],
      z = a[2]; // var qvec = [qx, qy, qz];
  // var uv = vec3.cross([], qvec, a);

  var uvx = qy * z - qz * y,
      uvy = qz * x - qx * z,
      uvz = qx * y - qy * x; // var uuv = vec3.cross([], qvec, uv);

  var uuvx = qy * uvz - qz * uvy,
      uuvy = qz * uvx - qx * uvz,
      uuvz = qx * uvy - qy * uvx; // vec3.scale(uv, uv, 2 * w);

  var w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2; // vec3.scale(uuv, uuv, 2);

  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2; // return vec3.add(out, a, vec3.add(out, uv, uuv));

  out[0] = x + uvx + uuvx;
  out[1] = y + uvy + uuvy;
  out[2] = z + uvz + uuvz;
  return out;
}
/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */


function rotateX$2(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[0];
  r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
  r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad); //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */


function rotateY$2(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
  r[1] = p[1];
  r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad); //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */


function rotateZ$2(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
  r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
  r[2] = p[2]; //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Get the angle between two 3D vectors
 * @param {ReadonlyVec3} a The first operand
 * @param {ReadonlyVec3} b The second operand
 * @returns {Number} The angle in radians
 */


function angle$1(a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2],
      bx = b[0],
      by = b[1],
      bz = b[2],
      mag1 = Math.sqrt(ax * ax + ay * ay + az * az),
      mag2 = Math.sqrt(bx * bx + by * by + bz * bz),
      mag = mag1 * mag2,
      cosine = mag && dot$4$1(a, b) / mag;
  return Math.acos(Math.min(Math.max(cosine, -1), 1));
}
/**
 * Set the components of a vec3 to zero
 *
 * @param {vec3} out the receiving vector
 * @returns {vec3} out
 */


function zero$2(out) {
  out[0] = 0.0;
  out[1] = 0.0;
  out[2] = 0.0;
  return out;
}
/**
 * Returns a string representation of a vector
 *
 * @param {ReadonlyVec3} a vector to represent as a string
 * @returns {String} string representation of the vector
 */


function str$4(a) {
  return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
}
/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyVec3} a The first vector.
 * @param {ReadonlyVec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */


function exactEquals$4(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {ReadonlyVec3} a The first vector.
 * @param {ReadonlyVec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */


function equals$4(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2];
  return Math.abs(a0 - b0) <= EPSILON$1 * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= EPSILON$1 * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= EPSILON$1 * Math.max(1.0, Math.abs(a2), Math.abs(b2));
}
/**
 * Alias for {@link vec3.subtract}
 * @function
 */


var sub$2 = subtract$2;
/**
 * Alias for {@link vec3.multiply}
 * @function
 */

var mul$4 = multiply$4;
/**
 * Alias for {@link vec3.divide}
 * @function
 */

var div$2 = divide$2;
/**
 * Alias for {@link vec3.distance}
 * @function
 */

var dist$2 = distance$2;
/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */

var sqrDist$2 = squaredDistance$2;
/**
 * Alias for {@link vec3.length}
 * @function
 */

var len$4$1 = length$4$1;
/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */

var sqrLen$4 = squaredLength$4;
/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

var forEach$2 = function () {
  var vec = create$4$1();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 3;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }

    return a;
  };
}();

var vec3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  create: create$4$1,
  clone: clone$4,
  length: length$4$1,
  fromValues: fromValues$4$1,
  copy: copy$4,
  set: set$4,
  add: add$4,
  subtract: subtract$2,
  multiply: multiply$4,
  divide: divide$2,
  ceil: ceil$2,
  floor: floor$2,
  min: min$2,
  max: max$2,
  round: round$2,
  scale: scale$4,
  scaleAndAdd: scaleAndAdd$2,
  distance: distance$2,
  squaredDistance: squaredDistance$2,
  squaredLength: squaredLength$4,
  negate: negate$2,
  inverse: inverse$2,
  normalize: normalize$4$1,
  dot: dot$4$1,
  cross: cross$2$1,
  lerp: lerp$4,
  hermite: hermite,
  bezier: bezier,
  random: random$3,
  transformMat4: transformMat4$2,
  transformMat3: transformMat3$1,
  transformQuat: transformQuat$1,
  rotateX: rotateX$2,
  rotateY: rotateY$2,
  rotateZ: rotateZ$2,
  angle: angle$1,
  zero: zero$2,
  str: str$4,
  exactEquals: exactEquals$4,
  equals: equals$4,
  sub: sub$2,
  mul: mul$4,
  div: div$2,
  dist: dist$2,
  sqrDist: sqrDist$2,
  len: len$4$1,
  sqrLen: sqrLen$4,
  forEach: forEach$2
});
/**
 * 4 Dimensional Vector
 * @module vec4
 */

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */

function create$3$1() {
  var out = new ARRAY_TYPE$1(4);

  if (ARRAY_TYPE$1 != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
  }

  return out;
}
/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to normalize
 * @returns {vec4} out
 */


function normalize$3$1(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  var len = x * x + y * y + z * z + w * w;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }

  out[0] = x * len;
  out[1] = y * len;
  out[2] = z * len;
  out[3] = w * len;
  return out;
}
/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

(function () {
  var vec = create$3$1();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 4;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      vec[3] = a[i + 3];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
      a[i + 3] = vec[3];
    }

    return a;
  };
})();
/**
 * Quaternion
 * @module quat
 */

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */

function create$2$1() {
  var out = new ARRAY_TYPE$1(4);

  if (ARRAY_TYPE$1 != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  out[3] = 1;
  return out;
}
/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyVec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/


function setAxisAngle$1(out, axis, rad) {
  rad = rad * 0.5;
  var s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}
/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */


function slerp$1(out, a, b, t) {
  // benchmarks:
  //    http://jsperf.com/quaternion-slerp-implementations
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bx = b[0],
      by = b[1],
      bz = b[2],
      bw = b[3];
  var omega, cosom, sinom, scale0, scale1; // calc cosine

  cosom = ax * bx + ay * by + az * bz + aw * bw; // adjust signs (if necessary)

  if (cosom < 0.0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  } // calculate coefficients


  if (1.0 - cosom > EPSILON$1) {
    // standard case (slerp)
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    // "from" and "to" quaternions are very close
    //  ... so we can do a linear interpolation
    scale0 = 1.0 - t;
    scale1 = t;
  } // calculate final values


  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;
  return out;
}
/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyMat3} m rotation matrix
 * @returns {quat} out
 * @function
 */


function fromMat3$1(out, m) {
  // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
  // article "Quaternion Calculus and Fast Animation".
  var fTrace = m[0] + m[4] + m[8];
  var fRoot;

  if (fTrace > 0.0) {
    // |w| > 1/2, may as well choose w > 1/2
    fRoot = Math.sqrt(fTrace + 1.0); // 2w

    out[3] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot; // 1/(4w)

    out[0] = (m[5] - m[7]) * fRoot;
    out[1] = (m[6] - m[2]) * fRoot;
    out[2] = (m[1] - m[3]) * fRoot;
  } else {
    // |w| <= 1/2
    var i = 0;
    if (m[4] > m[0]) i = 1;
    if (m[8] > m[i * 3 + i]) i = 2;
    var j = (i + 1) % 3;
    var k = (i + 2) % 3;
    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
  }

  return out;
}
/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */

var normalize$2$1 = normalize$3$1;
/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {ReadonlyVec3} a the initial vector
 * @param {ReadonlyVec3} b the destination vector
 * @returns {quat} out
 */

(function () {
  var tmpvec3 = create$4$1();
  var xUnitVec3 = fromValues$4$1(1, 0, 0);
  var yUnitVec3 = fromValues$4$1(0, 1, 0);
  return function (out, a, b) {
    var dot = dot$4$1(a, b);

    if (dot < -0.999999) {
      cross$2$1(tmpvec3, xUnitVec3, a);
      if (len$4$1(tmpvec3) < 0.000001) cross$2$1(tmpvec3, yUnitVec3, a);
      normalize$4$1(tmpvec3, tmpvec3);
      setAxisAngle$1(out, tmpvec3, Math.PI);
      return out;
    } else if (dot > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      cross$2$1(tmpvec3, a, b);
      out[0] = tmpvec3[0];
      out[1] = tmpvec3[1];
      out[2] = tmpvec3[2];
      out[3] = 1 + dot;
      return normalize$2$1(out, out);
    }
  };
})();
/**
 * Performs a spherical linear interpolation with two control points
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {ReadonlyQuat} c the third operand
 * @param {ReadonlyQuat} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */


(function () {
  var temp1 = create$2$1();
  var temp2 = create$2$1();
  return function (out, a, b, c, d, t) {
    slerp$1(temp1, a, d, t);
    slerp$1(temp2, b, c, t);
    slerp$1(out, temp1, temp2, 2 * t * (1 - t));
    return out;
  };
})();
/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {ReadonlyVec3} view  the vector representing the viewing direction
 * @param {ReadonlyVec3} right the vector representing the local "right" direction
 * @param {ReadonlyVec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */


(function () {
  var matr = create$6$1();
  return function (out, view, right, up) {
    matr[0] = right[0];
    matr[3] = right[1];
    matr[6] = right[2];
    matr[1] = up[0];
    matr[4] = up[1];
    matr[7] = up[2];
    matr[2] = -view[0];
    matr[5] = -view[1];
    matr[8] = -view[2];
    return normalize$2$1(out, fromMat3$1(out, matr));
  };
})();
/**
 * 2 Dimensional Vector
 * @module vec2
 */

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */

function create$1() {
  var out = new ARRAY_TYPE$1(2);

  if (ARRAY_TYPE$1 != Float32Array) {
    out[0] = 0;
    out[1] = 0;
  }

  return out;
}
/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

(function () {
  var vec = create$1();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 2;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
    }

    return a;
  };
})();

const _excluded$1 = ["name"];

var _application$2 = /*#__PURE__*/new WeakMap();

var _dataSaved$1 = /*#__PURE__*/new WeakMap();

class ApplicationState {
  /**
   * @type {Map<string, ApplicationData>}
   */

  /**
   * @param {{ reactive: SvelteReactive, options: object }}   application - The application.
   */
  constructor(application) {
    _classPrivateFieldInitSpec(this, _application$2, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _dataSaved$1, {
      writable: true,
      value: new Map()
    });

    _classPrivateFieldSet(this, _application$2, application);
  }
  /**
   * Returns current application state along with any extra data passed into method.
   *
   * @param {object} [extra] - Extra data to add to application state.
   *
   * @returns {ApplicationData} Passed in object with current application state.
   */


  get(extra = {}) {
    var _classPrivateFieldGet2, _classPrivateFieldGet3, _classPrivateFieldGet4, _classPrivateFieldGet5, _classPrivateFieldGet6;

    return Object.assign(extra, {
      position: (_classPrivateFieldGet2 = _classPrivateFieldGet(this, _application$2)) === null || _classPrivateFieldGet2 === void 0 ? void 0 : (_classPrivateFieldGet3 = _classPrivateFieldGet2.position) === null || _classPrivateFieldGet3 === void 0 ? void 0 : _classPrivateFieldGet3.get(),
      options: Object.assign({}, (_classPrivateFieldGet4 = _classPrivateFieldGet(this, _application$2)) === null || _classPrivateFieldGet4 === void 0 ? void 0 : _classPrivateFieldGet4.options),
      ui: {
        minimized: (_classPrivateFieldGet5 = _classPrivateFieldGet(this, _application$2)) === null || _classPrivateFieldGet5 === void 0 ? void 0 : (_classPrivateFieldGet6 = _classPrivateFieldGet5.reactive) === null || _classPrivateFieldGet6 === void 0 ? void 0 : _classPrivateFieldGet6.minimized
      }
    });
  }
  /**
   * Returns any stored save state by name.
   *
   * @param {string}   name - Saved data set name.
   *
   * @returns {ApplicationData} The saved data set.
   */


  getSave({
    name
  }) {
    if (typeof name !== 'string') {
      throw new TypeError(`ApplicationState - getSave error: 'name' is not a string.`);
    }

    return _classPrivateFieldGet(this, _dataSaved$1).get(name);
  }
  /**
   * Removes and returns any application state by name.
   *
   * @param {object}   options - Options.
   *
   * @param {string}   options.name - Name to remove and retrieve.
   *
   * @returns {ApplicationData} Saved position data.
   */


  remove({
    name
  }) {
    if (typeof name !== 'string') {
      throw new TypeError(`Position - remove: 'name' is not a string.`);
    }

    const data = _classPrivateFieldGet(this, _dataSaved$1).get(name);

    _classPrivateFieldGet(this, _dataSaved$1).delete(name);

    return data;
  }
  /**
   * Restores a saved application state returning the data. Several optional parameters are available
   * to control whether the restore action occurs silently (no store / inline styles updates), animates
   * to the stored data, or simply sets the stored data. Restoring via {@link Position.animateTo} allows
   * specification of the duration, easing, and interpolate functions along with configuring a Promise to be
   * returned if awaiting the end of the animation.
   *
   * @param {object}            params - Parameters
   *
   * @param {string}            params.name - Saved data set name.
   *
   * @param {boolean}           [params.remove=false] - Remove data set.
   *
   * @param {boolean}           [params.async=false] - If animating return a Promise that resolves with any saved data.
   *
   * @param {boolean}           [params.animateTo=false] - Animate to restore data.
   *
   * @param {number}            [params.duration=100] - Duration in milliseconds.
   *
   * @param {Function}          [params.easing=linear] - Easing function.
   *
   * @param {Function}          [params.interpolate=lerp] - Interpolation function.
   *
   * @returns {ApplicationData} Saved application data.
   */


  restore({
    name,
    remove = false,
    async = false,
    animateTo = false,
    duration = 100,
    easing = identity,
    interpolate = lerp$5
  }) {
    if (typeof name !== 'string') {
      throw new TypeError(`ApplicationState - restore error: 'name' is not a string.`);
    }

    const dataSaved = _classPrivateFieldGet(this, _dataSaved$1).get(name);

    if (dataSaved) {
      if (remove) {
        _classPrivateFieldGet(this, _dataSaved$1).delete(name);
      }

      return this.set(dataSaved, {
        async,
        animateTo,
        duration,
        easing,
        interpolate
      });
    }

    return dataSaved;
  }
  /**
   * Saves current application state with the opportunity to add extra data to the saved state.
   *
   * @param {object}   options - Options.
   *
   * @param {string}   options.name - name to index this saved data.
   *
   * @param {...*}     [options.extra] - Extra data to add to saved data.
   *
   * @returns {ApplicationData} Current position data
   */


  save(_ref) {
    let {
      name
    } = _ref,
        extra = _objectWithoutProperties(_ref, _excluded$1);

    if (typeof name !== 'string') {
      throw new TypeError(`ApplicationState - save error: 'name' is not a string.`);
    }

    const data = this.get(extra);

    _classPrivateFieldGet(this, _dataSaved$1).set(name, data);

    return data;
  }
  /**
   * Restores a saved positional state returning the data. Several optional parameters are available
   * to control whether the restore action occurs silently (no store / inline styles updates), animates
   * to the stored data, or simply sets the stored data. Restoring via {@link Position.animateTo} allows
   * specification of the duration, easing, and interpolate functions along with configuring a Promise to be
   * returned if awaiting the end of the animation.
   *
   * @param {ApplicationData}   data - Saved data set name.
   *
   * @param {object}            opts - Optional parameters
   *
   * @param {boolean}           [opts.async=false] - If animating return a Promise that resolves with any saved data.
   *
   * @param {boolean}           [opts.animateTo=false] - Animate to restore data.
   *
   * @param {number}            [opts.duration=100] - Duration in milliseconds.
   *
   * @param {Function}          [opts.easing=linear] - Easing function.
   *
   * @param {Function}          [opts.interpolate=lerp] - Interpolation function.
   *
   * @returns {Application} application.
   */


  set(data, {
    async = false,
    animateTo = false,
    duration = 100,
    easing = identity,
    interpolate = lerp$5
  }) {
    if (typeof data !== 'object') {
      throw new TypeError(`ApplicationState - restore error: 'data' is not an object.`);
    }

    const application = _classPrivateFieldGet(this, _application$2);

    if (data) {
      // Merge in saved options to application.
      if (typeof (data === null || data === void 0 ? void 0 : data.options) === 'object') {
        application === null || application === void 0 ? void 0 : application.reactive.mergeOptions(data.options);
      }

      if (typeof (data === null || data === void 0 ? void 0 : data.ui) === 'object') {
        var _data$ui, _application$reactive, _application$reactive2;

        const minimized = typeof ((_data$ui = data.ui) === null || _data$ui === void 0 ? void 0 : _data$ui.minimized) === 'boolean' ? data.ui.minimized : false; // Application is currently minimized and stored state is not, so reset minimized state without animationn.

        if (application !== null && application !== void 0 && (_application$reactive = application.reactive) !== null && _application$reactive !== void 0 && _application$reactive.minimized && !minimized) {
          application.maximize({
            animate: false,
            duration: 0
          });
        } else if (!(application !== null && application !== void 0 && (_application$reactive2 = application.reactive) !== null && _application$reactive2 !== void 0 && _application$reactive2.minimized) && minimized) {
          application.minimize({
            animate: false,
            duration
          });
        }
      }

      if (typeof (data === null || data === void 0 ? void 0 : data.position) === 'object') {
        // Update data directly with no store or inline style updates.
        if (animateTo) // Animate to saved data.
          {
            // Provide special handling to potentially change transform origin as this parameter is not animated.
            if (data.position.transformOrigin !== application.position.transformOrigin) {
              application.position.transformOrigin = data.position.transformOrigin;
            } // Return a Promise with saved data that resolves after animation ends.


            if (async) {
              return application.position.animateTo(data.position, {
                duration,
                easing,
                interpolate
              }).then(() => application);
            } else // Animate synchronously.
              {
                application.position.animateTo(data.position, {
                  duration,
                  easing,
                  interpolate
                });
              }
          } else {
          // Default options is to set data for an immediate update.
          application.position.set(data.position);
        }
      }
    }

    return application;
  }

}
/**
 * @typedef {object} ApplicationData
 *
 * @property {PositionData}   position - Application position.
 *
 * @property {object}         options - Application options.
 *
 * @property {object}         ui - Application UI state.
 */

var _applicationShellHolder$1 = /*#__PURE__*/new WeakMap();

var _svelteData$1 = /*#__PURE__*/new WeakMap();

/**
 * Provides a helper class for {@link SvelteApplication} by combining all methods that work on the {@link SvelteData[]}
 * of mounted components. This class is instantiated and can be retrieved by the getter `svelte` via SvelteApplication.
 */
class GetSvelteData {
  /**
   * @type {MountedAppShell[]|null[]}
   */

  /**
   * @type {SvelteData[]}
   */

  /**
   * Keep a direct reference to the SvelteData array in an associated {@link SvelteApplication}.
   *
   * @param {MountedAppShell[]|null[]}  applicationShellHolder - A reference to the MountedAppShell array.
   *
   * @param {SvelteData[]}  svelteData - A reference to the SvelteData array of mounted components.
   */
  constructor(applicationShellHolder, svelteData) {
    _classPrivateFieldInitSpec(this, _applicationShellHolder$1, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _svelteData$1, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _applicationShellHolder$1, applicationShellHolder);

    _classPrivateFieldSet(this, _svelteData$1, svelteData);
  }
  /**
   * Returns any mounted {@link MountedAppShell}.
   *
   * @returns {MountedAppShell|null} Any mounted application shell.
   */


  get applicationShell() {
    return _classPrivateFieldGet(this, _applicationShellHolder$1)[0];
  }
  /**
   * Returns the indexed Svelte component.
   *
   * @param {number}   index -
   *
   * @returns {object} The loaded Svelte component.
   */


  component(index) {
    const data = _classPrivateFieldGet(this, _svelteData$1)[index];

    return typeof data === 'object' ? data === null || data === void 0 ? void 0 : data.component : void 0;
  }
  /**
   * Returns the Svelte component entries iterator.
   *
   * @returns {Generator<Array<number|SvelteComponent>>} Svelte component entries iterator.
   * @yields
   */


  *componentEntries() {
    for (let cntr = 0; cntr < _classPrivateFieldGet(this, _svelteData$1).length; cntr++) {
      yield [cntr, _classPrivateFieldGet(this, _svelteData$1)[cntr].component];
    }
  }
  /**
   * Returns the Svelte component values iterator.
   *
   * @returns {Generator<SvelteComponent>} Svelte component values iterator.
   * @yields
   */


  *componentValues() {
    for (let cntr = 0; cntr < _classPrivateFieldGet(this, _svelteData$1).length; cntr++) {
      yield _classPrivateFieldGet(this, _svelteData$1)[cntr].component;
    }
  }
  /**
   * Returns the indexed SvelteData entry.
   *
   * @param {number}   index -
   *
   * @returns {SvelteData} The loaded Svelte config + component.
   */


  data(index) {
    return _classPrivateFieldGet(this, _svelteData$1)[index];
  }
  /**
   * Returns the {@link SvelteData} instance for a given component.
   *
   * @param {object} component - Svelte component.
   *
   * @returns {SvelteData} -  The loaded Svelte config + component.
   */


  dataByComponent(component) {
    for (const data of _classPrivateFieldGet(this, _svelteData$1)) {
      if (data.component === component) {
        return data;
      }
    }

    return void 0;
  }
  /**
   * Returns the SvelteData entries iterator.
   *
   * @returns {IterableIterator<[number, SvelteData]>} SvelteData entries iterator.
   */


  dataEntries() {
    return _classPrivateFieldGet(this, _svelteData$1).entries();
  }
  /**
   * Returns the SvelteData values iterator.
   *
   * @returns {IterableIterator<SvelteData>} SvelteData values iterator.
   */


  dataValues() {
    return _classPrivateFieldGet(this, _svelteData$1).values();
  }
  /**
   * Returns the length of the mounted Svelte component list.
   *
   * @returns {number} Length of mounted Svelte component list.
   */


  get length() {
    return _classPrivateFieldGet(this, _svelteData$1).length;
  }

}

/**
 * Instantiates and attaches a Svelte component to the main inserted HTML.
 *
 * @param {SvelteFormApplication} app - The application
 *
 * @param {JQuery}            html - The inserted HTML.
 *
 * @param {object}            config - Svelte component options
 *
 * @param {Function}          elementRootUpdate - A callback to assign to the external context.
 *
 * @returns {SvelteData} The config + instantiated Svelte component.
 */

function loadSvelteConfig(app, html, config, elementRootUpdate) {
  const svelteOptions = typeof config.options === 'object' ? config.options : {};
  let target;

  if (config.target instanceof HTMLElement) // A specific HTMLElement to append Svelte component.
    {
      target = config.target;
    } else if (typeof config.target === 'string') // A string target defines a selector to find in existing HTML.
    {
      target = html.find(config.target).get(0);
    } else // No target defined, create a document fragment.
    {
      target = document.createDocumentFragment();
    }

  if (target === void 0) {
    throw new Error(`SvelteFormApplication - s_LOAD_CONFIG - could not find target selector: ${config.target} for config:\n${JSON.stringify(config)}`);
  }

  const NewSvelteComponent = config.class;
  const svelteConfig = parseSvelteConfig(_objectSpread2(_objectSpread2({}, config), {}, {
    target
  }), app);
  const externalContext = svelteConfig.context.get('external'); // Inject the Foundry application instance and `elementRootUpdate` to the external context.

  externalContext.application = app;
  externalContext.elementRootUpdate = elementRootUpdate;
  let eventbus; // Potentially inject any TyphonJS eventbus and track the proxy in the SvelteData instance.

  if (typeof app._eventbus === 'object' && typeof app._eventbus.createProxy === 'function') {
    eventbus = app._eventbus.createProxy();
    externalContext.eventbus = eventbus;
  } // Create the Svelte component.

  /**
   * @type {import('svelte').SvelteComponent}
   */


  const component = new NewSvelteComponent(svelteConfig); // Set any eventbus to the config.

  svelteConfig.eventbus = eventbus;
  /**
   * @type {HTMLElement}
   */

  let element; // We can directly get the root element from components which follow the application store contract.

  if (isApplicationShell(component)) {
    element = component.elementRoot;
  } // Detect if target is a synthesized DocumentFragment with an child element. Child elements will be present
  // if the Svelte component mounts and renders initial content into the document fragment.


  if (config.target instanceof DocumentFragment && target.firstElementChild) {
    if (element === void 0) {
      element = target.firstElementChild;
    }

    html.append(target);
  } else if (config.target instanceof HTMLElement && element === void 0) {
    if (config.target instanceof HTMLElement && typeof svelteOptions.selectorElement !== 'string') {
      throw new Error(`SvelteFormApplication - s_LOAD_CONFIG - HTMLElement target with no 'selectorElement' defined for config:\n${JSON.stringify(config)}`);
    } // The target is an HTMLElement so find the Application element from `selectorElement` option.


    element = target.querySelector(svelteOptions.selectorElement);

    if (element === null || element === void 0) {
      throw new Error(`SvelteFormApplication - s_LOAD_CONFIG - HTMLElement target - could not find 'selectorElement' for config:\n${JSON.stringify(config)}`);
    }
  } // If the configuration / original target is an HTML element then do not inject HTML.


  const injectHTML = !(config.target instanceof HTMLElement);
  return {
    config: svelteConfig,
    component,
    element,
    injectHTML
  };
}

const s_REGEX = /(\d+)\s*px/;
/**
 * Parses a pixel string / computed styles. Ex. `100px` returns `100`.
 *
 * @param {string}   value - Value to parse.
 *
 * @returns {number|undefined} The integer component of a pixel string.
 */

function styleParsePixels(value) {
  if (typeof value !== 'string') {
    return void 0;
  }

  const isPixels = s_REGEX.test(value);
  const number = parseInt(value);
  return isPixels && Number.isFinite(number) ? number : void 0;
}

const subscriber_queue = [];
/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial value
 * @param {StartStopNotifier}start start and stop notifications for subscriptions
 */

function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */


function writable(value, start = noop) {
  let stop;
  const subscribers = new Set();

  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;

      if (stop) {
        // store is ready
        const run_queue = !subscriber_queue.length;

        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }

        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }

          subscriber_queue.length = 0;
        }
      }
    }
  }

  function update(fn) {
    set(fn(value));
  }

  function subscribe(run, invalidate = noop) {
    const subscriber = [run, invalidate];
    subscribers.add(subscriber);

    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }

    run(value);
    return () => {
      subscribers.delete(subscriber);

      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }

  return {
    set,
    update,
    subscribe
  };
}

function derived(stores, fn, initial_value) {
  const single = !Array.isArray(stores);
  const stores_array = single ? [stores] : stores;
  const auto = fn.length < 2;
  return readable(initial_value, set => {
    let inited = false;
    const values = [];
    let pending = 0;
    let cleanup = noop;

    const sync = () => {
      if (pending) {
        return;
      }

      cleanup();
      const result = fn(single ? values[0] : values, set);

      if (auto) {
        set(result);
      } else {
        cleanup = is_function(result) ? result : noop;
      }
    };

    const unsubscribers = stores_array.map((store, i) => subscribe(store, value => {
      values[i] = value;
      pending &= ~(1 << i);

      if (inited) {
        sync();
      }
    }, () => {
      pending |= 1 << i;
    }));
    inited = true;
    sync();
    return function stop() {
      run_all(unsubscribers);
      cleanup();
    };
  });
}

/**
 * Subscribes to the given store with the update function provided and ignores the first automatic
 * update. All future updates are dispatched to the update function.
 *
 * @param {import('svelte/store').Readable | import('svelte/store').Writable} store -
 *  Store to subscribe to...
 *
 * @param {import('svelte/store').Updater} update - function to receive future updates.
 *
 * @returns {import('svelte/store').Unsubscriber} Store unsubscribe function.
 */


function subscribeIgnoreFirst(store, update) {
  let firedFirst = false;
  return store.subscribe(value => {
    if (!firedFirst) {
      firedFirst = true;
    } else {
      update(value);
    }
  });
}
/**
 * @external Store
 * @see [Svelte stores](https://svelte.dev/docs#Store_contract)
 */

/**
 * Create a store similar to [Svelte's `derived`](https://svelte.dev/docs#derived), but which
 * has its own `set` and `update` methods and can send values back to the origin stores.
 * [Read more...](https://github.com/PixievoltNo1/svelte-writable-derived#default-export-writablederived)
 * 
 * @param {Store|Store[]} origins One or more stores to derive from. Same as
 * [`derived`](https://svelte.dev/docs#derived)'s 1st parameter.
 * @param {!Function} derive The callback to determine the derived value. Same as
 * [`derived`](https://svelte.dev/docs#derived)'s 2nd parameter.
 * @param {!Function|{withOld: !Function}} reflect Called when the
 * derived store gets a new value via its `set` or `update` methods, and determines new values for
 * the origin stores. [Read more...](https://github.com/PixievoltNo1/svelte-writable-derived#new-parameter-reflect)
 * @param [initial] The new store's initial value. Same as
 * [`derived`](https://svelte.dev/docs#derived)'s 3rd parameter.
 * 
 * @returns {Store} A writable store.
 */


function writableDerived(origins, derive, reflect, initial) {
  var childDerivedSetter,
      originValues,
      allowDerive = true;
  var reflectOldValues = ("withOld" in reflect);

  var wrappedDerive = (got, set) => {
    childDerivedSetter = set;

    if (reflectOldValues) {
      originValues = got;
    }

    if (allowDerive) {
      let returned = derive(got, set);

      if (derive.length < 2) {
        set(returned);
      } else {
        return returned;
      }
    }
  };

  var childDerived = derived(origins, wrappedDerive, initial);
  var singleOrigin = !Array.isArray(origins);

  var sendUpstream = setWith => {
    allowDerive = false;

    if (singleOrigin) {
      origins.set(setWith);
    } else {
      setWith.forEach((value, i) => {
        origins[i].set(value);
      });
    }

    allowDerive = true;
  };

  if (reflectOldValues) {
    reflect = reflect.withOld;
  }

  var reflectIsAsync = reflect.length >= (reflectOldValues ? 3 : 2);
  var cleanup = null;

  function doReflect(reflecting) {
    if (cleanup) {
      cleanup();
      cleanup = null;
    }

    if (reflectOldValues) {
      var returned = reflect(reflecting, originValues, sendUpstream);
    } else {
      var returned = reflect(reflecting, sendUpstream);
    }

    if (reflectIsAsync) {
      if (typeof returned == "function") {
        cleanup = returned;
      }
    } else {
      sendUpstream(returned);
    }
  }

  var tryingSet = false;

  function update(fn) {
    var isUpdated, mutatedBySubscriptions, oldValue, newValue;

    if (tryingSet) {
      newValue = fn(get_store_value(childDerived));
      childDerivedSetter(newValue);
      return;
    }

    var unsubscribe = childDerived.subscribe(value => {
      if (!tryingSet) {
        oldValue = value;
      } else if (!isUpdated) {
        isUpdated = true;
      } else {
        mutatedBySubscriptions = true;
      }
    });
    newValue = fn(oldValue);
    tryingSet = true;
    childDerivedSetter(newValue);
    unsubscribe();
    tryingSet = false;

    if (mutatedBySubscriptions) {
      newValue = get_store_value(childDerived);
    }

    if (isUpdated) {
      doReflect(newValue);
    }
  }

  return {
    subscribe: childDerived.subscribe,

    set(value) {
      update(() => value);
    },

    update
  };
}
/**
 * Create a store for a property value in an object contained in another store.
 * [Read more...](https://github.com/PixievoltNo1/svelte-writable-derived#named-export-propertystore)
 * 
 * @param {Store} origin The store containing the object to get/set from.
 * @param {string|number|symbol|Array<string|number|symbol>} propName The property to get/set, or a path of
 * properties in nested objects.
 *
 * @returns {Store} A writable store.
 */


function propertyStore(origin, propName) {
  if (!Array.isArray(propName)) {
    return writableDerived(origin, object => object[propName], {
      withOld(reflecting, object) {
        object[propName] = reflecting;
        return object;
      }

    });
  } else {
    let props = propName.concat();
    return writableDerived(origin, value => {
      for (let i = 0; i < props.length; ++i) {
        value = value[props[i]];
      }

      return value;
    }, {
      withOld(reflecting, object) {
        let target = object;

        for (let i = 0; i < props.length - 1; ++i) {
          target = target[props[i]];
        }

        target[props[props.length - 1]] = reflecting;
        return object;
      }

    });
  }
}

const storeState = writable(void 0);
/**
 * @type {GameState} Provides a Svelte store wrapping the Foundry runtime / global game state.
 */

const gameState = {
  subscribe: storeState.subscribe,
  get: () => game
};
Object.freeze(gameState);
Hooks.once('ready', () => storeState.set(game));

/**
 * Contains the reactive functionality / Svelte stores associated with SvelteApplication.
 */

var _application$1 = /*#__PURE__*/new WeakMap();

var _initialized = /*#__PURE__*/new WeakMap();

var _storeAppOptions = /*#__PURE__*/new WeakMap();

var _storeAppOptionsUpdate = /*#__PURE__*/new WeakMap();

var _dataUIState = /*#__PURE__*/new WeakMap();

var _storeUIState = /*#__PURE__*/new WeakMap();

var _storeUIStateUpdate = /*#__PURE__*/new WeakMap();

var _storeUnsubscribe = /*#__PURE__*/new WeakMap();

var _storesInitialize = /*#__PURE__*/new WeakSet();

var _storesSubscribe = /*#__PURE__*/new WeakSet();

var _storesUnsubscribe = /*#__PURE__*/new WeakSet();

class SvelteReactive {
  /**
   * @type {SvelteApplication}
   */

  /**
   * @type {boolean}
   */

  /**
   * The Application option store which is injected into mounted Svelte component context under the `external` key.
   *
   * @type {StoreAppOptions}
   */

  /**
   * Stores the update function for `#storeAppOptions`.
   *
   * @type {import('svelte/store').Writable.update}
   */

  /**
   * Stores the UI state data to make it accessible via getters.
   *
   * @type {object}
   */

  /**
   * The UI option store which is injected into mounted Svelte component context under the `external` key.
   *
   * @type {StoreUIOptions}
   */

  /**
   * Stores the update function for `#storeUIState`.
   *
   * @type {import('svelte/store').Writable.update}
   */

  /**
   * Stores the unsubscribe functions from local store subscriptions.
   *
   * @type {import('svelte/store').Unsubscriber[]}
   */

  /**
   * @param {SvelteApplication} application - The host Foundry application.
   */
  constructor(application) {
    _classPrivateMethodInitSpec(this, _storesUnsubscribe);

    _classPrivateMethodInitSpec(this, _storesSubscribe);

    _classPrivateMethodInitSpec(this, _storesInitialize);

    _classPrivateFieldInitSpec(this, _application$1, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _initialized, {
      writable: true,
      value: false
    });

    _classPrivateFieldInitSpec(this, _storeAppOptions, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _storeAppOptionsUpdate, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _dataUIState, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _storeUIState, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _storeUIStateUpdate, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _storeUnsubscribe, {
      writable: true,
      value: []
    });

    _classPrivateFieldSet(this, _application$1, application);
  }
  /**
   * Initializes reactive support. Package private for internal use.
   *
   * @returns {SvelteStores} Internal methods to interact with Svelte stores.
   * @package
   */


  initialize() {
    if (_classPrivateFieldGet(this, _initialized)) {
      return;
    }

    _classPrivateFieldSet(this, _initialized, true);

    _classPrivateMethodGet(this, _storesInitialize, _storesInitialize2).call(this);

    return {
      appOptionsUpdate: _classPrivateFieldGet(this, _storeAppOptionsUpdate),
      uiOptionsUpdate: _classPrivateFieldGet(this, _storeUIStateUpdate),
      subscribe: _classPrivateMethodGet(this, _storesSubscribe, _storesSubscribe2).bind(this),
      unsubscribe: _classPrivateMethodGet(this, _storesUnsubscribe, _storesUnsubscribe2).bind(this)
    };
  } // Only reactive getters ---------------------------------------------------------------------------------------------

  /**
   * Returns the current dragging UI state.
   *
   * @returns {boolean} Dragging UI state.
   */


  get dragging() {
    return _classPrivateFieldGet(this, _dataUIState).dragging;
  }
  /**
   * Returns the current minimized UI state.
   *
   * @returns {boolean} Minimized UI state.
   */


  get minimized() {
    return _classPrivateFieldGet(this, _dataUIState).minimized;
  }
  /**
   * Returns the current resizing UI state.
   *
   * @returns {boolean} Resizing UI state.
   */


  get resizing() {
    return _classPrivateFieldGet(this, _dataUIState).resizing;
  } // Reactive getter / setters -----------------------------------------------------------------------------------------

  /**
   * Returns the draggable app option.
   *
   * @returns {boolean} Draggable app option.
   */


  get draggable() {
    var _classPrivateFieldGet2, _classPrivateFieldGet3;

    return (_classPrivateFieldGet2 = _classPrivateFieldGet(this, _application$1)) === null || _classPrivateFieldGet2 === void 0 ? void 0 : (_classPrivateFieldGet3 = _classPrivateFieldGet2.options) === null || _classPrivateFieldGet3 === void 0 ? void 0 : _classPrivateFieldGet3.draggable;
  }
  /**
   * Returns the headerButtonNoClose app option.
   *
   * @returns {boolean} Remove the close the button in header app option.
   */


  get headerButtonNoClose() {
    var _classPrivateFieldGet4, _classPrivateFieldGet5;

    return (_classPrivateFieldGet4 = _classPrivateFieldGet(this, _application$1)) === null || _classPrivateFieldGet4 === void 0 ? void 0 : (_classPrivateFieldGet5 = _classPrivateFieldGet4.options) === null || _classPrivateFieldGet5 === void 0 ? void 0 : _classPrivateFieldGet5.headerButtonNoClose;
  }
  /**
   * Returns the headerButtonNoLabel app option.
   *
   * @returns {boolean} Remove the labels from buttons in header app option.
   */


  get headerButtonNoLabel() {
    var _classPrivateFieldGet6, _classPrivateFieldGet7;

    return (_classPrivateFieldGet6 = _classPrivateFieldGet(this, _application$1)) === null || _classPrivateFieldGet6 === void 0 ? void 0 : (_classPrivateFieldGet7 = _classPrivateFieldGet6.options) === null || _classPrivateFieldGet7 === void 0 ? void 0 : _classPrivateFieldGet7.headerButtonNoLabel;
  }
  /**
   * Returns the headerNoTitleMinimized app option.
   *
   * @returns {boolean} When true removes the header title when minimized.
   */


  get headerNoTitleMinimized() {
    var _classPrivateFieldGet8, _classPrivateFieldGet9;

    return (_classPrivateFieldGet8 = _classPrivateFieldGet(this, _application$1)) === null || _classPrivateFieldGet8 === void 0 ? void 0 : (_classPrivateFieldGet9 = _classPrivateFieldGet8.options) === null || _classPrivateFieldGet9 === void 0 ? void 0 : _classPrivateFieldGet9.headerNoTitleMinimized;
  }
  /**
   * Returns the minimizable app option.
   *
   * @returns {boolean} Minimizable app option.
   */


  get minimizable() {
    var _classPrivateFieldGet10, _classPrivateFieldGet11;

    return (_classPrivateFieldGet10 = _classPrivateFieldGet(this, _application$1)) === null || _classPrivateFieldGet10 === void 0 ? void 0 : (_classPrivateFieldGet11 = _classPrivateFieldGet10.options) === null || _classPrivateFieldGet11 === void 0 ? void 0 : _classPrivateFieldGet11.minimizable;
  }
  /**
   * @inheritDoc
   */


  get popOut() {
    return _classPrivateFieldGet(this, _application$1).popOut;
  }
  /**
   * Returns the resizable option.
   *
   * @returns {boolean} Resizable app option.
   */


  get resizable() {
    var _classPrivateFieldGet12, _classPrivateFieldGet13;

    return (_classPrivateFieldGet12 = _classPrivateFieldGet(this, _application$1)) === null || _classPrivateFieldGet12 === void 0 ? void 0 : (_classPrivateFieldGet13 = _classPrivateFieldGet12.options) === null || _classPrivateFieldGet13 === void 0 ? void 0 : _classPrivateFieldGet13.resizable;
  }
  /**
   * Returns the store for app options.
   *
   * @returns {StoreAppOptions} App options store.
   */


  get storeAppOptions() {
    return _classPrivateFieldGet(this, _storeAppOptions);
  }
  /**
   * Returns the store for UI options.
   *
   * @returns {StoreUIOptions} UI options store.
   */


  get storeUIState() {
    return _classPrivateFieldGet(this, _storeUIState);
  }
  /**
   * Returns the title accessor from the parent Application class.
   * TODO: Application v2; note that super.title localizes `this.options.title`; IMHO it shouldn't.
   *
   * @returns {string} Title.
   */


  get title() {
    return _classPrivateFieldGet(this, _application$1).title;
  }
  /**
   * Sets `this.options.draggable` which is reactive for application shells.
   *
   * @param {boolean}  draggable - Sets the draggable option.
   */


  set draggable(draggable) {
    if (typeof draggable === 'boolean') {
      this.setOptions('draggable', draggable);
    }
  }
  /**
   * Sets `this.options.headerButtonNoClose` which is reactive for application shells.
   *
   * @param {boolean}  headerButtonNoClose - Sets the headerButtonNoClose option.
   */


  set headerButtonNoClose(headerButtonNoClose) {
    if (typeof headerButtonNoClose === 'boolean') {
      this.setOptions('headerButtonNoClose', headerButtonNoClose);
    }
  }
  /**
   * Sets `this.options.headerButtonNoLabel` which is reactive for application shells.
   *
   * @param {boolean}  headerButtonNoLabel - Sets the headerButtonNoLabel option.
   */


  set headerButtonNoLabel(headerButtonNoLabel) {
    if (typeof headerButtonNoLabel === 'boolean') {
      this.setOptions('headerButtonNoLabel', headerButtonNoLabel);
    }
  }
  /**
   * Sets `this.options.headerNoTitleMinimized` which is reactive for application shells.
   *
   * @param {boolean}  headerNoTitleMinimized - Sets the headerNoTitleMinimized option.
   */


  set headerNoTitleMinimized(headerNoTitleMinimized) {
    if (typeof headerNoTitleMinimized === 'boolean') {
      this.setOptions('headerNoTitleMinimized', headerNoTitleMinimized);
    }
  }
  /**
   * Sets `this.options.minimizable` which is reactive for application shells that are also pop out.
   *
   * @param {boolean}  minimizable - Sets the minimizable option.
   */


  set minimizable(minimizable) {
    if (typeof minimizable === 'boolean') {
      this.setOptions('minimizable', minimizable);
    }
  }
  /**
   * Sets `this.options.popOut` which is reactive for application shells. This will add / remove this application
   * from `ui.windows`.
   *
   * @param {boolean}  popOut - Sets the popOut option.
   */


  set popOut(popOut) {
    if (typeof popOut === 'boolean') {
      this.setOptions('popOut', popOut);
    }
  }
  /**
   * Sets `this.options.resizable` which is reactive for application shells.
   *
   * @param {boolean}  resizable - Sets the resizable option.
   */


  set resizable(resizable) {
    if (typeof resizable === 'boolean') {
      this.setOptions('resizable', resizable);
    }
  }
  /**
   * Sets `this.options.title` which is reactive for application shells.
   *
   * @param {string}   title - Application title; will be localized, so a translation key is fine.
   */


  set title(title) {
    if (typeof title === 'string') {
      this.setOptions('title', title);
    }
  }
  /**
   * Provides a way to safely get this applications options given an accessor string which describes the
   * entries to walk. To access deeper entries into the object format the accessor string with `.` between entries
   * to walk.
   *
   * // TODO DOCUMENT the accessor in more detail.
   *
   * @param {string}   accessor - The path / key to set. You can set multiple levels.
   *
   * @param {*}        [defaultValue] - A default value returned if the accessor is not found.
   *
   * @returns {*} Value at the accessor.
   */


  getOptions(accessor, defaultValue) {
    return safeAccess(_classPrivateFieldGet(this, _application$1).options, accessor, defaultValue);
  }
  /**
   * Provides a way to merge `options` into this applications options and update the appOptions store.
   *
   * @param {object}   options - The options object to merge with `this.options`.
   */


  mergeOptions(options) {
    _classPrivateFieldGet(this, _storeAppOptionsUpdate).call(this, instanceOptions => deepMerge(instanceOptions, options));
  }
  /**
   * Provides a way to safely set this applications options given an accessor string which describes the
   * entries to walk. To access deeper entries into the object format the accessor string with `.` between entries
   * to walk.
   *
   * Additionally if an application shell Svelte component is mounted and exports the `appOptions` property then
   * the application options is set to `appOptions` potentially updating the application shell / Svelte component.
   *
   * // TODO DOCUMENT the accessor in more detail.
   *
   * @param {string}   accessor - The path / key to set. You can set multiple levels.
   *
   * @param {*}        value - Value to set.
   */


  setOptions(accessor, value) {
    const success = safeSet(_classPrivateFieldGet(this, _application$1).options, accessor, value); // If `this.options` modified then update the app options store.

    if (success) {
      _classPrivateFieldGet(this, _storeAppOptionsUpdate).call(this, () => _classPrivateFieldGet(this, _application$1).options);
    }
  }
  /**
   * Initializes the Svelte stores and derived stores for the application options and UI state.
   *
   * While writable stores are created the update method is stored in private variables locally and derived Readable
   * stores are provided for essential options which are commonly used.
   *
   * These stores are injected into all Svelte components mounted under the `external` context: `storeAppOptions` and
   * ` storeUIState`.
   */


  /**
   * Updates the UI Options store with the current header buttons. You may dynamically add / remove header buttons
   * if using an application shell Svelte component. In either overriding `_getHeaderButtons` or responding to the
   * Hooks fired return a new button array and the uiOptions store is updated and the application shell will render
   * the new buttons.
   *
   * Optionally you can set in the Foundry app options `headerButtonNoClose` to remove the close button and
   * `headerButtonNoLabel` to true and labels will be removed from the header buttons.
   *
   * @param {object} opts - Optional parameters (for internal use)
   *
   * @param {boolean} opts.headerButtonNoClose - The value for `headerButtonNoClose`.
   *
   * @param {boolean} opts.headerButtonNoLabel - The value for `headerButtonNoLabel`.
   */
  updateHeaderButtons({
    headerButtonNoClose = _classPrivateFieldGet(this, _application$1).options.headerButtonNoClose,
    headerButtonNoLabel = _classPrivateFieldGet(this, _application$1).options.headerButtonNoLabel
  } = {}) {
    let buttons = _classPrivateFieldGet(this, _application$1)._getHeaderButtons(); // Remove close button if this.options.headerButtonNoClose is true;


    if (typeof headerButtonNoClose === 'boolean' && headerButtonNoClose) {
      buttons = buttons.filter(button => button.class !== 'close');
    } // Remove labels if this.options.headerButtonNoLabel is true;


    if (typeof headerButtonNoLabel === 'boolean' && headerButtonNoLabel) {
      for (const button of buttons) {
        button.label = void 0;
      }
    }

    _classPrivateFieldGet(this, _storeUIStateUpdate).call(this, options => {
      options.headerButtons = buttons;
      return options;
    });
  }

}

function _storesInitialize2() {
  const writableAppOptions = writable(_classPrivateFieldGet(this, _application$1).options); // Keep the update function locally, but make the store essentially readable.

  _classPrivateFieldSet(this, _storeAppOptionsUpdate, writableAppOptions.update);
  /**
   * Create custom store. The main subscribe method for all app options changes is provided along with derived
   * writable stores for all reactive options.
   *
   * @type {StoreAppOptions}
   */


  const storeAppOptions = {
    subscribe: writableAppOptions.subscribe,
    draggable: propertyStore(writableAppOptions, 'draggable'),
    headerButtonNoClose: propertyStore(writableAppOptions, 'headerButtonNoClose'),
    headerButtonNoLabel: propertyStore(writableAppOptions, 'headerButtonNoLabel'),
    headerNoTitleMinimized: propertyStore(writableAppOptions, 'headerNoTitleMinimized'),
    minimizable: propertyStore(writableAppOptions, 'minimizable'),
    popOut: propertyStore(writableAppOptions, 'popOut'),
    resizable: propertyStore(writableAppOptions, 'resizable'),
    title: propertyStore(writableAppOptions, 'title')
  };
  Object.freeze(storeAppOptions);

  _classPrivateFieldSet(this, _storeAppOptions, storeAppOptions);

  _classPrivateFieldSet(this, _dataUIState, {
    dragging: false,
    headerButtons: [],
    minimized: _classPrivateFieldGet(this, _application$1)._minimized,
    resizing: false
  }); // Create a store for UI state data.


  const writableUIOptions = writable(_classPrivateFieldGet(this, _dataUIState)); // Keep the update function locally, but make the store essentially readable.

  _classPrivateFieldSet(this, _storeUIStateUpdate, writableUIOptions.update);
  /**
   * @type {StoreUIOptions}
   */


  const storeUIState = {
    subscribe: writableUIOptions.subscribe,
    dragging: propertyStore(writableUIOptions, 'dragging'),
    headerButtons: derived(writableUIOptions, ($options, set) => set($options.headerButtons)),
    minimized: derived(writableUIOptions, ($options, set) => set($options.minimized)),
    resizing: propertyStore(writableUIOptions, 'resizing')
  };
  Object.freeze(storeUIState); // Initialize the store with options set in the Application constructor.

  _classPrivateFieldSet(this, _storeUIState, storeUIState);
}

function _storesSubscribe2() {
  // Register local subscriptions.
  // Handles updating header buttons to add / remove the close button.
  _classPrivateFieldGet(this, _storeUnsubscribe).push(subscribeIgnoreFirst(_classPrivateFieldGet(this, _storeAppOptions).headerButtonNoClose, value => {
    this.updateHeaderButtons({
      headerButtonNoClose: value
    });
  })); // Handles updating header buttons to add / remove button labels.


  _classPrivateFieldGet(this, _storeUnsubscribe).push(subscribeIgnoreFirst(_classPrivateFieldGet(this, _storeAppOptions).headerButtonNoLabel, value => {
    this.updateHeaderButtons({
      headerButtonNoLabel: value
    });
  })); // Handles adding / removing this application from `ui.windows` when popOut changes.


  _classPrivateFieldGet(this, _storeUnsubscribe).push(subscribeIgnoreFirst(_classPrivateFieldGet(this, _storeAppOptions).popOut, value => {
    if (value && _classPrivateFieldGet(this, _application$1).rendered) {
      ui.windows[_classPrivateFieldGet(this, _application$1).appId] = _classPrivateFieldGet(this, _application$1);
    } else {
      delete ui.windows[_classPrivateFieldGet(this, _application$1).appId];
    }
  }));
}

function _storesUnsubscribe2() {
  _classPrivateFieldGet(this, _storeUnsubscribe).forEach(unsubscribe => unsubscribe());

  _classPrivateFieldSet(this, _storeUnsubscribe, []);
}

/**
 * Awaits `requestAnimationFrame` calls by the counter specified. This allows asynchronous applications for direct /
 * inline style modification amongst other direct animation techniques.
 *
 * @param {number}   [cntr=1] - A positive integer greater than 0 for amount of requestAnimationFrames to wait.
 *
 * @returns {Promise<number>} Returns current time equivalent to `performance.now()`.
 */
async function nextAnimationFrame$1(cntr = 1) {
  if (!Number.isInteger(cntr) || cntr < 1) {
    throw new TypeError(`nextAnimationFrame error: 'cntr' must be a positive integer greater than 0.`);
  }

  let currentTime = performance.now();

  for (; --cntr >= 0;) {
    currentTime = await new Promise(resolve => requestAnimationFrame(resolve));
  }

  return currentTime;
}

let _Symbol$iterator$1;

var _validatorData = /*#__PURE__*/new WeakMap();

var _mapUnsubscribe = /*#__PURE__*/new WeakMap();

_Symbol$iterator$1 = Symbol.iterator;

/**
 * Provides the storage and sequencing of managed position validators. Each validator added may be a bespoke function or
 * a {@link ValidatorData} object containing an `id`, `validator`, and `weight` attributes; `validator` is the only
 * required attribute.
 *
 * The `id` attribute can be anything that creates a unique ID for the validator; recommended strings or numbers. This
 * allows validators to be removed by ID easily.
 *
 * The `weight` attribute is a number between 0 and 1 inclusive that allows validators to be added in a
 * predictable order which is especially handy if they are manipulated at runtime. A lower weighted validator always
 * runs before a higher weighted validator. If no weight is specified the default of '1' is assigned and it is appended
 * to the end of the validators list.
 *
 * This class forms the public API which is accessible from the `.validators` getter in the main Position instance.
 * ```
 * const position = new Position(<PositionData>);
 * position.validators.add(...);
 * position.validators.clear();
 * position.validators.length;
 * position.validators.remove(...);
 * position.validators.removeBy(...);
 * position.validators.removeById(...);
 * ```
 */
class AdapterValidators {
  /**
   * @returns {[AdapterValidators, ValidatorData[]]} Returns this and internal storage for validator adapter.
   */
  constructor() {
    _classPrivateFieldInitSpec(this, _validatorData, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _mapUnsubscribe, {
      writable: true,
      value: new Map()
    });

    _classPrivateFieldSet(this, _validatorData, []);

    Object.seal(this);
    return [this, _classPrivateFieldGet(this, _validatorData)];
  }
  /**
   * @returns {number} Returns the length of the validators array.
   */


  get length() {
    return _classPrivateFieldGet(this, _validatorData).length;
  }
  /**
   * Provides an iterator for validators.
   *
   * @returns {Generator<ValidatorData|undefined>} Generator / iterator of validators.
   * @yields {ValidatorData<T>}
   */


  *[_Symbol$iterator$1]() {
    if (_classPrivateFieldGet(this, _validatorData).length === 0) {
      return;
    }

    for (const entry of _classPrivateFieldGet(this, _validatorData)) {
      yield _objectSpread2({}, entry);
    }
  }
  /**
   * @param {...(ValidatorFn<T>|ValidatorData<T>)}   validators -
   */


  add(...validators) {
    var _validator$validator$;

    for (const validator of validators) {
      const validatorType = typeof validator;

      if (validatorType !== 'function' && validatorType !== 'object' || validator === null) {
        throw new TypeError(`AdapterValidator error: 'validator' is not a function or object.`);
      }

      let data = void 0;
      let subscribeFn = void 0;

      switch (validatorType) {
        case 'function':
          data = {
            id: void 0,
            validator,
            weight: 1
          };
          subscribeFn = validator.subscribe;
          break;

        case 'object':
          if (typeof validator.validator !== 'function') {
            throw new TypeError(`AdapterValidator error: 'validator' attribute is not a function.`);
          }

          if (validator.weight !== void 0 && typeof validator.weight !== 'number' || validator.weight < 0 || validator.weight > 1) {
            throw new TypeError(`AdapterValidator error: 'weight' attribute is not a number between '0 - 1' inclusive.`);
          }

          data = {
            id: validator.id !== void 0 ? validator.id : void 0,
            validator: validator.validator,
            weight: validator.weight || 1
          };
          subscribeFn = (_validator$validator$ = validator.validator.subscribe) !== null && _validator$validator$ !== void 0 ? _validator$validator$ : validator.subscribe;
          break;
      } // Find the index to insert where data.weight is less than existing values weight.


      const index = _classPrivateFieldGet(this, _validatorData).findIndex(value => {
        return data.weight < value.weight;
      }); // If an index was found insert at that location.


      if (index >= 0) {
        _classPrivateFieldGet(this, _validatorData).splice(index, 0, data);
      } else // push to end of validators.
        {
          _classPrivateFieldGet(this, _validatorData).push(data);
        }

      if (typeof subscribeFn === 'function') {
        // TODO: consider how to handle validator updates.
        const unsubscribe = subscribeFn(); // Ensure that unsubscribe is a function.

        if (typeof unsubscribe !== 'function') {
          throw new TypeError('AdapterValidator error: Filter has subscribe function, but no unsubscribe function is returned.');
        } // Ensure that the same validator is not subscribed to multiple times.


        if (_classPrivateFieldGet(this, _mapUnsubscribe).has(data.validator)) {
          throw new Error('AdapterValidator error: Filter added already has an unsubscribe function registered.');
        }

        _classPrivateFieldGet(this, _mapUnsubscribe).set(data.validator, unsubscribe);
      }
    } // Filters with subscriber functionality are assumed to immediately invoke the `subscribe` callback. If the
    // subscriber count is less than the amount of validators added then automatically trigger an index update
    // manually.
    // TODO: handle validator updates.
    // if (subscribeCount < validators.length) { this.#indexUpdate(); }

  }

  clear() {
    _classPrivateFieldGet(this, _validatorData).length = 0; // Unsubscribe from all validators with subscription support.

    for (const unsubscribe of _classPrivateFieldGet(this, _mapUnsubscribe).values()) {
      unsubscribe();
    }

    _classPrivateFieldGet(this, _mapUnsubscribe).clear(); // TODO: handle validator updates.
    // this.#indexUpdate();

  }
  /**
   * @param {...(ValidatorFn<T>|ValidatorData<T>)}   validators -
   */


  remove(...validators) {
    const length = _classPrivateFieldGet(this, _validatorData).length;

    if (length === 0) {
      return;
    }

    for (const data of validators) {
      // Handle the case that the validator may either be a function or a validator entry / object.
      const actualValidator = typeof data === 'function' ? data : data !== null && typeof data === 'object' ? data.validator : void 0;

      if (!actualValidator) {
        continue;
      }

      for (let cntr = _classPrivateFieldGet(this, _validatorData).length; --cntr >= 0;) {
        if (_classPrivateFieldGet(this, _validatorData)[cntr].validator === actualValidator) {
          _classPrivateFieldGet(this, _validatorData).splice(cntr, 1); // Invoke any unsubscribe function for given validator then remove from tracking.


          let unsubscribe = void 0;

          if (typeof (unsubscribe = _classPrivateFieldGet(this, _mapUnsubscribe).get(actualValidator)) === 'function') {
            unsubscribe();

            _classPrivateFieldGet(this, _mapUnsubscribe).delete(actualValidator);
          }
        }
      }
    } // Update the index a validator was removed.
    // TODO: handle validator updates.
    // if (length !== this.#validatorData.length) { this.#indexUpdate(); }

  }
  /**
   * Remove validators by the provided callback. The callback takes 3 parameters: `id`, `validator`, and `weight`.
   * Any truthy value returned will remove that validator.
   *
   * @param {function(*, ValidatorFn<T>, number): boolean} callback - Callback function to evaluate each validator
   *                                                                  entry.
   */


  removeBy(callback) {
    const length = _classPrivateFieldGet(this, _validatorData).length;

    if (length === 0) {
      return;
    }

    if (typeof callback !== 'function') {
      throw new TypeError(`AdapterValidator error: 'callback' is not a function.`);
    }

    _classPrivateFieldSet(this, _validatorData, _classPrivateFieldGet(this, _validatorData).filter(data => {
      const remove = callback.call(callback, _objectSpread2({}, data));

      if (remove) {
        let unsubscribe;

        if (typeof (unsubscribe = _classPrivateFieldGet(this, _mapUnsubscribe).get(data.validator)) === 'function') {
          unsubscribe();

          _classPrivateFieldGet(this, _mapUnsubscribe).delete(data.validator);
        }
      } // Reverse remove boolean to properly validator / remove this validator.


      return !remove;
    })); // TODO: handle validator updates.
    // if (length !== this.#validatorData.length) { this.#indexUpdate(); }

  }

  removeById(...ids) {
    const length = _classPrivateFieldGet(this, _validatorData).length;

    if (length === 0) {
      return;
    }

    _classPrivateFieldSet(this, _validatorData, _classPrivateFieldGet(this, _validatorData).filter(data => {
      let remove = false;

      for (const id of ids) {
        remove |= data.id === id;
      } // If not keeping invoke any unsubscribe function for given validator then remove from tracking.


      if (remove) {
        let unsubscribe;

        if (typeof (unsubscribe = _classPrivateFieldGet(this, _mapUnsubscribe).get(data.validator)) === 'function') {
          unsubscribe();

          _classPrivateFieldGet(this, _mapUnsubscribe).delete(data.validator);
        }
      }

      return !remove; // Swap here to actually remove the item via array validator method.
    })); // TODO: handle validator updates.
    // if (length !== this.#validatorData.length) { this.#indexUpdate(); }

  }

}
/**
 * @typedef {function(object, PositionData): PositionData|null} ValidatorFn - Position validator function that
 *                         takes a {@link PositionData} instance potentially modifying it or returning null if invalid.
 *
 * @property {Function} [subscribe] - Optional subscribe function following the Svelte store / subscribe pattern.
 */

/**
 * @typedef {object} ValidatorData
 *
 * @property {*}           [id=undefined] - An ID associated with this validator. Can be used to remove the validator.
 *
 * @property {ValidatorFn} validator - Position validator function that takes a {@link PositionData} instance
 *                                     potentially modifying it or returning null if invalid.
 *
 * @property {number}      [weight=1] - A number between 0 and 1 inclusive to position this validator against others.
 *
 * @property {Function}    [subscribe] - Optional subscribe function following the Svelte store / subscribe pattern.
 */

/**
 * Defines the keys of PositionData that are transform keys.
 *
 * @type {string[]}
 */
const transformKeys = ['rotateX', 'rotateY', 'rotateZ', 'scale'];
Object.freeze(transformKeys);
/**
 * Defines bitwise keys for transforms used in {@link Transforms.getMat4FromTransforms}.
 *
 * @type {object}
 */

const transformKeysBitwise = {
  rotateX: 1,
  rotateY: 2,
  rotateZ: 4,
  scale: 8
};
Object.freeze(transformKeysBitwise);
/**
 * Defines the default transform origin.
 *
 * @type {string}
 */

const transformOriginDefault = 'top left';
/**
 * Defines the valid transform origins.
 *
 * @type {string[]}
 */

const transformOrigins = ['top left', 'top center', 'top right', 'center left', 'center', 'center right', 'bottom left', 'bottom center', 'bottom right'];
Object.freeze(transformOrigins);

let _Symbol$iterator;
const s_SCALE_VECTOR = [1, 1, 1];
const s_MAT4_RESULT = mat4.create();
const s_MAT4_TEMP = mat4.create();
const s_MAT4_TEMP_TRANSLATE = [mat4.create(), mat4.create()];
const s_RECT_TEMP = [vec3.create(), vec3.create(), vec3.create(), vec3.create()];
const s_VEC3_TEMP = vec3.create();

var _count = /*#__PURE__*/new WeakMap();

_Symbol$iterator = Symbol.iterator;
class Transforms {
  /**
   * Stores the number of transforms currently loaded.
   *
   * @type {number}
   */
  constructor() {
    _classPrivateFieldInitSpec(this, _count, {
      writable: true,
      value: 0
    });

    this._data = {};
  }
  /**
   * Provides an iterator for transform keys.
   *
   * @returns {Generator<string>} Generator / iterator of transform keys.
   * @yields {string}
   */


  *[_Symbol$iterator]() {
    for (const key in this._data) {
      yield key;
    }
  }

  get isActive() {
    return _classPrivateFieldGet(this, _count) > 0;
  }

  get rotateX() {
    return this._data.rotateX;
  }

  get rotateY() {
    return this._data.rotateY;
  }

  get rotateZ() {
    return this._data.rotateZ;
  }

  get scale() {
    return this._data.scale;
  }

  set rotateX(value) {
    if (Number.isFinite(value)) {
      if (this._data.rotateX === void 0) {

        _classPrivateFieldSet(this, _count, (+_classPrivateFieldGet(this, _count)) + 1);
      }

      this._data.rotateX = value;
    } else {
      if (this._data.rotateX !== void 0) {

        _classPrivateFieldSet(this, _count, (+_classPrivateFieldGet(this, _count)) - 1);
      }

      delete this._data.rotateX;
    }
  }

  set rotateY(value) {
    if (Number.isFinite(value)) {
      if (this._data.rotateY === void 0) {

        _classPrivateFieldSet(this, _count, (+_classPrivateFieldGet(this, _count)) + 1);
      }

      this._data.rotateY = value;
    } else {
      if (this._data.rotateY !== void 0) {

        _classPrivateFieldSet(this, _count, (+_classPrivateFieldGet(this, _count)) - 1);
      }

      delete this._data.rotateY;
    }
  }

  set rotateZ(value) {
    if (Number.isFinite(value)) {
      if (this._data.rotateZ === void 0) {

        _classPrivateFieldSet(this, _count, (+_classPrivateFieldGet(this, _count)) + 1);
      }

      this._data.rotateZ = value;
    } else {
      if (this._data.rotateZ !== void 0) {

        _classPrivateFieldSet(this, _count, (+_classPrivateFieldGet(this, _count)) - 1);
      }

      delete this._data.rotateZ;
    }
  }

  set scale(value) {
    if (Number.isFinite(value)) {
      if (this._data.scale === void 0) {

        _classPrivateFieldSet(this, _count, (+_classPrivateFieldGet(this, _count)) + 1);
      }

      this._data.scale = value;
    } else {
      if (this._data.scale !== void 0) {

        _classPrivateFieldSet(this, _count, (+_classPrivateFieldGet(this, _count)) - 1);
      }

      delete this._data.scale;
    }
  }
  /**
   *
   * @param {PositionData} position -
   *
   * @param {DOMRect}      [output] -
   *
   * @returns {DOMRect} The output DOMRect.
   */


  getBoundingBox(position, output = new DOMRect()) {
    const rect = s_RECT_TEMP;

    if (this.hasTransform(position)) {
      rect[0][0] = rect[0][1] = rect[0][2] = 0;
      rect[1][0] = position.width;
      rect[1][1] = rect[1][2] = 0;
      rect[2][0] = position.width;
      rect[2][1] = position.height;
      rect[2][2] = 0;
      rect[3][0] = 0;
      rect[3][1] = position.height;
      rect[3][2] = 0;
      const matrix = this.getMat4FromTransforms(position);

      if (transformOriginDefault === position.transformOrigin) {
        vec3.transformMat4(rect[0], rect[0], matrix);
        vec3.transformMat4(rect[1], rect[1], matrix);
        vec3.transformMat4(rect[2], rect[2], matrix);
        vec3.transformMat4(rect[3], rect[3], matrix);
      } else {
        const translate = s_GET_ORIGIN_TRANSLATE(position, s_MAT4_TEMP_TRANSLATE);
        vec3.transformMat4(rect[0], rect[0], translate[0]);
        vec3.transformMat4(rect[0], rect[0], matrix);
        vec3.transformMat4(rect[0], rect[0], translate[1]);
        vec3.transformMat4(rect[1], rect[1], translate[0]);
        vec3.transformMat4(rect[1], rect[1], matrix);
        vec3.transformMat4(rect[1], rect[1], translate[1]);
        vec3.transformMat4(rect[2], rect[2], translate[0]);
        vec3.transformMat4(rect[2], rect[2], matrix);
        vec3.transformMat4(rect[2], rect[2], translate[1]);
        vec3.transformMat4(rect[3], rect[3], translate[0]);
        vec3.transformMat4(rect[3], rect[3], matrix);
        vec3.transformMat4(rect[3], rect[3], translate[1]);
      }

      rect[0][0] = position.left + rect[0][0];
      rect[0][1] = position.top + rect[0][1];
      rect[1][0] = position.left + rect[1][0];
      rect[1][1] = position.top + rect[1][1];
      rect[2][0] = position.left + rect[2][0];
      rect[2][1] = position.top + rect[2][1];
      rect[3][0] = position.left + rect[3][0];
      rect[3][1] = position.top + rect[3][1];
    } else {
      rect[0][0] = position.left;
      rect[0][1] = position.top;
      rect[1][0] = position.left + position.width;
      rect[1][1] = position.top;
      rect[2][0] = position.left + position.width;
      rect[2][1] = position.top + position.height;
      rect[3][0] = position.left;
      rect[3][1] = position.top + position.height;
    }

    let maxX = Number.MIN_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;
    let minX = Number.MAX_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;

    for (let cntr = 4; --cntr >= 0;) {
      if (rect[cntr][0] > maxX) {
        maxX = rect[cntr][0];
      }

      if (rect[cntr][0] < minX) {
        minX = rect[cntr][0];
      }

      if (rect[cntr][1] > maxY) {
        maxY = rect[cntr][1];
      }

      if (rect[cntr][1] < minY) {
        minY = rect[cntr][1];
      }
    }

    output.x = minX;
    output.y = minY;
    output.width = maxX - minX;
    output.height = maxY - minY;
    return output;
  }
  /**
   * Returns the matrix3d CSS transform for the given position / transform data.
   *
   * @param data -
   *
   * @returns {string}
   */


  getTransformString(data = this._data) {
    return `matrix3d(${this.getMat4FromTransforms(data).join(',')})`;
  }
  /**
   * Creates a transform matrix based on local data applied in order it was added.
   *
   * If no data object is provided then the source is the local transform data. If another data object is supplied
   * then the stored local transform order is applied then all remaining transform keys are applied. This allows the
   * construction of a transform matrix in advance of setting local data and is useful in collision detection.
   *
   * @param {object}   data -
   *
   * @param {mat4}     output -
   *
   * @returns {mat4} Transform matrix.
   */


  getMat4FromTransforms(data = this._data, output = s_MAT4_RESULT) {
    const matrix = mat4.identity(output); // Bitwise tracks applied transform keys from local transform data.

    let seenKeys = 0; // First apply ordered transforms from local transform data.

    for (const key in this._data) {
      switch (key) {
        case 'rotateX':
          seenKeys |= transformKeysBitwise.rotateX;
          mat4.multiply(matrix, matrix, mat4.fromXRotation(s_MAT4_TEMP, degToRad(data[key])));
          break;

        case 'rotateY':
          seenKeys |= transformKeysBitwise.rotateY;
          mat4.multiply(matrix, matrix, mat4.fromYRotation(s_MAT4_TEMP, degToRad(data[key])));
          break;

        case 'rotateZ':
          seenKeys |= transformKeysBitwise.rotateZ;
          mat4.multiply(matrix, matrix, mat4.fromZRotation(s_MAT4_TEMP, degToRad(data[key])));
          break;

        case 'scale':
          seenKeys |= transformKeysBitwise.scale;
          s_SCALE_VECTOR[0] = s_SCALE_VECTOR[1] = data[key];
          mat4.multiply(matrix, matrix, mat4.fromScaling(s_MAT4_TEMP, s_SCALE_VECTOR));
          break;
      }
    } // Now apply any new keys not set in local transform data that have not been applied yet.


    if (data !== this._data) {
      for (const key of transformKeys) {
        // Reject bad / no data or if the key has already been applied.
        if (!Number.isFinite(data[key]) || (seenKeys & transformKeysBitwise[key]) > 0) {
          continue;
        }

        switch (key) {
          case 'rotateX':
            mat4.multiply(matrix, matrix, mat4.fromXRotation(s_MAT4_TEMP, degToRad(data[key])));
            break;

          case 'rotateY':
            mat4.multiply(matrix, matrix, mat4.fromYRotation(s_MAT4_TEMP, degToRad(data[key])));
            break;

          case 'rotateZ':
            mat4.multiply(matrix, matrix, mat4.fromZRotation(s_MAT4_TEMP, degToRad(data[key])));
            break;

          case 'scale':
            s_SCALE_VECTOR[0] = s_SCALE_VECTOR[1] = data[key];
            mat4.multiply(matrix, matrix, mat4.fromScaling(s_MAT4_TEMP, s_SCALE_VECTOR));
            break;
        }
      }
    }

    return matrix;
  }
  /**
   * @param {PositionData} position -
   *
   * @returns {boolean} Whether the given PositionData has transforms.
   */


  hasTransform(position) {
    for (const key of transformKeys) {
      if (Number.isFinite(position[key])) {
        return true;
      }
    }

    return false;
  }

  reset(data) {
    for (const key in data) {
      if (transformKeys.includes(key) && Number.isFinite(data[key])) {
        this._data[key] = data[key];
      } else {
        delete this._data[key];
      }
    }

    _classPrivateFieldSet(this, _count, Object.keys(this._data).length);
  }

}
/**
 * @param {PositionData}   position -
 *
 * @param {number[]}       output - Output Mat4 array.
 *
 * @returns {number[]} Output Mat4 array.
 */

function s_GET_ORIGIN_TRANSLATE(position, output = s_MAT4_TEMP_TRANSLATE) {
  const vector = s_VEC3_TEMP;

  switch (position.transformOrigin) {
    case 'top left':
      vector[0] = vector[1] = 0;
      mat4.fromTranslation(output[0], vector);
      mat4.fromTranslation(output[1], vector);
      break;

    case 'top center':
      vector[0] = -position.width / 2;
      vector[1] = 0;
      mat4.fromTranslation(output[0], vector);
      vector[0] = position.width / 2;
      mat4.fromTranslation(output[1], vector);
      break;

    case 'top right':
      vector[0] = -position.width;
      vector[1] = 0;
      mat4.fromTranslation(output[0], vector);
      vector[0] = position.width;
      mat4.fromTranslation(output[1], vector);
      break;

    case 'center left':
      vector[0] = 0;
      vector[1] = -position.height / 2;
      mat4.fromTranslation(output[0], vector);
      vector[1] = position.height / 2;
      mat4.fromTranslation(output[1], vector);
      break;

    case 'center':
      vector[0] = -position.width / 2;
      vector[1] = -position.height / 2;
      mat4.fromTranslation(output[0], vector);
      vector[0] = position.width / 2;
      vector[1] = position.height / 2;
      mat4.fromTranslation(output[1], vector);
      break;

    case 'center right':
      vector[0] = -position.width;
      vector[1] = -position.height / 2;
      mat4.fromTranslation(output[0], vector);
      vector[0] = position.width;
      vector[1] = position.height / 2;
      mat4.fromTranslation(output[1], vector);
      break;

    case 'bottom left':
      vector[0] = 0;
      vector[1] = -position.height;
      mat4.fromTranslation(output[0], vector);
      vector[1] = position.height;
      mat4.fromTranslation(output[1], vector);
      break;

    case 'bottom center':
      vector[0] = -position.width / 2;
      vector[1] = -position.height;
      mat4.fromTranslation(output[0], vector);
      vector[0] = position.width / 2;
      vector[1] = position.height;
      mat4.fromTranslation(output[1], vector);
      break;

    case 'bottom right':
      vector[0] = -position.width;
      vector[1] = -position.height;
      mat4.fromTranslation(output[0], vector);
      vector[0] = position.width;
      vector[1] = position.height;
      mat4.fromTranslation(output[1], vector);
      break;
  }

  return output;
}

const _excluded = ["name"],
      _excluded2 = ["left", "top", "width", "height", "rotateX", "rotateY", "rotateZ", "scale", "transformOrigin", "zIndex"];
/**
 * Provides a store for position following the subscriber protocol in addition to providing individual writable derived
 * stores for each independent variable.
 */

var _subscriptions = /*#__PURE__*/new WeakMap();

var _data$1 = /*#__PURE__*/new WeakMap();

var _dataSaved = /*#__PURE__*/new WeakMap();

var _currentAnimationKeys = /*#__PURE__*/new WeakMap();

var _defaultData = /*#__PURE__*/new WeakMap();

var _parent = /*#__PURE__*/new WeakMap();

var _elementUpdatePromises = /*#__PURE__*/new WeakMap();

var _rectValidate = /*#__PURE__*/new WeakMap();

var _stores$1 = /*#__PURE__*/new WeakMap();

var _transforms = /*#__PURE__*/new WeakMap();

var _transformUpdate = /*#__PURE__*/new WeakMap();

var _updateElementInvoked = /*#__PURE__*/new WeakMap();

var _validators = /*#__PURE__*/new WeakMap();

var _validatorsAdapter = /*#__PURE__*/new WeakMap();

var _updateElement = /*#__PURE__*/new WeakSet();

var _updatePosition = /*#__PURE__*/new WeakSet();

class Position {
  /**
   * @type {PositionData}
   */

  /**
   * @type {Map<string, PositionData>}
   */

  /**
   * Stores current animation keys.
   *
   * @type {Set<string>}
   */

  /**
   * @type {PositionData}
   */

  /**
   * The associated parent for positional data tracking. Used in validators.
   *
   * @type {object}
   */

  /**
   * Stores all pending set position Promise resolve functions.
   *
   * @type {Function[]}
   */

  /**
   * Provides a cached DOMRect for position validation.
   *
   * @type {DOMRect}
   */

  /**
   * @type {StorePosition}
   */

  /**
   * @type {Transforms}
   */

  /**
   * @type {boolean}
   */

  /**
   * @type {boolean}
   */

  /**
   * @type {AdapterValidators}
   */

  /**
   * @type {ValidatorData[]}
   */

  /**
   * @param {object}         parent - The associated parent for positional data tracking. Used in validators.
   *
   * @param {object}         options - Default values.
   */
  constructor(parent, options = {}) {
    _classPrivateMethodInitSpec(this, _updatePosition);

    _classPrivateMethodInitSpec(this, _updateElement);

    _classPrivateFieldInitSpec(this, _subscriptions, {
      writable: true,
      value: []
    });

    _classPrivateFieldInitSpec(this, _data$1, {
      writable: true,
      value: {
        height: null,
        left: null,
        rotateX: null,
        rotateY: null,
        rotateZ: null,
        scale: null,
        top: null,
        transformOrigin: transformOriginDefault,
        width: null,
        zIndex: null
      }
    });

    _classPrivateFieldInitSpec(this, _dataSaved, {
      writable: true,
      value: new Map()
    });

    _classPrivateFieldInitSpec(this, _currentAnimationKeys, {
      writable: true,
      value: new Set()
    });

    _classPrivateFieldInitSpec(this, _defaultData, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _parent, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _elementUpdatePromises, {
      writable: true,
      value: []
    });

    _classPrivateFieldInitSpec(this, _rectValidate, {
      writable: true,
      value: new DOMRect()
    });

    _classPrivateFieldInitSpec(this, _stores$1, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _transforms, {
      writable: true,
      value: new Transforms()
    });

    _classPrivateFieldInitSpec(this, _transformUpdate, {
      writable: true,
      value: false
    });

    _classPrivateFieldInitSpec(this, _updateElementInvoked, {
      writable: true,
      value: false
    });

    _classPrivateFieldInitSpec(this, _validators, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _validatorsAdapter, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _parent, parent);

    const _data2 = _classPrivateFieldGet(this, _data$1);

    const transforms = _classPrivateFieldGet(this, _transforms); // TODO REMOVE: FOR TESTING
    // this._overlay = document.createElement('div');
    // this._overlay.style.zIndex = '99999';
    // this._overlay.style.background = 'rgba(0, 0, 255, 0.3)';
    // this._overlay.style.width = '200px';
    // this._overlay.style.height = '200px';
    // this._overlay.style.top = '100px';
    // this._overlay.style.left = '100px';
    // this._overlay.style.position = 'absolute';
    // this._overlay.style.pointerEvents = 'none';
    //
    // document.body.append(this._overlay);
    // Set default value from options.


    if (typeof options === 'object') {
      if (Number.isFinite(options.height) || options.height === 'auto' || options.height === null) {
        _data2.height = typeof options.height === 'number' ? Math.round(options.height) : options.height;
      }

      if (Number.isFinite(options.left) || options.left === null) {
        _data2.left = typeof options.left === 'number' ? Math.round(options.left) : options.left;
      }

      if (Number.isFinite(options.rotateX) || options.rotateX === null) {
        transforms.rotateX = _data2.rotateX = options.rotateX;

        _classPrivateFieldSet(this, _transformUpdate, true);
      }

      if (Number.isFinite(options.rotateY) || options.rotateY === null) {
        transforms.rotateY = _data2.rotateY = options.rotateY;

        _classPrivateFieldSet(this, _transformUpdate, true);
      }

      if (Number.isFinite(options.rotateZ) || options.rotateZ === null) {
        transforms.rotateZ = _data2.rotateZ = options.rotateZ;

        _classPrivateFieldSet(this, _transformUpdate, true);
      }

      if (Number.isFinite(options.scale) || options.scale === null) {
        transforms.scale = _data2.scale = options.scale;

        _classPrivateFieldSet(this, _transformUpdate, true);
      }

      if (Number.isFinite(options.top) || options.top === null) {
        _data2.top = typeof options.top === 'number' ? Math.round(options.top) : options.top;
      }

      if (typeof options.transformOrigin === 'string' && transformOrigins.includes(options.transformOrigin)) {
        _data2.transformOrigin = options.transformOrigin;
      }

      if (Number.isFinite(options.width) || options.width === 'auto' || options.width === null) {
        _data2.width = typeof options.width === 'number' ? Math.round(options.width) : options.width;
      }

      if (Number.isFinite(options.zIndex) || options.zIndex === null) {
        _data2.zIndex = typeof options.zIndex === 'number' ? Math.round(options.zIndex) : options.zIndex;
      }
    }

    _classPrivateFieldSet(this, _stores$1, {
      height: propertyStore(this, 'height'),
      left: propertyStore(this, 'left'),
      rotateX: propertyStore(this, 'rotateX'),
      rotateY: propertyStore(this, 'rotateY'),
      rotateZ: propertyStore(this, 'rotateZ'),
      scale: propertyStore(this, 'scale'),
      top: propertyStore(this, 'top'),
      transformOrigin: propertyStore(this, 'transformOrigin'),
      width: propertyStore(this, 'width'),
      zIndex: propertyStore(this, 'zIndex')
    });

    _classPrivateFieldGet(this, _stores$1).transformOrigin.values = transformOrigins;
    Object.freeze(_classPrivateFieldGet(this, _stores$1));
    [_classPrivateFieldDestructureSet(this, _validators).value, _classPrivateFieldDestructureSet(this, _validatorsAdapter).value] = new AdapterValidators();
  }
  /**
   * Returns a promise that is resolved on the next element update with the time of the update.
   *
   * @returns {Promise<number>} Promise resolved on element update.
   */


  get elementUpdated() {
    return new Promise(resolve => _classPrivateFieldGet(this, _elementUpdatePromises).push(resolve));
  }
  /**
   * Returns the derived writable stores for individual data variables.
   *
   * @returns {StorePosition} Derived / writable stores.
   */


  get stores() {
    return _classPrivateFieldGet(this, _stores$1);
  }
  /**
   * Returns the validators.
   *
   * @returns {AdapterValidators} validators.
   */


  get validators() {
    return _classPrivateFieldGet(this, _validators);
  } // Data accessors ----------------------------------------------------------------------------------------------------

  /**
   * @returns {number|'auto'|null} height
   */


  get height() {
    return _classPrivateFieldGet(this, _data$1).height;
  }
  /**
   * @returns {number|null} left
   */


  get left() {
    return _classPrivateFieldGet(this, _data$1).left;
  }
  /**
   * @returns {number|null} rotateX
   */


  get rotateX() {
    return _classPrivateFieldGet(this, _data$1).rotateX;
  }
  /**
   * @returns {number|null} rotateY
   */


  get rotateY() {
    return _classPrivateFieldGet(this, _data$1).rotateY;
  }
  /**
   * @returns {number|null} rotateZ
   */


  get rotateZ() {
    return _classPrivateFieldGet(this, _data$1).rotateZ;
  }
  /**
   * @returns {number|null} scale
   */


  get scale() {
    return _classPrivateFieldGet(this, _data$1).scale;
  }
  /**
   * @returns {number|null} top
   */


  get top() {
    return _classPrivateFieldGet(this, _data$1).top;
  }
  /**
   * @returns {string} transformOrigin
   */


  get transformOrigin() {
    return _classPrivateFieldGet(this, _data$1).transformOrigin;
  }
  /**
   * @returns {number|'auto'|null} width
   */


  get width() {
    return _classPrivateFieldGet(this, _data$1).width;
  }
  /**
   * @returns {number|null} z-index
   */


  get zIndex() {
    return _classPrivateFieldGet(this, _data$1).zIndex;
  }
  /**
   * @param {number|'auto'|null} height -
   */


  set height(height) {
    _classPrivateFieldGet(this, _stores$1).height.set(height);
  }
  /**
   * @param {number|null} left -
   */


  set left(left) {
    _classPrivateFieldGet(this, _stores$1).left.set(left);
  }
  /**
   * @param {number|null} rotateX -
   */


  set rotateX(rotateX) {
    _classPrivateFieldGet(this, _stores$1).rotateX.set(rotateX);
  }
  /**
   * @param {number|null} rotateY -
   */


  set rotateY(rotateY) {
    _classPrivateFieldGet(this, _stores$1).rotateY.set(rotateY);
  }
  /**
   * @param {number|null} rotateZ -
   */


  set rotateZ(rotateZ) {
    _classPrivateFieldGet(this, _stores$1).rotateZ.set(rotateZ);
  }
  /**
   * @param {number|null} scale -
   */


  set scale(scale) {
    _classPrivateFieldGet(this, _stores$1).scale.set(scale);
  }
  /**
   * @param {number|null} top -
   */


  set top(top) {
    _classPrivateFieldGet(this, _stores$1).top.set(top);
  }
  /**
   * @param {string} transformOrigin -
   */


  set transformOrigin(transformOrigin) {
    if (transformOrigins.includes(transformOrigin)) {
      _classPrivateFieldGet(this, _stores$1).transformOrigin.set(transformOrigin);
    }
  }
  /**
   * @param {number|'auto'|null} width -
   */


  set width(width) {
    _classPrivateFieldGet(this, _stores$1).width.set(width);
  }
  /**
   * @param {number|null} zIndex -
   */


  set zIndex(zIndex) {
    _classPrivateFieldGet(this, _stores$1).zIndex.set(zIndex);
  }
  /**
   * Provides animation
   *
   * @param {PositionData}   position - The destination position.
   *
   * @param {object}         [opts] - Optional parameters.
   *
   * @param {number}         [opts.duration] - Duration in milliseconds.
   *
   * @param {Function}       [opts.easing=linear] - Easing function.
   *
   * @param {Function}       [opts.interpolate=lerp] - Interpolation function.
   *
   * @returns {Promise<void>} Animation complete.
   */


  async animateTo(position = {}, {
    duration = 1000,
    easing = identity,
    interpolate = lerp$5
  } = {}) {
    var _parent$options, _parent$options2;

    if (typeof position !== 'object') {
      throw new TypeError(`Position - animateTo error: 'position' is not an object.`);
    } // Early out if the application is not positionable.


    const parent = _classPrivateFieldGet(this, _parent);

    if (parent !== void 0 && typeof (parent === null || parent === void 0 ? void 0 : (_parent$options = parent.options) === null || _parent$options === void 0 ? void 0 : _parent$options.positionable) === 'boolean' && !(parent !== null && parent !== void 0 && (_parent$options2 = parent.options) !== null && _parent$options2 !== void 0 && _parent$options2.positionable)) {
      return;
    }

    if (!Number.isInteger(duration) || duration < 0) {
      throw new TypeError(`Position - animateTo error: 'duration' is not a positive integer.`);
    }

    if (typeof easing !== 'function') {
      throw new TypeError(`Position - animateTo error: 'easing' is not a function.`);
    }

    if (typeof interpolate !== 'function') {
      throw new TypeError(`Position - animateTo error: 'interpolate' is not a function.`);
    }

    const data = _classPrivateFieldGet(this, _data$1);

    const currentAnimationKeys = _classPrivateFieldGet(this, _currentAnimationKeys);

    const initial = {};
    const destination = {}; // Set initial data if the key / data is defined and the end position is not equal to current data.

    for (const key in position) {
      if (data[key] !== void 0 && position[key] !== data[key]) {
        destination[key] = position[key];
        initial[key] = data[key];
      }
    } // Set initial data for transform values that are often null by default.


    if (initial.rotateX === null) {
      initial.rotateX = 0;
    }

    if (initial.rotateY === null) {
      initial.rotateY = 0;
    }

    if (initial.rotateZ === null) {
      initial.rotateZ = 0;
    }

    if (initial.scale === null) {
      initial.scale = 1;
    }

    if (destination.rotateX === null) {
      destination.rotateX = 0;
    }

    if (destination.rotateY === null) {
      destination.rotateY = 0;
    }

    if (destination.rotateZ === null) {
      destination.rotateZ = 0;
    }

    if (destination.scale === null) {
      destination.scale = 1;
    } // Reject all initial data that is not a number or is current animating.
    // Add all keys that pass to `currentAnimationKeys`.


    for (const key in initial) {
      if (!Number.isFinite(initial[key]) || currentAnimationKeys.has(key)) {
        delete initial[key];
      } else {
        currentAnimationKeys.add(key);
      }
    }

    const newData = Object.assign({}, initial);
    const keys = Object.keys(newData); // Nothing to animate, so return now.

    if (keys.length === 0) {
      return;
    }

    const start = await nextAnimationFrame$1();
    let current = 0;

    while (current < duration) {
      const easedTime = easing(current / duration);

      for (const key of keys) {
        newData[key] = interpolate(initial[key], destination[key], easedTime);
      }

      current = (await this.set(newData).elementUpdated) - start;
    } // Prepare final update with end position data and remove keys from `currentAnimationKeys`.


    for (const key of keys) {
      newData[key] = position[key];
      currentAnimationKeys.delete(key);
    }

    this.set(newData);
  }
  /**
   * Assigns current position to object passed into method.
   *
   * @param {object|PositionData} [position] - Target to assign current position data.
   *
   * @returns {PositionData} Passed in object with current position data.
   */


  get(position = {}) {
    return Object.assign(position, _classPrivateFieldGet(this, _data$1));
  }
  /**
   * Returns any stored save state by name.
   *
   * @param {string}   name - Saved data set name.
   *
   * @returns {PositionData} The saved data set.
   */


  getSave({
    name
  }) {
    if (typeof name !== 'string') {
      throw new TypeError(`Position - getSave error: 'name' is not a string.`);
    }

    return _classPrivateFieldGet(this, _dataSaved).get(name);
  }
  /**
   * @returns {PositionData} Current position data.
   */


  toJSON() {
    return Object.assign({}, _classPrivateFieldGet(this, _data$1));
  }
  /**
   * Resets data to default values and invokes set. Check options, but by default current z-index is maintained.
   *
   * @param {object}   [opts] - Optional parameters.
   *
   * @param {boolean}  [opts.keepZIndex=false] - When true keeps current z-index.
   *
   * @param {boolean}  [opts.invokeSet=true] - When true invokes set method.
   *
   * @returns {boolean} Operation successful.
   */


  reset({
    keepZIndex = false,
    invokeSet = true
  } = {}) {
    var _classPrivateFieldGet2, _classPrivateFieldGet3;

    if (typeof _classPrivateFieldGet(this, _defaultData) !== 'object') {
      return false;
    }

    if (_classPrivateFieldGet(this, _currentAnimationKeys).size) {
      return false;
    }

    const zIndex = _classPrivateFieldGet(this, _data$1).zIndex;

    const data = Object.assign({}, _classPrivateFieldGet(this, _defaultData));

    if (keepZIndex) {
      data.zIndex = zIndex;
    } // Remove any keys that are currently animating.


    for (const key of _classPrivateFieldGet(this, _currentAnimationKeys)) {
      delete data[key];
    } // Reset the transform data.


    _classPrivateFieldGet(this, _transforms).reset(data); // If current minimized invoke `maximize`.


    if ((_classPrivateFieldGet2 = _classPrivateFieldGet(this, _parent)) !== null && _classPrivateFieldGet2 !== void 0 && (_classPrivateFieldGet3 = _classPrivateFieldGet2.reactive) !== null && _classPrivateFieldGet3 !== void 0 && _classPrivateFieldGet3.minimized) {
      var _classPrivateFieldGet4, _classPrivateFieldGet5;

      (_classPrivateFieldGet4 = _classPrivateFieldGet(this, _parent)) === null || _classPrivateFieldGet4 === void 0 ? void 0 : (_classPrivateFieldGet5 = _classPrivateFieldGet4.maximize) === null || _classPrivateFieldGet5 === void 0 ? void 0 : _classPrivateFieldGet5.call(_classPrivateFieldGet4, {
        animate: false,
        duration: 0
      });
    }

    if (invokeSet) {
      this.set(data);
    }

    return true;
  }
  /**
   * Removes and returns any position state by name.
   *
   * @param {object}   options - Options.
   *
   * @param {string}   options.name - Name to remove and retrieve.
   *
   * @returns {PositionData} Saved position data.
   */


  remove({
    name
  }) {
    if (typeof name !== 'string') {
      throw new TypeError(`Position - remove: 'name' is not a string.`);
    }

    const data = _classPrivateFieldGet(this, _dataSaved).get(name);

    _classPrivateFieldGet(this, _dataSaved).delete(name);

    return data;
  }
  /**
   * Restores a saved positional state returning the data. Several optional parameters are available
   * to control whether the restore action occurs silently (no store / inline styles updates), animates
   * to the stored data, or simply sets the stored data. Restoring via {@link Position.animateTo} allows
   * specification of the duration, easing, and interpolate functions along with configuring a Promise to be
   * returned if awaiting the end of the animation.
   *
   * @param {object}            params - Parameters
   *
   * @param {string}            params.name - Saved data set name.
   *
   * @param {boolean}           [params.remove=false] - Remove data set.
   *
   * @param {Iterable<string>}  [params.properties] - Specific properties to set / animate.
   *
   * @param {boolean}           [params.silent] - Set position data directly; no store or style updates.
   *
   * @param {boolean}           [params.async=false] - If animating return a Promise that resolves with any saved data.
   *
   * @param {boolean}           [params.animateTo=false] - Animate to restore data.
   *
   * @param {number}            [params.duration=100] - Duration in milliseconds.
   *
   * @param {Function}          [params.easing=linear] - Easing function.
   *
   * @param {Function}          [params.interpolate=lerp] - Interpolation function.
   *
   * @returns {PositionData} Saved position data.
   */


  restore({
    name,
    remove = false,
    properties,
    silent = false,
    async = false,
    animateTo = false,
    duration = 100,
    easing = identity,
    interpolate = lerp$5
  }) {
    if (typeof name !== 'string') {
      throw new TypeError(`Position - restore error: 'name' is not a string.`);
    }

    const dataSaved = _classPrivateFieldGet(this, _dataSaved).get(name);

    if (dataSaved) {
      if (remove) {
        _classPrivateFieldGet(this, _dataSaved).delete(name);
      }

      let data = dataSaved;

      if (isIterable(properties)) {
        data = {};

        for (const property of properties) {
          data[property] = dataSaved[property];
        }
      } // Update data directly with no store or inline style updates.


      if (silent) {
        for (const property in data) {
          _classPrivateFieldGet(this, _data$1)[property] = data[property];
        }

        return dataSaved;
      } else if (animateTo) // Animate to saved data.
        {
          // Provide special handling to potentially change transform origin as this parameter is not animated.
          if (data.transformOrigin !== this.transformOrigin) {
            this.transformOrigin = data.transformOrigin;
          } // Return a Promise with saved data that resolves after animation ends.


          if (async) {
            return this.animateTo(data, {
              duration,
              easing,
              interpolate
            }).then(() => dataSaved);
          } else // Animate synchronously.
            {
              this.animateTo(data, {
                duration,
                easing,
                interpolate
              });
            }
        } else {
        // Default options is to set data for an immediate update.
        this.set(data);
      }
    }

    return dataSaved;
  }
  /**
   * Saves current position state with the opportunity to add extra data to the saved state.
   *
   * @param {object}   options - Options.
   *
   * @param {string}   options.name - name to index this saved data.
   *
   * @param {...*}     [options.extra] - Extra data to add to saved data.
   *
   * @returns {PositionData} Current position data
   */


  save(_ref) {
    let {
      name
    } = _ref,
        extra = _objectWithoutProperties(_ref, _excluded);

    if (typeof name !== 'string') {
      throw new TypeError(`Position - save error: 'name' is not a string.`);
    }

    const data = this.get(extra);

    _classPrivateFieldGet(this, _dataSaved).set(name, data);

    return data;
  }
  /**
   * All calculation and updates of position are implemented in {@link Position}. This allows position to be fully
   * reactive and in control of updating inline styles for the application.
   *
   * Note: the logic for updating position is improved and changes a few aspects from the default
   * {@link Application.setPosition}. The gate on `popOut` is removed, so to ensure no positional application occurs
   * popOut applications can set `this.options.positionable` to false ensuring no positional inline styles are
   * applied.
   *
   * The initial set call on an application with a target element will always set width / height as this is
   * necessary for correct calculations.
   *
   * When a target element is present updated styles are applied after validation. To modify the behavior of set
   * implement one or more validator functions and add them from the application via
   * `this.position.validators.add(<Function>)`.
   *
   * Updates to any target element are decoupled from the underlying Position data. This method returns this instance
   * that you can then await on the target element inline style update by using {@link Position.elementUpdated}.
   *
   * @param {PositionData}   [position] - Position data to set.
   *
   * @returns {Position} This Position instance.
   */


  set(position = {}) {
    var _parent$options3, _parent$options4;

    if (typeof position !== 'object') {
      throw new TypeError(`Position - set error: 'position' is not an object.`);
    }

    const parent = _classPrivateFieldGet(this, _parent); // An early out to prevent `set` from taking effect if options `positionable` is false.


    if (parent !== void 0 && typeof (parent === null || parent === void 0 ? void 0 : (_parent$options3 = parent.options) === null || _parent$options3 === void 0 ? void 0 : _parent$options3.positionable) === 'boolean' && !(parent !== null && parent !== void 0 && (_parent$options4 = parent.options) !== null && _parent$options4 !== void 0 && _parent$options4.positionable)) {
      return this;
    }

    const data = _classPrivateFieldGet(this, _data$1);

    const transforms = _classPrivateFieldGet(this, _transforms);

    const validators = _classPrivateFieldGet(this, _validators);

    let currentTransform = '',
        updateTransform = false;
    const el = parent === null || parent === void 0 ? void 0 : parent.elementTarget;

    if (el) {
      var _el$style$transform;

      currentTransform = (_el$style$transform = el.style.transform) !== null && _el$style$transform !== void 0 ? _el$style$transform : '';
      position = _classPrivateMethodGet(this, _updatePosition, _updatePosition2).call(this, position, el);
    } // If there are any validators allow them to potentially modify position data or reject the update.


    if (validators.length) {
      for (const validator of validators) {
        position = validator.validator(position, parent);

        if (position === null) {
          return this;
        }
      }
    }

    let modified = false;

    if (typeof position.left === 'number') {
      position.left = Math.round(position.left);

      if (data.left !== position.left) {
        data.left = position.left;
        modified = true;
      }
    }

    if (typeof position.top === 'number') {
      position.top = Math.round(position.top);

      if (data.top !== position.top) {
        data.top = position.top;
        modified = true;
      }
    }

    if (typeof position.rotateX === 'number' || position.rotateX === null) {
      if (data.rotateX !== position.rotateX) {
        data.rotateX = transforms.rotateX = position.rotateX;
        updateTransform = modified = true;
      } else if (transforms.rotateX && !currentTransform.includes('rotateX(')) {
        updateTransform = true;
      }
    }

    if (typeof position.rotateY === 'number' || position.rotateY === null) {
      if (data.rotateY !== position.rotateY) {
        data.rotateY = transforms.rotateY = position.rotateY;
        updateTransform = modified = true;
      } else if (transforms.rotateY && !currentTransform.includes('rotateY(')) {
        updateTransform = true;
      }
    }

    if (typeof position.rotateZ === 'number' || position.rotateZ === null) {
      if (data.rotateZ !== position.rotateZ) {
        data.rotateZ = transforms.rotateZ = position.rotateZ;
        updateTransform = modified = true;
      } else if (transforms.rotateZ && !currentTransform.includes('rotateZ(')) {
        updateTransform = true;
      }
    }

    if (typeof position.scale === 'number' || position.scale === null) {
      position.scale = typeof position.scale === 'number' ? Math.max(0, Math.min(position.scale, 1000)) : null;

      if (data.scale !== position.scale) {
        data.scale = transforms.scale = position.scale;
        updateTransform = modified = true;
      } else if (transforms.scale && !currentTransform.includes('scale(')) {
        updateTransform = true;
      }
    }

    if (typeof position.transformOrigin !== void 0) {
      position.transformOrigin = transformOrigins.includes(position.transformOrigin) ? position.transformOrigin : transformOriginDefault;

      if (data.transformOrigin !== position.transformOrigin) {
        data.transformOrigin = position.transformOrigin;
        updateTransform = modified = true;
      }
    }

    if (typeof position.zIndex === 'number') {
      position.zIndex = Math.round(position.zIndex);

      if (data.zIndex !== position.zIndex) {
        data.zIndex = position.zIndex;
        modified = true;
      }
    }

    if (typeof position.width === 'number' || position.width === 'auto' || position.width === null) {
      position.width = typeof position.width === 'number' ? Math.round(position.width) : position.width;

      if (data.width !== position.width) {
        data.width = position.width;
        modified = true;
      }
    }

    if (typeof position.height === 'number' || position.height === 'auto' || position.height === null) {
      position.height = typeof position.height === 'number' ? Math.round(position.height) : position.height;

      if (data.height !== position.height) {
        data.height = position.height;
        modified = true;
      }
    }

    if (el) {
      // Set default data after first set operation that has a target element.
      if (typeof _classPrivateFieldGet(this, _defaultData) !== 'object') {
        _classPrivateFieldSet(this, _defaultData, Object.assign({}, data));
      } // Track any transform updates that are handled in `#updateElement`.


      _classPrivateFieldSet(this, _transformUpdate, _classPrivateFieldGet(this, _transformUpdate) | updateTransform); // If there isn't already a pending update element action then initiate it.


      if (!_classPrivateFieldGet(this, _updateElementInvoked)) {
        _classPrivateMethodGet(this, _updateElement, _updateElement2).call(this);
      }
    } // Notify main store subscribers.


    if (modified) {
      // Subscriptions are stored locally as on the browser Babel is still used for private class fields / Babel
      // support until 2023. IE not doing this will require several extra method calls otherwise.
      const subscriptions = _classPrivateFieldGet(this, _subscriptions); // Early out if there are no subscribers.


      if (subscriptions.length > 0) {
        for (let cntr = 0; cntr < subscriptions.length; cntr++) {
          subscriptions[cntr](position);
        }
      }
    }

    return this;
  }
  /**
   *
   * @param {function(PositionData): void} handler - Callback function that is invoked on update / changes. Receives
   *                                                 a copy of the PositionData.
   *
   * @returns {(function(): void)} Unsubscribe function.
   */


  subscribe(handler) {
    _classPrivateFieldGet(this, _subscriptions).push(handler); // add handler to the array of subscribers


    handler(Object.assign({}, _classPrivateFieldGet(this, _data$1))); // call handler with current value
    // Return unsubscribe function.

    return () => {
      const index = _classPrivateFieldGet(this, _subscriptions).findIndex(sub => sub === handler);

      if (index >= 0) {
        _classPrivateFieldGet(this, _subscriptions).splice(index, 1);
      }
    };
  }
  /**
   * Decouples updates to any parent target HTMLElement inline styles. Invoke {@link Position.elementUpdated} to await
   * on the returned promise that is resolved with the current render time via `nextAnimationFrame` /
   * `requestAnimationFrame`. This allows the underlying data model to be updated immediately while updates to the
   * element are in sync with the browser and potentially in the future be further throttled.
   *
   * @returns {Promise<number>} The current time before rendering.
   */


}

async function _updateElement2() {
  var _classPrivateFieldGet6;

  _classPrivateFieldSet(this, _updateElementInvoked, true); // Await the next animation frame. In the future this can be extended to multiple frames to divide update rate.


  const currentTime = await nextAnimationFrame$1();

  _classPrivateFieldSet(this, _updateElementInvoked, false);

  const el = (_classPrivateFieldGet6 = _classPrivateFieldGet(this, _parent)) === null || _classPrivateFieldGet6 === void 0 ? void 0 : _classPrivateFieldGet6.elementTarget;

  if (!el) {
    // Resolve any stored Promises when multiple updates have occurred.
    if (_classPrivateFieldGet(this, _elementUpdatePromises).length) {
      for (const resolve of _classPrivateFieldGet(this, _elementUpdatePromises)) {
        resolve(currentTime);
      }

      _classPrivateFieldGet(this, _elementUpdatePromises).length = 0;
    }

    return currentTime;
  }

  const data = _classPrivateFieldGet(this, _data$1);

  if (typeof data.left === 'number') {
    el.style.left = `${data.left}px`;
  }

  if (typeof data.top === 'number') {
    el.style.top = `${data.top}px`;
  }

  if (typeof data.zIndex === 'number' || data.zIndex === null) {
    el.style.zIndex = typeof data.zIndex === 'number' ? `${data.zIndex}` : null;
  }

  if (typeof data.width === 'number' || data.width === 'auto' || data.width === null) {
    el.style.width = typeof data.width === 'number' ? `${data.width}px` : data.width;
  }

  if (typeof data.height === 'number' || data.height === 'auto' || data.height === null) {
    el.style.height = typeof data.height === 'number' ? `${data.height}px` : data.height;
  } // Update all transforms in order added to transforms object.


  if (_classPrivateFieldGet(this, _transformUpdate)) {
    _classPrivateFieldSet(this, _transformUpdate, false); // If there are active transforms then set them otherwise reset the styles.


    if (_classPrivateFieldGet(this, _transforms).isActive) {
      el.style.transformOrigin = data.transformOrigin;
      el.style.transform = _classPrivateFieldGet(this, _transforms).getTransformString();
    } else {
      el.style.transformOrigin = null;
      el.style.transform = null;
    }
  } // Resolve any stored Promises when multiple updates have occurred.


  if (_classPrivateFieldGet(this, _elementUpdatePromises).length) {
    for (const resolve of _classPrivateFieldGet(this, _elementUpdatePromises)) {
      resolve(currentTime);
    }

    _classPrivateFieldGet(this, _elementUpdatePromises).length = 0;
  }

  return currentTime;
}

function _updatePosition2(_ref2 = {}, el) {
  let {
    left,
    top,
    width,
    height,
    rotateX,
    rotateY,
    rotateZ,
    scale,
    transformOrigin,
    zIndex
  } = _ref2,
      rest = _objectWithoutProperties(_ref2, _excluded2);

  const currentPosition = this.get(rest);
  const styles = globalThis.getComputedStyle(el); // Update width if an explicit value is passed, or if no width value is set on the element.

  if (el.style.width === '' || width !== void 0) {
    if (width === 'auto' || currentPosition.width === 'auto' && width !== null) {
      currentPosition.width = 'auto';
      width = el.offsetWidth;
    } else {
      const tarW = typeof width === 'number' ? Math.round(width) : el.offsetWidth;
      const minW = styleParsePixels(styles.minWidth) || MIN_WINDOW_WIDTH;
      const maxW = styleParsePixels(styles.maxWidth) || el.style.maxWidth || globalThis.innerWidth;
      currentPosition.width = width = Math.clamped(tarW, minW, maxW);

      if (width + left > globalThis.innerWidth) {
        left = currentPosition.left;
      }
    }
  } else {
    width = el.offsetWidth;
  } // Update height if an explicit value is passed, or if no height value is set on the element.


  if (el.style.height === '' || height !== void 0) {
    if (height === 'auto' || currentPosition.height === 'auto' && height !== null) {
      currentPosition.height = 'auto';
      height = el.offsetHeight;
    } else {
      const tarH = typeof height === 'number' ? Math.round(height) : el.offsetHeight + 1;
      const minH = styleParsePixels(styles.minHeight) || MIN_WINDOW_HEIGHT;
      const maxH = styleParsePixels(styles.maxHeight) || el.style.maxHeight || globalThis.innerHeight;
      currentPosition.height = height = Math.clamped(tarH, minH, maxH);

      if (height + currentPosition.top > globalThis.innerHeight + 1) {
        top = currentPosition.top - 1;
      }
    }
  } else {
    height = el.offsetHeight;
  } // Update left


  if (el.style.left === '' || Number.isFinite(left)) {
    const tarL = Number.isFinite(left) ? left : (globalThis.innerWidth - width) / 2;
    const maxL = Math.max(globalThis.innerWidth - width, 0);
    currentPosition.left = Math.round(Math.clamped(tarL, 0, maxL));
  } // Update top


  if (el.style.top === '' || Number.isFinite(top)) {
    const tarT = Number.isFinite(top) ? top : (globalThis.innerHeight - height) / 2;
    const maxT = Math.max(globalThis.innerHeight - height, 0);
    currentPosition.top = Math.round(Math.clamped(tarT, 0, maxT));
  } // Update rotate X/Y/Z, scale, z-index


  if (typeof rotateX === 'number' || rotateX === null) {
    currentPosition.rotateX = rotateX;
  }

  if (typeof rotateY === 'number' || rotateY === null) {
    currentPosition.rotateY = rotateY;
  }

  if (typeof rotateZ === 'number' || rotateZ === null) {
    currentPosition.rotateZ = rotateZ;
  }

  if (typeof scale === 'number' || scale === null) {
    currentPosition.scale = typeof scale === 'number' ? Math.max(0, Math.min(scale, 1000)) : null;
  }

  if (typeof transformOrigin === 'string') {
    currentPosition.transformOrigin = transformOrigins.includes(transformOrigin) ? transformOrigin : transformOriginDefault;
  }

  if (typeof zIndex === 'number' || zIndex === null) {
    currentPosition.zIndex = typeof zIndex === 'number' ? Math.round(zIndex) : zIndex;
  } // const rect = this.#transforms.getBoundingBox(currentPosition, this.#rectValidate);
  // TODO REMOVE: FOR TESTING
  // this._overlay.style.top = `${rect.top}px`;
  // this._overlay.style.left = `${rect.left}px`;
  // this._overlay.style.width = `${rect.width}px`;
  // this._overlay.style.height = `${rect.height}px`;
  // Return the updated position object.


  return currentPosition;
}

/**
 * Provides a Svelte aware extension to Application to control the app lifecycle appropriately. You can declaratively
 * load one or more components from `defaultOptions`.
 */

var _applicationShellHolder = /*#__PURE__*/new WeakMap();

var _applicationState = /*#__PURE__*/new WeakMap();

var _elementTarget = /*#__PURE__*/new WeakMap();

var _elementContent = /*#__PURE__*/new WeakMap();

var _initialZIndex = /*#__PURE__*/new WeakMap();

var _onMount = /*#__PURE__*/new WeakMap();

var _position = /*#__PURE__*/new WeakMap();

var _reactive = /*#__PURE__*/new WeakMap();

var _svelteData = /*#__PURE__*/new WeakMap();

var _getSvelteData = /*#__PURE__*/new WeakMap();

var _stores = /*#__PURE__*/new WeakMap();

var _updateApplicationShell = /*#__PURE__*/new WeakSet();

class SvelteApplication extends Application {
  /**
   * Stores the first mounted component which follows the application shell contract.
   *
   * @type {MountedAppShell[]|null[]} Application shell.
   */

  /**
   * Stores and manages application state for saving / restoring / serializing.
   *
   * @type {ApplicationState}
   */

  /**
   * Stores the target element which may not necessarily be the main element.
   *
   * @type {HTMLElement}
   */

  /**
   * Stores the content element which is set for application shells.
   *
   * @type {HTMLElement}
   */

  /**
   * Stores initial z-index from `_renderOuter` to set to target element / Svelte component.
   *
   * @type {number}
   */

  /**
   * Stores on mount state which is checked in _render to trigger onSvelteMount callback.
   *
   * @type {boolean}
   */

  /**
   * The position store.
   *
   * @type {Position}
   */

  /**
   * Contains the Svelte stores and reactive accessors.
   *
   * @type {SvelteReactive}
   */

  /**
   * Stores SvelteData entries with instantiated Svelte components.
   *
   * @type {SvelteData[]}
   */

  /**
   * Provides a helper class that combines multiple methods for interacting with the mounted components tracked in
   * {@link SvelteData}.
   *
   * @type {GetSvelteData}
   */

  /**
   * Contains methods to interact with the Svelte stores.
   *
   * @type {SvelteStores}
   */

  /**
   * @inheritDoc
   */
  constructor(options = {}) {
    super(options);

    _classPrivateMethodInitSpec(this, _updateApplicationShell);

    _classPrivateFieldInitSpec(this, _applicationShellHolder, {
      writable: true,
      value: [null]
    });

    _classPrivateFieldInitSpec(this, _applicationState, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _elementTarget, {
      writable: true,
      value: null
    });

    _classPrivateFieldInitSpec(this, _elementContent, {
      writable: true,
      value: null
    });

    _classPrivateFieldInitSpec(this, _initialZIndex, {
      writable: true,
      value: 95
    });

    _classPrivateFieldInitSpec(this, _onMount, {
      writable: true,
      value: false
    });

    _classPrivateFieldInitSpec(this, _position, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _reactive, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _svelteData, {
      writable: true,
      value: []
    });

    _classPrivateFieldInitSpec(this, _getSvelteData, {
      writable: true,
      value: new GetSvelteData(_classPrivateFieldGet(this, _applicationShellHolder), _classPrivateFieldGet(this, _svelteData))
    });

    _classPrivateFieldInitSpec(this, _stores, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _applicationState, new ApplicationState(this)); // Initialize Position with the position object set by Application.


    _classPrivateFieldSet(this, _position, new Position(this, _objectSpread2(_objectSpread2({}, this.options), this.position))); // Remove old position field.


    delete this.position;
    /**
     * Define accessors to retrieve Position by `this.position`.
     *
     * @member {PositionData} position - Adds accessors to SvelteApplication to get / set the position data.
     *
     * @memberof SvelteApplication#
     */

    Object.defineProperty(this, 'position', {
      get: () => _classPrivateFieldGet(this, _position),
      set: position => {
        if (typeof position === 'object') {
          _classPrivateFieldGet(this, _position).set(position);
        }
      }
    });

    _classPrivateFieldSet(this, _reactive, new SvelteReactive(this));

    _classPrivateFieldSet(this, _stores, _classPrivateFieldGet(this, _reactive).initialize());
  }
  /**
   * Specifies the default options that SvelteApplication supports.
   *
   * @returns {object} options - Application options.
   * @see https://foundryvtt.com/api/Application.html#options
   */


  static get defaultOptions() {
    return deepMerge(super.defaultOptions, {
      draggable: true,
      // If true then application shells are draggable.
      headerButtonNoClose: false,
      // If true then the close header button is removed.
      headerButtonNoLabel: false,
      // If true then header button labels are removed for application shells.
      headerNoTitleMinimized: false,
      // If true then header title is hidden when application is minimized.
      defaultCloseAnimation: true,
      // If false the default slide close animation is not run.
      positionable: true,
      // If false then `position.set` does not take effect.
      rotateX: null,
      // Assigned to position.
      rotateY: null,
      // Assigned to position.
      rotateZ: null,
      // Assigned to position.
      zIndex: null // Assigned to position.

    });
  }
  /**
   * Returns the content element if an application shell is mounted.
   *
   * @returns {HTMLElement} Content element.
   */


  get elementContent() {
    return _classPrivateFieldGet(this, _elementContent);
  }
  /**
   * Returns the target element or main element if no target defined.
   *
   * @returns {HTMLElement} Target element.
   */


  get elementTarget() {
    return _classPrivateFieldGet(this, _elementTarget);
  }
  /**
   * Returns the reactive accessors & Svelte stores for SvelteApplication.
   *
   * @returns {SvelteReactive} The reactive accessors & Svelte stores.
   */


  get reactive() {
    return _classPrivateFieldGet(this, _reactive);
  }
  /**
   * Returns the application state manager.
   *
   * @returns {ApplicationState} The application state manager.
   */


  get state() {
    return _classPrivateFieldGet(this, _applicationState);
  }
  /**
   * Returns the Svelte helper class w/ various methods to access mounted Svelte components.
   *
   * @returns {GetSvelteData} GetSvelteData
   */


  get svelte() {
    return _classPrivateFieldGet(this, _getSvelteData);
  }
  /**
   * In this case of when a template is defined in app options `html` references the inner HTML / template. However,
   * to activate classic v1 tabs for a Svelte component the element target is passed as an array simulating JQuery as
   * the element is retrieved immediately and the core listeners use standard DOM queries.
   *
   * @inheritDoc
   * @protected
   * @ignore
   */


  _activateCoreListeners(html) {
    super._activateCoreListeners(typeof this.options.template === 'string' ? html : [_classPrivateFieldGet(this, _elementTarget)]);
  }
  /**
   * Provide an override to set this application as the active window regardless of z-index. Changes behaviour from
   * Foundry core. This is important / used for instance in dialog key handling for left / right button selection.
   */


  bringToTop() {
    super.bringToTop();
    ui.activeWindow = this;
  }
  /**
   * Note: This method is fully overridden and duplicated as Svelte components need to be destroyed manually and the
   * best visual result is to destroy them after the default slide up animation occurs, but before the element
   * is removed from the DOM.
   *
   * If you destroy the Svelte components before the slide up animation the Svelte elements are removed immediately
   * from the DOM. The purpose of overriding ensures the slide up animation is always completed before
   * the Svelte components are destroyed and then the element is removed from the DOM.
   *
   * Close the application and un-register references to it within UI mappings.
   * This function returns a Promise which resolves once the window closing animation concludes
   *
   * @param {object}   [options] - Optional parameters.
   *
   * @param {boolean}  [options.force] - Force close regardless of render state.
   *
   * @returns {Promise<void>}    A Promise which resolves once the application is closed.
   * @ignore
   */


  async close(options = {}) {
    const states = Application.RENDER_STATES;

    if (!options.force && ![states.RENDERED, states.ERROR].includes(this._state)) {
      return;
    } // Unsubscribe from any local stores.


    _classPrivateFieldGet(this, _stores).unsubscribe();
    /**
     * @ignore
     */


    this._state = states.CLOSING;
    /**
     * Get the element.
     *
     * @type {HTMLElement}
     */

    const el = _classPrivateFieldGet(this, _elementTarget);

    if (!el) {
      return this._state = states.CLOSED;
    } // Make any window content overflow hidden to avoid any scrollbars appearing in default or Svelte outro
    // transitions.


    const content = el.querySelector('.window-content');

    if (content) {
      content.style.overflow = 'hidden';
    } // Dispatch Hooks for closing the base and subclass applications


    for (const cls of this.constructor._getInheritanceChain()) {
      /**
       * A hook event that fires whenever this Application is closed.
       *
       * @param {Application} app                     The Application instance being closed
       *
       * @param {jQuery[]} html                       The application HTML when it is closed
       *
       * @function closeApplication
       *
       * @memberof hookEvents
       */
      Hooks.call(`close${cls.name}`, this, el);
    } // If options `defaultCloseAnimation` is false then do not execute the standard slide up animation.
    // This allows Svelte components to provide any out transition. Application shells will automatically set
    // `defaultCloseAnimation` based on any out transition set or unset.


    const animate = typeof this.options.defaultCloseAnimation === 'boolean' ? this.options.defaultCloseAnimation : true;

    if (animate) {
      // Set min height for full slide.
      el.style.minHeight = '0';
      const {
        paddingBottom,
        paddingTop
      } = globalThis.getComputedStyle(el); // Slide-up application.

      await el.animate([{
        maxHeight: `${el.clientHeight}px`,
        paddingTop,
        paddingBottom
      }, {
        maxHeight: 0,
        paddingTop: 0,
        paddingBottom: 0
      }], {
        duration: 250,
        easing: 'ease-in',
        fill: 'forwards'
      }).finished;
    } // Stores the Promises returned from running outro transitions and destroying each Svelte component.


    const svelteDestroyPromises = []; // Manually invoke the destroy callbacks for all Svelte components.

    for (const entry of _classPrivateFieldGet(this, _svelteData)) {
      // Use `outroAndDestroy` to run outro transitions before destroying.
      svelteDestroyPromises.push(outroAndDestroy(entry.component)); // If any proxy eventbus has been added then remove all event registrations from the component.

      const eventbus = entry.config.eventbus;

      if (typeof eventbus === 'object' && typeof eventbus.off === 'function') {
        eventbus.off();
        entry.config.eventbus = void 0;
      }
    } // Await all Svelte components to destroy.


    await Promise.all(svelteDestroyPromises); // Reset SvelteData like this to maintain reference to GetSvelteData / `this.svelte`.

    _classPrivateFieldGet(this, _svelteData).length = 0; // Remove element from the DOM. Most SvelteComponents have already removed it.

    el.remove(); // Silently restore any width / height state before minimized as applicable.

    this.position.restore({
      name: '#beforeMinimized',
      properties: ['width', 'height'],
      silent: true,
      remove: true
    }); // Clean up data

    _classPrivateFieldGet(this, _applicationShellHolder)[0] = null;
    /**
     * @ignore
     */

    this._element = null;

    _classPrivateFieldSet(this, _elementContent, null);

    _classPrivateFieldSet(this, _elementTarget, null);

    delete ui.windows[this.appId];
    /**
     * @ignore
     */

    this._minimized = false;
    /**
     * @ignore
     */

    this._scrollPositions = null;
    this._state = states.CLOSED;

    _classPrivateFieldSet(this, _onMount, false); // Update the minimized UI store options.


    _classPrivateFieldGet(this, _stores).uiOptionsUpdate(storeOptions => deepMerge(storeOptions, {
      minimized: this._minimized
    }));
  }
  /**
   * Inject the Svelte components defined in `this.options.svelte`. The Svelte component can attach to the existing
   * pop-out of Application or provide no template and render into a document fragment which is then attached to the
   * DOM.
   *
   * @param {JQuery} html -
   *
   * @inheritDoc
   * @ignore
   */


  _injectHTML(html) {
    if (this.popOut && html.length === 0 && Array.isArray(this.options.svelte)) {
      throw new Error('SvelteApplication - _injectHTML - A popout app with no template can only support one Svelte component.');
    } // Make sure the store is updated with the latest header buttons. Also allows filtering buttons before display.


    this.reactive.updateHeaderButtons(); // Create a function to generate a callback for Svelte components to invoke to update the tracked elements for
    // application shells in the rare cases that the main element root changes. The update is only trigged on
    // successive changes of `elementRoot`. Returns a boolean to indicate the element roots are updated.

    const elementRootUpdate = () => {
      let cntr = 0;
      return elementRoot => {
        if (elementRoot !== null && elementRoot !== void 0 && cntr++ > 0) {
          _classPrivateMethodGet(this, _updateApplicationShell, _updateApplicationShell2).call(this);

          return true;
        }

        return false;
      };
    };

    if (Array.isArray(this.options.svelte)) {
      for (const svelteConfig of this.options.svelte) {
        const svelteData = loadSvelteConfig(this, html, svelteConfig, elementRootUpdate);

        if (isApplicationShell(svelteData.component)) {
          if (this.svelte.applicationShell !== null) {
            throw new Error(`SvelteApplication - _injectHTML - An application shell is already mounted; offending config:
                    ${JSON.stringify(svelteConfig)}`);
          }

          _classPrivateFieldGet(this, _applicationShellHolder)[0] = svelteData.component;
        }

        _classPrivateFieldGet(this, _svelteData).push(svelteData);
      }
    } else if (typeof this.options.svelte === 'object') {
      const svelteData = loadSvelteConfig(this, html, this.options.svelte, elementRootUpdate);

      if (isApplicationShell(svelteData.component)) {
        // A sanity check as shouldn't hit this case as only one component is being mounted.
        if (this.svelte.applicationShell !== null) {
          throw new Error(`SvelteApplication - _injectHTML - An application shell is already mounted; offending config:
                 ${JSON.stringify(this.options.svelte)}`);
        }

        _classPrivateFieldGet(this, _applicationShellHolder)[0] = svelteData.component;
      }

      _classPrivateFieldGet(this, _svelteData).push(svelteData);
    } // Detect if this is a synthesized DocumentFragment.


    const isDocumentFragment = html.length && html[0] instanceof DocumentFragment; // If any of the Svelte components mounted directly targets an HTMLElement then do not inject HTML.

    let injectHTML = true;

    for (const svelteData of _classPrivateFieldGet(this, _svelteData)) {
      if (!svelteData.injectHTML) {
        injectHTML = false;
        break;
      }
    }

    if (injectHTML) {
      super._injectHTML(html);
    }

    if (this.svelte.applicationShell !== null) {
      this._element = $(this.svelte.applicationShell.elementRoot); // Detect if the application shell exports an `elementContent` accessor.

      _classPrivateFieldSet(this, _elementContent, hasGetter(this.svelte.applicationShell, 'elementContent') ? this.svelte.applicationShell.elementContent : null); // Detect if the application shell exports an `elementTarget` accessor.


      _classPrivateFieldSet(this, _elementTarget, hasGetter(this.svelte.applicationShell, 'elementTarget') ? this.svelte.applicationShell.elementTarget : null);
    } else if (isDocumentFragment) // Set the element of the app to the first child element in order of Svelte components mounted.
      {
        for (const svelteData of _classPrivateFieldGet(this, _svelteData)) {
          if (svelteData.element instanceof HTMLElement) {
            this._element = $(svelteData.element);
            break;
          }
        }
      } // Potentially retrieve a specific target element if `selectorTarget` is defined otherwise make the target the
    // main element.


    if (_classPrivateFieldGet(this, _elementTarget) === null) {
      const element = typeof this.options.selectorTarget === 'string' ? this._element.find(this.options.selectorTarget) : this._element;

      _classPrivateFieldSet(this, _elementTarget, element[0]);
    } // TODO VERIFY THIS CHECK ESPECIALLY `this.#elementTarget.length === 0`.


    if (_classPrivateFieldGet(this, _elementTarget) === null || _classPrivateFieldGet(this, _elementTarget) === void 0 || _classPrivateFieldGet(this, _elementTarget).length === 0) {
      throw new Error(`SvelteApplication - _injectHTML: Target element '${this.options.selectorTarget}' not found.`);
    } // The initial zIndex may be set in application options or for popOut applications is stored by `_renderOuter`
    // in `this.#initialZIndex`.


    if (typeof this.options.positionable === 'boolean' && this.options.positionable) {
      var _classPrivateFieldGet2;

      _classPrivateFieldGet(this, _elementTarget).style.zIndex = typeof this.options.zIndex === 'number' ? this.options.zIndex : (_classPrivateFieldGet2 = _classPrivateFieldGet(this, _initialZIndex)) !== null && _classPrivateFieldGet2 !== void 0 ? _classPrivateFieldGet2 : 95;
    } // Subscribe to local store handling.


    _classPrivateFieldGet(this, _stores).subscribe();
  }
  /**
   * Provides a mechanism to update the UI options store for maximized.
   *
   * Note: the sanity check is duplicated from {@link Application.maximize} the store is updated _before_
   * performing the rest of animations. This allows application shells to remove / show any resize handlers
   * correctly. Extra constraint data is stored in a saved position state in {@link SvelteApplication.minimize}
   * to animate the content area.
   *
   * @param {object} [opts] - Optional parameters.
   *
   * @param {boolean}  [opts.animate=true] - When true perform default maximizing animation.
   *
   * @param {boolean}  [opts.duration=100] - Controls content area animation duration.
   */


  async maximize({
    animate = true,
    duration = 100
  } = {}) {
    if (!this.popOut || [false, null].includes(this._minimized)) {
      return;
    }

    _classPrivateFieldGet(this, _stores).uiOptionsUpdate(options => deepMerge(options, {
      minimized: false
    }));

    this._minimized = null; // Get content

    const element = this.elementTarget;
    const header = element.querySelector('.window-header');
    const content = element.querySelector('.window-content'); // First animate / restore width / async.

    if (animate) {
      await this.position.restore({
        name: '#beforeMinimized',
        async: true,
        animateTo: true,
        properties: ['width']
      });
    } // Reset display none on all children of header.


    for (let cntr = header.children.length; --cntr >= 0;) {
      header.children[cntr].style.display = null;
    }

    content.style.display = null;
    let constraints;

    if (animate) {
      // Next animate / restore height synchronously and remove key. Retrieve constraints data for slide up animation
      // below.
      ({
        constraints
      } = this.position.restore({
        name: '#beforeMinimized',
        animateTo: true,
        properties: ['height'],
        remove: true,
        duration: 100
      }));
    } else {
      ({
        constraints
      } = this.position.remove({
        name: '#beforeMinimized'
      }));
    } // Slide down content with stored constraints.


    await content.animate([{
      maxHeight: 0,
      paddingTop: 0,
      paddingBottom: 0,
      offset: 0
    }, _objectSpread2(_objectSpread2({}, constraints), {}, {
      offset: 1
    }), {
      maxHeight: '100%',
      offset: 1
    }], {
      duration,
      fill: 'forwards'
    }).finished;
    element.classList.remove('minimized');
    this._minimized = false;
    element.style.minWidth = null;
    element.style.minHeight = null; // Using a 30ms timeout prevents any instantaneous display of scrollbars with the above maximize animation.

    setTimeout(() => content.style.overflow = null, 30);
  }
  /**
   * Provides a mechanism to update the UI options store for minimized.
   *
   * Note: the sanity check is duplicated from {@link Application.minimize} the store is updated _before_
   * performing the rest of animations. This allows application shells to remove / show any resize handlers
   * correctly. Extra constraint data is stored in a saved position state in {@link SvelteApplication.minimize}
   * to animate the content area.
   *
   * @param {object} [opts] - Optional parameters
   *
   * @param {boolean}  [opts.animate=true] - When true perform default minimizing animation.
   *
   * @param {boolean}  [opts.duration=100] - Controls content area animation duration.
   */


  async minimize({
    animate = true,
    duration = 100
  } = {}) {
    if (!this.rendered || !this.popOut || [true, null].includes(this._minimized)) {
      return;
    }

    _classPrivateFieldGet(this, _stores).uiOptionsUpdate(options => deepMerge(options, {
      minimized: true
    }));

    this._minimized = null;
    const element = this.elementTarget; // Get content

    const header = element.querySelector('.window-header');
    const content = element.querySelector('.window-content'); // Remove minimum width and height styling rules

    element.style.minWidth = '100px';
    element.style.minHeight = '30px';
    content.style.overflow = 'hidden';
    const {
      paddingBottom,
      paddingTop
    } = globalThis.getComputedStyle(content); // Extra data that is saved with the current position. Used during `maximize`.

    const constraints = {
      maxHeight: `${content.clientHeight}px`,
      paddingTop,
      paddingBottom
    }; // Slide-up content

    if (animate) {
      const animation = content.animate([constraints, {
        maxHeight: 0,
        paddingTop: 0,
        paddingBottom: 0
      }], {
        duration,
        fill: 'forwards'
      }); // Set display style to none when animation finishes.

      animation.finished.then(() => content.style.display = 'none');
    } else {
      setTimeout(() => content.style.display = 'none', duration);
    } // Save current position state and add the constraint data to use in `maximize`.


    this.position.save({
      name: '#beforeMinimized',
      constraints
    });

    if (animate) {
      // First await animation of height upward.
      await this.position.animateTo({
        height: header.offsetHeight
      }, {
        duration: 100
      });
    } // Set all header buttons besides close and the window title to display none.


    for (let cntr = header.children.length; --cntr >= 0;) {
      const className = header.children[cntr].className;

      if (className.includes('window-title') || className.includes('close') || className.includes('keep-minimized')) {
        continue;
      }

      header.children[cntr].style.display = 'none';
    }

    if (animate) {
      // Await animation of width to the left / minimum width.
      await this.position.animateTo({
        width: MIN_WINDOW_WIDTH
      }, {
        duration: 100
      });
    }

    element.classList.add('minimized');
    this._minimized = true;
  }
  /**
   * Provides a callback after all Svelte components are initialized.
   *
   * @param {object}      [opts] - Optional parameters.
   *
   * @param {HTMLElement} [opts.element] - HTMLElement container for main application element.
   *
   * @param {HTMLElement} [opts.elementContent] - HTMLElement container for content area of application shells.
   *
   * @param {HTMLElement} [opts.elementTarget] - HTMLElement container for main application target element.
   */


  onSvelteMount({
    element,
    elementContent,
    elementTarget
  }) {} // eslint-disable-line no-unused-vars

  /**
   * Override replacing HTML as Svelte components control the rendering process. Only potentially change the outer
   * application frame / title for pop-out applications.
   *
   * @inheritDoc
   * @ignore
   */


  _replaceHTML(element, html) // eslint-disable-line no-unused-vars
  {
    if (!element.length) {
      return;
    }

    this.reactive.updateHeaderButtons();
  }
  /**
   * Provides an override verifying that a new Application being rendered for the first time doesn't have a
   * corresponding DOM element already loaded. This is a check that only occurs when `this._state` is
   * `Application.RENDER_STATES.NONE`. It is useful in particular when SvelteApplication has a static ID
   * explicitly set in `this.options.id` and long intro / outro transitions are assigned. If a new application
   * sharing this static ID attempts to open / render for the first time while an existing DOM element sharing
   * this static ID exists then the initial render is cancelled below rather than crashing later in the render
   * cycle {@link Position.set}.
   *
   * @inheritDoc
   * @protected
   * @ignore
   */


  async _render(force = false, options = {}) {
    if (this._state === Application.RENDER_STATES.NONE && document.querySelector(`#${this.id}`) instanceof HTMLElement) {
      console.warn(`SvelteApplication - _render: A DOM element already exists for CSS ID '${this.id}'. Cancelling initial render for new application with appId '${this.appId}'.`);
      return;
    }

    await super._render(force, options);

    if (!_classPrivateFieldGet(this, _onMount)) {
      this.onSvelteMount({
        element: this._element[0],
        elementContent: _classPrivateFieldGet(this, _elementContent),
        elementTarget: _classPrivateFieldGet(this, _elementTarget)
      });

      _classPrivateFieldSet(this, _onMount, true);
    }
  }
  /**
   * Render the inner application content. Only render a template if one is defined otherwise provide an empty
   * JQuery element per the core Foundry API.
   *
   * @param {Object} data         The data used to render the inner template
   *
   * @returns {Promise.<JQuery>}   A promise resolving to the constructed jQuery object
   *
   * @protected
   * @ignore
   */


  async _renderInner(data) {
    const html = typeof this.template === 'string' ? await renderTemplate(this.template, data) : document.createDocumentFragment();
    return $(html);
  }
  /**
   * Stores the initial z-index set in `_renderOuter` which is used in `_injectHTML` to set the target element
   * z-index after the Svelte component is mounted.
   *
   * @returns {Promise<JQuery>} Outer frame / unused.
   * @protected
   * @ignore
   */


  async _renderOuter() {
    const html = await super._renderOuter();

    _classPrivateFieldSet(this, _initialZIndex, html[0].style.zIndex);

    return html;
  }
  /**
   * All calculation and updates of position are implemented in {@link Position.set}. This allows position to be fully
   * reactive and in control of updating inline styles for the application.
   *
   * This method remains for backward compatibility with Foundry. If you have a custom override quite likely you need
   * to update to using the {@link Position.validators} functionality.
   *
   * @param {PositionData}   [position] - Position data.
   *
   * @returns {PositionData} The updated position object for the application containing the new values
   */


  setPosition(position) {
    return this.position.set(position);
  }
  /**
   * This method is only invoked by the `elementRootUpdate` callback that is added to the external context passed to
   * Svelte components. When invoked it updates the local element roots tracked by SvelteApplication.
   */


}
/**
 * @typedef {object} SvelteData
 *
 * @property {object}                           config -
 *
 * @property {import('svelte').SvelteComponent} component -
 *
 * @property {HTMLElement}                      element -
 *
 * @property {boolean}                          injectHTML -
 */

/**
 * @typedef {object} SvelteStores
 *
 * @property {import('svelte/store').Writable.update} appOptionsUpdate - Update function for app options store.
 *
 * @property {Function} subscribe - Subscribes to local stores.
 *
 * @property {import('svelte/store').Writable.update} uiOptionsUpdate - Update function for UI options store.
 *
 * @property {Function} unsubscribe - Unsubscribes from local stores.
 */

function _updateApplicationShell2() {
  const applicationShell = this.svelte.applicationShell;

  if (applicationShell !== null) {
    this._element = $(applicationShell.elementRoot); // Detect if the application shell exports an `elementContent` accessor.

    _classPrivateFieldSet(this, _elementContent, hasGetter(applicationShell, 'elementContent') ? applicationShell.elementContent : null); // Detect if the application shell exports an `elementTarget` accessor.


    _classPrivateFieldSet(this, _elementTarget, hasGetter(applicationShell, 'elementTarget') ? applicationShell.elementTarget : null);

    if (_classPrivateFieldGet(this, _elementTarget) === null) {
      const element = typeof this.options.selectorTarget === 'string' ? this._element.find(this.options.selectorTarget) : this._element;

      _classPrivateFieldSet(this, _elementTarget, element[0]);
    } // The initial zIndex may be set in application options or for popOut applications is stored by `_renderOuter`
    // in `this.#initialZIndex`.


    if (typeof this.options.positionable === 'boolean' && this.options.positionable) {
      var _classPrivateFieldGet3;

      _classPrivateFieldGet(this, _elementTarget).style.zIndex = typeof this.options.zIndex === 'number' ? this.options.zIndex : (_classPrivateFieldGet3 = _classPrivateFieldGet(this, _initialZIndex)) !== null && _classPrivateFieldGet3 !== void 0 ? _classPrivateFieldGet3 : 95;

      _get(_getPrototypeOf(SvelteApplication.prototype), "bringToTop", this).call(this); // Ensure that new root element has inline position styles set.


      this.position.set(this.position.get());
    }

    _get(_getPrototypeOf(SvelteApplication.prototype), "_activateCoreListeners", this).call(this, [_classPrivateFieldGet(this, _elementTarget)]);

    this.onSvelteMount({
      element: this._element[0],
      elementContent: _classPrivateFieldGet(this, _elementContent),
      elementTarget: _classPrivateFieldGet(this, _elementTarget)
    });
  }
}

function fade(node, {
  delay = 0,
  duration = 400,
  easing = identity
} = {}) {
  const o = +getComputedStyle(node).opacity;
  return {
    delay,
    duration,
    easing,
    css: t => `opacity: ${t * o}`
  };
}

/**
 * Common utilities
 * @module glMatrix
 */
// Configuration Constants


var EPSILON = 0.000001;
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
if (!Math.hypot) Math.hypot = function () {
  var y = 0,
      i = arguments.length;

  while (i--) {
    y += arguments[i] * arguments[i];
  }

  return Math.sqrt(y);
};
/**
 * 3x3 Matrix
 * @module mat3
 */

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */

function create$6() {
  var out = new ARRAY_TYPE(9);

  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
  }

  out[0] = 1;
  out[4] = 1;
  out[8] = 1;
  return out;
}
/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */


function create$4() {
  var out = new ARRAY_TYPE(3);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  return out;
}
/**
 * Calculates the length of a vec3
 *
 * @param {ReadonlyVec3} a vector to calculate length of
 * @returns {Number} length of a
 */


function length$4(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return Math.hypot(x, y, z);
}
/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */


function fromValues$4(x, y, z) {
  var out = new ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to normalize
 * @returns {vec3} out
 */


function normalize$4(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var len = x * x + y * y + z * z;

  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }

  out[0] = a[0] * len;
  out[1] = a[1] * len;
  out[2] = a[2] * len;
  return out;
}
/**
 * Calculates the dot product of two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} dot product of a and b
 */


function dot$4(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */


function cross$2(out, a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2];
  var bx = b[0],
      by = b[1],
      bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
/**
 * Alias for {@link vec3.length}
 * @function
 */


var len$4 = length$4;
/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

(function () {
  var vec = create$4();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 3;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }

    return a;
  };
})();
/**
 * 4 Dimensional Vector
 * @module vec4
 */

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */


function create$3() {
  var out = new ARRAY_TYPE(4);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
  }

  return out;
}
/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to normalize
 * @returns {vec4} out
 */


function normalize$3(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  var len = x * x + y * y + z * z + w * w;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }

  out[0] = x * len;
  out[1] = y * len;
  out[2] = z * len;
  out[3] = w * len;
  return out;
}
/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */


(function () {
  var vec = create$3();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 4;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      vec[3] = a[i + 3];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
      a[i + 3] = vec[3];
    }

    return a;
  };
})();
/**
 * Quaternion
 * @module quat
 */

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */


function create$2() {
  var out = new ARRAY_TYPE(4);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  out[3] = 1;
  return out;
}
/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyVec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/


function setAxisAngle(out, axis, rad) {
  rad = rad * 0.5;
  var s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}
/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */


function slerp(out, a, b, t) {
  // benchmarks:
  //    http://jsperf.com/quaternion-slerp-implementations
  var ax = a[0],
      ay = a[1],
      az = a[2],
      aw = a[3];
  var bx = b[0],
      by = b[1],
      bz = b[2],
      bw = b[3];
  var omega, cosom, sinom, scale0, scale1; // calc cosine

  cosom = ax * bx + ay * by + az * bz + aw * bw; // adjust signs (if necessary)

  if (cosom < 0.0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  } // calculate coefficients


  if (1.0 - cosom > EPSILON) {
    // standard case (slerp)
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    // "from" and "to" quaternions are very close
    //  ... so we can do a linear interpolation
    scale0 = 1.0 - t;
    scale1 = t;
  } // calculate final values


  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;
  return out;
}
/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyMat3} m rotation matrix
 * @returns {quat} out
 * @function
 */


function fromMat3(out, m) {
  // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
  // article "Quaternion Calculus and Fast Animation".
  var fTrace = m[0] + m[4] + m[8];
  var fRoot;

  if (fTrace > 0.0) {
    // |w| > 1/2, may as well choose w > 1/2
    fRoot = Math.sqrt(fTrace + 1.0); // 2w

    out[3] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot; // 1/(4w)

    out[0] = (m[5] - m[7]) * fRoot;
    out[1] = (m[6] - m[2]) * fRoot;
    out[2] = (m[1] - m[3]) * fRoot;
  } else {
    // |w| <= 1/2
    var i = 0;
    if (m[4] > m[0]) i = 1;
    if (m[8] > m[i * 3 + i]) i = 2;
    var j = (i + 1) % 3;
    var k = (i + 2) % 3;
    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
  }

  return out;
}
/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */


var normalize$2 = normalize$3;
/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {ReadonlyVec3} a the initial vector
 * @param {ReadonlyVec3} b the destination vector
 * @returns {quat} out
 */

(function () {
  var tmpvec3 = create$4();
  var xUnitVec3 = fromValues$4(1, 0, 0);
  var yUnitVec3 = fromValues$4(0, 1, 0);
  return function (out, a, b) {
    var dot = dot$4(a, b);

    if (dot < -0.999999) {
      cross$2(tmpvec3, xUnitVec3, a);
      if (len$4(tmpvec3) < 0.000001) cross$2(tmpvec3, yUnitVec3, a);
      normalize$4(tmpvec3, tmpvec3);
      setAxisAngle(out, tmpvec3, Math.PI);
      return out;
    } else if (dot > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      cross$2(tmpvec3, a, b);
      out[0] = tmpvec3[0];
      out[1] = tmpvec3[1];
      out[2] = tmpvec3[2];
      out[3] = 1 + dot;
      return normalize$2(out, out);
    }
  };
})();
/**
 * Performs a spherical linear interpolation with two control points
 *
 * @param {quat} out the receiving quaternion
 * @param {ReadonlyQuat} a the first operand
 * @param {ReadonlyQuat} b the second operand
 * @param {ReadonlyQuat} c the third operand
 * @param {ReadonlyQuat} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */


(function () {
  var temp1 = create$2();
  var temp2 = create$2();
  return function (out, a, b, c, d, t) {
    slerp(temp1, a, d, t);
    slerp(temp2, b, c, t);
    slerp(out, temp1, temp2, 2 * t * (1 - t));
    return out;
  };
})();
/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {ReadonlyVec3} view  the vector representing the viewing direction
 * @param {ReadonlyVec3} right the vector representing the local "right" direction
 * @param {ReadonlyVec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */


(function () {
  var matr = create$6();
  return function (out, view, right, up) {
    matr[0] = right[0];
    matr[3] = right[1];
    matr[6] = right[2];
    matr[1] = up[0];
    matr[4] = up[1];
    matr[7] = up[2];
    matr[2] = -view[0];
    matr[5] = -view[1];
    matr[8] = -view[2];
    return normalize$2(out, fromMat3(out, matr));
  };
})();
/**
 * 2 Dimensional Vector
 * @module vec2
 */

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */


function create() {
  var out = new ARRAY_TYPE(2);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
  }

  return out;
}
/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */


(function () {
  var vec = create();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 2;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
    }

    return a;
  };
})();

const s_DEFAULT_TRANSITION = () => void 0;

const s_DEFAULT_TRANSITION_OPTIONS = {};

/**
 * Provides an action to apply style properties provided as an object.
 *
 * @param {HTMLElement} node - Target element
 *
 * @param {object}      properties - Key / value object of properties to set.
 *
 * @returns {Function} Update function.
 */
function applyStyles(node, properties) {
  /** Sets properties on node. */
  function setProperties() {
    if (typeof properties !== 'object') {
      return;
    }

    for (const prop of Object.keys(properties)) {
      node.style.setProperty(`${prop}`, properties[prop]);
    }
  }

  setProperties();
  return {
    update(newProperties) {
      properties = newProperties;
      setProperties();
    }

  };
}
/**
 * Provides an action to enable pointer dragging of an HTMLElement and invoke `position.set` on a given {@link Position}
 * instance provided. When the attached boolean store state changes the draggable action is enabled or disabled.
 *
 * @param {HTMLElement}       node - The node associated with the action.
 *
 * @param {object}            params - Required parameters.
 *
 * @param {Position}          params.position - A position instance.
 *
 * @param {boolean}           [params.active=true] - A boolean value; attached to a readable store.
 *
 * @param {Writable<boolean>} [params.storeDragging] - A writable store that tracks "dragging" state.
 *
 * @returns {{update: Function, destroy: Function}} The action lifecycle methods.
 */


function draggable(node, {
  position,
  active = true,
  storeDragging = void 0
}) {
  /**
   * Duplicate the app / Positionable starting position to track differences.
   *
   * @type {object}
   */
  let initialPosition = null;
  /**
   * Stores the initial X / Y on drag down.
   *
   * @type {object}
   */

  let initialDragPoint = {};
  /**
   * Stores the current dragging state and gates the move pointer as the dragging store is not
   * set until the first pointer move.
   *
   * @type {boolean}
   */

  let dragging = false;
  /**
   * Remember event handlers associated with this action so they may be later unregistered.
   *
   * @type {object}
   */

  const handlers = {
    dragDown: ['pointerdown', e => onDragPointerDown(e), false],
    dragMove: ['pointermove', e => onDragPointerMove(e), false],
    dragUp: ['pointerup', e => onDragPointerUp(e), false]
  };
  /**
   * Activates listeners.
   */

  function activateListeners() {
    // Drag handlers
    node.addEventListener(...handlers.dragDown);
    node.classList.add('draggable');
  }
  /**
   * Removes listeners.
   */


  function removeListeners() {
    if (typeof (storeDragging === null || storeDragging === void 0 ? void 0 : storeDragging.set) === 'function') {
      storeDragging.set(false);
    } // Drag handlers


    node.removeEventListener(...handlers.dragDown);
    node.removeEventListener(...handlers.dragMove);
    node.removeEventListener(...handlers.dragUp);
    node.classList.remove('draggable');
  }

  if (active) {
    activateListeners();
  }
  /**
   * Handle the initial pointer down that activates dragging behavior for the positionable.
   *
   * @param {PointerEvent} event - The pointer down event.
   */


  function onDragPointerDown(event) {
    event.preventDefault();
    dragging = false; // Record initial position.

    initialPosition = position.get();
    initialDragPoint = {
      x: event.clientX,
      y: event.clientY
    }; // Add move and pointer up handlers.

    node.addEventListener(...handlers.dragMove);
    node.addEventListener(...handlers.dragUp);
    node.setPointerCapture(event.pointerId);
  }
  /**
   * Move the positionable.
   *
   * @param {PointerEvent} event - The pointer move event.
   */


  function onDragPointerMove(event) {
    event.preventDefault(); // Only set store dragging on first move event.

    if (!dragging && typeof (storeDragging === null || storeDragging === void 0 ? void 0 : storeDragging.set) === 'function') {
      dragging = true;
      storeDragging.set(true);
    } // Update application position.


    position.set({
      left: initialPosition.left + (event.clientX - initialDragPoint.x),
      top: initialPosition.top + (event.clientY - initialDragPoint.y)
    });
  }
  /**
   * Finish dragging and set the final position and removing listeners.
   *
   * @param {PointerEvent} event - The pointer up event.
   */


  function onDragPointerUp(event) {
    event.preventDefault();
    dragging = false;

    if (typeof (storeDragging === null || storeDragging === void 0 ? void 0 : storeDragging.set) === 'function') {
      storeDragging.set(false);
    }

    node.removeEventListener(...handlers.dragMove);
    node.removeEventListener(...handlers.dragUp);
  }

  return {
    update: ({
      active
    }) => // eslint-disable-line no-shadow
    {
      if (active) {
        activateListeners();
      } else {
        removeListeners();
      }
    },
    destroy: () => removeListeners()
  };
}

/**
 * A helper to create a set of radio checkbox input elements in a named set.
 * The provided keys are the possible radio values while the provided values are human readable labels.
 *
 * @param {string} name         The radio checkbox field name
 *
 * @param {object} choices      A mapping of radio checkbox values to human readable labels
 *
 * @param {object} options      Options which customize the radio boxes creation
 *
 * @param {string} options.checked    Which key is currently checked?
 *
 * @param {boolean} options.localize  Pass each label through string localization?
 *
 * @returns {string} HTML for radio boxes.
 *
 * @example <caption>The provided input data</caption>
 * let groupName = "importantChoice";
 * let choices = {a: "Choice A", b: "Choice B"};
 * let chosen = "a";
 *
 * @example <caption>The template HTML structure</caption>
 * <div class="form-group">
 *   <label>Radio Group Label</label>
 *   <div class="form-fields">
 *     {@html radioBoxes(groupName, choices, { checked: chosen, localize: true})}
 *   </div>
 * </div>
 */
/**
 * Localize a string including variable formatting for input arguments. Provide a string ID which defines the localized
 * template. Variables can be included in the template enclosed in braces and will be substituted using those named
 * keys.
 *
 * @param {string}   stringId - The string ID to translate.
 *
 * @param {object}   [data] - Provided input data.
 *
 * @returns {string} The translated and formatted string
 */


function localize(stringId, data) {
  const result = typeof data !== 'object' ? game.i18n.localize(stringId) : game.i18n.format(stringId, data);
  return result !== void 0 ? result : '';
}

/* src\component\core\TJSContainer.svelte generated by Svelte v3.46.0 */

function add_css$4(target) {
  append_styles(target, "svelte-1s361pr", "p.svelte-1s361pr{color:red;font-size:18px}");
}

function get_each_context$2$1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[2] = list[i];
  return child_ctx;
} // (12:15) 


function create_if_block_1$3$1(ctx) {
  let p;
  return {
    c() {
      p = element("p");
      p.textContent = "Container warning: No children.";
      attr(p, "class", "svelte-1s361pr");
    },

    m(target, anchor) {
      insert(target, p, anchor);
    },

    p: noop,
    i: noop,
    o: noop,

    d(detaching) {
      if (detaching) detach(p);
    }

  };
} // (8:0) {#if Array.isArray(children)}


function create_if_block$5$1(ctx) {
  let each_1_anchor;
  let current;
  let each_value =
  /*children*/
  ctx[1];
  let each_blocks = [];

  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$2$1(get_each_context$2$1(ctx, each_value, i));
  }

  const out = i => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });

  return {
    c() {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }

      each_1_anchor = empty();
    },

    m(target, anchor) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(target, anchor);
      }

      insert(target, each_1_anchor, anchor);
      current = true;
    },

    p(ctx, dirty) {
      if (dirty &
      /*children*/
      2) {
        each_value =
        /*children*/
        ctx[1];
        let i;

        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$2$1(ctx, each_value, i);

          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block$2$1(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
          }
        }

        group_outros();

        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }

        check_outros();
      }
    },

    i(local) {
      if (current) return;

      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }

      current = true;
    },

    o(local) {
      each_blocks = each_blocks.filter(Boolean);

      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }

      current = false;
    },

    d(detaching) {
      destroy_each(each_blocks, detaching);
      if (detaching) detach(each_1_anchor);
    }

  };
} // (9:4) {#each children as child}


function create_each_block$2$1(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [
  /*child*/
  ctx[2].props];
  var switch_value =
  /*child*/
  ctx[2].class;

  function switch_props(ctx) {
    let switch_instance_props = {};

    for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
      switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    }

    return {
      props: switch_instance_props
    };
  }

  if (switch_value) {
    switch_instance = new switch_value(switch_props());
  }

  return {
    c() {
      if (switch_instance) create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },

    m(target, anchor) {
      if (switch_instance) {
        mount_component(switch_instance, target, anchor);
      }

      insert(target, switch_instance_anchor, anchor);
      current = true;
    },

    p(ctx, dirty) {
      const switch_instance_changes = dirty &
      /*children*/
      2 ? get_spread_update(switch_instance_spread_levels, [get_spread_object(
      /*child*/
      ctx[2].props)]) : {};

      if (switch_value !== (switch_value =
      /*child*/
      ctx[2].class)) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }

        if (switch_value) {
          switch_instance = new switch_value(switch_props());
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        switch_instance.$set(switch_instance_changes);
      }
    },

    i(local) {
      if (current) return;
      if (switch_instance) transition_in(switch_instance.$$.fragment, local);
      current = true;
    },

    o(local) {
      if (switch_instance) transition_out(switch_instance.$$.fragment, local);
      current = false;
    },

    d(detaching) {
      if (detaching) detach(switch_instance_anchor);
      if (switch_instance) destroy_component(switch_instance, detaching);
    }

  };
}

function create_fragment$a(ctx) {
  let show_if;
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block$5$1, create_if_block_1$3$1];
  const if_blocks = [];

  function select_block_type(ctx, dirty) {
    if (dirty &
    /*children*/
    2) show_if = null;
    if (show_if == null) show_if = !!Array.isArray(
    /*children*/
    ctx[1]);
    if (show_if) return 0;
    if (
    /*warn*/
    ctx[0]) return 1;
    return -1;
  }

  if (~(current_block_type_index = select_block_type(ctx, -1))) {
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  }

  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },

    m(target, anchor) {
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].m(target, anchor);
      }

      insert(target, if_block_anchor, anchor);
      current = true;
    },

    p(ctx, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx, dirty);

      if (current_block_type_index === previous_block_index) {
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].p(ctx, dirty);
        }
      } else {
        if (if_block) {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
        }

        if (~current_block_type_index) {
          if_block = if_blocks[current_block_type_index];

          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
            if_block.c();
          } else {
            if_block.p(ctx, dirty);
          }

          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        } else {
          if_block = null;
        }
      }
    },

    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },

    o(local) {
      transition_out(if_block);
      current = false;
    },

    d(detaching) {
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].d(detaching);
      }

      if (detaching) detach(if_block_anchor);
    }

  };
}

function instance$a($$self, $$props, $$invalidate) {
  let {
    warn = false
  } = $$props;
  let {
    children = void 0
  } = $$props;

  $$self.$$set = $$props => {
    if ('warn' in $$props) $$invalidate(0, warn = $$props.warn);
    if ('children' in $$props) $$invalidate(1, children = $$props.children);
  };

  return [warn, children];
}

class TJSContainer extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$a, create_fragment$a, safe_not_equal, {
      warn: 0,
      children: 1
    }, add_css$4);
  }

  get warn() {
    return this.$$.ctx[0];
  }

  set warn(warn) {
    this.$$set({
      warn
    });
    flush();
  }

  get children() {
    return this.$$.ctx[1];
  }

  set children(children) {
    this.$$set({
      children
    });
    flush();
  }

}
/* src\component\core\TJSGlassPane.svelte generated by Svelte v3.46.0 */


function add_css$3(target) {
  append_styles(target, "svelte-71db55", ".tjs-glass-pane.svelte-71db55{position:absolute;overflow:inherit}");
}

function create_fragment$8$1(ctx) {
  let div;
  let div_intro;
  let div_outro;
  let current;
  let mounted;
  let dispose;
  const default_slot_template =
  /*#slots*/
  ctx[17].default;
  const default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[16], null);
  return {
    c() {
      div = element("div");
      if (default_slot) default_slot.c();
      attr(div, "id",
      /*id*/
      ctx[4]);
      attr(div, "tabindex", "0");
      attr(div, "class", "tjs-glass-pane svelte-71db55");
    },

    m(target, anchor) {
      insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }
      /*div_binding*/


      ctx[18](div);
      current = true;

      if (!mounted) {
        dispose = listen(div, "keydown",
        /*swallow*/
        ctx[6]);
        mounted = true;
      }
    },

    p(new_ctx, [dirty]) {
      ctx = new_ctx;

      if (default_slot) {
        if (default_slot.p && (!current || dirty &
        /*$$scope*/
        65536)) {
          update_slot_base(default_slot, default_slot_template, ctx,
          /*$$scope*/
          ctx[16], !current ? get_all_dirty_from_scope(
          /*$$scope*/
          ctx[16]) : get_slot_changes(default_slot_template,
          /*$$scope*/
          ctx[16], dirty, null), null);
        }
      }

      if (!current || dirty &
      /*id*/
      16) {
        attr(div, "id",
        /*id*/
        ctx[4]);
      }
    },

    i(local) {
      if (current) return;
      transition_in(default_slot, local);
      add_render_callback(() => {
        if (div_outro) div_outro.end(1);
        div_intro = create_in_transition(div,
        /*inTransition*/
        ctx[0],
        /*inTransitionOptions*/
        ctx[2]);
        div_intro.start();
      });
      current = true;
    },

    o(local) {
      transition_out(default_slot, local);
      if (div_intro) div_intro.invalidate();
      div_outro = create_out_transition(div,
      /*outTransition*/
      ctx[1],
      /*outTransitionOptions*/
      ctx[3]);
      current = false;
    },

    d(detaching) {
      if (detaching) detach(div);
      if (default_slot) default_slot.d(detaching);
      /*div_binding*/

      ctx[18](null);
      if (detaching && div_outro) div_outro.end();
      mounted = false;
      dispose();
    }

  };
}

function instance$8$1($$self, $$props, $$invalidate) {
  let {
    $$slots: slots = {},
    $$scope
  } = $$props;
  let {
    id = void 0
  } = $$props;
  let {
    zIndex = Number.MAX_SAFE_INTEGER
  } = $$props;
  let {
    background = '#50505080'
  } = $$props;
  let {
    captureInput = true
  } = $$props;
  let {
    preventDefault = true
  } = $$props;
  let {
    stopPropagation = true
  } = $$props;
  let glassPane;
  let {
    transition = void 0
  } = $$props;
  let {
    inTransition = s_DEFAULT_TRANSITION
  } = $$props;
  let {
    outTransition = s_DEFAULT_TRANSITION
  } = $$props;
  let {
    transitionOptions = void 0
  } = $$props;
  let {
    inTransitionOptions = s_DEFAULT_TRANSITION_OPTIONS
  } = $$props;
  let {
    outTransitionOptions = s_DEFAULT_TRANSITION_OPTIONS
  } = $$props; // Tracks last transition state.

  let oldTransition = void 0;
  let oldTransitionOptions = void 0; // ---------------------------------------------------------------------------------------------------------------

  function swallow(event) {
    if (captureInput) {
      if (preventDefault) {
        event.preventDefault();
      }

      if (stopPropagation) {
        event.stopPropagation();
      }
    }
  }

  function div_binding($$value) {
    binding_callbacks[$$value ? 'unshift' : 'push'](() => {
      glassPane = $$value;
      (($$invalidate(5, glassPane), $$invalidate(9, captureInput)), $$invalidate(8, background)), $$invalidate(7, zIndex);
    });
  }

  $$self.$$set = $$props => {
    if ('id' in $$props) $$invalidate(4, id = $$props.id);
    if ('zIndex' in $$props) $$invalidate(7, zIndex = $$props.zIndex);
    if ('background' in $$props) $$invalidate(8, background = $$props.background);
    if ('captureInput' in $$props) $$invalidate(9, captureInput = $$props.captureInput);
    if ('preventDefault' in $$props) $$invalidate(10, preventDefault = $$props.preventDefault);
    if ('stopPropagation' in $$props) $$invalidate(11, stopPropagation = $$props.stopPropagation);
    if ('transition' in $$props) $$invalidate(12, transition = $$props.transition);
    if ('inTransition' in $$props) $$invalidate(0, inTransition = $$props.inTransition);
    if ('outTransition' in $$props) $$invalidate(1, outTransition = $$props.outTransition);
    if ('transitionOptions' in $$props) $$invalidate(13, transitionOptions = $$props.transitionOptions);
    if ('inTransitionOptions' in $$props) $$invalidate(2, inTransitionOptions = $$props.inTransitionOptions);
    if ('outTransitionOptions' in $$props) $$invalidate(3, outTransitionOptions = $$props.outTransitionOptions);
    if ('$$scope' in $$props) $$invalidate(16, $$scope = $$props.$$scope);
  };

  $$self.$$.update = () => {
    if ($$self.$$.dirty &
    /*glassPane*/
    32) {
      if (glassPane) {
        $$invalidate(5, glassPane.style.maxWidth = '100%', glassPane);
        $$invalidate(5, glassPane.style.maxHeight = '100%', glassPane);
        $$invalidate(5, glassPane.style.width = '100%', glassPane);
        $$invalidate(5, glassPane.style.height = '100%', glassPane);
      }
    }

    if ($$self.$$.dirty &
    /*glassPane, captureInput*/
    544) {
      if (glassPane) {
        if (captureInput) {
          glassPane.focus();
        }

        $$invalidate(5, glassPane.style.pointerEvents = captureInput ? 'auto' : 'none', glassPane);
      }
    }

    if ($$self.$$.dirty &
    /*glassPane, background*/
    288) {
      if (glassPane) {
        $$invalidate(5, glassPane.style.background = background, glassPane);
      }
    }

    if ($$self.$$.dirty &
    /*glassPane, zIndex*/
    160) {
      if (glassPane) {
        $$invalidate(5, glassPane.style.zIndex = zIndex, glassPane);
      }
    }

    if ($$self.$$.dirty &
    /*oldTransition, transition*/
    20480) {
      // Run this reactive block when the last transition state is not equal to the current state.
      if (oldTransition !== transition) {
        // If transition is defined and not the default transition then set it to both in and out transition otherwise
        // set the default transition to both in & out transitions.
        const newTransition = s_DEFAULT_TRANSITION !== transition && typeof transition === 'function' ? transition : s_DEFAULT_TRANSITION;
        $$invalidate(0, inTransition = newTransition);
        $$invalidate(1, outTransition = newTransition);
        $$invalidate(14, oldTransition = newTransition);
      }
    }

    if ($$self.$$.dirty &
    /*oldTransitionOptions, transitionOptions*/
    40960) {
      // Run this reactive block when the last transition options state is not equal to the current options state.
      if (oldTransitionOptions !== transitionOptions) {
        const newOptions = transitionOptions !== s_DEFAULT_TRANSITION_OPTIONS && typeof transitionOptions === 'object' ? transitionOptions : s_DEFAULT_TRANSITION_OPTIONS;
        $$invalidate(2, inTransitionOptions = newOptions);
        $$invalidate(3, outTransitionOptions = newOptions);
        $$invalidate(15, oldTransitionOptions = newOptions);
      }
    }

    if ($$self.$$.dirty &
    /*inTransition*/
    1) {
      // Handle cases if inTransition is unset; assign noop default transition function.
      if (typeof inTransition !== 'function') {
        $$invalidate(0, inTransition = s_DEFAULT_TRANSITION);
      }
    }

    if ($$self.$$.dirty &
    /*outTransition*/
    2) {
      // Handle cases if outTransition is unset; assign noop default transition function.
      if (typeof outTransition !== 'function') {
        $$invalidate(1, outTransition = s_DEFAULT_TRANSITION);
      }
    }

    if ($$self.$$.dirty &
    /*inTransitionOptions*/
    4) {
      // Handle cases if inTransitionOptions is unset; assign empty default transition options.
      if (typeof inTransitionOptions !== 'object') {
        $$invalidate(2, inTransitionOptions = s_DEFAULT_TRANSITION_OPTIONS);
      }
    }

    if ($$self.$$.dirty &
    /*outTransitionOptions*/
    8) {
      // Handle cases if outTransitionOptions is unset; assign empty default transition options.
      if (typeof outTransitionOptions !== 'object') {
        $$invalidate(3, outTransitionOptions = s_DEFAULT_TRANSITION_OPTIONS);
      }
    }
  };

  return [inTransition, outTransition, inTransitionOptions, outTransitionOptions, id, glassPane, swallow, zIndex, background, captureInput, preventDefault, stopPropagation, transition, transitionOptions, oldTransition, oldTransitionOptions, $$scope, slots, div_binding];
}

class TJSGlassPane extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$8$1, create_fragment$8$1, safe_not_equal, {
      id: 4,
      zIndex: 7,
      background: 8,
      captureInput: 9,
      preventDefault: 10,
      stopPropagation: 11,
      transition: 12,
      inTransition: 0,
      outTransition: 1,
      transitionOptions: 13,
      inTransitionOptions: 2,
      outTransitionOptions: 3
    }, add_css$3);
  }

  get id() {
    return this.$$.ctx[4];
  }

  set id(id) {
    this.$$set({
      id
    });
    flush();
  }

  get zIndex() {
    return this.$$.ctx[7];
  }

  set zIndex(zIndex) {
    this.$$set({
      zIndex
    });
    flush();
  }

  get background() {
    return this.$$.ctx[8];
  }

  set background(background) {
    this.$$set({
      background
    });
    flush();
  }

  get captureInput() {
    return this.$$.ctx[9];
  }

  set captureInput(captureInput) {
    this.$$set({
      captureInput
    });
    flush();
  }

  get preventDefault() {
    return this.$$.ctx[10];
  }

  set preventDefault(preventDefault) {
    this.$$set({
      preventDefault
    });
    flush();
  }

  get stopPropagation() {
    return this.$$.ctx[11];
  }

  set stopPropagation(stopPropagation) {
    this.$$set({
      stopPropagation
    });
    flush();
  }

  get transition() {
    return this.$$.ctx[12];
  }

  set transition(transition) {
    this.$$set({
      transition
    });
    flush();
  }

  get inTransition() {
    return this.$$.ctx[0];
  }

  set inTransition(inTransition) {
    this.$$set({
      inTransition
    });
    flush();
  }

  get outTransition() {
    return this.$$.ctx[1];
  }

  set outTransition(outTransition) {
    this.$$set({
      outTransition
    });
    flush();
  }

  get transitionOptions() {
    return this.$$.ctx[13];
  }

  set transitionOptions(transitionOptions) {
    this.$$set({
      transitionOptions
    });
    flush();
  }

  get inTransitionOptions() {
    return this.$$.ctx[2];
  }

  set inTransitionOptions(inTransitionOptions) {
    this.$$set({
      inTransitionOptions
    });
    flush();
  }

  get outTransitionOptions() {
    return this.$$.ctx[3];
  }

  set outTransitionOptions(outTransitionOptions) {
    this.$$set({
      outTransitionOptions
    });
    flush();
  }

}
/* src\component\core\application\TJSHeaderButton.svelte generated by Svelte v3.46.0 */


function create_fragment$7$1(ctx) {
  let a;
  let html_tag;
  let t;
  let a_class_value;
  let applyStyles_action;
  let mounted;
  let dispose;
  return {
    c() {
      a = element("a");
      html_tag = new HtmlTag();
      t = text(
      /*label*/
      ctx[2]);
      html_tag.a = t;
      attr(a, "class", a_class_value = "header-button " +
      /*button*/
      ctx[0].class);
    },

    m(target, anchor) {
      insert(target, a, anchor);
      html_tag.m(
      /*icon*/
      ctx[1], a);
      append(a, t);

      if (!mounted) {
        dispose = [listen(a, "click", stop_propagation(prevent_default(
        /*onClick*/
        ctx[4]))), listen(a, "pointerdown", stop_propagation(prevent_default(pointerdown_handler))), listen(a, "dblclick", stop_propagation(prevent_default(dblclick_handler))), action_destroyer(applyStyles_action = applyStyles.call(null, a,
        /*styles*/
        ctx[3]))];
        mounted = true;
      }
    },

    p(ctx, [dirty]) {
      if (dirty &
      /*icon*/
      2) html_tag.p(
      /*icon*/
      ctx[1]);
      if (dirty &
      /*label*/
      4) set_data(t,
      /*label*/
      ctx[2]);

      if (dirty &
      /*button*/
      1 && a_class_value !== (a_class_value = "header-button " +
      /*button*/
      ctx[0].class)) {
        attr(a, "class", a_class_value);
      }

      if (applyStyles_action && is_function(applyStyles_action.update) && dirty &
      /*styles*/
      8) applyStyles_action.update.call(null,
      /*styles*/
      ctx[3]);
    },

    i: noop,
    o: noop,

    d(detaching) {
      if (detaching) detach(a);
      mounted = false;
      run_all(dispose);
    }

  };
}

const s_REGEX_HTML$1 = /^\s*<.*>$/;

const pointerdown_handler = () => null;

const dblclick_handler = () => null;

function instance$7$1($$self, $$props, $$invalidate) {
  let {
    button
  } = $$props;
  let icon, label, title, styles;

  function onClick() {
    var _button$callback;

    // Accept either callback or onclick as the function / data to invoke.
    const invoke = (_button$callback = button.callback) !== null && _button$callback !== void 0 ? _button$callback : button.onclick;

    if (typeof invoke === 'function') {
      invoke.call(button);
      $$invalidate(0, button); // This provides a reactive update if button data changes.
    }
  }

  $$self.$$set = $$props => {
    if ('button' in $$props) $$invalidate(0, button = $$props.button);
  };

  $$self.$$.update = () => {
    if ($$self.$$.dirty &
    /*button, title*/
    33) {
      if (button) {
        $$invalidate(5, title = typeof button.title === 'string' ? localize(button.title) : ''); // Handle icon and treat bare strings as the icon class; otherwise assume the icon is fully formed HTML.

        $$invalidate(1, icon = typeof button.icon !== 'string' ? void 0 : s_REGEX_HTML$1.test(button.icon) ? button.icon : `<i class="${button.icon}" title="${title}"></i>`);
        $$invalidate(2, label = typeof button.label === 'string' ? localize(button.label) : '');
        $$invalidate(3, styles = typeof button.styles === 'object' ? button.styles : void 0);
      }
    }
  };

  return [button, icon, label, styles, onClick, title];
}

class TJSHeaderButton extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$7$1, create_fragment$7$1, safe_not_equal, {
      button: 0
    });
  }

  get button() {
    return this.$$.ctx[0];
  }

  set button(button) {
    this.$$set({
      button
    });
    flush();
  }

}
/* src\component\core\application\TJSApplicationHeader.svelte generated by Svelte v3.46.0 */


function get_each_context$1$1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[17] = list[i];
  return child_ctx;
} // (63:4) {#each buttons as button}


function create_each_block$1$1(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [
  /*button*/
  ctx[17].props];
  var switch_value =
  /*button*/
  ctx[17].class;

  function switch_props(ctx) {
    let switch_instance_props = {};

    for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
      switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    }

    return {
      props: switch_instance_props
    };
  }

  if (switch_value) {
    switch_instance = new switch_value(switch_props());
  }

  return {
    c() {
      if (switch_instance) create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },

    m(target, anchor) {
      if (switch_instance) {
        mount_component(switch_instance, target, anchor);
      }

      insert(target, switch_instance_anchor, anchor);
      current = true;
    },

    p(ctx, dirty) {
      const switch_instance_changes = dirty &
      /*buttons*/
      2 ? get_spread_update(switch_instance_spread_levels, [get_spread_object(
      /*button*/
      ctx[17].props)]) : {};

      if (switch_value !== (switch_value =
      /*button*/
      ctx[17].class)) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }

        if (switch_value) {
          switch_instance = new switch_value(switch_props());
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        switch_instance.$set(switch_instance_changes);
      }
    },

    i(local) {
      if (current) return;
      if (switch_instance) transition_in(switch_instance.$$.fragment, local);
      current = true;
    },

    o(local) {
      if (switch_instance) transition_out(switch_instance.$$.fragment, local);
      current = false;
    },

    d(detaching) {
      if (detaching) detach(switch_instance_anchor);
      if (switch_instance) destroy_component(switch_instance, detaching);
    }

  };
}

function create_fragment$6$1(ctx) {
  let header;
  let h4;
  let t0_value = localize(
  /*$storeTitle*/
  ctx[4]) + "";
  let t0;
  let t1;
  let draggable_action;
  let minimizable_action;
  let current;
  let mounted;
  let dispose;
  let each_value =
  /*buttons*/
  ctx[1];
  let each_blocks = [];

  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$1$1(get_each_context$1$1(ctx, each_value, i));
  }

  const out = i => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });

  return {
    c() {
      header = element("header");
      h4 = element("h4");
      t0 = text(t0_value);
      t1 = space();

      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }

      attr(h4, "class", "window-title");
      set_style(h4, "display",
      /*displayHeaderTitle*/
      ctx[0], false);
      attr(header, "class", "window-header flexrow");
    },

    m(target, anchor) {
      insert(target, header, anchor);
      append(header, h4);
      append(h4, t0);
      append(header, t1);

      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(header, null);
      }

      current = true;

      if (!mounted) {
        dispose = [action_destroyer(draggable_action = draggable.call(null, header, {
          position:
          /*application*/
          ctx[5].position,
          active:
          /*$storeDraggable*/
          ctx[2],
          storeDragging:
          /*storeDragging*/
          ctx[8]
        })), action_destroyer(minimizable_action =
        /*minimizable*/
        ctx[13].call(null, header,
        /*$storeMinimizable*/
        ctx[3]))];
        mounted = true;
      }
    },

    p(ctx, [dirty]) {
      if ((!current || dirty &
      /*$storeTitle*/
      16) && t0_value !== (t0_value = localize(
      /*$storeTitle*/
      ctx[4]) + "")) set_data(t0, t0_value);

      if (dirty &
      /*displayHeaderTitle*/
      1) {
        set_style(h4, "display",
        /*displayHeaderTitle*/
        ctx[0], false);
      }

      if (dirty &
      /*buttons*/
      2) {
        each_value =
        /*buttons*/
        ctx[1];
        let i;

        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$1$1(ctx, each_value, i);

          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block$1$1(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(header, null);
          }
        }

        group_outros();

        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }

        check_outros();
      }

      if (draggable_action && is_function(draggable_action.update) && dirty &
      /*$storeDraggable*/
      4) draggable_action.update.call(null, {
        position:
        /*application*/
        ctx[5].position,
        active:
        /*$storeDraggable*/
        ctx[2],
        storeDragging:
        /*storeDragging*/
        ctx[8]
      });
      if (minimizable_action && is_function(minimizable_action.update) && dirty &
      /*$storeMinimizable*/
      8) minimizable_action.update.call(null,
      /*$storeMinimizable*/
      ctx[3]);
    },

    i(local) {
      if (current) return;

      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }

      current = true;
    },

    o(local) {
      each_blocks = each_blocks.filter(Boolean);

      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }

      current = false;
    },

    d(detaching) {
      if (detaching) detach(header);
      destroy_each(each_blocks, detaching);
      mounted = false;
      run_all(dispose);
    }

  };
}

function instance$6$1($$self, $$props, $$invalidate) {
  let $storeHeaderButtons;
  let $storeMinimized;
  let $storeHeaderNoTitleMinimized;
  let $storeDraggable;
  let $storeMinimizable;
  let $storeTitle;
  const application = getContext('external').application;
  const storeTitle = application.reactive.storeAppOptions.title;
  component_subscribe($$self, storeTitle, value => $$invalidate(4, $storeTitle = value));
  const storeDraggable = application.reactive.storeAppOptions.draggable;
  component_subscribe($$self, storeDraggable, value => $$invalidate(2, $storeDraggable = value));
  const storeDragging = application.reactive.storeUIState.dragging;
  const storeHeaderButtons = application.reactive.storeUIState.headerButtons;
  component_subscribe($$self, storeHeaderButtons, value => $$invalidate(14, $storeHeaderButtons = value));
  const storeHeaderNoTitleMinimized = application.reactive.storeAppOptions.headerNoTitleMinimized;
  component_subscribe($$self, storeHeaderNoTitleMinimized, value => $$invalidate(16, $storeHeaderNoTitleMinimized = value));
  const storeMinimizable = application.reactive.storeAppOptions.minimizable;
  component_subscribe($$self, storeMinimizable, value => $$invalidate(3, $storeMinimizable = value));
  const storeMinimized = application.reactive.storeUIState.minimized;
  component_subscribe($$self, storeMinimized, value => $$invalidate(15, $storeMinimized = value));
  let displayHeaderTitle;
  let buttons;

  function minimizable(node, booleanStore) {
    const callback = application._onToggleMinimize.bind(application);

    function activateListeners() {
      node.addEventListener('dblclick', callback);
    }

    function removeListeners() {
      node.removeEventListener('dblclick', callback);
    }

    if (booleanStore) {
      activateListeners();
    }

    return {
      update: booleanStore => // eslint-disable-line no-shadow
      {
        if (booleanStore) {
          activateListeners();
        } else {
          removeListeners();
        }
      },
      destroy: () => removeListeners()
    };
  }

  $$self.$$.update = () => {
    if ($$self.$$.dirty &
    /*$storeHeaderNoTitleMinimized, $storeMinimized*/
    98304) {
      $$invalidate(0, displayHeaderTitle = $storeHeaderNoTitleMinimized && $storeMinimized ? 'none' : null);
    }

    if ($$self.$$.dirty &
    /*$storeHeaderButtons*/
    16384) {
      {
        $$invalidate(1, buttons = $storeHeaderButtons.reduce((array, button) => {
          // If the button is a SvelteComponent set it as the class otherwise use `TJSHeaderButton` w/ button as props.
          array.push(isSvelteComponent(button) ? {
            class: button,
            props: {}
          } : {
            class: TJSHeaderButton,
            props: {
              button
            }
          });
          return array;
        }, []));
      }
    }
  };

  return [displayHeaderTitle, buttons, $storeDraggable, $storeMinimizable, $storeTitle, application, storeTitle, storeDraggable, storeDragging, storeHeaderButtons, storeHeaderNoTitleMinimized, storeMinimizable, storeMinimized, minimizable, $storeHeaderButtons, $storeMinimized, $storeHeaderNoTitleMinimized];
}

class TJSApplicationHeader extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$6$1, create_fragment$6$1, safe_not_equal, {});
  }

}
/**
 * Awaits `requestAnimationFrame` calls by the counter specified. This allows asynchronous applications for direct /
 * inline style modification amongst other direct animation techniques.
 *
 * @param {number}   [cntr=1] - A positive integer greater than 0 for amount of requestAnimationFrames to wait.
 *
 * @returns {Promise<number>} Returns current time equivalent to `performance.now()`.
 */


async function nextAnimationFrame(cntr = 1) {
  if (!Number.isInteger(cntr) || cntr < 1) {
    throw new TypeError(`nextAnimationFrame error: 'cntr' must be a positive integer greater than 0.`);
  }

  let currentTime = performance.now();

  for (; --cntr >= 0;) {
    currentTime = await new Promise(resolve => requestAnimationFrame(resolve));
  }

  return currentTime;
}
/* src\component\core\application\ResizableHandle.svelte generated by Svelte v3.46.0 */


function create_fragment$5$1(ctx) {
  let div;
  let resizable_action;
  let mounted;
  let dispose;
  return {
    c() {
      div = element("div");
      div.innerHTML = `<i class="fas fa-arrows-alt-h"></i>`;
      attr(div, "class", "window-resizable-handle");
    },

    m(target, anchor) {
      insert(target, div, anchor);
      /*div_binding*/

      ctx[10](div);

      if (!mounted) {
        dispose = action_destroyer(resizable_action =
        /*resizable*/
        ctx[6].call(null, div, {
          active:
          /*$storeResizable*/
          ctx[1],
          storeResizing:
          /*storeResizing*/
          ctx[5]
        }));
        mounted = true;
      }
    },

    p(ctx, [dirty]) {
      if (resizable_action && is_function(resizable_action.update) && dirty &
      /*$storeResizable*/
      2) resizable_action.update.call(null, {
        active:
        /*$storeResizable*/
        ctx[1],
        storeResizing:
        /*storeResizing*/
        ctx[5]
      });
    },

    i: noop,
    o: noop,

    d(detaching) {
      if (detaching) detach(div);
      /*div_binding*/

      ctx[10](null);
      mounted = false;
      dispose();
    }

  };
}

function instance$5$1($$self, $$props, $$invalidate) {
  let $storeElementRoot;
  let $storeMinimized;
  let $storeResizable;
  let {
    isResizable = false
  } = $$props;
  const application = getContext('external').application; // Allows retrieval of the element root at runtime.

  const storeElementRoot = getContext('storeElementRoot');
  component_subscribe($$self, storeElementRoot, value => $$invalidate(8, $storeElementRoot = value));
  const storeResizable = application.reactive.storeAppOptions.resizable;
  component_subscribe($$self, storeResizable, value => $$invalidate(1, $storeResizable = value));
  const storeMinimized = application.reactive.storeUIState.minimized;
  component_subscribe($$self, storeMinimized, value => $$invalidate(9, $storeMinimized = value));
  const storeResizing = application.reactive.storeUIState.resizing;
  let elementResize;
  /**
  * Provides an action to handle resizing the application shell based on the resizable app option.
  *
  * @param {HTMLElement}       node - The node associated with the action.
  *
  * @param {object}            [opts] - Optional parameters.
  *
  * @param {boolean}           [opts.active=true] - A boolean value; attached to a readable store.
  *
  * @param {Writable<boolean>} [opts.storeResizing] - A writable store that tracks "resizing" state.
  *
  * @returns {{update: Function, destroy: Function}} The action lifecycle methods.
  */

  function resizable(node, {
    active = true,
    storeResizing = void 0
  } = {}) {
    /**
    * Duplicate the app / Positionable starting position to track differences.
    *
    * @type {object}
    */
    let position = null;
    /**
    * Stores the initial X / Y on drag down.
    *
    * @type {object}
    */

    let initialPosition = {};
    /**
    * Stores the current resizing state and gates the move pointer as the resizing store is not
    * set until the first pointer move.
    *
    * @type {boolean}
    */

    let resizing = false;
    /**
    * Remember event handlers associated with this action so they may be later unregistered.
    *
    * @type {Object}
    */

    const handlers = {
      resizeDown: ['pointerdown', e => onResizePointerDown(e), false],
      resizeMove: ['pointermove', e => onResizePointerMove(e), false],
      resizeUp: ['pointerup', e => onResizePointerUp(e), false]
    };
    /**
    * Activates listeners.
    */

    function activateListeners() {
      // Resize handlers
      node.addEventListener(...handlers.resizeDown);
      $$invalidate(7, isResizable = true);
      node.style.display = 'block';
    }
    /**
    * Removes listeners.
    */


    function removeListeners() {
      if (typeof (storeResizing === null || storeResizing === void 0 ? void 0 : storeResizing.set) === 'function') {
        storeResizing.set(false);
      } // Resize handlers


      node.removeEventListener(...handlers.resizeDown);
      node.removeEventListener(...handlers.resizeMove);
      node.removeEventListener(...handlers.resizeUp);
      node.style.display = 'none';
      $$invalidate(7, isResizable = false);
    } // On mount if resizable is true then activate listeners otherwise set element display to `none`.


    if (active) {
      activateListeners();
    } else {
      node.style.display = 'none';
    }
    /**
    * Handle the initial pointer down that activates resizing capture.
    */


    function onResizePointerDown(event) {
      event.preventDefault();
      resizing = false; // Record initial position

      position = application.position.get();

      if (position.height === 'auto') {
        position.height = $storeElementRoot.clientHeight;
      }

      if (position.width === 'auto') {
        position.width = $storeElementRoot.clientWidth;
      }

      initialPosition = {
        x: event.clientX,
        y: event.clientY
      }; // Add temporary handlers

      node.addEventListener(...handlers.resizeMove);
      node.addEventListener(...handlers.resizeUp);
      node.setPointerCapture(event.pointerId);
    }
    /**
    * Sets the width / height of the positionable application.
    */


    async function onResizePointerMove(event) {
      event.preventDefault();
      await nextAnimationFrame();

      if (!resizing && typeof (storeResizing === null || storeResizing === void 0 ? void 0 : storeResizing.set) === 'function') {
        resizing = true;
        storeResizing.set(true);
      }

      application.position.set({
        width: position.width + (event.clientX - initialPosition.x),
        height: position.height + (event.clientY - initialPosition.y)
      });
    }
    /**
    * Conclude the dragging behavior when the pointer is released setting the final position and
    * removing listeners.
    */


    function onResizePointerUp(event) {
      resizing = false;

      if (typeof (storeResizing === null || storeResizing === void 0 ? void 0 : storeResizing.set) === 'function') {
        storeResizing.set(false);
      }

      event.preventDefault();
      node.removeEventListener(...handlers.resizeMove);
      node.removeEventListener(...handlers.resizeUp);

      application._onResize(event);
    }

    return {
      update: ({
        active
      }) => // eslint-disable-line no-shadow
      {
        if (active) {
          activateListeners();
        } else {
          removeListeners();
        }
      },
      destroy: () => removeListeners()
    };
  }

  function div_binding($$value) {
    binding_callbacks[$$value ? 'unshift' : 'push'](() => {
      elementResize = $$value;
      (($$invalidate(0, elementResize), $$invalidate(7, isResizable)), $$invalidate(9, $storeMinimized)), $$invalidate(8, $storeElementRoot);
    });
  }

  $$self.$$set = $$props => {
    if ('isResizable' in $$props) $$invalidate(7, isResizable = $$props.isResizable);
  };

  $$self.$$.update = () => {
    if ($$self.$$.dirty &
    /*elementResize, isResizable, $storeMinimized, $storeElementRoot*/
    897) {
      if (elementResize) {
        // Instead of creating a derived store it is easier to use isResizable and the minimized store below.
        $$invalidate(0, elementResize.style.display = isResizable && !$storeMinimized ? 'block' : 'none', elementResize); // Add / remove `resizable` class from element root.

        const elementRoot = $storeElementRoot;

        if (elementRoot) {
          elementRoot.classList[isResizable ? 'add' : 'remove']('resizable');
        }
      }
    }
  };

  return [elementResize, $storeResizable, storeElementRoot, storeResizable, storeMinimized, storeResizing, resizable, isResizable, $storeElementRoot, $storeMinimized, div_binding];
}

class ResizableHandle extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$5$1, create_fragment$5$1, safe_not_equal, {
      isResizable: 7
    });
  }

}
/* src\component\core\application\ApplicationShell.svelte generated by Svelte v3.46.0 */


function add_css$2(target) {
  append_styles(target, "svelte-3vt5in", ".window-app.svelte-3vt5in{overflow:inherit}");
} // (166:0) {:else}


function create_else_block_1$1$1(ctx) {
  let div;
  let tjsapplicationheader;
  let t0;
  let section;
  let current_block_type_index;
  let if_block;
  let applyStyles_action;
  let t1;
  let resizablehandle;
  let div_id_value;
  let div_class_value;
  let div_data_appid_value;
  let applyStyles_action_1;
  let div_intro;
  let div_outro;
  let current;
  let mounted;
  let dispose;
  tjsapplicationheader = new TJSApplicationHeader({});
  const if_block_creators = [create_if_block_2$2$1, create_else_block_2$1];
  const if_blocks = [];

  function select_block_type_2(ctx, dirty) {
    if (Array.isArray(
    /*allChildren*/
    ctx[12])) return 0;
    return 1;
  }

  current_block_type_index = select_block_type_2(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  resizablehandle = new ResizableHandle({});
  return {
    c() {
      div = element("div");
      create_component(tjsapplicationheader.$$.fragment);
      t0 = space();
      section = element("section");
      if_block.c();
      t1 = space();
      create_component(resizablehandle.$$.fragment);
      attr(section, "class", "window-content");
      attr(div, "id", div_id_value =
      /*application*/
      ctx[9].id);
      attr(div, "class", div_class_value = "app window-app " +
      /*application*/
      ctx[9].options.classes.join(' ') + " svelte-3vt5in");
      attr(div, "data-appid", div_data_appid_value =
      /*application*/
      ctx[9].appId);
    },

    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(tjsapplicationheader, div, null);
      append(div, t0);
      append(div, section);
      if_blocks[current_block_type_index].m(section, null);
      /*section_binding_1*/

      ctx[24](section);
      append(div, t1);
      mount_component(resizablehandle, div, null);
      /*div_binding_1*/

      ctx[25](div);
      current = true;

      if (!mounted) {
        dispose = [action_destroyer(applyStyles_action = applyStyles.call(null, section,
        /*stylesContent*/
        ctx[8])), listen(div, "pointerdown",
        /*bringToTop*/
        ctx[11], true), action_destroyer(applyStyles_action_1 = applyStyles.call(null, div,
        /*stylesApp*/
        ctx[7]))];
        mounted = true;
      }
    },

    p(new_ctx, dirty) {
      ctx = new_ctx;
      if_block.p(ctx, dirty);
      if (applyStyles_action && is_function(applyStyles_action.update) && dirty &
      /*stylesContent*/
      256) applyStyles_action.update.call(null,
      /*stylesContent*/
      ctx[8]);

      if (!current || dirty &
      /*application*/
      512 && div_id_value !== (div_id_value =
      /*application*/
      ctx[9].id)) {
        attr(div, "id", div_id_value);
      }

      if (!current || dirty &
      /*application*/
      512 && div_class_value !== (div_class_value = "app window-app " +
      /*application*/
      ctx[9].options.classes.join(' ') + " svelte-3vt5in")) {
        attr(div, "class", div_class_value);
      }

      if (!current || dirty &
      /*application*/
      512 && div_data_appid_value !== (div_data_appid_value =
      /*application*/
      ctx[9].appId)) {
        attr(div, "data-appid", div_data_appid_value);
      }

      if (applyStyles_action_1 && is_function(applyStyles_action_1.update) && dirty &
      /*stylesApp*/
      128) applyStyles_action_1.update.call(null,
      /*stylesApp*/
      ctx[7]);
    },

    i(local) {
      if (current) return;
      transition_in(tjsapplicationheader.$$.fragment, local);
      transition_in(if_block);
      transition_in(resizablehandle.$$.fragment, local);
      add_render_callback(() => {
        if (div_outro) div_outro.end(1);
        div_intro = create_in_transition(div,
        /*inTransition*/
        ctx[2],
        /*inTransitionOptions*/
        ctx[4]);
        div_intro.start();
      });
      current = true;
    },

    o(local) {
      transition_out(tjsapplicationheader.$$.fragment, local);
      transition_out(if_block);
      transition_out(resizablehandle.$$.fragment, local);
      if (div_intro) div_intro.invalidate();
      div_outro = create_out_transition(div,
      /*outTransition*/
      ctx[3],
      /*outTransitionOptions*/
      ctx[5]);
      current = false;
    },

    d(detaching) {
      if (detaching) detach(div);
      destroy_component(tjsapplicationheader);
      if_blocks[current_block_type_index].d();
      /*section_binding_1*/

      ctx[24](null);
      destroy_component(resizablehandle);
      /*div_binding_1*/

      ctx[25](null);
      if (detaching && div_outro) div_outro.end();
      mounted = false;
      run_all(dispose);
    }

  };
} // (143:0) {#if bindHeightChanged}


function create_if_block$4$1(ctx) {
  let div;
  let tjsapplicationheader;
  let t0;
  let section;
  let current_block_type_index;
  let if_block;
  let section_resize_listener;
  let applyStyles_action;
  let t1;
  let resizablehandle;
  let div_id_value;
  let div_class_value;
  let div_data_appid_value;
  let div_resize_listener;
  let applyStyles_action_1;
  let div_intro;
  let div_outro;
  let current;
  let mounted;
  let dispose;
  tjsapplicationheader = new TJSApplicationHeader({});
  const if_block_creators = [create_if_block_1$2$1, create_else_block$3];
  const if_blocks = [];

  function select_block_type_1(ctx, dirty) {
    if (Array.isArray(
    /*allChildren*/
    ctx[12])) return 0;
    return 1;
  }

  current_block_type_index = select_block_type_1(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  resizablehandle = new ResizableHandle({});
  return {
    c() {
      div = element("div");
      create_component(tjsapplicationheader.$$.fragment);
      t0 = space();
      section = element("section");
      if_block.c();
      t1 = space();
      create_component(resizablehandle.$$.fragment);
      attr(section, "class", "window-content");
      add_render_callback(() =>
      /*section_elementresize_handler*/
      ctx[21].call(section));
      attr(div, "id", div_id_value =
      /*application*/
      ctx[9].id);
      attr(div, "class", div_class_value = "app window-app " +
      /*application*/
      ctx[9].options.classes.join(' ') + " svelte-3vt5in");
      attr(div, "data-appid", div_data_appid_value =
      /*application*/
      ctx[9].appId);
      add_render_callback(() =>
      /*div_elementresize_handler*/
      ctx[22].call(div));
    },

    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(tjsapplicationheader, div, null);
      append(div, t0);
      append(div, section);
      if_blocks[current_block_type_index].m(section, null);
      /*section_binding*/

      ctx[20](section);
      section_resize_listener = add_resize_listener(section,
      /*section_elementresize_handler*/
      ctx[21].bind(section));
      append(div, t1);
      mount_component(resizablehandle, div, null);
      div_resize_listener = add_resize_listener(div,
      /*div_elementresize_handler*/
      ctx[22].bind(div));
      /*div_binding*/

      ctx[23](div);
      current = true;

      if (!mounted) {
        dispose = [action_destroyer(applyStyles_action = applyStyles.call(null, section,
        /*stylesContent*/
        ctx[8])), listen(div, "pointerdown",
        /*bringToTop*/
        ctx[11], true), action_destroyer(applyStyles_action_1 = applyStyles.call(null, div,
        /*stylesApp*/
        ctx[7]))];
        mounted = true;
      }
    },

    p(new_ctx, dirty) {
      ctx = new_ctx;
      if_block.p(ctx, dirty);
      if (applyStyles_action && is_function(applyStyles_action.update) && dirty &
      /*stylesContent*/
      256) applyStyles_action.update.call(null,
      /*stylesContent*/
      ctx[8]);

      if (!current || dirty &
      /*application*/
      512 && div_id_value !== (div_id_value =
      /*application*/
      ctx[9].id)) {
        attr(div, "id", div_id_value);
      }

      if (!current || dirty &
      /*application*/
      512 && div_class_value !== (div_class_value = "app window-app " +
      /*application*/
      ctx[9].options.classes.join(' ') + " svelte-3vt5in")) {
        attr(div, "class", div_class_value);
      }

      if (!current || dirty &
      /*application*/
      512 && div_data_appid_value !== (div_data_appid_value =
      /*application*/
      ctx[9].appId)) {
        attr(div, "data-appid", div_data_appid_value);
      }

      if (applyStyles_action_1 && is_function(applyStyles_action_1.update) && dirty &
      /*stylesApp*/
      128) applyStyles_action_1.update.call(null,
      /*stylesApp*/
      ctx[7]);
    },

    i(local) {
      if (current) return;
      transition_in(tjsapplicationheader.$$.fragment, local);
      transition_in(if_block);
      transition_in(resizablehandle.$$.fragment, local);
      add_render_callback(() => {
        if (div_outro) div_outro.end(1);
        div_intro = create_in_transition(div,
        /*inTransition*/
        ctx[2],
        /*inTransitionOptions*/
        ctx[4]);
        div_intro.start();
      });
      current = true;
    },

    o(local) {
      transition_out(tjsapplicationheader.$$.fragment, local);
      transition_out(if_block);
      transition_out(resizablehandle.$$.fragment, local);
      if (div_intro) div_intro.invalidate();
      div_outro = create_out_transition(div,
      /*outTransition*/
      ctx[3],
      /*outTransitionOptions*/
      ctx[5]);
      current = false;
    },

    d(detaching) {
      if (detaching) detach(div);
      destroy_component(tjsapplicationheader);
      if_blocks[current_block_type_index].d();
      /*section_binding*/

      ctx[20](null);
      section_resize_listener();
      destroy_component(resizablehandle);
      div_resize_listener();
      /*div_binding*/

      ctx[23](null);
      if (detaching && div_outro) div_outro.end();
      mounted = false;
      run_all(dispose);
    }

  };
} // (179:9) {:else}


function create_else_block_2$1(ctx) {
  let current;
  const default_slot_template =
  /*#slots*/
  ctx[19].default;
  const default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[18], null);
  return {
    c() {
      if (default_slot) default_slot.c();
    },

    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }

      current = true;
    },

    p(ctx, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty &
        /*$$scope*/
        262144)) {
          update_slot_base(default_slot, default_slot_template, ctx,
          /*$$scope*/
          ctx[18], !current ? get_all_dirty_from_scope(
          /*$$scope*/
          ctx[18]) : get_slot_changes(default_slot_template,
          /*$$scope*/
          ctx[18], dirty, null), null);
        }
      }
    },

    i(local) {
      if (current) return;
      transition_in(default_slot, local);
      current = true;
    },

    o(local) {
      transition_out(default_slot, local);
      current = false;
    },

    d(detaching) {
      if (default_slot) default_slot.d(detaching);
    }

  };
} // (177:9) {#if Array.isArray(allChildren)}


function create_if_block_2$2$1(ctx) {
  let tjscontainer;
  let current;
  tjscontainer = new TJSContainer({
    props: {
      children:
      /*allChildren*/
      ctx[12]
    }
  });
  return {
    c() {
      create_component(tjscontainer.$$.fragment);
    },

    m(target, anchor) {
      mount_component(tjscontainer, target, anchor);
      current = true;
    },

    p: noop,

    i(local) {
      if (current) return;
      transition_in(tjscontainer.$$.fragment, local);
      current = true;
    },

    o(local) {
      transition_out(tjscontainer.$$.fragment, local);
      current = false;
    },

    d(detaching) {
      destroy_component(tjscontainer, detaching);
    }

  };
} // (160:9) {:else}


function create_else_block$3(ctx) {
  let current;
  const default_slot_template =
  /*#slots*/
  ctx[19].default;
  const default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[18], null);
  return {
    c() {
      if (default_slot) default_slot.c();
    },

    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }

      current = true;
    },

    p(ctx, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty &
        /*$$scope*/
        262144)) {
          update_slot_base(default_slot, default_slot_template, ctx,
          /*$$scope*/
          ctx[18], !current ? get_all_dirty_from_scope(
          /*$$scope*/
          ctx[18]) : get_slot_changes(default_slot_template,
          /*$$scope*/
          ctx[18], dirty, null), null);
        }
      }
    },

    i(local) {
      if (current) return;
      transition_in(default_slot, local);
      current = true;
    },

    o(local) {
      transition_out(default_slot, local);
      current = false;
    },

    d(detaching) {
      if (default_slot) default_slot.d(detaching);
    }

  };
} // (158:9) {#if Array.isArray(allChildren)}


function create_if_block_1$2$1(ctx) {
  let tjscontainer;
  let current;
  tjscontainer = new TJSContainer({
    props: {
      children:
      /*allChildren*/
      ctx[12]
    }
  });
  return {
    c() {
      create_component(tjscontainer.$$.fragment);
    },

    m(target, anchor) {
      mount_component(tjscontainer, target, anchor);
      current = true;
    },

    p: noop,

    i(local) {
      if (current) return;
      transition_in(tjscontainer.$$.fragment, local);
      current = true;
    },

    o(local) {
      transition_out(tjscontainer.$$.fragment, local);
      current = false;
    },

    d(detaching) {
      destroy_component(tjscontainer, detaching);
    }

  };
}

function create_fragment$4$1(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block$4$1, create_else_block_1$1$1];
  const if_blocks = [];

  function select_block_type(ctx, dirty) {
    if (
    /*bindHeightChanged*/
    ctx[10]) return 0;
    return 1;
  }

  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },

    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },

    p(ctx, [dirty]) {
      if_block.p(ctx, dirty);
    },

    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },

    o(local) {
      transition_out(if_block);
      current = false;
    },

    d(detaching) {
      if_blocks[current_block_type_index].d(detaching);
      if (detaching) detach(if_block_anchor);
    }

  };
}

function instance$4$1($$self, $$props, $$invalidate) {
  let {
    $$slots: slots = {},
    $$scope
  } = $$props;
  let {
    elementContent
  } = $$props;
  let {
    elementRoot
  } = $$props;
  let {
    children = void 0
  } = $$props;
  let {
    heightChanged = false
  } = $$props;
  let {
    stylesApp
  } = $$props;
  let {
    stylesContent
  } = $$props; // Store the initial `heightChanged` state. If it is truthy then `clientHeight` for the content & root elements
  // are bound to `heightChanged` to signal to any parent component of any change to the client & root.

  const bindHeightChanged = !!heightChanged; // If the application is a popOut application then when clicked bring to top. Bound to on pointerdown.

  const bringToTop = () => {
    var _ui;

    if (typeof application.options.popOut === 'boolean' && application.options.popOut && application !== ((_ui = ui) === null || _ui === void 0 ? void 0 : _ui.activeWindow)) {
      application.bringToTop.call(application);
    }
  }; // Use a writable store to make `elementContent` and `elementRoot` accessible. A store is used in the case when
  // One root component with an `elementRoot` is replaced with another. Due to timing issues and the onDestroy / outro
  // transitions either of these may be set to null. I will investigate more and file a bug against Svelte.


  if (!getContext('storeElementContent')) {
    setContext('storeElementContent', writable(elementContent));
  }

  if (!getContext('storeElementRoot')) {
    setContext('storeElementRoot', writable(elementRoot));
  }

  const context = getContext('external'); // Store Foundry Application reference.

  const application = context.application; // This component can host multiple children defined via props or in the TyphonJS SvelteData configuration object
  // that are potentially mounted in the content area. If no children defined then this component mounts any slotted
  // child.

  const allChildren = Array.isArray(children) ? children : typeof context === 'object' ? context.children : void 0;
  let {
    transition = void 0
  } = $$props;
  let {
    inTransition = s_DEFAULT_TRANSITION
  } = $$props;
  let {
    outTransition = s_DEFAULT_TRANSITION
  } = $$props;
  let {
    transitionOptions = void 0
  } = $$props;
  let {
    inTransitionOptions = s_DEFAULT_TRANSITION_OPTIONS
  } = $$props;
  let {
    outTransitionOptions = s_DEFAULT_TRANSITION_OPTIONS
  } = $$props; // Tracks last transition state.

  let oldTransition = void 0;
  let oldTransitionOptions = void 0;

  function section_binding($$value) {
    binding_callbacks[$$value ? 'unshift' : 'push'](() => {
      elementContent = $$value;
      $$invalidate(0, elementContent);
    });
  }

  function section_elementresize_handler() {
    heightChanged = this.clientHeight;
    $$invalidate(6, heightChanged);
  }

  function div_elementresize_handler() {
    heightChanged = this.clientHeight;
    $$invalidate(6, heightChanged);
  }

  function div_binding($$value) {
    binding_callbacks[$$value ? 'unshift' : 'push'](() => {
      elementRoot = $$value;
      $$invalidate(1, elementRoot);
    });
  }

  function section_binding_1($$value) {
    binding_callbacks[$$value ? 'unshift' : 'push'](() => {
      elementContent = $$value;
      $$invalidate(0, elementContent);
    });
  }

  function div_binding_1($$value) {
    binding_callbacks[$$value ? 'unshift' : 'push'](() => {
      elementRoot = $$value;
      $$invalidate(1, elementRoot);
    });
  }

  $$self.$$set = $$props => {
    if ('elementContent' in $$props) $$invalidate(0, elementContent = $$props.elementContent);
    if ('elementRoot' in $$props) $$invalidate(1, elementRoot = $$props.elementRoot);
    if ('children' in $$props) $$invalidate(13, children = $$props.children);
    if ('heightChanged' in $$props) $$invalidate(6, heightChanged = $$props.heightChanged);
    if ('stylesApp' in $$props) $$invalidate(7, stylesApp = $$props.stylesApp);
    if ('stylesContent' in $$props) $$invalidate(8, stylesContent = $$props.stylesContent);
    if ('transition' in $$props) $$invalidate(14, transition = $$props.transition);
    if ('inTransition' in $$props) $$invalidate(2, inTransition = $$props.inTransition);
    if ('outTransition' in $$props) $$invalidate(3, outTransition = $$props.outTransition);
    if ('transitionOptions' in $$props) $$invalidate(15, transitionOptions = $$props.transitionOptions);
    if ('inTransitionOptions' in $$props) $$invalidate(4, inTransitionOptions = $$props.inTransitionOptions);
    if ('outTransitionOptions' in $$props) $$invalidate(5, outTransitionOptions = $$props.outTransitionOptions);
    if ('$$scope' in $$props) $$invalidate(18, $$scope = $$props.$$scope);
  };

  $$self.$$.update = () => {
    if ($$self.$$.dirty &
    /*elementContent*/
    1) {
      // Only update the `elementContent` store if the new `elementContent` is not null or undefined.
      if (elementContent !== void 0 && elementContent !== null) {
        getContext('storeElementContent').set(elementContent);
      }
    }

    if ($$self.$$.dirty &
    /*elementRoot*/
    2) {
      // Only update the `elementRoot` store if the new `elementRoot` is not null or undefined.
      if (elementRoot !== void 0 && elementRoot !== null) {
        getContext('storeElementRoot').set(elementRoot);
      }
    }

    if ($$self.$$.dirty &
    /*oldTransition, transition*/
    81920) {
      // Run this reactive block when the last transition state is not equal to the current state.
      if (oldTransition !== transition) {
        // If transition is defined and not the default transition then set it to both in and out transition otherwise
        // set the default transition to both in & out transitions.
        const newTransition = s_DEFAULT_TRANSITION !== transition && typeof transition === 'function' ? transition : s_DEFAULT_TRANSITION;
        $$invalidate(2, inTransition = newTransition);
        $$invalidate(3, outTransition = newTransition);
        $$invalidate(16, oldTransition = newTransition);
      }
    }

    if ($$self.$$.dirty &
    /*oldTransitionOptions, transitionOptions*/
    163840) {
      // Run this reactive block when the last transition options state is not equal to the current options state.
      if (oldTransitionOptions !== transitionOptions) {
        const newOptions = transitionOptions !== s_DEFAULT_TRANSITION_OPTIONS && typeof transitionOptions === 'object' ? transitionOptions : s_DEFAULT_TRANSITION_OPTIONS;
        $$invalidate(4, inTransitionOptions = newOptions);
        $$invalidate(5, outTransitionOptions = newOptions);
        $$invalidate(17, oldTransitionOptions = newOptions);
      }
    }

    if ($$self.$$.dirty &
    /*inTransition*/
    4) {
      // Handle cases if inTransition is unset; assign noop default transition function.
      if (typeof inTransition !== 'function') {
        $$invalidate(2, inTransition = s_DEFAULT_TRANSITION);
      }
    }

    if ($$self.$$.dirty &
    /*outTransition, application*/
    520) {
      {
        var _application$options;

        // Handle cases if outTransition is unset; assign noop default transition function.
        if (typeof outTransition !== 'function') {
          $$invalidate(3, outTransition = s_DEFAULT_TRANSITION);
        } // Set jquery close animation to either run or not when an out transition is changed.


        if (application && typeof (application === null || application === void 0 ? void 0 : (_application$options = application.options) === null || _application$options === void 0 ? void 0 : _application$options.defaultCloseAnimation) === 'boolean') {
          $$invalidate(9, application.options.defaultCloseAnimation = outTransition === s_DEFAULT_TRANSITION, application);
        }
      }
    }

    if ($$self.$$.dirty &
    /*inTransitionOptions*/
    16) {
      // Handle cases if inTransitionOptions is unset; assign empty default transition options.
      if (typeof inTransitionOptions !== 'object') {
        $$invalidate(4, inTransitionOptions = s_DEFAULT_TRANSITION_OPTIONS);
      }
    }

    if ($$self.$$.dirty &
    /*outTransitionOptions*/
    32) {
      // Handle cases if outTransitionOptions is unset; assign empty default transition options.
      if (typeof outTransitionOptions !== 'object') {
        $$invalidate(5, outTransitionOptions = s_DEFAULT_TRANSITION_OPTIONS);
      }
    }
  };

  return [elementContent, elementRoot, inTransition, outTransition, inTransitionOptions, outTransitionOptions, heightChanged, stylesApp, stylesContent, application, bindHeightChanged, bringToTop, allChildren, children, transition, transitionOptions, oldTransition, oldTransitionOptions, $$scope, slots, section_binding, section_elementresize_handler, div_elementresize_handler, div_binding, section_binding_1, div_binding_1];
}

class ApplicationShell extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$4$1, create_fragment$4$1, safe_not_equal, {
      elementContent: 0,
      elementRoot: 1,
      children: 13,
      heightChanged: 6,
      stylesApp: 7,
      stylesContent: 8,
      transition: 14,
      inTransition: 2,
      outTransition: 3,
      transitionOptions: 15,
      inTransitionOptions: 4,
      outTransitionOptions: 5
    }, add_css$2);
  }

  get elementContent() {
    return this.$$.ctx[0];
  }

  set elementContent(elementContent) {
    this.$$set({
      elementContent
    });
    flush();
  }

  get elementRoot() {
    return this.$$.ctx[1];
  }

  set elementRoot(elementRoot) {
    this.$$set({
      elementRoot
    });
    flush();
  }

  get children() {
    return this.$$.ctx[13];
  }

  set children(children) {
    this.$$set({
      children
    });
    flush();
  }

  get heightChanged() {
    return this.$$.ctx[6];
  }

  set heightChanged(heightChanged) {
    this.$$set({
      heightChanged
    });
    flush();
  }

  get stylesApp() {
    return this.$$.ctx[7];
  }

  set stylesApp(stylesApp) {
    this.$$set({
      stylesApp
    });
    flush();
  }

  get stylesContent() {
    return this.$$.ctx[8];
  }

  set stylesContent(stylesContent) {
    this.$$set({
      stylesContent
    });
    flush();
  }

  get transition() {
    return this.$$.ctx[14];
  }

  set transition(transition) {
    this.$$set({
      transition
    });
    flush();
  }

  get inTransition() {
    return this.$$.ctx[2];
  }

  set inTransition(inTransition) {
    this.$$set({
      inTransition
    });
    flush();
  }

  get outTransition() {
    return this.$$.ctx[3];
  }

  set outTransition(outTransition) {
    this.$$set({
      outTransition
    });
    flush();
  }

  get transitionOptions() {
    return this.$$.ctx[15];
  }

  set transitionOptions(transitionOptions) {
    this.$$set({
      transitionOptions
    });
    flush();
  }

  get inTransitionOptions() {
    return this.$$.ctx[4];
  }

  set inTransitionOptions(inTransitionOptions) {
    this.$$set({
      inTransitionOptions
    });
    flush();
  }

  get outTransitionOptions() {
    return this.$$.ctx[5];
  }

  set outTransitionOptions(outTransitionOptions) {
    this.$$set({
      outTransitionOptions
    });
    flush();
  }

}
/* src\component\core\dialog\DialogContent.svelte generated by Svelte v3.46.0 */


function add_css(target) {
  append_styles(target, "svelte-14xg9ru", "div.dialog-buttons.svelte-14xg9ru{padding-top:8px}");
}

function get_each_context$6(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[15] = list[i];
  return child_ctx;
} // (202:29) 


function create_if_block_3$3(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [
  /*dialogProps*/
  ctx[5]];
  var switch_value =
  /*dialogComponent*/
  ctx[4];

  function switch_props(ctx) {
    let switch_instance_props = {};

    for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
      switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    }

    return {
      props: switch_instance_props
    };
  }

  if (switch_value) {
    switch_instance = new switch_value(switch_props());
    /*switch_instance_binding*/

    ctx[12](switch_instance);
  }

  return {
    c() {
      if (switch_instance) create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },

    m(target, anchor) {
      if (switch_instance) {
        mount_component(switch_instance, target, anchor);
      }

      insert(target, switch_instance_anchor, anchor);
      current = true;
    },

    p(ctx, dirty) {
      const switch_instance_changes = dirty &
      /*dialogProps*/
      32 ? get_spread_update(switch_instance_spread_levels, [get_spread_object(
      /*dialogProps*/
      ctx[5])]) : {};

      if (switch_value !== (switch_value =
      /*dialogComponent*/
      ctx[4])) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }

        if (switch_value) {
          switch_instance = new switch_value(switch_props());
          /*switch_instance_binding*/

          ctx[12](switch_instance);
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        switch_instance.$set(switch_instance_changes);
      }
    },

    i(local) {
      if (current) return;
      if (switch_instance) transition_in(switch_instance.$$.fragment, local);
      current = true;
    },

    o(local) {
      if (switch_instance) transition_out(switch_instance.$$.fragment, local);
      current = false;
    },

    d(detaching) {
      /*switch_instance_binding*/
      ctx[12](null);
      if (detaching) detach(switch_instance_anchor);
      if (switch_instance) destroy_component(switch_instance, detaching);
    }

  };
} // (200:3) {#if typeof content === 'string'}


function create_if_block_2$4(ctx) {
  let html_tag;
  let html_anchor;
  return {
    c() {
      html_tag = new HtmlTag();
      html_anchor = empty();
      html_tag.a = html_anchor;
    },

    m(target, anchor) {
      html_tag.m(
      /*content*/
      ctx[2], target, anchor);
      insert(target, html_anchor, anchor);
    },

    p(ctx, dirty) {
      if (dirty &
      /*content*/
      4) html_tag.p(
      /*content*/
      ctx[2]);
    },

    i: noop,
    o: noop,

    d(detaching) {
      if (detaching) detach(html_anchor);
      if (detaching) html_tag.d();
    }

  };
} // (207:0) {#if buttons.length}


function create_if_block$1$1(ctx) {
  let div;
  let each_blocks = [];
  let each_1_lookup = new Map();
  let each_value =
  /*buttons*/
  ctx[1];

  const get_key = ctx =>
  /*button*/
  ctx[15].id;

  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context$6(ctx, each_value, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block$6(key, child_ctx));
  }

  return {
    c() {
      div = element("div");

      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }

      attr(div, "class", "dialog-buttons svelte-14xg9ru");
    },

    m(target, anchor) {
      insert(target, div, anchor);

      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(div, null);
      }
    },

    p(ctx, dirty) {
      if (dirty &
      /*buttons, currentButtonId, onClick*/
      74) {
        each_value =
        /*buttons*/
        ctx[1];
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, destroy_block, create_each_block$6, null, get_each_context$6);
      }
    },

    d(detaching) {
      if (detaching) detach(div);

      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
    }

  };
} // (214:33) {#if button.icon}


function create_if_block_1$5(ctx) {
  let html_tag;
  let raw_value =
  /*button*/
  ctx[15].icon + "";
  let html_anchor;
  return {
    c() {
      html_tag = new HtmlTag();
      html_anchor = empty();
      html_tag.a = html_anchor;
    },

    m(target, anchor) {
      html_tag.m(raw_value, target, anchor);
      insert(target, html_anchor, anchor);
    },

    p(ctx, dirty) {
      if (dirty &
      /*buttons*/
      2 && raw_value !== (raw_value =
      /*button*/
      ctx[15].icon + "")) html_tag.p(raw_value);
    },

    d(detaching) {
      if (detaching) detach(html_anchor);
      if (detaching) html_tag.d();
    }

  };
} // (209:3) {#each buttons as button (button.id)}


function create_each_block$6(key_1, ctx) {
  let button;
  let span;
  let t0_value =
  /*button*/
  ctx[15].label + "";
  let t0;
  let span_title_value;
  let t1;
  let button_class_value;
  let applyStyles_action;
  let mounted;
  let dispose;
  let if_block =
  /*button*/
  ctx[15].icon && create_if_block_1$5(ctx);

  function click_handler() {
    return (
      /*click_handler*/
      ctx[13](
      /*button*/
      ctx[15])
    );
  }

  return {
    key: key_1,
    first: null,

    c() {
      button = element("button");
      span = element("span");
      if (if_block) if_block.c();
      t0 = text(t0_value);
      t1 = space();
      attr(span, "title", span_title_value =
      /*button*/
      ctx[15].title);
      attr(button, "class", button_class_value = "dialog-button " +
      /*button*/
      ctx[15].id);
      toggle_class(button, "default",
      /*button*/
      ctx[15].id ===
      /*currentButtonId*/
      ctx[3]);
      this.first = button;
    },

    m(target, anchor) {
      insert(target, button, anchor);
      append(button, span);
      if (if_block) if_block.m(span, null);
      append(span, t0);
      append(button, t1);

      if (!mounted) {
        dispose = [listen(button, "click", click_handler), action_destroyer(applyStyles_action = applyStyles.call(null, button,
        /*button*/
        ctx[15].styles))];
        mounted = true;
      }
    },

    p(new_ctx, dirty) {
      ctx = new_ctx;

      if (
      /*button*/
      ctx[15].icon) {
        if (if_block) {
          if_block.p(ctx, dirty);
        } else {
          if_block = create_if_block_1$5(ctx);
          if_block.c();
          if_block.m(span, t0);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }

      if (dirty &
      /*buttons*/
      2 && t0_value !== (t0_value =
      /*button*/
      ctx[15].label + "")) set_data(t0, t0_value);

      if (dirty &
      /*buttons*/
      2 && span_title_value !== (span_title_value =
      /*button*/
      ctx[15].title)) {
        attr(span, "title", span_title_value);
      }

      if (dirty &
      /*buttons*/
      2 && button_class_value !== (button_class_value = "dialog-button " +
      /*button*/
      ctx[15].id)) {
        attr(button, "class", button_class_value);
      }

      if (applyStyles_action && is_function(applyStyles_action.update) && dirty &
      /*buttons*/
      2) applyStyles_action.update.call(null,
      /*button*/
      ctx[15].styles);

      if (dirty &
      /*buttons, buttons, currentButtonId*/
      10) {
        toggle_class(button, "default",
        /*button*/
        ctx[15].id ===
        /*currentButtonId*/
        ctx[3]);
      }
    },

    d(detaching) {
      if (detaching) detach(button);
      if (if_block) if_block.d();
      mounted = false;
      run_all(dispose);
    }

  };
}

function create_fragment$1$1(ctx) {
  let t0;
  let div;
  let current_block_type_index;
  let if_block0;
  let t1;
  let if_block1_anchor;
  let current;
  let mounted;
  let dispose;
  const if_block_creators = [create_if_block_2$4, create_if_block_3$3];
  const if_blocks = [];

  function select_block_type(ctx, dirty) {
    if (typeof
    /*content*/
    ctx[2] === 'string') return 0;
    if (
    /*dialogComponent*/
    ctx[4]) return 1;
    return -1;
  }

  if (~(current_block_type_index = select_block_type(ctx))) {
    if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  }

  let if_block1 =
  /*buttons*/
  ctx[1].length && create_if_block$1$1(ctx);
  return {
    c() {
      t0 = space();
      div = element("div");
      if (if_block0) if_block0.c();
      t1 = space();
      if (if_block1) if_block1.c();
      if_block1_anchor = empty();
      attr(div, "class", "dialog-content");
    },

    m(target, anchor) {
      insert(target, t0, anchor);
      insert(target, div, anchor);

      if (~current_block_type_index) {
        if_blocks[current_block_type_index].m(div, null);
      }

      insert(target, t1, anchor);
      if (if_block1) if_block1.m(target, anchor);
      insert(target, if_block1_anchor, anchor);
      current = true;

      if (!mounted) {
        dispose = listen(document.body, "keydown",
        /*onKeydown*/
        ctx[7]);
        mounted = true;
      }
    },

    p(ctx, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx);

      if (current_block_type_index === previous_block_index) {
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].p(ctx, dirty);
        }
      } else {
        if (if_block0) {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
        }

        if (~current_block_type_index) {
          if_block0 = if_blocks[current_block_type_index];

          if (!if_block0) {
            if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
            if_block0.c();
          } else {
            if_block0.p(ctx, dirty);
          }

          transition_in(if_block0, 1);
          if_block0.m(div, null);
        } else {
          if_block0 = null;
        }
      }

      if (
      /*buttons*/
      ctx[1].length) {
        if (if_block1) {
          if_block1.p(ctx, dirty);
        } else {
          if_block1 = create_if_block$1$1(ctx);
          if_block1.c();
          if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
    },

    i(local) {
      if (current) return;
      transition_in(if_block0);
      current = true;
    },

    o(local) {
      transition_out(if_block0);
      current = false;
    },

    d(detaching) {
      if (detaching) detach(t0);
      if (detaching) detach(div);

      if (~current_block_type_index) {
        if_blocks[current_block_type_index].d();
      }

      if (detaching) detach(t1);
      if (if_block1) if_block1.d(detaching);
      if (detaching) detach(if_block1_anchor);
      mounted = false;
      dispose();
    }

  };
}

const s_REGEX_HTML = /^\s*<.*>$/;

function instance$1$1($$self, $$props, $$invalidate) {
  let {
    data = {}
  } = $$props;
  let {
    autoClose = true
  } = $$props;
  let {
    preventDefault = false
  } = $$props;
  let {
    stopPropagation = false
  } = $$props;
  let {
    dialogInstance = void 0
  } = $$props;
  let buttons;
  let content = void 0;
  let dialogComponent;
  let dialogProps = {};
  let application = getContext('external').application;
  let currentButtonId = data.default;

  async function onClick(button) {
    try {
      var _button$callback2;

      let result = null; // Accept either callback or onclick as the function / data to invoke.

      const invoke = (_button$callback2 = button.callback) !== null && _button$callback2 !== void 0 ? _button$callback2 : button.onclick;

      switch (typeof invoke) {
        case 'function':
          // Passing back the HTML element is to keep with the existing Foundry API, however second parameter is
          // the Svelte component instance.
          result = await invoke(application.options.jQuery ? application.element : application.element[0], dialogInstance);
          break;

        case 'string':
          // Attempt lookup by function name in dialog instance component.
          if (dialogInstance !== void 0 && typeof dialogInstance[invoke] === 'function') {
            result = await dialogInstance[invoke](application.options.jQuery ? application.element : application.element[0], dialogInstance);
          }

          break;
      } // Delay closing to next clock tick to be able to return result.


      if (autoClose) {
        setTimeout(() => application.close(), 0);
      }

      return result;
    } catch (err) {
      ui.notifications.error(err);
      throw new Error(err);
    }
  }

  function onKeydown(event) {
    /**
    * If this dialog is not the activeWindow then return immediately. See {@link SvelteApplication.bringToTop} as
    * SvelteApplication overrides core Foundry and always sets the activeWindow when `bringToTop` is invoked.
    */
    if (event.key !== 'Escape' && ui.activeWindow !== application) {
      return;
    }

    switch (event.key) {
      case 'ArrowLeft':
        {
          event.preventDefault();
          event.stopPropagation();
          const currentIndex = buttons.findIndex(button => button.id === currentButtonId);

          if (buttons.length && currentIndex > 0) {
            $$invalidate(3, currentButtonId = buttons[currentIndex - 1].id);
          }

          break;
        }

      case 'ArrowRight':
        {
          event.preventDefault();
          event.stopPropagation();
          const currentIndex = buttons.findIndex(button => button.id === currentButtonId);

          if (buttons.length && currentIndex < buttons.length - 1) {
            $$invalidate(3, currentButtonId = buttons[currentIndex + 1].id);
          }

          break;
        }

      case 'Escape':
        event.preventDefault();
        event.stopPropagation();
        return application.close();

      case 'Enter':
        event.preventDefault();
        event.stopPropagation();

        if (currentButtonId && isObject(data.buttons) && currentButtonId in data.buttons) {
          onClick(data.buttons[currentButtonId]);
        }

        break;

      default:
        if (preventDefault) {
          event.preventDefault();
        }

        if (stopPropagation) {
          event.stopPropagation();
        }

        break;
    }
  }

  function switch_instance_binding($$value) {
    binding_callbacks[$$value ? 'unshift' : 'push'](() => {
      dialogInstance = $$value;
      $$invalidate(0, dialogInstance);
    });
  }

  const click_handler = button => onClick(button);

  $$self.$$set = $$props => {
    if ('data' in $$props) $$invalidate(8, data = $$props.data);
    if ('autoClose' in $$props) $$invalidate(9, autoClose = $$props.autoClose);
    if ('preventDefault' in $$props) $$invalidate(10, preventDefault = $$props.preventDefault);
    if ('stopPropagation' in $$props) $$invalidate(11, stopPropagation = $$props.stopPropagation);
    if ('dialogInstance' in $$props) $$invalidate(0, dialogInstance = $$props.dialogInstance);
  };

  $$self.$$.update = () => {
    if ($$self.$$.dirty &
    /*data*/
    256) {
      // If `data.buttons` is not an object then set an empty array otherwise reduce the button data.
      {
        $$invalidate(1, buttons = !isObject(data.buttons) ? [] : Object.keys(data.buttons).reduce((array, key) => {
          var _b$condition;

          const b = data.buttons[key]; // Handle icon and treat bare strings as the icon class; otherwise assume the icon is fully formed HTML.

          const icon = typeof b.icon !== 'string' ? void 0 : s_REGEX_HTML.test(b.icon) ? b.icon : `<i class="${b.icon}"></i>`;
          const label = typeof b.label === 'string' ? `${icon !== void 0 ? ' ' : ''}${localize(b.label)}` : '';
          const title = typeof b.title === 'string' ? localize(b.title) : void 0; // Test any condition supplied otherwise default to true.

          const condition = typeof b.condition === 'function' ? b.condition.call(b) : (_b$condition = b.condition) !== null && _b$condition !== void 0 ? _b$condition : true;

          if (condition) {
            array.push(_objectSpread2(_objectSpread2({}, b), {}, {
              id: key,
              icon,
              label,
              title
            }));
          }

          return array;
        }, []));
      }
    }

    if ($$self.$$.dirty &
    /*buttons, currentButtonId*/
    10) {
      /**
      * This reactivity block will trigger on arrow left / right key presses _and_ when buttons change. It is OK for it to
      * trigger on both.
      */
      if (!buttons.find(button => button.id === currentButtonId)) {
        $$invalidate(3, currentButtonId = void 0);
      }
    }

    if ($$self.$$.dirty &
    /*content, data*/
    260) {
      if (content !== data.content) {
        $$invalidate(2, content = data.content); // Only update the content if it has changed.

        try {
          if (isSvelteComponent(content)) {
            $$invalidate(4, dialogComponent = content);
            $$invalidate(5, dialogProps = {});
          } else if (typeof content === 'object') {
            var _svelteConfig$props, _svelteConfig$context, _svelteConfig$context2;

            const svelteConfig = parseSvelteConfig(content, application);
            $$invalidate(4, dialogComponent = svelteConfig.class);
            $$invalidate(5, dialogProps = (_svelteConfig$props = svelteConfig.props) !== null && _svelteConfig$props !== void 0 ? _svelteConfig$props : {}); // Check for any children parsed and added to the external context.

            const children = svelteConfig === null || svelteConfig === void 0 ? void 0 : (_svelteConfig$context = svelteConfig.context) === null || _svelteConfig$context === void 0 ? void 0 : (_svelteConfig$context2 = _svelteConfig$context.get('external')) === null || _svelteConfig$context2 === void 0 ? void 0 : _svelteConfig$context2.children; // If so add to dialogProps.

            if (Array.isArray(children)) {
              $$invalidate(5, dialogProps.children = children, dialogProps);
            }
          } else {
            $$invalidate(4, dialogComponent = void 0);
            $$invalidate(5, dialogProps = {});
          }
        } catch (err) {
          $$invalidate(4, dialogComponent = void 0);
          $$invalidate(5, dialogProps = {});
          $$invalidate(2, content = err.message);
          console.error(err);
        }
      }
    }
  };

  return [dialogInstance, buttons, content, currentButtonId, dialogComponent, dialogProps, onClick, onKeydown, data, autoClose, preventDefault, stopPropagation, switch_instance_binding, click_handler];
}

class DialogContent extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$1$1, create_fragment$1$1, safe_not_equal, {
      data: 8,
      autoClose: 9,
      preventDefault: 10,
      stopPropagation: 11,
      dialogInstance: 0
    }, add_css);
  }

}
/* src\component\core\dialog\DialogShell.svelte generated by Svelte v3.46.0 */


function create_else_block$4(ctx) {
  let applicationshell;
  let updating_elementRoot;
  let updating_elementContent;
  let current;
  const applicationshell_spread_levels = [
  /*appProps*/
  ctx[6]];

  function applicationshell_elementRoot_binding_1(value) {
    /*applicationshell_elementRoot_binding_1*/
    ctx[16](value);
  }

  function applicationshell_elementContent_binding_1(value) {
    /*applicationshell_elementContent_binding_1*/
    ctx[17](value);
  }

  let applicationshell_props = {
    $$slots: {
      default: [create_default_slot_2]
    },
    $$scope: {
      ctx
    }
  };

  for (let i = 0; i < applicationshell_spread_levels.length; i += 1) {
    applicationshell_props = assign(applicationshell_props, applicationshell_spread_levels[i]);
  }

  if (
  /*elementRoot*/
  ctx[1] !== void 0) {
    applicationshell_props.elementRoot =
    /*elementRoot*/
    ctx[1];
  }

  if (
  /*elementContent*/
  ctx[0] !== void 0) {
    applicationshell_props.elementContent =
    /*elementContent*/
    ctx[0];
  }

  applicationshell = new ApplicationShell({
    props: applicationshell_props
  });
  binding_callbacks.push(() => bind(applicationshell, 'elementRoot', applicationshell_elementRoot_binding_1));
  binding_callbacks.push(() => bind(applicationshell, 'elementContent', applicationshell_elementContent_binding_1));
  return {
    c() {
      create_component(applicationshell.$$.fragment);
    },

    m(target, anchor) {
      mount_component(applicationshell, target, anchor);
      current = true;
    },

    p(ctx, dirty) {
      const applicationshell_changes = dirty &
      /*appProps*/
      64 ? get_spread_update(applicationshell_spread_levels, [get_spread_object(
      /*appProps*/
      ctx[6])]) : {};

      if (dirty &
      /*$$scope, data, autoClose, dialogComponent*/
      1049100) {
        applicationshell_changes.$$scope = {
          dirty,
          ctx
        };
      }

      if (!updating_elementRoot && dirty &
      /*elementRoot*/
      2) {
        updating_elementRoot = true;
        applicationshell_changes.elementRoot =
        /*elementRoot*/
        ctx[1];
        add_flush_callback(() => updating_elementRoot = false);
      }

      if (!updating_elementContent && dirty &
      /*elementContent*/
      1) {
        updating_elementContent = true;
        applicationshell_changes.elementContent =
        /*elementContent*/
        ctx[0];
        add_flush_callback(() => updating_elementContent = false);
      }

      applicationshell.$set(applicationshell_changes);
    },

    i(local) {
      if (current) return;
      transition_in(applicationshell.$$.fragment, local);
      current = true;
    },

    o(local) {
      transition_out(applicationshell.$$.fragment, local);
      current = false;
    },

    d(detaching) {
      destroy_component(applicationshell, detaching);
    }

  };
} // (180:0) {#if modal}


function create_if_block$6(ctx) {
  let tjsglasspane;
  let current;
  const tjsglasspane_spread_levels = [{
    id: `${
    /*application*/
    ctx[4].id}-glasspane`
  }, {
    preventDefault: false
  }, {
    stopPropagation: false
  },
  /*modalProps*/
  ctx[7], {
    zIndex:
    /*zIndex*/
    ctx[8]
  }];
  let tjsglasspane_props = {
    $$slots: {
      default: [create_default_slot$4]
    },
    $$scope: {
      ctx
    }
  };

  for (let i = 0; i < tjsglasspane_spread_levels.length; i += 1) {
    tjsglasspane_props = assign(tjsglasspane_props, tjsglasspane_spread_levels[i]);
  }

  tjsglasspane = new TJSGlassPane({
    props: tjsglasspane_props
  });
  return {
    c() {
      create_component(tjsglasspane.$$.fragment);
    },

    m(target, anchor) {
      mount_component(tjsglasspane, target, anchor);
      current = true;
    },

    p(ctx, dirty) {
      const tjsglasspane_changes = dirty &
      /*application, modalProps, zIndex*/
      400 ? get_spread_update(tjsglasspane_spread_levels, [dirty &
      /*application*/
      16 && {
        id: `${
        /*application*/
        ctx[4].id}-glasspane`
      }, tjsglasspane_spread_levels[1], tjsglasspane_spread_levels[2], dirty &
      /*modalProps*/
      128 && get_spread_object(
      /*modalProps*/
      ctx[7]), dirty &
      /*zIndex*/
      256 && {
        zIndex:
        /*zIndex*/
        ctx[8]
      }]) : {};

      if (dirty &
      /*$$scope, appProps, elementRoot, elementContent, data, autoClose, dialogComponent*/
      1049167) {
        tjsglasspane_changes.$$scope = {
          dirty,
          ctx
        };
      }

      tjsglasspane.$set(tjsglasspane_changes);
    },

    i(local) {
      if (current) return;
      transition_in(tjsglasspane.$$.fragment, local);
      current = true;
    },

    o(local) {
      transition_out(tjsglasspane.$$.fragment, local);
      current = false;
    },

    d(detaching) {
      destroy_component(tjsglasspane, detaching);
    }

  };
} // (187:3) <ApplicationShell bind:elementRoot bind:elementContent {...appProps}>


function create_default_slot_2(ctx) {
  let dialogcontent;
  let updating_autoClose;
  let updating_dialogInstance;
  let current;

  function dialogcontent_autoClose_binding_1(value) {
    /*dialogcontent_autoClose_binding_1*/
    ctx[14](value);
  }

  function dialogcontent_dialogInstance_binding_1(value) {
    /*dialogcontent_dialogInstance_binding_1*/
    ctx[15](value);
  }

  let dialogcontent_props = {
    data:
    /*data*/
    ctx[3]
  };

  if (
  /*autoClose*/
  ctx[9] !== void 0) {
    dialogcontent_props.autoClose =
    /*autoClose*/
    ctx[9];
  }

  if (
  /*dialogComponent*/
  ctx[2] !== void 0) {
    dialogcontent_props.dialogInstance =
    /*dialogComponent*/
    ctx[2];
  }

  dialogcontent = new DialogContent({
    props: dialogcontent_props
  });
  binding_callbacks.push(() => bind(dialogcontent, 'autoClose', dialogcontent_autoClose_binding_1));
  binding_callbacks.push(() => bind(dialogcontent, 'dialogInstance', dialogcontent_dialogInstance_binding_1));
  return {
    c() {
      create_component(dialogcontent.$$.fragment);
    },

    m(target, anchor) {
      mount_component(dialogcontent, target, anchor);
      current = true;
    },

    p(ctx, dirty) {
      const dialogcontent_changes = {};
      if (dirty &
      /*data*/
      8) dialogcontent_changes.data =
      /*data*/
      ctx[3];

      if (!updating_autoClose && dirty &
      /*autoClose*/
      512) {
        updating_autoClose = true;
        dialogcontent_changes.autoClose =
        /*autoClose*/
        ctx[9];
        add_flush_callback(() => updating_autoClose = false);
      }

      if (!updating_dialogInstance && dirty &
      /*dialogComponent*/
      4) {
        updating_dialogInstance = true;
        dialogcontent_changes.dialogInstance =
        /*dialogComponent*/
        ctx[2];
        add_flush_callback(() => updating_dialogInstance = false);
      }

      dialogcontent.$set(dialogcontent_changes);
    },

    i(local) {
      if (current) return;
      transition_in(dialogcontent.$$.fragment, local);
      current = true;
    },

    o(local) {
      transition_out(dialogcontent.$$.fragment, local);
      current = false;
    },

    d(detaching) {
      destroy_component(dialogcontent, detaching);
    }

  };
} // (182:6) <ApplicationShell bind:elementRoot bind:elementContent {...appProps}>


function create_default_slot_1(ctx) {
  let dialogcontent;
  let updating_autoClose;
  let updating_dialogInstance;
  let current;

  function dialogcontent_autoClose_binding(value) {
    /*dialogcontent_autoClose_binding*/
    ctx[10](value);
  }

  function dialogcontent_dialogInstance_binding(value) {
    /*dialogcontent_dialogInstance_binding*/
    ctx[11](value);
  }

  let dialogcontent_props = {
    stopPropagation: true,
    data:
    /*data*/
    ctx[3]
  };

  if (
  /*autoClose*/
  ctx[9] !== void 0) {
    dialogcontent_props.autoClose =
    /*autoClose*/
    ctx[9];
  }

  if (
  /*dialogComponent*/
  ctx[2] !== void 0) {
    dialogcontent_props.dialogInstance =
    /*dialogComponent*/
    ctx[2];
  }

  dialogcontent = new DialogContent({
    props: dialogcontent_props
  });
  binding_callbacks.push(() => bind(dialogcontent, 'autoClose', dialogcontent_autoClose_binding));
  binding_callbacks.push(() => bind(dialogcontent, 'dialogInstance', dialogcontent_dialogInstance_binding));
  return {
    c() {
      create_component(dialogcontent.$$.fragment);
    },

    m(target, anchor) {
      mount_component(dialogcontent, target, anchor);
      current = true;
    },

    p(ctx, dirty) {
      const dialogcontent_changes = {};
      if (dirty &
      /*data*/
      8) dialogcontent_changes.data =
      /*data*/
      ctx[3];

      if (!updating_autoClose && dirty &
      /*autoClose*/
      512) {
        updating_autoClose = true;
        dialogcontent_changes.autoClose =
        /*autoClose*/
        ctx[9];
        add_flush_callback(() => updating_autoClose = false);
      }

      if (!updating_dialogInstance && dirty &
      /*dialogComponent*/
      4) {
        updating_dialogInstance = true;
        dialogcontent_changes.dialogInstance =
        /*dialogComponent*/
        ctx[2];
        add_flush_callback(() => updating_dialogInstance = false);
      }

      dialogcontent.$set(dialogcontent_changes);
    },

    i(local) {
      if (current) return;
      transition_in(dialogcontent.$$.fragment, local);
      current = true;
    },

    o(local) {
      transition_out(dialogcontent.$$.fragment, local);
      current = false;
    },

    d(detaching) {
      destroy_component(dialogcontent, detaching);
    }

  };
} // (181:3) <TJSGlassPane id={`${application.id}-glasspane`} preventDefault={false} stopPropagation={false} {...modalProps} {zIndex}>


function create_default_slot$4(ctx) {
  let applicationshell;
  let updating_elementRoot;
  let updating_elementContent;
  let current;
  const applicationshell_spread_levels = [
  /*appProps*/
  ctx[6]];

  function applicationshell_elementRoot_binding(value) {
    /*applicationshell_elementRoot_binding*/
    ctx[12](value);
  }

  function applicationshell_elementContent_binding(value) {
    /*applicationshell_elementContent_binding*/
    ctx[13](value);
  }

  let applicationshell_props = {
    $$slots: {
      default: [create_default_slot_1]
    },
    $$scope: {
      ctx
    }
  };

  for (let i = 0; i < applicationshell_spread_levels.length; i += 1) {
    applicationshell_props = assign(applicationshell_props, applicationshell_spread_levels[i]);
  }

  if (
  /*elementRoot*/
  ctx[1] !== void 0) {
    applicationshell_props.elementRoot =
    /*elementRoot*/
    ctx[1];
  }

  if (
  /*elementContent*/
  ctx[0] !== void 0) {
    applicationshell_props.elementContent =
    /*elementContent*/
    ctx[0];
  }

  applicationshell = new ApplicationShell({
    props: applicationshell_props
  });
  binding_callbacks.push(() => bind(applicationshell, 'elementRoot', applicationshell_elementRoot_binding));
  binding_callbacks.push(() => bind(applicationshell, 'elementContent', applicationshell_elementContent_binding));
  return {
    c() {
      create_component(applicationshell.$$.fragment);
    },

    m(target, anchor) {
      mount_component(applicationshell, target, anchor);
      current = true;
    },

    p(ctx, dirty) {
      const applicationshell_changes = dirty &
      /*appProps*/
      64 ? get_spread_update(applicationshell_spread_levels, [get_spread_object(
      /*appProps*/
      ctx[6])]) : {};

      if (dirty &
      /*$$scope, data, autoClose, dialogComponent*/
      1049100) {
        applicationshell_changes.$$scope = {
          dirty,
          ctx
        };
      }

      if (!updating_elementRoot && dirty &
      /*elementRoot*/
      2) {
        updating_elementRoot = true;
        applicationshell_changes.elementRoot =
        /*elementRoot*/
        ctx[1];
        add_flush_callback(() => updating_elementRoot = false);
      }

      if (!updating_elementContent && dirty &
      /*elementContent*/
      1) {
        updating_elementContent = true;
        applicationshell_changes.elementContent =
        /*elementContent*/
        ctx[0];
        add_flush_callback(() => updating_elementContent = false);
      }

      applicationshell.$set(applicationshell_changes);
    },

    i(local) {
      if (current) return;
      transition_in(applicationshell.$$.fragment, local);
      current = true;
    },

    o(local) {
      transition_out(applicationshell.$$.fragment, local);
      current = false;
    },

    d(detaching) {
      destroy_component(applicationshell, detaching);
    }

  };
}

function create_fragment$9(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block$6, create_else_block$4];
  const if_blocks = [];

  function select_block_type(ctx, dirty) {
    if (
    /*modal*/
    ctx[5]) return 0;
    return 1;
  }

  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },

    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },

    p(ctx, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx);

      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];

        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
          if_block.c();
        } else {
          if_block.p(ctx, dirty);
        }

        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },

    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },

    o(local) {
      transition_out(if_block);
      current = false;
    },

    d(detaching) {
      if_blocks[current_block_type_index].d(detaching);
      if (detaching) detach(if_block_anchor);
    }

  };
}

const s_MODAL_BACKGROUND = '#50505080';

function instance$9($$self, $$props, $$invalidate) {
  let {
    elementContent
  } = $$props;
  let {
    elementRoot
  } = $$props;
  let {
    data = {}
  } = $$props;
  let {
    dialogComponent = void 0
  } = $$props;
  const application = getContext('external').application;
  const s_MODAL_TRANSITION = fade;
  const s_MODAL_TRANSITION_OPTIONS = {
    duration: 200
  };
  let modal = void 0; // Stores props for the ApplicationShell.

  const appProps = {
    // Stores any transition functions.
    transition: void 0,
    inTransition: void 0,
    outTransition: void 0,
    // Stores properties to set for options for any transitions.
    transitionOptions: void 0,
    inTransitionOptions: void 0,
    outTransitionOptions: void 0,
    // Stores any style overrides for application shell.
    stylesApp: void 0,
    stylesContent: void 0
  };
  const modalProps = {
    // Background CSS style string.
    background: void 0,
    // Stores any transition functions.
    transition: void 0,
    inTransition: void 0,
    outTransition: void 0,
    // Stores properties to set for options for any transitions.
    transitionOptions: void 0,
    inTransitionOptions: void 0,
    outTransitionOptions: void 0
  };
  let zIndex = void 0; // Automatically close the dialog on button click handler completion.

  let autoClose = true; // Only set modal once on mount. You can't change between a modal an non-modal dialog during runtime.

  if (modal === void 0) {
    var _data;

    modal = typeof ((_data = data) === null || _data === void 0 ? void 0 : _data.modal) === 'boolean' ? data.modal : false;
  }

  function dialogcontent_autoClose_binding(value) {
    autoClose = value;
    ((($$invalidate(9, autoClose), $$invalidate(3, data)), $$invalidate(5, modal)), $$invalidate(8, zIndex)), $$invalidate(4, application);
  }

  function dialogcontent_dialogInstance_binding(value) {
    dialogComponent = value;
    $$invalidate(2, dialogComponent);
  }

  function applicationshell_elementRoot_binding(value) {
    elementRoot = value;
    $$invalidate(1, elementRoot);
  }

  function applicationshell_elementContent_binding(value) {
    elementContent = value;
    $$invalidate(0, elementContent);
  }

  function dialogcontent_autoClose_binding_1(value) {
    autoClose = value;
    ((($$invalidate(9, autoClose), $$invalidate(3, data)), $$invalidate(5, modal)), $$invalidate(8, zIndex)), $$invalidate(4, application);
  }

  function dialogcontent_dialogInstance_binding_1(value) {
    dialogComponent = value;
    $$invalidate(2, dialogComponent);
  }

  function applicationshell_elementRoot_binding_1(value) {
    elementRoot = value;
    $$invalidate(1, elementRoot);
  }

  function applicationshell_elementContent_binding_1(value) {
    elementContent = value;
    $$invalidate(0, elementContent);
  }

  $$self.$$set = $$props => {
    if ('elementContent' in $$props) $$invalidate(0, elementContent = $$props.elementContent);
    if ('elementRoot' in $$props) $$invalidate(1, elementRoot = $$props.elementRoot);
    if ('data' in $$props) $$invalidate(3, data = $$props.data);
    if ('dialogComponent' in $$props) $$invalidate(2, dialogComponent = $$props.dialogComponent);
  };

  $$self.$$.update = () => {
    if ($$self.$$.dirty &
    /*data, modal, zIndex, application*/
    312) {
      // Retrieve values from the DialogData object and also potentially set any SvelteApplication accessors.
      // Explicit checks are performed against existing local variables as the only externally reactive variable is `data`.
      // All of the checks below trigger when there are any external changes to the `data` prop.
      // Prevent any unnecessary changing of local & `application` variables unless actual changes occur.
      // Foundry App options --------------------------------------------------------------------------------------------
      if (typeof data === 'object') {
        var _data$draggable, _data$popOut, _data$resizable, _data$title, _application$options4;

        $$invalidate(9, autoClose = typeof data.autoClose === 'boolean' ? data.autoClose : true);
        const newZIndex = Number.isInteger(data.zIndex) || data.zIndex === null ? data.zIndex : modal ? Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER - 1;

        if (zIndex !== newZIndex) {
          $$invalidate(8, zIndex = newZIndex);
        } // Update the main foundry options when data changes. Perform explicit checks against existing data in `application`.


        const newDraggable = (_data$draggable = data.draggable) !== null && _data$draggable !== void 0 ? _data$draggable : true;

        if (application.reactive.draggable !== newDraggable) {
          $$invalidate(4, application.reactive.draggable = newDraggable, application);
        }

        const newPopOut = (_data$popOut = data.popOut) !== null && _data$popOut !== void 0 ? _data$popOut : true;

        if (application.reactive.popOut !== newPopOut) {
          $$invalidate(4, application.reactive.popOut = newPopOut, application);
        }

        const newResizable = (_data$resizable = data.resizable) !== null && _data$resizable !== void 0 ? _data$resizable : false;

        if (application.reactive.resizable !== newResizable) {
          $$invalidate(4, application.reactive.resizable = newResizable, application);
        } // Note application.title from Application localizes `options.title`, so compare with `application.options.title`.


        const newTitle = (_data$title = data.title) !== null && _data$title !== void 0 ? _data$title : 'Dialog';

        if (newTitle !== (application === null || application === void 0 ? void 0 : (_application$options4 = application.options) === null || _application$options4 === void 0 ? void 0 : _application$options4.title)) {
          $$invalidate(4, application.reactive.title = newTitle, application);
        }

        if (application.position.zIndex !== zIndex) {
          $$invalidate(4, application.position.zIndex = zIndex, application);
        }
      }
    }

    if ($$self.$$.dirty &
    /*data, appProps*/
    72) {
      var _data2;

      // ApplicationShell transition options ----------------------------------------------------------------------------
      if (typeof ((_data2 = data) === null || _data2 === void 0 ? void 0 : _data2.transition) === 'object') {
        // Store data.transitions to shorten statements below.
        const d = data.transition;

        if ((d === null || d === void 0 ? void 0 : d.transition) !== appProps.transition) {
          $$invalidate(6, appProps.transition = d.transition, appProps);
        }

        if ((d === null || d === void 0 ? void 0 : d.inTransition) !== appProps.inTransition) {
          $$invalidate(6, appProps.inTransition = d.inTransition, appProps);
        }

        if ((d === null || d === void 0 ? void 0 : d.outTransition) !== appProps.outTransition) {
          $$invalidate(6, appProps.outTransition = d.outTransition, appProps);
        }

        if ((d === null || d === void 0 ? void 0 : d.transitionOptions) !== appProps.transitionOptions) {
          $$invalidate(6, appProps.transitionOptions = d.transitionOptions, appProps);
        }

        if ((d === null || d === void 0 ? void 0 : d.inTransitionOptions) !== appProps.inTransitionOptions) {
          $$invalidate(6, appProps.inTransitionOptions = d.inTransitionOptions, appProps);
        }

        if ((d === null || d === void 0 ? void 0 : d.outTransitionOptions) !== appProps.outTransitionOptions) {
          $$invalidate(6, appProps.outTransitionOptions = d.outTransitionOptions, appProps);
        }
      }
    }

    if ($$self.$$.dirty &
    /*data, modalProps*/
    136) {
      // Modal options --------------------------------------------------------------------------------------------------
      {
        var _data3, _data3$modalOptions;

        const newModalBackground = typeof ((_data3 = data) === null || _data3 === void 0 ? void 0 : (_data3$modalOptions = _data3.modalOptions) === null || _data3$modalOptions === void 0 ? void 0 : _data3$modalOptions.background) === 'string' ? data.modalOptions.background : s_MODAL_BACKGROUND;

        if (newModalBackground !== modalProps.background) {
          $$invalidate(7, modalProps.background = newModalBackground, modalProps);
        }
      }
    }

    if ($$self.$$.dirty &
    /*data, modalProps*/
    136) {
      var _data4, _data4$modalOptions;

      if (typeof ((_data4 = data) === null || _data4 === void 0 ? void 0 : (_data4$modalOptions = _data4.modalOptions) === null || _data4$modalOptions === void 0 ? void 0 : _data4$modalOptions.transition) === 'object') {
        // Store data.transitions to shorten statements below.
        const d = data.modalOptions.transition;

        if ((d === null || d === void 0 ? void 0 : d.transition) !== modalProps.transition) {
          $$invalidate(7, modalProps.transition = typeof (d === null || d === void 0 ? void 0 : d.transition) === 'function' ? d.transition : s_MODAL_TRANSITION, modalProps);
        }

        if ((d === null || d === void 0 ? void 0 : d.inTransition) !== modalProps.inTransition) {
          $$invalidate(7, modalProps.inTransition = d.inTransition, modalProps);
        }

        if ((d === null || d === void 0 ? void 0 : d.outTransition) !== modalProps.outTransition) {
          $$invalidate(7, modalProps.outTransition = d.outTransition, modalProps);
        } // Provide default transition options if not defined.


        if ((d === null || d === void 0 ? void 0 : d.transitionOptions) !== modalProps.transitionOptions) {
          $$invalidate(7, modalProps.transitionOptions = typeof (d === null || d === void 0 ? void 0 : d.transitionOptions) === 'object' ? d.transitionOptions : s_MODAL_TRANSITION_OPTIONS, modalProps);
        }

        if ((d === null || d === void 0 ? void 0 : d.inTransitionOptions) !== modalProps.inTransitionOptions) {
          $$invalidate(7, modalProps.inTransitionOptions = d.inTransitionOptions, modalProps);
        }

        if ((d === null || d === void 0 ? void 0 : d.outTransitionOptions) !== modalProps.outTransitionOptions) {
          $$invalidate(7, modalProps.outTransitionOptions = d.outTransitionOptions, modalProps);
        }
      } else // Provide a fallback / default glass pane transition when `data.modalOptions.transition` is not defined.
        {
          var _data5, _data5$modalOptions, _data5$modalOptions$t, _data6, _data6$modalOptions;

          const newModalTransition = typeof ((_data5 = data) === null || _data5 === void 0 ? void 0 : (_data5$modalOptions = _data5.modalOptions) === null || _data5$modalOptions === void 0 ? void 0 : (_data5$modalOptions$t = _data5$modalOptions.transition) === null || _data5$modalOptions$t === void 0 ? void 0 : _data5$modalOptions$t.transition) === 'function' ? data.modalOptions.transition.transition : s_MODAL_TRANSITION;

          if (newModalTransition !== modalProps.transition) {
            $$invalidate(7, modalProps.transition = newModalTransition, modalProps);
          }

          const newModalTransitionOptions = typeof ((_data6 = data) === null || _data6 === void 0 ? void 0 : (_data6$modalOptions = _data6.modalOptions) === null || _data6$modalOptions === void 0 ? void 0 : _data6$modalOptions.transitionOptions) === 'object' ? data.modalOptions.transitionOptions : s_MODAL_TRANSITION_OPTIONS;

          if (newModalTransitionOptions !== modalProps.transitionOptions) {
            $$invalidate(7, modalProps.transitionOptions = newModalTransitionOptions, modalProps);
          }
        }
    }
  };

  return [elementContent, elementRoot, dialogComponent, data, application, modal, appProps, modalProps, zIndex, autoClose, dialogcontent_autoClose_binding, dialogcontent_dialogInstance_binding, applicationshell_elementRoot_binding, applicationshell_elementContent_binding, dialogcontent_autoClose_binding_1, dialogcontent_dialogInstance_binding_1, applicationshell_elementRoot_binding_1, applicationshell_elementContent_binding_1];
}

class DialogShell extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$9, create_fragment$9, safe_not_equal, {
      elementContent: 0,
      elementRoot: 1,
      data: 3,
      dialogComponent: 2
    });
  }

  get elementContent() {
    return this.$$.ctx[0];
  }

  set elementContent(elementContent) {
    this.$$set({
      elementContent
    });
    flush();
  }

  get elementRoot() {
    return this.$$.ctx[1];
  }

  set elementRoot(elementRoot) {
    this.$$set({
      elementRoot
    });
    flush();
  }

  get data() {
    return this.$$.ctx[3];
  }

  set data(data) {
    this.$$set({
      data
    });
    flush();
  }

  get dialogComponent() {
    return this.$$.ctx[2];
  }

  set dialogComponent(dialogComponent) {
    this.$$set({
      dialogComponent
    });
    flush();
  }

}

var _application = /*#__PURE__*/new WeakMap();

class DialogData {
  /**
   * @type {SvelteApplication}
   */

  /**
   * @param {SvelteApplication} application - The host Foundry application.
   */
  constructor(application) {
    _classPrivateFieldInitSpec(this, _application, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _application, application);
  }
  /**
   * Provides a way to safely get this dialogs data given an accessor string which describes the
   * entries to walk. To access deeper entries into the object format the accessor string with `.` between entries
   * to walk.
   *
   * // TODO DOCUMENT the accessor in more detail.
   *
   * @param {string}   accessor - The path / key to set. You can set multiple levels.
   *
   * @param {*}        [defaultValue] - A default value returned if the accessor is not found.
   *
   * @returns {*} Value at the accessor.
   */


  get(accessor, defaultValue) {
    return safeAccess(this, accessor, defaultValue);
  }
  /**
   * @param {object} data - Merge provided data object into Dialog data.
   */


  merge(data) {
    deepMerge(this, data);

    const component = _classPrivateFieldGet(this, _application).svelte.component(0);

    if (component !== null && component !== void 0 && component.data) {
      component.data = this;
    }
  }
  /**
   * Provides a way to safely set this dialogs data given an accessor string which describes the
   * entries to walk. To access deeper entries into the object format the accessor string with `.` between entries
   * to walk.
   *
   * Automatically the dialog data will be updated in the associated DialogShell Svelte component.
   *
   * // TODO DOCUMENT the accessor in more detail.
   *
   * @param {string}   accessor - The path / key to set. You can set multiple levels.
   *
   * @param {*}        value - Value to set.
   *
   * @returns {boolean} True if successful.
   */


  set(accessor, value) {
    const success = safeSet(this, accessor, value); // If `this.options` modified then update the app options store.

    if (success) {
      const component = _classPrivateFieldGet(this, _application).svelte.component(0);

      if (component !== null && component !== void 0 && component.data) {
        component.data = this;
      }
    }

    return success;
  }

}

/**
 * Provides a Foundry API compatible dialog alternative implemented w/ Svelte. There are several features including
 * a glasspane / modal option with various styling and transition capabilities.
 *
 * TODO: document all dialog data parameters; keep track of newly added like button -> styles, title; modal,
 * draggable, transition options, modal transitions
 */

var _data = /*#__PURE__*/new WeakMap();

class TJSDialog extends SvelteApplication {
  /**
   * @type {DialogData}
   */

  /**
   * @param {object}   data - Dialog data.
   *
   * @param {object}   [options] - SvelteApplication options.
   */
  constructor(data, options = {}) {
    super(options);

    _classPrivateFieldInitSpec(this, _data, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _data, new DialogData(this));

    this.data = data;
    /**
     * @member {object} dialogComponent - A getter to SvelteData to retrieve any mounted Svelte component as the
     *                                    dialog content.
     *
     * @memberof GetSvelteData#
     * @readonly
     */

    Object.defineProperty(this.svelte, 'dialogComponent', {
      get: () => {
        var _this$svelte, _this$svelte$applicat;

        return (_this$svelte = this.svelte) === null || _this$svelte === void 0 ? void 0 : (_this$svelte$applicat = _this$svelte.applicationShell) === null || _this$svelte$applicat === void 0 ? void 0 : _this$svelte$applicat.dialogComponent;
      }
    });
  }
  /**
   * Default options
   *
   * @returns {object} Default options
   */


  static get defaultOptions() {
    return deepMerge(super.defaultOptions, {
      classes: ['dialog'],
      width: 400,
      height: 'auto',
      jQuery: true,
      svelte: {
        class: DialogShell,
        intro: true,
        target: document.body,
        props: function () {
          return {
            data: _classPrivateFieldGet(this, _data)
          };
        } // this context is the SvelteApplication when invoked.

      }
    });
  }
  /**
   * Returns the dialog data.
   *
   * @returns {DialogData} Dialog data.
   */


  get data() {
    return _classPrivateFieldGet(this, _data);
  }
  /**
   * Sets the dialog data; this is reactive.
   *
   * @param {object}   data - Dialog data.
   */


  set data(data) {
    const descriptors = Object.getOwnPropertyDescriptors(_classPrivateFieldGet(this, _data)); // Remove old data for all configurable descriptors.

    for (const descriptor in descriptors) {
      if (descriptors[descriptor].configurable) {
        delete _classPrivateFieldGet(this, _data)[descriptor];
      }
    } // Merge new data and perform a reactive update.


    _classPrivateFieldGet(this, _data).merge(data);
  }
  /**
   * Implemented only for backwards compatibility w/ default Foundry {@link Dialog} API.
   *
   * @param {JQuery}   html - JQuery element for content area.
   */


  activateListeners(html) {
    super.activateListeners(html);

    if (this.data.render instanceof Function) {
      const actualHTML = typeof this.options.template === 'string' ? html : this.options.jQuery ? $(this.elementContent) : this.elementContent;
      this.data.render(this.options.jQuery ? actualHTML : actualHTML[0]);
    }
  }
  /**
   * Close the dialog and un-register references to it within UI mappings.
   * This function returns a Promise which resolves once the window closing animation concludes.
   *
   * @param {object}   [options] - Optional parameters.
   *
   * @param {boolean}  [options.force] - Force close regardless of render state.
   *
   * @returns {Promise<void>} A Promise which resolves once the application is closed.
   */


  async close(options) {
    /**
     * Implemented only for backwards compatibility w/ default Foundry {@link Dialog} API.
     */
    if (this.data.close instanceof Function) {
      this.data.close(this.options.jQuery ? this.element : this.element[0]);
    }

    return super.close(options);
  } // ---------------------------------------------------------------------------------------------------------------

  /**
   * A helper factory method to create simple confirmation dialog windows which consist of simple yes/no prompts.
   * If you require more flexibility, a custom Dialog instance is preferred.
   *
   * @param {TJSConfirmConfig} config - Confirm dialog options.
   *
   * @returns {Promise<*>} A promise which resolves once the user makes a choice or closes the window.
   *
   * @example
   * let d = TJSDialog.confirm({
   *  title: "A Yes or No Question",
   *  content: "<p>Choose wisely.</p>",
   *  yes: () => console.log("You chose ... wisely"),
   *  no: () => console.log("You chose ... poorly"),
   *  defaultYes: false
   * });
   */


  static async confirm({
    title,
    content,
    yes,
    no,
    render,
    defaultYes = true,
    rejectClose = false,
    options = {},
    buttons = {},
    draggable = true,
    modal = false,
    modalOptions = {},
    popOut = true,
    resizable = false,
    transition = {},
    zIndex
  } = {}) {
    // Allow overwriting of default icon and labels.
    const mergedButtons = deepMerge({
      yes: {
        icon: '<i class="fas fa-check"></i>',
        label: game.i18n.localize('Yes')
      },
      no: {
        icon: '<i class="fas fa-times"></i>',
        label: game.i18n.localize('No')
      }
    }, buttons);
    return new Promise((resolve, reject) => {
      const dialog = new this({
        title,
        content,
        render,
        draggable,
        modal,
        modalOptions,
        popOut,
        resizable,
        transition,
        zIndex,
        buttons: deepMerge(mergedButtons, {
          yes: {
            callback: html => {
              const result = yes ? yes(html) : true;
              resolve(result);
            }
          },
          no: {
            callback: html => {
              const result = no ? no(html) : false;
              resolve(result);
            }
          }
        }),
        default: defaultYes ? "yes" : "no",
        close: () => {
          if (rejectClose) {
            reject('The confirmation Dialog was closed without a choice being made.');
          } else {
            resolve(null);
          }
        }
      }, options);
      dialog.render(true);
    });
  }
  /**
   * A helper factory method to display a basic "prompt" style Dialog with a single button
   *
   * @param {TJSPromptConfig} config - Prompt dialog options.
   *
   * @returns {Promise<*>} The returned value from the provided callback function, if any
   */


  static async prompt({
    title,
    content,
    label,
    callback,
    render,
    rejectClose = false,
    options = {},
    draggable = true,
    icon = '<i class="fas fa-check"></i>',
    modal = false,
    modalOptions = {},
    popOut = true,
    resizable = false,
    transition = {},
    zIndex
  } = {}) {
    return new Promise((resolve, reject) => {
      const dialog = new this({
        title,
        content,
        render,
        draggable,
        modal,
        modalOptions,
        popOut,
        resizable,
        transition,
        zIndex,
        buttons: {
          ok: {
            icon,
            label,
            callback: html => {
              const result = callback ? callback(html) : null;
              resolve(result);
            }
          }
        },
        default: 'ok',
        close: () => {
          if (rejectClose) {
            reject(new Error('The Dialog prompt was closed without being accepted.'));
          } else {
            resolve(null);
          }
        }
      }, options);
      dialog.render(true);
    });
  }

}
/**
 * @typedef TJSConfirmConfig - Configuration options for the confirm dialog.
 *
 * @property {string}   title - The confirmation window title
 *
 * @property {string}   content - The confirmation message
 *
 * @property {Function} [yes] - Callback function upon yes
 *
 * @property {Function} [no] - Callback function upon no
 *
 * @property {Function} [render] - A function to call when the dialog is rendered
 *
 * @property {boolean}  [defaultYes=true] - Make "yes" the default choice?
 *
 * @property {boolean}  [rejectClose=false] - Reject the Promise if the Dialog is closed without making a choice.
 *
 * @property {object}   [options={}] - Additional rendering options passed to the Dialog
 *
 * @property {object}   [buttons={}] - Provides a button override that is merged with default buttons.
 *
 * @property {boolean}  [draggable=true] - The dialog is draggable when true.
 *
 * @property {boolean}  [modal=false] - When true a modal dialog is displayed.
 *
 * @property {object}   [modalOptions] - Additional options for modal dialog display.
 *
 * @property {boolean}  [popOut=true] - When true the dialog is a pop out Application.
 *
 * @property {boolean}  [resizable=false] - When true the dialog is resizable.
 *
 * @property {object}   [transition] - Transition options for the dialog.
 *
 * @property {number|null} [zIndex] - A specific z-index for the dialog.
 */

/**
 * @typedef TJSPromptConfig - Configuration options for the confirm dialog.
 *
 * @property {string}   title - The confirmation window title
 *
 * @property {string}   content - The confirmation message
 *
 * @property {string}   [label] - The confirmation button text.
 *
 * @property {Function} [callback] - A callback function to fire when the button is clicked.
 *
 * @property {Function} [render] - A function to call when the dialog is rendered.
 *
 * @property {boolean}  [rejectClose=false] - Reject the Promise if the Dialog is closed without making a choice.
 *
 * @property {object}   [options={}] - Additional application options passed to the TJSDialog.
 *
 * @property {boolean}  [draggable=true] - The dialog is draggable when true.
 *
 * @property {string}   [icon="<i class="fas fa-check"></i>"] - Set another icon besides `fa-check` for button.
 *
 * @property {boolean}  [modal=false] - When true a modal dialog is displayed.
 *
 * @property {object}   [modalOptions] - Additional options for modal dialog display.
 *
 * @property {boolean}  [popOut=true] - When true the dialog is a pop out Application.
 *
 * @property {boolean}  [resizable=false] - When true the dialog is resizable.
 *
 * @property {object}   [transition] - Transition options for the dialog.
 *
 * @property {number|null} [zIndex] - A specific z-index for the dialog.
 */

function ordinalSuffixOf(i) {
  let j = i % 10;
  let k = i % 100;

  if (j === 1 && k !== 11) {
    return game.i18n.localize(`REST-RECOVERY.NumberToText.${i + 'st'}`);
  } else if (j === 2 && k !== 12) {
    return game.i18n.localize(`REST-RECOVERY.NumberToText.${i + 'nd'}`);
  } else if (j === 3 && k !== 13) {
    return game.i18n.localize(`REST-RECOVERY.NumberToText.${i + 'rd'}`);
  }

  return game.i18n.localize(`REST-RECOVERY.NumberToText.${i + 'th'}`);
}
function determineLongRestMultiplier(settingKey) {
  const multiplierSetting = getSetting(settingKey);

  switch (multiplierSetting) {
    case CONSTANTS.RECOVERY.NONE:
      return 0;

    case CONSTANTS.RECOVERY.QUARTER:
      return 0.25;

    case CONSTANTS.RECOVERY.HALF:
      return 0.5;

    case CONSTANTS.RECOVERY.FULL:
      return 1.0;

    case CONSTANTS.RECOVERY.CUSTOM:
      return getSetting(CONSTANTS.DEFAULT_SETTINGS[settingKey].customFormula);

    default:
      throw new Error(`Unable to parse recovery multiplier setting for "${settingKey}".`);
  }
}
function determineRoundingMethod(settingKey) {
  const rounding = getSetting(settingKey);

  switch (rounding) {
    case "down":
      return Math.floor;

    case "up":
      return Math.ceil;

    case "round":
      return Math.round;

    default:
      throw new Error(`Unable to parse rounding setting for "${settingKey}".`);
  }
}
function getSetting(key, localize = false) {
  const value = game.settings.get(CONSTANTS.MODULE_NAME, key);
  if (localize) return game.i18n.localize(value);
  return value;
}

/* scripts/formapplications/settings/Setting.svelte generated by Svelte v3.46.4 */

function get_each_context$5(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[12] = list[i][0];
	child_ctx[13] = list[i][1];
	child_ctx[15] = i;
	return child_ctx;
}

// (49:8) {:else}
function create_else_block$2(ctx) {
	let div;
	let input0;
	let t;
	let input1;
	let input1_value_value;
	let mounted;
	let dispose;

	return {
		c() {
			div = element("div");
			input0 = element("input");
			t = space();
			input1 = element("input");
			attr(input0, "type", "text");
			input0.required = true;
			attr(input0, "class", "svelte-1mvkigi");
			attr(input1, "type", "text");
			input1.disabled = true;
			input1.value = input1_value_value = localize(/*setting*/ ctx[0].value);
			attr(input1, "class", "svelte-1mvkigi");
			attr(div, "class", "setting-container svelte-1mvkigi");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, input0);
			set_input_value(input0, /*setting*/ ctx[0].value);
			append(div, t);
			append(div, input1);

			if (!mounted) {
				dispose = listen(input0, "input", /*input0_input_handler*/ ctx[11]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty & /*setting, Object*/ 1 && input0.value !== /*setting*/ ctx[0].value) {
				set_input_value(input0, /*setting*/ ctx[0].value);
			}

			if (dirty & /*setting, Object*/ 1 && input1_value_value !== (input1_value_value = localize(/*setting*/ ctx[0].value)) && input1.value !== input1_value_value) {
				input1.value = input1_value_value;
			}
		},
		d(detaching) {
			if (detaching) detach(div);
			mounted = false;
			dispose();
		}
	};
}

// (45:42) 
function create_if_block_3$2(ctx) {
	let input;
	let mounted;
	let dispose;

	return {
		c() {
			input = element("input");
			attr(input, "type", "number");
			input.required = true;
			attr(input, "class", "svelte-1mvkigi");
			toggle_class(input, "invalid", !/*setting*/ ctx[0].value && /*setting*/ ctx[0].value !== 0);
		},
		m(target, anchor) {
			insert(target, input, anchor);
			set_input_value(input, /*setting*/ ctx[0].value);

			if (!mounted) {
				dispose = listen(input, "input", /*input_input_handler_1*/ ctx[10]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty & /*setting, Object*/ 1 && to_number(input.value) !== /*setting*/ ctx[0].value) {
				set_input_value(input, /*setting*/ ctx[0].value);
			}

			if (dirty & /*setting*/ 1) {
				toggle_class(input, "invalid", !/*setting*/ ctx[0].value && /*setting*/ ctx[0].value !== 0);
			}
		},
		d(detaching) {
			if (detaching) detach(input);
			mounted = false;
			dispose();
		}
	};
}

// (31:34) 
function create_if_block_1$4(ctx) {
	let div;
	let select;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let select_name_value;
	let t;
	let mounted;
	let dispose;
	let each_value = Object.entries(/*setting*/ ctx[0].choices);
	const get_key = ctx => /*index*/ ctx[15];

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context$5(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block$5(key, child_ctx));
	}

	let if_block = /*customFormulaSetting*/ ctx[4] && /*setting*/ ctx[0].value === CONSTANTS.RECOVERY.CUSTOM && create_if_block_2$3(ctx);

	return {
		c() {
			div = element("div");
			select = element("select");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t = space();
			if (if_block) if_block.c();
			attr(select, "name", select_name_value = /*setting*/ ctx[0].key);
			attr(select, "class", "svelte-1mvkigi");
			if (/*setting*/ ctx[0].value === void 0) add_render_callback(() => /*select_change_handler*/ ctx[8].call(select));
			attr(div, "class", "choice-container svelte-1mvkigi");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, select);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(select, null);
			}

			select_option(select, /*setting*/ ctx[0].value);
			append(div, t);
			if (if_block) if_block.m(div, null);

			if (!mounted) {
				dispose = listen(select, "change", /*select_change_handler*/ ctx[8]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty & /*Object, setting, localize*/ 1) {
				each_value = Object.entries(/*setting*/ ctx[0].choices);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, select, destroy_block, create_each_block$5, null, get_each_context$5);
			}

			if (dirty & /*setting, Object*/ 1 && select_name_value !== (select_name_value = /*setting*/ ctx[0].key)) {
				attr(select, "name", select_name_value);
			}

			if (dirty & /*setting, Object*/ 1) {
				select_option(select, /*setting*/ ctx[0].value);
			}

			if (/*customFormulaSetting*/ ctx[4] && /*setting*/ ctx[0].value === CONSTANTS.RECOVERY.CUSTOM) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_2$3(ctx);
					if_block.c();
					if_block.m(div, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		d(detaching) {
			if (detaching) detach(div);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}

			if (if_block) if_block.d();
			mounted = false;
			dispose();
		}
	};
}

// (27:8) {#if setting.type === Boolean}
function create_if_block$5(ctx) {
	let input;
	let input_disabled_value;
	let mounted;
	let dispose;

	return {
		c() {
			input = element("input");
			attr(input, "type", "checkbox");
			input.disabled = input_disabled_value = /*setting*/ ctx[0].disabled;
		},
		m(target, anchor) {
			insert(target, input, anchor);
			input.checked = /*setting*/ ctx[0].value;

			if (!mounted) {
				dispose = listen(input, "change", /*input_change_handler*/ ctx[7]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty & /*setting, Object*/ 1 && input_disabled_value !== (input_disabled_value = /*setting*/ ctx[0].disabled)) {
				input.disabled = input_disabled_value;
			}

			if (dirty & /*setting, Object*/ 1) {
				input.checked = /*setting*/ ctx[0].value;
			}
		},
		d(detaching) {
			if (detaching) detach(input);
			mounted = false;
			dispose();
		}
	};
}

// (35:20) {#each Object.entries(setting.choices) as [key, choice], index (index)}
function create_each_block$5(key_1, ctx) {
	let option;
	let t_value = localize(/*choice*/ ctx[13]) + "";
	let t;
	let option_value_value;

	return {
		key: key_1,
		first: null,
		c() {
			option = element("option");
			t = text(t_value);
			option.__value = option_value_value = /*key*/ ctx[12];
			option.value = option.__value;
			this.first = option;
		},
		m(target, anchor) {
			insert(target, option, anchor);
			append(option, t);
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*setting*/ 1 && t_value !== (t_value = localize(/*choice*/ ctx[13]) + "")) set_data(t, t_value);

			if (dirty & /*setting, Object*/ 1 && option_value_value !== (option_value_value = /*key*/ ctx[12])) {
				option.__value = option_value_value;
				option.value = option.__value;
			}
		},
		d(detaching) {
			if (detaching) detach(option);
		}
	};
}

// (40:16) {#if customFormulaSetting && setting.value === CONSTANTS.RECOVERY.CUSTOM}
function create_if_block_2$3(ctx) {
	let input;
	let input_name_value;
	let mounted;
	let dispose;

	return {
		c() {
			input = element("input");
			attr(input, "name", input_name_value = /*setting*/ ctx[0].customFormula);
			attr(input, "type", "text");
			input.required = true;
			attr(input, "class", "svelte-1mvkigi");
			toggle_class(input, "invalid", /*customFormulaSetting*/ ctx[4].value === '');
		},
		m(target, anchor) {
			insert(target, input, anchor);
			set_input_value(input, /*customFormulaSetting*/ ctx[4].value);

			if (!mounted) {
				dispose = listen(input, "input", /*input_input_handler*/ ctx[9]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty & /*setting, Object*/ 1 && input_name_value !== (input_name_value = /*setting*/ ctx[0].customFormula)) {
				attr(input, "name", input_name_value);
			}

			if (dirty & /*customFormulaSetting*/ 16 && input.value !== /*customFormulaSetting*/ ctx[4].value) {
				set_input_value(input, /*customFormulaSetting*/ ctx[4].value);
			}

			if (dirty & /*customFormulaSetting*/ 16) {
				toggle_class(input, "invalid", /*customFormulaSetting*/ ctx[4].value === '');
			}
		},
		d(detaching) {
			if (detaching) detach(input);
			mounted = false;
			dispose();
		}
	};
}

function create_fragment$8(ctx) {
	let div2;
	let div0;
	let label;
	let t0_value = localize(/*setting*/ ctx[0].name) + "";
	let t0;
	let t1;
	let a;
	let i;
	let t2;
	let p;
	let t3_value = localize(/*setting*/ ctx[0].hint) + "";
	let t3;
	let t4;
	let div1;
	let mounted;
	let dispose;

	function select_block_type(ctx, dirty) {
		if (/*setting*/ ctx[0].type === Boolean) return create_if_block$5;
		if (/*setting*/ ctx[0].choices) return create_if_block_1$4;
		if (/*setting*/ ctx[0].type === Number) return create_if_block_3$2;
		return create_else_block$2;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type(ctx);

	return {
		c() {
			div2 = element("div");
			div0 = element("div");
			label = element("label");
			t0 = text(t0_value);
			t1 = space();
			a = element("a");
			i = element("i");
			t2 = space();
			p = element("p");
			t3 = text(t3_value);
			t4 = space();
			div1 = element("div");
			if_block.c();
			attr(i, "title", "Reset setting");
			attr(i, "class", "fas fa-undo reset-setting svelte-1mvkigi");
			attr(label, "class", "svelte-1mvkigi");
			attr(p, "class", "notes");
			attr(div0, "class", "label-side svelte-1mvkigi");
			attr(div1, "class", "form-fields input-side svelte-1mvkigi");
			attr(div2, "class", "form-group flexrow");
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			append(div2, div0);
			append(div0, label);
			append(label, t0);
			append(label, t1);
			append(label, a);
			append(a, i);
			append(div0, t2);
			append(div0, p);
			append(p, t3);
			append(div2, t4);
			append(div2, div1);
			if_block.m(div1, null);

			if (!mounted) {
				dispose = listen(i, "click", /*click_handler*/ ctx[6]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*setting*/ 1 && t0_value !== (t0_value = localize(/*setting*/ ctx[0].name) + "")) set_data(t0, t0_value);
			if (dirty & /*setting*/ 1 && t3_value !== (t3_value = localize(/*setting*/ ctx[0].hint) + "")) set_data(t3, t3_value);

			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(div1, null);
				}
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div2);
			if_block.d();
			mounted = false;
			dispose();
		}
	};
}

function instance$8($$self, $$props, $$invalidate) {
	let { settingsMap } = $$props;
	let { setting } = $$props;
	let { group } = $$props;
	let { setting_index } = $$props;
	let { resetSetting } = $$props;
	let customFormulaSetting = settingsMap.get(setting.customFormula);

	const click_handler = () => {
		resetSetting(group, setting_index);
	};

	function input_change_handler() {
		setting.value = this.checked;
		$$invalidate(0, setting);
	}

	function select_change_handler() {
		setting.value = select_value(this);
		$$invalidate(0, setting);
	}

	function input_input_handler() {
		customFormulaSetting.value = this.value;
		$$invalidate(4, customFormulaSetting);
	}

	function input_input_handler_1() {
		setting.value = to_number(this.value);
		$$invalidate(0, setting);
	}

	function input0_input_handler() {
		setting.value = this.value;
		$$invalidate(0, setting);
	}

	$$self.$$set = $$props => {
		if ('settingsMap' in $$props) $$invalidate(5, settingsMap = $$props.settingsMap);
		if ('setting' in $$props) $$invalidate(0, setting = $$props.setting);
		if ('group' in $$props) $$invalidate(1, group = $$props.group);
		if ('setting_index' in $$props) $$invalidate(2, setting_index = $$props.setting_index);
		if ('resetSetting' in $$props) $$invalidate(3, resetSetting = $$props.resetSetting);
	};

	return [
		setting,
		group,
		setting_index,
		resetSetting,
		customFormulaSetting,
		settingsMap,
		click_handler,
		input_change_handler,
		select_change_handler,
		input_input_handler,
		input_input_handler_1,
		input0_input_handler
	];
}

class Setting extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
			settingsMap: 5,
			setting: 0,
			group: 1,
			setting_index: 2,
			resetSetting: 3
		});
	}
}

/* scripts/formapplications/settings/settings-shell.svelte generated by Svelte v3.46.4 */

const { Map: Map_1 } = globals;

function get_each_context$4(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[11] = list[i];
	child_ctx[13] = i;
	return child_ctx;
}

function get_each_context_1$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[14] = list[i][0];
	child_ctx[15] = list[i][1];
	child_ctx[17] = i;
	return child_ctx;
}

// (81:20) {#if !setting.hidden}
function create_if_block_1$3(ctx) {
	let div;
	let setting;
	let current;
	let mounted;
	let dispose;

	setting = new Setting({
			props: {
				group: /*group*/ ctx[11],
				setting_index: /*setting_index*/ ctx[17],
				key: /*key*/ ctx[14],
				setting: /*setting*/ ctx[15],
				settingsMap: /*settingsMap*/ ctx[3],
				resetSetting: /*resetSetting*/ ctx[5]
			}
		});

	return {
		c() {
			div = element("div");
			create_component(setting.$$.fragment);
			attr(div, "class", "setting svelte-1tio1xs");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			mount_component(setting, div, null);
			current = true;

			if (!mounted) {
				dispose = listen(div, "change", /*validateSettings*/ ctx[4]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			const setting_changes = {};
			if (dirty & /*settings*/ 4) setting_changes.group = /*group*/ ctx[11];
			if (dirty & /*settings*/ 4) setting_changes.setting_index = /*setting_index*/ ctx[17];
			if (dirty & /*settings*/ 4) setting_changes.key = /*key*/ ctx[14];
			if (dirty & /*settings*/ 4) setting_changes.setting = /*setting*/ ctx[15];
			setting.$set(setting_changes);
		},
		i(local) {
			if (current) return;
			transition_in(setting.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(setting.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			destroy_component(setting);
			mounted = false;
			dispose();
		}
	};
}

// (80:16) {#each settings[group] as [key, setting], setting_index (key)}
function create_each_block_1$1(key_1, ctx) {
	let first;
	let if_block_anchor;
	let current;
	let if_block = !/*setting*/ ctx[15].hidden && create_if_block_1$3(ctx);

	return {
		key: key_1,
		first: null,
		c() {
			first = empty();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			this.first = first;
		},
		m(target, anchor) {
			insert(target, first, anchor);
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
			current = true;
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (!/*setting*/ ctx[15].hidden) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*settings*/ 4) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block_1$3(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(first);
			if (if_block) if_block.d(detaching);
			if (detaching) detach(if_block_anchor);
		}
	};
}

// (88:16) {#if settings[group].length < 4}
function create_if_block$4(ctx) {
	let div;
	let p0;
	let p1;
	let p2;
	let a;

	return {
		c() {
			div = element("div");
			p0 = element("p");
			p0.textContent = `${localize("REST-RECOVERY.Dialogs.ModuleConfig.MoreToCome")}`;
			p1 = element("p");
			p2 = element("p");
			a = element("a");
			a.textContent = `${localize("REST-RECOVERY.Dialogs.ModuleConfig.Request")}`;
			set_style(a, "color", "var(--color-text-hyperlink)");
			attr(a, "href", "https://github.com/fantasycalendar/FoundryVTT-RestRecovery/issues/new?assignees=&labels=&template=feature_request.md&title=");
			attr(a, "target", "_blank");
			set_style(div, "text-align", "center");
			set_style(div, "font-size", "1rem");
			set_style(div, "margin-top", "3rem");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, p0);
			append(div, p1);
			append(div, p2);
			append(p2, a);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

// (77:12) {#each Object.keys(settings) as group, index (index)}
function create_each_block$4(key_1, ctx) {
	let div;
	let each_blocks = [];
	let each_1_lookup = new Map_1();
	let t0;
	let t1;
	let div_data_tab_value;
	let current;
	let each_value_1 = /*settings*/ ctx[2][/*group*/ ctx[11]];
	const get_key = ctx => /*key*/ ctx[14];

	for (let i = 0; i < each_value_1.length; i += 1) {
		let child_ctx = get_each_context_1$1(ctx, each_value_1, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block_1$1(key, child_ctx));
	}

	let if_block = /*settings*/ ctx[2][/*group*/ ctx[11]].length < 4 && create_if_block$4();

	return {
		key: key_1,
		first: null,
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t0 = space();
			if (if_block) if_block.c();
			t1 = space();
			attr(div, "class", "tab flex");
			attr(div, "data-group", "primary");
			attr(div, "data-tab", div_data_tab_value = /*group*/ ctx[11]);
			this.first = div;
		},
		m(target, anchor) {
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			append(div, t0);
			if (if_block) if_block.m(div, null);
			append(div, t1);
			current = true;
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*validateSettings, Object, settings, settingsMap, resetSetting*/ 60) {
				each_value_1 = /*settings*/ ctx[2][/*group*/ ctx[11]];
				group_outros();
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, div, outro_and_destroy_block, create_each_block_1$1, t0, get_each_context_1$1);
				check_outros();
			}

			if (/*settings*/ ctx[2][/*group*/ ctx[11]].length < 4) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$4();
					if_block.c();
					if_block.m(div, t1);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (!current || dirty & /*settings*/ 4 && div_data_tab_value !== (div_data_tab_value = /*group*/ ctx[11])) {
				attr(div, "data-tab", div_data_tab_value);
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value_1.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}

			if (if_block) if_block.d();
		}
	};
}

// (63:0) <ApplicationShell bind:elementRoot>
function create_default_slot$3(ctx) {
	let form_1;
	let h2;
	let t1;
	let nav;
	let a0;
	let t3;
	let a1;
	let t5;
	let a2;
	let t7;
	let a3;
	let t9;
	let section;
	let each_blocks = [];
	let each_1_lookup = new Map_1();
	let t10;
	let footer;
	let button;
	let i;
	let t11;
	let t12_value = localize("REST-RECOVERY.Dialogs.ModuleConfig.Submit") + "";
	let t12;
	let current;
	let mounted;
	let dispose;
	let each_value = Object.keys(/*settings*/ ctx[2]);
	const get_key = ctx => /*index*/ ctx[13];

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context$4(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block$4(key, child_ctx));
	}

	return {
		c() {
			form_1 = element("form");
			h2 = element("h2");
			h2.textContent = `${localize("REST-RECOVERY.Dialogs.ModuleConfig.Title")}`;
			t1 = space();
			nav = element("nav");
			a0 = element("a");
			a0.textContent = `${localize("REST-RECOVERY.Dialogs.ModuleConfig.General")}`;
			t3 = space();
			a1 = element("a");
			a1.textContent = `${localize("REST-RECOVERY.Dialogs.ModuleConfig.LongRest")}`;
			t5 = space();
			a2 = element("a");
			a2.textContent = `${localize("REST-RECOVERY.Dialogs.ModuleConfig.ShortRest")}`;
			t7 = space();
			a3 = element("a");
			a3.textContent = `${localize("REST-RECOVERY.Dialogs.ModuleConfig.ItemNames")}`;
			t9 = space();
			section = element("section");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t10 = space();
			footer = element("footer");
			button = element("button");
			i = element("i");
			t11 = space();
			t12 = text(t12_value);
			set_style(h2, "text-align", "center");
			set_style(h2, "margin-bottom", "1rem");
			attr(a0, "class", "item active");
			attr(a0, "data-tab", "general");
			attr(a1, "class", "item");
			attr(a1, "data-tab", "longrest");
			attr(a2, "class", "item");
			attr(a2, "data-tab", "shortrest");
			attr(a3, "class", "item");
			attr(a3, "data-tab", "itemnames");
			attr(nav, "class", "tabs svelte-1tio1xs");
			attr(nav, "data-group", "primary");
			attr(section, "class", "tab-body svelte-1tio1xs");
			attr(i, "class", "far fa-save");
			attr(button, "type", "button");
			attr(footer, "class", "svelte-1tio1xs");
			attr(form_1, "autocomplete", "off");
		},
		m(target, anchor) {
			insert(target, form_1, anchor);
			append(form_1, h2);
			append(form_1, t1);
			append(form_1, nav);
			append(nav, a0);
			append(nav, t3);
			append(nav, a1);
			append(nav, t5);
			append(nav, a2);
			append(nav, t7);
			append(nav, a3);
			append(form_1, t9);
			append(form_1, section);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(section, null);
			}

			append(form_1, t10);
			append(form_1, footer);
			append(footer, button);
			append(button, i);
			append(button, t11);
			append(button, t12);
			/*form_1_binding*/ ctx[8](form_1);
			current = true;

			if (!mounted) {
				dispose = [
					listen(button, "click", /*requestSubmit*/ ctx[6]),
					listen(form_1, "submit", prevent_default(/*updateSettings*/ ctx[7]), { once: true })
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty & /*Object, settings, localize, validateSettings, settingsMap, resetSetting*/ 60) {
				each_value = Object.keys(/*settings*/ ctx[2]);
				group_outros();
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, section, outro_and_destroy_block, create_each_block$4, null, get_each_context$4);
				check_outros();
			}
		},
		i(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o(local) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d(detaching) {
			if (detaching) detach(form_1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}

			/*form_1_binding*/ ctx[8](null);
			mounted = false;
			run_all(dispose);
		}
	};
}

function create_fragment$7(ctx) {
	let applicationshell;
	let updating_elementRoot;
	let current;

	function applicationshell_elementRoot_binding(value) {
		/*applicationshell_elementRoot_binding*/ ctx[9](value);
	}

	let applicationshell_props = {
		$$slots: { default: [create_default_slot$3] },
		$$scope: { ctx }
	};

	if (/*elementRoot*/ ctx[0] !== void 0) {
		applicationshell_props.elementRoot = /*elementRoot*/ ctx[0];
	}

	applicationshell = new ApplicationShell({ props: applicationshell_props });
	binding_callbacks.push(() => bind(applicationshell, 'elementRoot', applicationshell_elementRoot_binding));

	return {
		c() {
			create_component(applicationshell.$$.fragment);
		},
		m(target, anchor) {
			mount_component(applicationshell, target, anchor);
			current = true;
		},
		p(ctx, [dirty]) {
			const applicationshell_changes = {};

			if (dirty & /*$$scope, form, settings*/ 262150) {
				applicationshell_changes.$$scope = { dirty, ctx };
			}

			if (!updating_elementRoot && dirty & /*elementRoot*/ 1) {
				updating_elementRoot = true;
				applicationshell_changes.elementRoot = /*elementRoot*/ ctx[0];
				add_flush_callback(() => updating_elementRoot = false);
			}

			applicationshell.$set(applicationshell_changes);
		},
		i(local) {
			if (current) return;
			transition_in(applicationshell.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(applicationshell.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(applicationshell, detaching);
		}
	};
}

function instance$7($$self, $$props, $$invalidate) {
	const { application } = getContext('external');
	let { elementRoot } = $$props;
	let form;
	let settingsMap = new Map();

	let settings = Object.entries(CONSTANTS.GET_DEFAULT_SETTINGS()).map(entry => {
		entry[1].value = getSetting(entry[0]);
		entry[1].disabled = false;
		settingsMap.set(entry[0], entry[1]);
		return entry;
	}).reduce(
		function (r, a) {
			r[a[1].group] = r[a[1].group] || [];
			r[a[1].group].push(a);
			return r;
		},
		Object.create(null)
	);

	validateSettings();

	function validateSettings() {
		for (const group of Object.keys(settings)) {
			for (let index = 0; index < settings[group].length; index++) {
				if (!settings[group][index][1].validate) continue;
				$$invalidate(2, settings[group][index][1].disabled = !settingsMap.get(settings[group][index][1].validate).value, settings);
				if (!settings[group][index][1].disabled) continue;
				$$invalidate(2, settings[group][index][1].value = settings[group][index][1].default, settings);
			}
		}
	}

	function resetSetting(group, index) {
		$$invalidate(2, settings[group][index][1].value = settings[group][index][1].default, settings);
		validateSettings();
	}

	function requestSubmit() {
		form.requestSubmit();
	}

	async function updateSettings() {
		for (let group of Object.values(settings)) {
			for (let [key, setting] of group) {
				await game.settings.set(CONSTANTS.MODULE_NAME, key, setting.value);
			}
		}

		application.close();
	}

	function form_1_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			form = $$value;
			$$invalidate(1, form);
		});
	}

	function applicationshell_elementRoot_binding(value) {
		elementRoot = value;
		$$invalidate(0, elementRoot);
	}

	$$self.$$set = $$props => {
		if ('elementRoot' in $$props) $$invalidate(0, elementRoot = $$props.elementRoot);
	};

	return [
		elementRoot,
		form,
		settings,
		settingsMap,
		validateSettings,
		resetSetting,
		requestSubmit,
		updateSettings,
		form_1_binding,
		applicationshell_elementRoot_binding
	];
}

class Settings_shell extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$7, create_fragment$7, safe_not_equal, { elementRoot: 0 });
	}

	get elementRoot() {
		return this.$$.ctx[0];
	}

	set elementRoot(elementRoot) {
		this.$$set({ elementRoot });
		flush();
	}
}

class Settings extends SvelteApplication {
  constructor(options = {}, dialogData = {}) {
    super(_objectSpread2({
      id: `rest-recovery-app`,
      title: "Rest Recovery",
      svelte: {
        class: Settings_shell,
        target: document.body
      },
      width: 600,
      tabs: [{
        navSelector: ".tabs",
        contentSelector: ".tab-body",
        initial: "mainsettings"
      }]
    }, options), {
      dialogData
    });
  }

  static getActiveApp() {
    return Object.values(ui.windows).find(app => app.id === "rest-recovery-app");
  }

  static async show(options = {}, dialogData = {}) {
    const app = this.getActiveApp();
    if (app) return app.render(false, {
      focus: true
    });
    return new Promise(resolve => {
      options.resolve = resolve;
      new this(options, dialogData).render(true, {
        focus: true
      });
    });
  }

}

class SettingsShim extends FormApplication {
  /**
   * @inheritDoc
   */
  constructor() {
    super({});
    Settings.show();
  }

  async _updateObject(event, formData) {}

  render() {
    this.close();
  }

}

function registerSettings() {
  game.settings.registerMenu(CONSTANTS.MODULE_NAME, "resetToDefaults", {
    name: "REST-RECOVERY.Settings.Reset.Title",
    label: "REST-RECOVERY.Settings.Reset.Label",
    hint: "REST-RECOVERY.Settings.Reset.Hint",
    icon: "fas fa-refresh",
    type: ResetSettingsDialog,
    restricted: true
  });
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

  game.settings.register(CONSTANTS.MODULE_NAME, "quick-hd-roll", {
    name: "REST-RECOVERY.Settings.QuickHDRoll.Title",
    hint: "REST-RECOVERY.Settings.QuickHDRoll.Hint",
    scope: "client",
    config: true,
    default: true,
    type: Boolean
  });
}

class ResetSettingsDialog extends FormApplication {
  constructor(...args) {
    super(...args);
    return new Dialog({
      title: game.i18n.localize("REST-RECOVERY.Dialogs.ResetSettings.Title"),
      content: `<p class="rest-recovery-dialog-important">${game.i18n.localize("REST-RECOVERY.Dialogs.ResetSettings.Content")}</p>`,
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize("REST-RECOVERY.Dialogs.ResetSettings.Confirm"),
          callback: () => {
            resetSettings();
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize("REST-RECOVERY.Dialogs.ResetSettings.Cancel")
        }
      },
      default: "cancel"
    });
  }

}

async function resetSettings() {
  for (const [name, data] of Object.entries(CONSTANTS.GET_DEFAULT_SETTINGS())) {
    await game.settings.set(CONSTANTS.MODULE_NAME, name, data.default);
  }

  window.location.reload();
}

function is_date(obj) {
  return Object.prototype.toString.call(obj) === '[object Date]';
}

function get_interpolator(a, b) {
  if (a === b || a !== a) return () => a;
  const type = typeof a;

  if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
    throw new Error('Cannot interpolate values of different type');
  }

  if (Array.isArray(a)) {
    const arr = b.map((bi, i) => {
      return get_interpolator(a[i], bi);
    });
    return t => arr.map(fn => fn(t));
  }

  if (type === 'object') {
    if (!a || !b) throw new Error('Object cannot be null');

    if (is_date(a) && is_date(b)) {
      a = a.getTime();
      b = b.getTime();
      const delta = b - a;
      return t => new Date(a + t * delta);
    }

    const keys = Object.keys(b);
    const interpolators = {};
    keys.forEach(key => {
      interpolators[key] = get_interpolator(a[key], b[key]);
    });
    return t => {
      const result = {};
      keys.forEach(key => {
        result[key] = interpolators[key](t);
      });
      return result;
    };
  }

  if (type === 'number') {
    const delta = b - a;
    return t => a + t * delta;
  }

  throw new Error(`Cannot interpolate ${type} values`);
}

function tweened(value, defaults = {}) {
  const store = writable(value);
  let task;
  let target_value = value;

  function set(new_value, opts) {
    if (value == null) {
      store.set(value = new_value);
      return Promise.resolve();
    }

    target_value = new_value;
    let previous_task = task;
    let started = false;
    let {
      delay = 0,
      duration = 400,
      easing = identity,
      interpolate = get_interpolator
    } = assign(assign({}, defaults), opts);

    if (duration === 0) {
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }

      store.set(value = target_value);
      return Promise.resolve();
    }

    const start = now() + delay;
    let fn;
    task = loop(now => {
      if (now < start) return true;

      if (!started) {
        fn = interpolate(value, new_value);
        if (typeof duration === 'function') duration = duration(value, new_value);
        started = true;
      }

      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }

      const elapsed = now - start;

      if (elapsed > duration) {
        store.set(value = new_value);
        return false;
      } // @ts-ignore


      store.set(value = fn(easing(elapsed / duration)));
      return true;
    });
    return task.promise;
  }

  return {
    set,
    update: (fn, opts) => set(fn(target_value, value), opts),
    subscribe: store.subscribe
  };
}

/* scripts/formapplications/components/HealthBar.svelte generated by Svelte v3.46.4 */

function create_fragment$6(ctx) {
	let div4;
	let div3;
	let div0;
	let t0;
	let div1;
	let t1;
	let div2;
	let t2;

	return {
		c() {
			div4 = element("div");
			div3 = element("div");
			div0 = element("div");
			t0 = space();
			div1 = element("div");
			t1 = space();
			div2 = element("div");
			t2 = text(/*text*/ ctx[0]);
			attr(div0, "class", "progress_ghost svelte-zkgr9f");
			set_style(div0, "width", /*$progressBarGhost*/ ctx[3] * 100 + "%");
			attr(div1, "class", "progress svelte-zkgr9f");
			set_style(div1, "width", /*$progressBar*/ ctx[4] * 100 + "%");
			attr(div2, "class", "overlay svelte-zkgr9f");
			attr(div3, "class", "healthbar svelte-zkgr9f");
		},
		m(target, anchor) {
			insert(target, div4, anchor);
			append(div4, div3);
			append(div3, div0);
			append(div3, t0);
			append(div3, div1);
			append(div3, t1);
			append(div3, div2);
			append(div2, t2);
		},
		p(ctx, [dirty]) {
			if (dirty & /*$progressBarGhost*/ 8) {
				set_style(div0, "width", /*$progressBarGhost*/ ctx[3] * 100 + "%");
			}

			if (dirty & /*$progressBar*/ 16) {
				set_style(div1, "width", /*$progressBar*/ ctx[4] * 100 + "%");
			}

			if (dirty & /*text*/ 1) set_data(t2, /*text*/ ctx[0]);
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div4);
		}
	};
}

function instance$6($$self, $$props, $$invalidate) {
	let $progressBarGhost,
		$$unsubscribe_progressBarGhost = noop,
		$$subscribe_progressBarGhost = () => ($$unsubscribe_progressBarGhost(), $$unsubscribe_progressBarGhost = subscribe(progressBarGhost, $$value => $$invalidate(3, $progressBarGhost = $$value)), progressBarGhost);

	let $progressBar,
		$$unsubscribe_progressBar = noop,
		$$subscribe_progressBar = () => ($$unsubscribe_progressBar(), $$unsubscribe_progressBar = subscribe(progressBar, $$value => $$invalidate(4, $progressBar = $$value)), progressBar);

	$$self.$$.on_destroy.push(() => $$unsubscribe_progressBarGhost());
	$$self.$$.on_destroy.push(() => $$unsubscribe_progressBar());
	let { text } = $$props;
	let { progress = 0 } = $$props;
	let { progressGhost = 0 } = $$props;
	let { progressBar = tweened(0, { duration: 400, easing: cubicOut }) } = $$props;
	$$subscribe_progressBar();
	let { progressBarGhost = tweened(0, { duration: 400, easing: cubicOut }) } = $$props;
	$$subscribe_progressBarGhost();

	function updateProgress() {
		progressBar.set(progress);
		progressBarGhost.set(progressGhost);
	}

	$$self.$$set = $$props => {
		if ('text' in $$props) $$invalidate(0, text = $$props.text);
		if ('progress' in $$props) $$invalidate(5, progress = $$props.progress);
		if ('progressGhost' in $$props) $$invalidate(6, progressGhost = $$props.progressGhost);
		if ('progressBar' in $$props) $$subscribe_progressBar($$invalidate(1, progressBar = $$props.progressBar));
		if ('progressBarGhost' in $$props) $$subscribe_progressBarGhost($$invalidate(2, progressBarGhost = $$props.progressBarGhost));
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*progress*/ 32) {
			(updateProgress());
		}

		if ($$self.$$.dirty & /*progressGhost*/ 64) {
			(updateProgress());
		}
	};

	return [
		text,
		progressBar,
		progressBarGhost,
		$progressBarGhost,
		$progressBar,
		progress,
		progressGhost
	];
}

class HealthBar extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
			text: 0,
			progress: 5,
			progressGhost: 6,
			progressBar: 1,
			progressBarGhost: 2
		});
	}
}

/* scripts/formapplications/components/Dialog.svelte generated by Svelte v3.46.4 */

function create_if_block$3(ctx) {
	let p;
	let i;
	let i_class_value;

	return {
		c() {
			p = element("p");
			i = element("i");
			attr(i, "class", i_class_value = "" + (null_to_empty(/*icon*/ ctx[0]) + " svelte-iivrm9"));
			attr(p, "class", "header-icon svelte-iivrm9");
		},
		m(target, anchor) {
			insert(target, p, anchor);
			append(p, i);
		},
		p(ctx, dirty) {
			if (dirty & /*icon*/ 1 && i_class_value !== (i_class_value = "" + (null_to_empty(/*icon*/ ctx[0]) + " svelte-iivrm9"))) {
				attr(i, "class", i_class_value);
			}
		},
		d(detaching) {
			if (detaching) detach(p);
		}
	};
}

function create_fragment$5(ctx) {
	let div;
	let t0;
	let p0;
	let strong;
	let t1;
	let t2;
	let p1;
	let t3;
	let if_block = /*icon*/ ctx[0] && create_if_block$3(ctx);

	return {
		c() {
			div = element("div");
			if (if_block) if_block.c();
			t0 = space();
			p0 = element("p");
			strong = element("strong");
			t1 = text(/*header*/ ctx[1]);
			t2 = space();
			p1 = element("p");
			t3 = text(/*content*/ ctx[2]);
			attr(p0, "class", "header svelte-iivrm9");
			attr(div, "class", "svelte-iivrm9");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			if (if_block) if_block.m(div, null);
			append(div, t0);
			append(div, p0);
			append(p0, strong);
			append(strong, t1);
			append(div, t2);
			append(div, p1);
			append(p1, t3);
		},
		p(ctx, [dirty]) {
			if (/*icon*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$3(ctx);
					if_block.c();
					if_block.m(div, t0);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*header*/ 2) set_data(t1, /*header*/ ctx[1]);
			if (dirty & /*content*/ 4) set_data(t3, /*content*/ ctx[2]);
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			if (if_block) if_block.d();
		}
	};
}

function instance$5($$self, $$props, $$invalidate) {
	let { icon } = $$props;
	let { header } = $$props;
	let { content } = $$props;

	$$self.$$set = $$props => {
		if ('icon' in $$props) $$invalidate(0, icon = $$props.icon);
		if ('header' in $$props) $$invalidate(1, header = $$props.header);
		if ('content' in $$props) $$invalidate(2, content = $$props.content);
	};

	return [icon, header, content];
}

class Dialog$1 extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$5, create_fragment$5, safe_not_equal, { icon: 0, header: 1, content: 2 });
	}
}

/* scripts/formapplications/components/HitDieRoller.svelte generated by Svelte v3.46.4 */

function get_each_context$3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[9] = list[i][0];
	child_ctx[10] = list[i][1];
	child_ctx[12] = i;
	return child_ctx;
}

// (20:16) {#each Object.entries(healthData.availableHitDice) as [hitDice, num], index (index)}
function create_each_block$3(key_1, ctx) {
	let option;
	let t0_value = /*hitDice*/ ctx[9] + "";
	let t0;
	let t1;
	let t2_value = /*num*/ ctx[10] + "";
	let t2;
	let t3;
	let t4_value = localize("DND5E.available") + "";
	let t4;
	let t5;
	let option_value_value;

	return {
		key: key_1,
		first: null,
		c() {
			option = element("option");
			t0 = text(t0_value);
			t1 = text(" (");
			t2 = text(t2_value);
			t3 = space();
			t4 = text(t4_value);
			t5 = text(")");
			option.__value = option_value_value = /*hitDice*/ ctx[9];
			option.value = option.__value;
			this.first = option;
		},
		m(target, anchor) {
			insert(target, option, anchor);
			append(option, t0);
			append(option, t1);
			append(option, t2);
			append(option, t3);
			append(option, t4);
			append(option, t5);
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*healthData*/ 2 && t0_value !== (t0_value = /*hitDice*/ ctx[9] + "")) set_data(t0, t0_value);
			if (dirty & /*healthData*/ 2 && t2_value !== (t2_value = /*num*/ ctx[10] + "")) set_data(t2, t2_value);

			if (dirty & /*healthData*/ 2 && option_value_value !== (option_value_value = /*hitDice*/ ctx[9])) {
				option.__value = option_value_value;
				option.value = option.__value;
			}
		},
		d(detaching) {
			if (detaching) detach(option);
		}
	};
}

// (27:12) {#if autoRollEnabled}
function create_if_block_2$2(ctx) {
	let button;
	let i;
	let t0;
	let t1_value = localize("REST-RECOVERY.Dialogs.ShortRest.AutoRoll") + "";
	let t1;
	let button_disabled_value;
	let mounted;
	let dispose;

	return {
		c() {
			button = element("button");
			i = element("i");
			t0 = space();
			t1 = text(t1_value);
			attr(i, "class", "fas fa-redo");
			attr(button, "type", "button");
			button.disabled = button_disabled_value = /*isAtMaxHP*/ ctx[2] || /*healthData*/ ctx[1].totalHitDice === 0 || /*healthData*/ ctx[1].availableHitDice[/*selectedHitDice*/ ctx[0]] === 0;
		},
		m(target, anchor) {
			insert(target, button, anchor);
			append(button, i);
			append(button, t0);
			append(button, t1);

			if (!mounted) {
				dispose = listen(button, "click", /*click_handler_1*/ ctx[8]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty & /*isAtMaxHP, healthData, selectedHitDice, Object*/ 7 && button_disabled_value !== (button_disabled_value = /*isAtMaxHP*/ ctx[2] || /*healthData*/ ctx[1].totalHitDice === 0 || /*healthData*/ ctx[1].availableHitDice[/*selectedHitDice*/ ctx[0]] === 0)) {
				button.disabled = button_disabled_value;
			}
		},
		d(detaching) {
			if (detaching) detach(button);
			mounted = false;
			dispose();
		}
	};
}

// (33:8) {#if healthData.totalHitDice === 0}
function create_if_block_1$2(ctx) {
	let p;

	return {
		c() {
			p = element("p");
			p.textContent = `${localize("DND5E.ShortRestNoHD")}`;
			attr(p, "class", "notes");
		},
		m(target, anchor) {
			insert(target, p, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(p);
		}
	};
}

// (36:8) {#if isAtMaxHP}
function create_if_block$2(ctx) {
	let p;

	return {
		c() {
			p = element("p");
			p.textContent = `${localize("REST-RECOVERY.Dialogs.ShortRest.FullHealth")}`;
			attr(p, "class", "notes");
		},
		m(target, anchor) {
			insert(target, p, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(p);
		}
	};
}

function create_fragment$4(ctx) {
	let div3;
	let div2;
	let div0;
	let label;
	let t1;
	let div1;
	let select;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let t2;
	let button;
	let i;
	let t3;
	let t4_value = localize("DND5E.Roll") + "";
	let t4;
	let button_disabled_value;
	let t5;
	let t6;
	let t7;
	let mounted;
	let dispose;
	let each_value = Object.entries(/*healthData*/ ctx[1].availableHitDice);
	const get_key = ctx => /*index*/ ctx[12];

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context$3(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
	}

	let if_block0 = /*autoRollEnabled*/ ctx[5] && create_if_block_2$2(ctx);
	let if_block1 = /*healthData*/ ctx[1].totalHitDice === 0 && create_if_block_1$2();
	let if_block2 = /*isAtMaxHP*/ ctx[2] && create_if_block$2();

	return {
		c() {
			div3 = element("div");
			div2 = element("div");
			div0 = element("div");
			label = element("label");
			label.textContent = `${localize("DND5E.ShortRestSelect")}`;
			t1 = space();
			div1 = element("div");
			select = element("select");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t2 = space();
			button = element("button");
			i = element("i");
			t3 = space();
			t4 = text(t4_value);
			t5 = space();
			if (if_block0) if_block0.c();
			t6 = space();
			if (if_block1) if_block1.c();
			t7 = space();
			if (if_block2) if_block2.c();
			attr(select, "name", "hd");
			set_style(select, "height", "26px");
			if (/*selectedHitDice*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[6].call(select));
			attr(i, "class", "fas fa-dice-d20");
			attr(button, "type", "button");
			button.disabled = button_disabled_value = /*isAtMaxHP*/ ctx[2] || /*healthData*/ ctx[1].totalHitDice === 0 || /*healthData*/ ctx[1].availableHitDice[/*selectedHitDice*/ ctx[0]] === 0;
			attr(div1, "class", "form-fields");
			attr(div2, "class", "flexcol");
			attr(div3, "class", "form-group");
		},
		m(target, anchor) {
			insert(target, div3, anchor);
			append(div3, div2);
			append(div2, div0);
			append(div0, label);
			append(div2, t1);
			append(div2, div1);
			append(div1, select);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(select, null);
			}

			select_option(select, /*selectedHitDice*/ ctx[0]);
			append(div1, t2);
			append(div1, button);
			append(button, i);
			append(button, t3);
			append(button, t4);
			append(div1, t5);
			if (if_block0) if_block0.m(div1, null);
			append(div2, t6);
			if (if_block1) if_block1.m(div2, null);
			append(div2, t7);
			if (if_block2) if_block2.m(div2, null);

			if (!mounted) {
				dispose = [
					listen(select, "change", /*select_change_handler*/ ctx[6]),
					listen(button, "click", /*click_handler*/ ctx[7])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*Object, healthData, localize*/ 2) {
				each_value = Object.entries(/*healthData*/ ctx[1].availableHitDice);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, select, destroy_block, create_each_block$3, null, get_each_context$3);
			}

			if (dirty & /*selectedHitDice, Object, healthData*/ 3) {
				select_option(select, /*selectedHitDice*/ ctx[0]);
			}

			if (dirty & /*isAtMaxHP, healthData, selectedHitDice, Object*/ 7 && button_disabled_value !== (button_disabled_value = /*isAtMaxHP*/ ctx[2] || /*healthData*/ ctx[1].totalHitDice === 0 || /*healthData*/ ctx[1].availableHitDice[/*selectedHitDice*/ ctx[0]] === 0)) {
				button.disabled = button_disabled_value;
			}

			if (/*autoRollEnabled*/ ctx[5]) if_block0.p(ctx, dirty);

			if (/*healthData*/ ctx[1].totalHitDice === 0) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_1$2();
					if_block1.c();
					if_block1.m(div2, t7);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (/*isAtMaxHP*/ ctx[2]) {
				if (if_block2) {
					if_block2.p(ctx, dirty);
				} else {
					if_block2 = create_if_block$2();
					if_block2.c();
					if_block2.m(div2, null);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div3);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}

			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$4($$self, $$props, $$invalidate) {
	let { healthData } = $$props;
	let { selectedHitDice } = $$props;
	let { isAtMaxHP = false } = $$props;

	let { onHitDiceFunction = () => {
		
	} } = $$props;

	let { onAutoFunction = () => {
		
	} } = $$props;

	let autoRollEnabled = getSetting(CONSTANTS.SETTINGS.ENABLE_AUTO_ROLL_HIT_DICE);

	function select_change_handler() {
		selectedHitDice = select_value(this);
		$$invalidate(0, selectedHitDice);
		$$invalidate(1, healthData);
	}

	const click_handler = event => {
		onHitDiceFunction(event);
	};

	const click_handler_1 = event => {
		onAutoFunction(event);
	};

	$$self.$$set = $$props => {
		if ('healthData' in $$props) $$invalidate(1, healthData = $$props.healthData);
		if ('selectedHitDice' in $$props) $$invalidate(0, selectedHitDice = $$props.selectedHitDice);
		if ('isAtMaxHP' in $$props) $$invalidate(2, isAtMaxHP = $$props.isAtMaxHP);
		if ('onHitDiceFunction' in $$props) $$invalidate(3, onHitDiceFunction = $$props.onHitDiceFunction);
		if ('onAutoFunction' in $$props) $$invalidate(4, onAutoFunction = $$props.onAutoFunction);
	};

	return [
		selectedHitDice,
		healthData,
		isAtMaxHP,
		onHitDiceFunction,
		onAutoFunction,
		autoRollEnabled,
		select_change_handler,
		click_handler,
		click_handler_1
	];
}

class HitDieRoller extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
			healthData: 1,
			selectedHitDice: 0,
			isAtMaxHP: 2,
			onHitDiceFunction: 3,
			onAutoFunction: 4
		});
	}
}

const rests = new Map();
class RestWorkflow {
  constructor(actor, longRest) {
    this.actor = actor;
    this.longRest = longRest;
    this.finished = false;
  }

  async setup() {
    this.fetchHealthData();
    this.fetchFeatures();
    this.fetchSpellData();
    return this;
  }

  get maxHP() {
    var _this$actor$data$data;

    return this.actor.data.data.attributes.hp.max + ((_this$actor$data$data = this.actor.data.data.attributes.hp.tempmax) !== null && _this$actor$data$data !== void 0 ? _this$actor$data$data : 0);
  }

  get currHP() {
    return this.actor.data.data.attributes.hp.value;
  }

  get healthPercentage() {
    return this.currHP / this.maxHP;
  }

  get healthRegained() {
    return this.currHP - this.healthData.startingHealth;
  }

  get totalHitDice() {
    return this.actor.data.data.attributes.hd;
  }

  get recoveredSlots() {
    return Object.fromEntries(Object.entries(this.spellData.slots).map(entry => {
      return [entry[0], entry[1] ? entry[1].reduce((acc, slot) => {
        return acc + (slot.empty && slot.checked ? 1 : 0);
      }, 0) : 0];
    }).filter(entry => entry[1]));
  }

  static get(actor) {
    return rests.get(actor.uuid);
  }

  static remove(actor) {
    return rests.delete(actor.uuid);
  }

  static make(actor, longRest = false) {
    this.remove(actor);
    const workflow = new this(actor, longRest);
    rests.set(actor.uuid, workflow);
    return workflow.setup();
  }

  static wrapperFn(actor, wrapped, args, fnName, runWrap = true) {
    const workflow = this.get(actor);

    if (!runWrap) {
      if (workflow && workflow[fnName]) {
        return wrapped(workflow[fnName](args));
      }

      return wrapped(args);
    }

    let updates = wrapped(args);

    if (workflow && workflow[fnName]) {
      updates = workflow[fnName](updates, args);
    }

    return updates;
  }

  fetchHealthData() {
    this.healthData = {
      startingHitDice: this.actor.data.data.attributes.hd,
      startingHealth: this.actor.data.data.attributes.hp.value,
      hitDiceSpent: 0
    };
    this.refreshHealthData();
  }

  refreshHealthData() {
    this.healthData.availableHitDice = this.getHitDice();
    this.healthData.totalHitDice = this.totalHitDice;

    if (this.longRest && (getSetting(CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE) || getSetting(CONSTANTS.SETTINGS.HP_MULTIPLIER) !== CONSTANTS.RECOVERY.FULL)) {
      let {
        hitPointsRecovered
      } = this.actor._getRestHitPointRecovery();

      this.healthData.hitPointsToRegain = hitPointsRecovered;
    }
  }

  getHitDice() {
    return this.actor.data.items.reduce((hd, item) => {
      if (item.type === "class") {
        const d = item.data.data;
        const denom = d.hitDice || "d6";
        const available = parseInt(d.levels || 1) - parseInt(d.hitDiceUsed || 0);
        hd[denom] = denom in hd ? hd[denom] + available : available;
      }

      return hd;
    }, {});
  }

  async fetchSpellData() {
    var _this$actor$items$fin, _this$actor$items$fin2, _this$actor$items$fin3, _this$actor$items$fin4, _this$actor$items$fin5, _this$actor$items$fin6, _this$actor$items$get;

    this.spellData = {
      slots: {},
      missingSlots: false,
      feature: false,
      pointsSpent: 0,
      pointsTotal: 0,
      className: ""
    };
    const wizardLevel = ((_this$actor$items$fin = this.actor.items.find(item => {
      return item.type === "class" && item.name === getSetting(CONSTANTS.SETTINGS.WIZARD_CLASS, true);
    })) === null || _this$actor$items$fin === void 0 ? void 0 : (_this$actor$items$fin2 = _this$actor$items$fin.data) === null || _this$actor$items$fin2 === void 0 ? void 0 : (_this$actor$items$fin3 = _this$actor$items$fin2.data) === null || _this$actor$items$fin3 === void 0 ? void 0 : _this$actor$items$fin3.levels) || 0;
    const wizardFeature = this.actor.items.getName(getSetting(CONSTANTS.SETTINGS.ARCANE_RECOVERY, true)) || false;
    const druidLevel = ((_this$actor$items$fin4 = this.actor.items.find(item => {
      return item.type === "class" && item.data.data.levels >= 2 && item.name === getSetting(CONSTANTS.SETTINGS.DRUID_CLASS, true);
    })) === null || _this$actor$items$fin4 === void 0 ? void 0 : (_this$actor$items$fin5 = _this$actor$items$fin4.data) === null || _this$actor$items$fin5 === void 0 ? void 0 : (_this$actor$items$fin6 = _this$actor$items$fin5.data) === null || _this$actor$items$fin6 === void 0 ? void 0 : _this$actor$items$fin6.levels) || 0;
    const druidFeature = (_this$actor$items$get = this.actor.items.getName(getSetting(CONSTANTS.SETTINGS.NATURAL_RECOVERY, true))) !== null && _this$actor$items$get !== void 0 ? _this$actor$items$get : false;

    for (let [level, slot] of Object.entries(this.actor.data.data.spells)) {
      if (!slot.max && !slot.override || level === "pact") {
        continue;
      }

      let levelNum = Number(level.substr(5));

      if (Number(levelNum) > 5) {
        break;
      }

      this.spellData.slots[levelNum] = [];

      for (let i = 0; i < slot.max; i++) {
        this.spellData.slots[levelNum].push({
          checked: i < slot.value,
          disabled: false,
          alwaysDisabled: i < slot.value,
          empty: i >= slot.value
        });
        this.spellData.missingSlots = this.spellData.missingSlots || i >= slot.value;
      }
    }

    const wizardFeatureUse = wizardLevel && wizardFeature && this.patchSpellFeature(wizardFeature);
    const druidFeatureUse = druidLevel && druidFeature && this.patchSpellFeature(druidFeature);

    if (wizardLevel > druidLevel || druidLevel > wizardLevel && !druidFeatureUse) {
      this.spellData.has_feature_use = wizardFeatureUse;
      this.spellData.feature = wizardFeature;
      this.spellData.pointsTotal = Math.ceil(wizardLevel / 2);
      this.spellData.className = getSetting(CONSTANTS.SETTINGS.WIZARD_CLASS, true);
    } else if (druidLevel > wizardLevel || wizardLevel > druidLevel && !wizardFeatureUse) {
      this.spellData.has_feature_use = druidFeatureUse;
      this.spellData.feature = druidFeature;
      this.spellData.pointsTotal = Math.ceil(druidLevel / 2);
      this.spellData.className = getSetting(CONSTANTS.SETTINGS.DRUID_CLASS, true);
    }
  }

  patchSpellFeature(feature) {
    if (feature && (feature.data.data.activation.type !== "special" || feature.data.data.uses.value === null || feature.data.data.uses.max === null || feature.data.data.uses.per !== "lr")) {
      this.actor.updateEmbeddedDocuments("Item", [{
        _id: feature.id,
        "data.activation.type": "special",
        "data.uses.value": 1,
        "data.uses.max": 1,
        "data.uses.per": "lr"
      }]);
      ui.notifications.info(game.i18n.format("REST-RECOVERY.PatchedRecovery", {
        actorName: this.actor.name,
        recoveryName: this.spellData.feature.name
      }));
      return true;
    }

    return feature.data.data.uses.value > 0;
  }

  fetchFeatures() {
    this.features = {
      bard: false,
      bardLevel: false,
      songOfRest: false,
      usedSongOfRest: false,
      chef: false,
      usedChef: false
    };
    const ignoreInactivePlayers = getSetting(CONSTANTS.SETTINGS.IGNORE_INACTIVE_PLAYERS);
    let characters = game.actors.filter(actor => actor.data.type === "character" && actor.hasPlayerOwner);

    for (let actor of characters) {
      // Only consider the actor if it has more than 0 hp, as features cannot be used if they are unconscious
      if (actor.data.data.attributes.hp.value <= 0) continue;

      if (ignoreInactivePlayers) {
        let found = game.users.find(user => {
          return actor === user.character && user.active;
        });
        if (!found) continue;
      }

      const bardClass = actor.items.find(item => item.type === "class" && item.name === getSetting(CONSTANTS.SETTINGS.BARD_CLASS, true));

      if (bardClass) {
        const songOfRest = actor.items.getName(getSetting(CONSTANTS.SETTINGS.SONG_OF_REST, true));

        if (songOfRest) {
          const level = bardClass.data.data.levels;
          this.features.bard = this.features.bardLevel > level ? this.features.bard : actor;
          this.features.bardLevel = this.features.bardLevel > level ? this.features.bardLevel : level;

          if (this.features.bardLevel >= 17) {
            this.features.songOfRest = "1d12";
          } else if (this.features.bardLevel >= 13) {
            this.features.songOfRest = "1d10";
          } else if (this.features.bardLevel >= 9) {
            this.features.songOfRest = "1d8";
          } else if (this.features.bardLevel >= 2) {
            this.features.songOfRest = "1d6";
          }
        }
      }

      const chefFeat = actor.items.getName(getSetting(CONSTANTS.SETTINGS.CHEF_FEAT, true));
      const chefTools = getSetting(CONSTANTS.SETTINGS.CHEF_TOOLS, true) !== "" ? actor.items.getName(getSetting(CONSTANTS.SETTINGS.CHEF_TOOLS, true)) : true;

      if (chefFeat && chefTools) {
        if (!this.features.chef) {
          this.features.chef = [];
        }

        this.features.chef.push(actor);
      }
    }
  }

  async autoSpendHitDice() {
    const avgHitDiceRegain = this.getAverageHitDiceRoll();
    const threshold = Math.max(Math.max(avgHitDiceRegain, this.healthData.hitPointsToRegain) + 5);
    await this.actor.autoSpendHitDice({
      threshold
    });
    this.healthData.availableHitDice = this.getHitDice();
    this.healthData.totalHitDice = this.totalHitDice;
  }

  getAverageHitDiceRoll() {
    var _periapt$data, _periapt$data$data, _blessing$data, _durable, _durable$data, _blackBlood, _blackBlood$data;

    const availableHitDice = Object.entries(this.healthData.availableHitDice).filter(entry => entry[1]);
    if (!availableHitDice.length) return 0;
    const periapt = getSetting(CONSTANTS.SETTINGS.PERIAPT_ITEM) ? this.actor.items.getName(getSetting(CONSTANTS.SETTINGS.PERIAPT_ITEM, true)) : false;
    const blessing = getSetting(CONSTANTS.SETTINGS.WOUND_CLOSURE_BLESSING) ? this.actor.items.getName(getSetting(CONSTANTS.SETTINGS.WOUND_CLOSURE_BLESSING, true)) : false;
    const periapt_mod = periapt && (periapt === null || periapt === void 0 ? void 0 : (_periapt$data = periapt.data) === null || _periapt$data === void 0 ? void 0 : (_periapt$data$data = _periapt$data.data) === null || _periapt$data$data === void 0 ? void 0 : _periapt$data$data.attunement) === 2 || blessing && (blessing === null || blessing === void 0 ? void 0 : (_blessing$data = blessing.data) === null || _blessing$data === void 0 ? void 0 : _blessing$data.type) === "feat" ? 3 : 1;
    let durable = getSetting(CONSTANTS.SETTINGS.DURABLE_FEAT) ? this.actor.items.getName(getSetting(CONSTANTS.SETTINGS.DURABLE_FEAT, true)) : false;
    durable = durable && ((_durable = durable) === null || _durable === void 0 ? void 0 : (_durable$data = _durable.data) === null || _durable$data === void 0 ? void 0 : _durable$data.type) === "feat";
    let blackBlood = getSetting(CONSTANTS.SETTINGS.BLACK_BLOOD_FEATURE) ? this.actor.items.getName(getSetting(CONSTANTS.SETTINGS.BLACK_BLOOD_FEATURE, true)) : false;
    blackBlood = blackBlood && ((_blackBlood = blackBlood) === null || _blackBlood === void 0 ? void 0 : (_blackBlood$data = _blackBlood.data) === null || _blackBlood$data === void 0 ? void 0 : _blackBlood$data.type) === "feat";
    const conMod = this.actor.data.data.abilities.con.mod;
    const totalHitDice = availableHitDice.reduce((acc, entry) => acc + entry[1], 0);
    return availableHitDice.map(entry => {
      const dieSize = Number(entry[0].split('d')[1]);
      let average = dieSize / 2 + 0.5;

      if (blackBlood) {
        average = Array.from(Array(dieSize).keys()).reduce((acc, num) => acc + Math.max(average, num + 1), 0) / dieSize;
      }

      average *= periapt_mod;

      if (durable) {
        if (conMod <= 0) {
          average += (-2 * conMod + 1) / dieSize;
        } else {
          average += (conMod - 1) * conMod / (2 * dieSize);
        }
      }

      return average * entry[1];
    }).reduce((acc, num) => acc + num, 0) / totalHitDice;
  }

  async rollHitDice(hitDice, dialog) {
    const roll = await this.actor.rollHitDie(hitDice, {
      dialog
    });
    if (!roll) return;
    this.healthData.availableHitDice = this.getHitDice();
    this.healthData.totalHitDice = this.totalHitDice;
    if (this.longRest) return true;
    let hpRegained = 0;

    if (this.features.songOfRest && !this.features.usedSongOfRest) {
      const _roll = new Roll(this.features.songOfRest).evaluate({
        async: false
      });

      hpRegained += _roll.total;
      const isOwnBard = this.features.bard === this.actor;
      await _roll.toMessage({
        flavor: game.i18n.format("REST-RECOVERY.Chat.SongOfRest" + (isOwnBard ? "Self" : ""), {
          name: this.actor.name,
          bard: this.features.bard.name
        }),
        speaker: ChatMessage.getSpeaker({
          actor: this.actor
        })
      });
      this.features.usedSongOfRest = true;
    }

    if (this.features.chef.length > 0 && !this.features.usedChef) {
      const chefActor = this.features.chef[Math.floor(Math.random() * this.features.chef.length)];

      const _roll2 = new Roll('1d8').evaluate({
        async: false
      });

      hpRegained += _roll2.total;
      const isOwnChef = this.features.bard === this.actor;
      await _roll2.toMessage({
        flavor: game.i18n.format("REST-RECOVERY.Chat.Chef" + (isOwnChef ? "Self" : ""), {
          name: this.actor.name,
          chef: chefActor.name
        }),
        speaker: ChatMessage.getSpeaker({
          actor: this.actor
        })
      });
      this.features.usedChef = true;
    }

    if (hpRegained > 0) {
      var _ref, _this$actor$data$data2;

      const curHP = this.actor.data.data.attributes.hp.value;
      const maxHP = this.actor.data.data.attributes.hp.max + ((_ref = (_this$actor$data$data2 = this.actor.data.data.attributes.hp.tempmax) !== null && _this$actor$data$data2 !== void 0 ? _this$actor$data$data2 : 0) !== null && _ref !== void 0 ? _ref : 0);
      await this.actor.update({
        "data.attributes.hp.value": Math.min(maxHP, curHP + hpRegained)
      });
    }

    return true;
  }

  spendSpellPoint(level, add) {
    this.spellData.pointsSpent += Number(level) * (add ? 1 : -1);
    const pointsLeft = this.spellData.pointsTotal - this.spellData.pointsSpent;

    for (let _level of Object.keys(this.spellData.slots)) {
      for (let i = 0; i < this.spellData.slots[_level].length; i++) {
        const slot = this.spellData.slots[_level][i];
        this.spellData.slots[_level][i].disabled = slot.alwaysDisabled || Number(_level) > pointsLeft && !slot.checked;
      }
    }
  }

  async regainHitDice() {
    if (!getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE)) return;

    let {
      maxHitDice
    } = this._getMaxHitDiceRecovery();

    let {
      updates,
      hitDiceRecovered
    } = this.actor._getRestHitDiceRecovery({
      maxHitDice,
      forced: true
    });

    let hitDiceLeftToRecover = maxHitDice - hitDiceRecovered;

    if (hitDiceLeftToRecover > 0) {
      const sortedClasses = Object.values(this.actor.classes).sort((a, b) => {
        return (parseInt(b.data.data.hitDice.slice(1)) || 0) - (parseInt(a.data.data.hitDice.slice(1)) || 0);
      });
      const biggestClass = sortedClasses[0];
      const update = updates.find(update => update._id === biggestClass.id);

      if (update) {
        if (updates[updates.indexOf(update)]["data.hitDiceUsed"] >= 0) {
          updates[updates.indexOf(update)]["data.hitDiceUsed"] -= hitDiceLeftToRecover;
        }
      } else {
        updates.push({
          _id: biggestClass.id,
          "data.hitDiceUsed": hitDiceLeftToRecover * -1
        });
      }
    }

    await this.actor.updateEmbeddedDocuments("Item", updates);
    this.healthData.availableHitDice = this.getHitDice();
    this.healthData.totalHitDice = this.totalHitDice;
  }

  preFinishRestMessage() {
    Hooks.once("preCreateChatMessage", (message, data) => {
      let newContent = `<p>${data.content}</p><p>${game.i18n.localize("REST-RECOVERY.Chat.RegainedSpellSlots")}</p>`;
      newContent += "<ul>";

      for (const [level, num] of Object.entries(this.recoveredSlots)) {
        const numText = game.i18n.localize("REST-RECOVERY.NumberToText." + num);
        const levelText = ordinalSuffixOf(level);
        const localization = "REST-RECOVERY.Chat.SpellSlotList" + (num > 1 ? "Plural" : "");
        newContent += `<li>${game.i18n.format(localization, {
          number: numText,
          level: levelText
        })}</li>`;
      }

      newContent += "</ul>";
      message.data.update({
        content: newContent
      });
    });
  }

  _finishedRest() {
    const updates = {};
    const maxShortRests = getSetting(CONSTANTS.SETTINGS.MAX_SHORT_RESTS);

    if (maxShortRests > 0) {
      if (this.longRest) {
        updates[`flags.${CONSTANTS.MODULE_NAME}.${CONSTANTS.FLAG_NAME}.currentShortRests`] = 0;
      } else {
        var _this$actor$getFlag;

        const currentShortRests = ((_this$actor$getFlag = this.actor.getFlag(CONSTANTS.MODULE_NAME, CONSTANTS.FLAG_NAME)) === null || _this$actor$getFlag === void 0 ? void 0 : _this$actor$getFlag.currentShortRests) || 0;
        updates[`flags.${CONSTANTS.MODULE_NAME}.${CONSTANTS.FLAG_NAME}.currentShortRests`] = currentShortRests + 1;
      }
    }

    return updates;
  }

  _evaluateFormula(formula, data) {
    const rollFormula = Roll.replaceFormulaData(formula, data, {
      warn: true
    });
    return new Roll(rollFormula).evaluate({
      async: false
    }).total;
  }

  _getRestHitPointRecovery(result) {
    if (!this.longRest) {
      result.hitPointsRecovered = Math.max(0, result.hitPointsRecovered);
      return result;
    }

    const multiplier = determineLongRestMultiplier(CONSTANTS.SETTINGS.HP_MULTIPLIER);
    const maxHP = this.actor.data.data.attributes.hp.max;
    const currentHP = this.actor.data.data.attributes.hp.value;
    let recoveredHP = this.healthData.hitPointsToRegain;

    if (!recoveredHP) {
      recoveredHP = typeof multiplier === "string" ? Math.floor(this._evaluateFormula(multiplier, foundry.utils.deepClone(this.actor.data.data))) : Math.floor(maxHP * multiplier);
    }

    result.updates["data.attributes.hp.value"] = Math.min(maxHP, currentHP + recoveredHP);
    result.hitPointsRecovered = Math.min(maxHP - currentHP, recoveredHP);

    if (getSetting(CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE)) {
      result.hitPointsRecovered += currentHP - this.healthData.startingHealth;
    }

    return result;
  }

  _getRestHitDiceRecoveryPre({
    maxHitDice = undefined
  } = {}) {
    if (!this.longRest) return {};
    return this._getMaxHitDiceRecovery({
      maxHitDice
    });
  }

  _getRestHitDiceRecoveryPost(results, {
    forced = false
  } = {}) {
    if (forced) {
      return results;
    }

    const sortedClasses = Object.values(this.actor.classes).sort((a, b) => {
      return (parseInt(b.data.data.hitDice.slice(1)) || 0) - (parseInt(a.data.data.hitDice.slice(1)) || 0);
    });

    for (const item of sortedClasses) {
      if (item.data.data.hitDiceUsed < 0) {
        const update = results.updates.find(update => update._id === item.id);

        if (update) {
          results.updates[results.updates.indexOf(update)]["data.hitDiceUsed"] = 0;
        } else {
          results.updates.push({
            _id: item.id,
            "data.hitDiceUsed": 0
          });
        }
      } else {
        const update = results.updates.find(update => update._id === item.id);

        if (update) {
          results.updates.splice(results.updates.indexOf(update), 1);
        }
      }
    }

    results.hitDiceRecovered = Math.max(0, Math.min(this.actor.data.data.details.level, this.totalHitDice) - this.healthData.startingHitDice);
    return results;
  }

  _getMaxHitDiceRecovery({
    maxHitDice = undefined
  } = {}) {
    const multiplier = determineLongRestMultiplier(CONSTANTS.SETTINGS.HD_MULTIPLIER);
    const roundingMethod = determineRoundingMethod(CONSTANTS.SETTINGS.HD_ROUNDING);
    const actorLevel = this.actor.data.data.details.level;

    if (typeof multiplier === "string") {
      var _maxHitDice;

      const customRegain = this._evaluateFormula(multiplier, foundry.utils.deepClone(this.actor.data.data));

      maxHitDice = Math.clamped(roundingMethod(customRegain), 0, (_maxHitDice = maxHitDice) !== null && _maxHitDice !== void 0 ? _maxHitDice : actorLevel);
    } else {
      var _maxHitDice2;

      maxHitDice = Math.clamped(roundingMethod(actorLevel * multiplier), multiplier ? 1 : 0, (_maxHitDice2 = maxHitDice) !== null && _maxHitDice2 !== void 0 ? _maxHitDice2 : actorLevel);
    }

    return {
      maxHitDice
    };
  }

  _getRestResourceRecovery(updates, {
    recoverShortRestResources = true,
    recoverLongRestResources = true
  } = {}) {
    const finishedRestUpdates = this._finishedRest(updates);

    const multiplier = determineLongRestMultiplier(CONSTANTS.SETTINGS.RESOURCES_MULTIPLIER);
    if (multiplier === 1.0) return _objectSpread2(_objectSpread2({}, updates), finishedRestUpdates);
    if (!multiplier) return finishedRestUpdates;

    for (const [key, resource] of Object.entries(this.actor.data.data.resources)) {
      if (Number.isNumeric(resource.max)) {
        if (recoverShortRestResources && resource.sr) {
          finishedRestUpdates[`data.resources.${key}.value`] = Number(resource.max);
        } else if (recoverLongRestResources && resource.lr) {
          const recoverResources = typeof multiplier === "string" ? this._evaluateFormula(multiplier, {
            resource: foundry.utils.deepClone(resource)
          }) : Math.max(Math.floor(resource.max * multiplier), 1);
          finishedRestUpdates[`data.resources.${key}.value`] = Math.min(resource.value + recoverResources, resource.max);
        }
      }
    }

    return finishedRestUpdates;
  }

  _getRestSpellRecovery(updates, {
    recoverSpells = true
  } = {}) {
    // Long rest
    if (recoverSpells) {
      const multiplier = determineLongRestMultiplier(CONSTANTS.SETTINGS.SPELLS_MULTIPLIER);

      for (let [level, slot] of Object.entries(this.actor.data.data.spells)) {
        if (!slot.override && !slot.max) continue;
        let spellMax = slot.override || slot.max;

        let _recoverSpells = typeof multiplier === "string" ? Math.max(this._evaluateFormula(multiplier, {
          slot: foundry.utils.deepClone(slot)
        }), 1) : Math.max(Math.floor(spellMax * multiplier), multiplier ? 1 : multiplier);

        updates[`data.spells.${level}.value`] = Math.min(slot.value + _recoverSpells, spellMax);
      } // Short rest

    } else {
      if (this.spellData.feature) {
        for (const [slot, num] of Object.entries(this.recoveredSlots)) {
          const prop = `data.spells.spell${slot}.value`;
          updates[prop] = (updates[prop] || foundry.utils.getProperty(this.actor.data, prop) || 0) + num;
        }
      }
    }

    return updates;
  }

  _getRestItemUsesRecovery(updates, args) {
    if (this.longRest) {
      return this.recoverItemsUses(updates, args);
    }

    if (this.spellData.pointsSpent && this.spellData.feature) {
      updates.push({
        _id: this.spellData.feature.id,
        "data.uses.value": 0
      });
    }

    return updates;
  }

  recoverItemsUses(updates, args) {
    const {
      recoverLongRestUses,
      recoverDailyUses
    } = args;
    const featsMultiplier = determineLongRestMultiplier(CONSTANTS.SETTINGS.USES_FEATS_MULTIPLIER);
    const othersMultiplier = determineLongRestMultiplier(CONSTANTS.SETTINGS.USES_OTHERS_MULTIPLIER);
    const dailyMultiplier = determineLongRestMultiplier(CONSTANTS.SETTINGS.USES_DAILY_MULTIPLIER);

    for (const item of this.actor.items) {
      if (item.data.data.uses) {
        if (recoverLongRestUses && item.data.data.uses.per === "lr") {
          updates = this.recoverItemUse(updates, item, item.type === "feat" ? featsMultiplier : othersMultiplier);
        } else if (recoverDailyUses && item.data.data.uses.per === "day") {
          updates = this.recoverItemUse(updates, item, dailyMultiplier);
        }
      } else if (recoverLongRestUses && item.data.data.recharge && item.data.data.recharge.value) {
        updates.push({
          _id: item.id,
          "data.recharge.charged": true
        });
      }
    }

    return updates;
  }

  recoverItemUse(updates, item, multiplier) {
    const usesMax = item.data.data.uses.max;
    const usesCur = item.data.data.uses.value;
    const amountToRecover = typeof multiplier === "string" ? this._evaluateFormula(multiplier, foundry.utils.deepClone(item.data.data)) : Math.max(Math.floor(usesMax * multiplier), multiplier ? 1 : 0);
    const update = updates.find(update => update._id === item.id);
    const recoverValue = Math.min(usesCur + amountToRecover, usesMax);

    if (update) {
      update["data.uses.value"] = recoverValue;
    } else {
      updates.push({
        _id: item.id,
        "data.uses.value": recoverValue
      });
    }

    return updates;
  }

}

/* scripts/formapplications/short-rest/short-rest-shell.svelte generated by Svelte v3.46.4 */

function get_each_context$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[29] = list[i][0];
	child_ctx[30] = list[i][1];
	child_ctx[32] = i;
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[33] = list[i];
	child_ctx[34] = list;
	child_ctx[35] = i;
	return child_ctx;
}

// (178:8) {:else}
function create_else_block_2(ctx) {
	let div;
	let label;
	let t1;
	let p;

	return {
		c() {
			div = element("div");
			label = element("label");
			label.textContent = `${localize("REST-RECOVERY.Dialogs.ShortRest.NoMoreRests")}`;
			t1 = space();
			p = element("p");

			p.textContent = `${localize("REST-RECOVERY.Dialogs.ShortRest.NoMoreRestsSmall", {
				max_short_rests: /*maxShortRests*/ ctx[10]
			})}`;

			attr(div, "class", "form-group");
			attr(p, "class", "notes");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, label);
			insert(target, t1, anchor);
			insert(target, p, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			if (detaching) detach(t1);
			if (detaching) detach(p);
		}
	};
}

// (114:8) {#if enableShortRest}
function create_if_block_2$1(ctx) {
	let p;
	let t1;
	let hitdieroller;
	let t2;
	let t3;
	let if_block1_anchor;
	let current;

	hitdieroller = new HitDieRoller({
			props: {
				selectedHitDice: /*selectedHitDice*/ ctx[13],
				healthData: /*healthData*/ ctx[8],
				isAtMaxHP: /*currHP*/ ctx[3] >= /*maxHP*/ ctx[4],
				onHitDiceFunction: /*rollHitDice*/ ctx[16],
				onAutoFunction: /*autoRollHitDie*/ ctx[17]
			}
		});

	let if_block0 = /*spellData*/ ctx[9].feature && create_if_block_4$1(ctx);
	let if_block1 = /*promptNewDay*/ ctx[12] && create_if_block_3$1(ctx);

	return {
		c() {
			p = element("p");
			p.textContent = `${localize("DND5E.ShortRestHint")}`;
			t1 = space();
			create_component(hitdieroller.$$.fragment);
			t2 = space();
			if (if_block0) if_block0.c();
			t3 = space();
			if (if_block1) if_block1.c();
			if_block1_anchor = empty();
		},
		m(target, anchor) {
			insert(target, p, anchor);
			insert(target, t1, anchor);
			mount_component(hitdieroller, target, anchor);
			insert(target, t2, anchor);
			if (if_block0) if_block0.m(target, anchor);
			insert(target, t3, anchor);
			if (if_block1) if_block1.m(target, anchor);
			insert(target, if_block1_anchor, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const hitdieroller_changes = {};
			if (dirty[0] & /*healthData*/ 256) hitdieroller_changes.healthData = /*healthData*/ ctx[8];
			if (dirty[0] & /*currHP, maxHP*/ 24) hitdieroller_changes.isAtMaxHP = /*currHP*/ ctx[3] >= /*maxHP*/ ctx[4];
			hitdieroller.$set(hitdieroller_changes);

			if (/*spellData*/ ctx[9].feature) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_4$1(ctx);
					if_block0.c();
					if_block0.m(t3.parentNode, t3);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*promptNewDay*/ ctx[12]) if_block1.p(ctx, dirty);
		},
		i(local) {
			if (current) return;
			transition_in(hitdieroller.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(hitdieroller.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(p);
			if (detaching) detach(t1);
			destroy_component(hitdieroller, detaching);
			if (detaching) detach(t2);
			if (if_block0) if_block0.d(detaching);
			if (detaching) detach(t3);
			if (if_block1) if_block1.d(detaching);
			if (detaching) detach(if_block1_anchor);
		}
	};
}

// (126:12) {#if spellData.feature}
function create_if_block_4$1(ctx) {
	let div;
	let label;

	let t0_value = localize("REST-RECOVERY.Dialogs.ShortRest.SpellSlotRecovery", {
		featureName: /*spellData*/ ctx[9].feature.name
	}) + "";

	let t0;
	let t1;
	let if_block_anchor;

	function select_block_type_1(ctx, dirty) {
		if (/*spellData*/ ctx[9].missingSlots && !/*spellData*/ ctx[9].has_feature_use) return create_if_block_5$1;
		if (/*spellData*/ ctx[9].missingSlots) return create_if_block_6$1;
		return create_else_block_1$1;
	}

	let current_block_type = select_block_type_1(ctx);
	let if_block = current_block_type(ctx);

	return {
		c() {
			div = element("div");
			label = element("label");
			t0 = text(t0_value);
			t1 = space();
			if_block.c();
			if_block_anchor = empty();
			attr(div, "class", "form-group");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, label);
			append(label, t0);
			insert(target, t1, anchor);
			if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*spellData*/ 512 && t0_value !== (t0_value = localize("REST-RECOVERY.Dialogs.ShortRest.SpellSlotRecovery", {
				featureName: /*spellData*/ ctx[9].feature.name
			}) + "")) set_data(t0, t0_value);

			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			}
		},
		d(detaching) {
			if (detaching) detach(div);
			if (detaching) detach(t1);
			if_block.d(detaching);
			if (detaching) detach(if_block_anchor);
		}
	};
}

// (162:16) {:else}
function create_else_block_1$1(ctx) {
	let p;

	return {
		c() {
			p = element("p");
			p.textContent = `${localize("REST-RECOVERY.Dialogs.ShortRest.FullSpells")}`;
			attr(p, "class", "notes");
		},
		m(target, anchor) {
			insert(target, p, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(p);
		}
	};
}

// (138:49) 
function create_if_block_6$1(ctx) {
	let each_blocks = [];
	let each_1_lookup = new Map();
	let t0;
	let p;

	let t1_value = localize("REST-RECOVERY.Dialogs.ShortRest.SpellSlotsLeft", {
		spellSlotsLeft: /*spellData*/ ctx[9].pointsTotal - /*spellData*/ ctx[9].pointsSpent
	}) + "";

	let t1;
	let each_value = Object.entries(/*spellData*/ ctx[9].slots);
	const get_key = ctx => /*levelIndex*/ ctx[32];

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context$2(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
	}

	return {
		c() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t0 = space();
			p = element("p");
			t1 = text(t1_value);
			set_style(p, "font-style", "italic");
		},
		m(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert(target, t0, anchor);
			insert(target, p, anchor);
			append(p, t1);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*spellData, spendSpellPoint*/ 262656) {
				each_value = Object.entries(/*spellData*/ ctx[9].slots);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, t0.parentNode, destroy_block, create_each_block$2, t0, get_each_context$2);
			}

			if (dirty[0] & /*spellData*/ 512 && t1_value !== (t1_value = localize("REST-RECOVERY.Dialogs.ShortRest.SpellSlotsLeft", {
				spellSlotsLeft: /*spellData*/ ctx[9].pointsTotal - /*spellData*/ ctx[9].pointsSpent
			}) + "")) set_data(t1, t1_value);
		},
		d(detaching) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d(detaching);
			}

			if (detaching) detach(t0);
			if (detaching) detach(p);
		}
	};
}

// (132:16) {#if spellData.missingSlots && !spellData.has_feature_use}
function create_if_block_5$1(ctx) {
	let p;

	let t_value = localize("REST-RECOVERY.Dialogs.ShortRest.NoFeatureUse", {
		featureName: /*spellData*/ ctx[9].feature.name
	}) + "";

	let t;

	return {
		c() {
			p = element("p");
			t = text(t_value);
			attr(p, "class", "notes");
		},
		m(target, anchor) {
			insert(target, p, anchor);
			append(p, t);
		},
		p(ctx, dirty) {
			if (dirty[0] & /*spellData*/ 512 && t_value !== (t_value = localize("REST-RECOVERY.Dialogs.ShortRest.NoFeatureUse", {
				featureName: /*spellData*/ ctx[9].feature.name
			}) + "")) set_data(t, t_value);
		},
		d(detaching) {
			if (detaching) detach(p);
		}
	};
}

// (145:36) {#each slots as slot, slotIndex (slotIndex)}
function create_each_block_1(key_1, ctx) {
	let input;
	let input_disabled_value;
	let mounted;
	let dispose;

	function input_change_handler() {
		/*input_change_handler*/ ctx[21].call(input, /*each_value_1*/ ctx[34], /*slotIndex*/ ctx[35]);
	}

	function change_handler(...args) {
		return /*change_handler*/ ctx[22](/*level*/ ctx[29], /*slotIndex*/ ctx[35], ...args);
	}

	return {
		key: key_1,
		first: null,
		c() {
			input = element("input");
			attr(input, "type", "checkbox");
			input.disabled = input_disabled_value = /*slot*/ ctx[33].disabled || /*slot*/ ctx[33].alwaysDisabled;
			this.first = input;
		},
		m(target, anchor) {
			insert(target, input, anchor);
			input.checked = /*slot*/ ctx[33].checked;

			if (!mounted) {
				dispose = [
					listen(input, "change", input_change_handler),
					listen(input, "change", change_handler)
				];

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty[0] & /*spellData*/ 512 && input_disabled_value !== (input_disabled_value = /*slot*/ ctx[33].disabled || /*slot*/ ctx[33].alwaysDisabled)) {
				input.disabled = input_disabled_value;
			}

			if (dirty[0] & /*spellData*/ 512) {
				input.checked = /*slot*/ ctx[33].checked;
			}
		},
		d(detaching) {
			if (detaching) detach(input);
			mounted = false;
			run_all(dispose);
		}
	};
}

// (140:20) {#each Object.entries(spellData.slots) as [level, slots], levelIndex (levelIndex)}
function create_each_block$2(key_1, ctx) {
	let div3;
	let div2;
	let div0;
	let t0;
	let t1_value = /*level*/ ctx[29] + "";
	let t1;
	let t2;
	let t3;
	let div1;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let each_value_1 = /*slots*/ ctx[30];
	const get_key = ctx => /*slotIndex*/ ctx[35];

	for (let i = 0; i < each_value_1.length; i += 1) {
		let child_ctx = get_each_context_1(ctx, each_value_1, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
	}

	return {
		key: key_1,
		first: null,
		c() {
			div3 = element("div");
			div2 = element("div");
			div0 = element("div");
			t0 = text("Level ");
			t1 = text(t1_value);
			t2 = text(":");
			t3 = space();
			div1 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			set_style(div0, "margin-right", "5px");
			set_style(div0, "flex", "0 1 auto");
			set_style(div1, "flex", "0 1 auto");
			attr(div2, "class", "form-fields");
			set_style(div2, "justify-content", "flex-start");
			attr(div3, "class", "form-group");
			this.first = div3;
		},
		m(target, anchor) {
			insert(target, div3, anchor);
			append(div3, div2);
			append(div2, div0);
			append(div0, t0);
			append(div0, t1);
			append(div0, t2);
			append(div2, t3);
			append(div2, div1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div1, null);
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty[0] & /*spellData*/ 512 && t1_value !== (t1_value = /*level*/ ctx[29] + "")) set_data(t1, t1_value);

			if (dirty[0] & /*spellData, spendSpellPoint*/ 262656) {
				each_value_1 = /*slots*/ ctx[30];
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, div1, destroy_block, create_each_block_1, null, get_each_context_1);
			}
		},
		d(detaching) {
			if (detaching) detach(div3);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}
		}
	};
}

// (170:12) {#if promptNewDay}
function create_if_block_3$1(ctx) {
	let div;
	let label;
	let t1;
	let input;
	let t2;
	let p;
	let mounted;
	let dispose;

	return {
		c() {
			div = element("div");
			label = element("label");
			label.textContent = `${localize("DND5E.NewDay")}`;
			t1 = space();
			input = element("input");
			t2 = space();
			p = element("p");
			p.textContent = `${localize("DND5E.NewDayHint")}`;
			attr(input, "type", "checkbox");
			attr(input, "name", "newDay");
			attr(p, "class", "hint");
			attr(div, "class", "form-group");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, label);
			append(div, t1);
			append(div, input);
			input.checked = /*newDay*/ ctx[7];
			append(div, t2);
			append(div, p);

			if (!mounted) {
				dispose = listen(input, "change", /*input_change_handler_1*/ ctx[23]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*newDay*/ 128) {
				input.checked = /*newDay*/ ctx[7];
			}
		},
		d(detaching) {
			if (detaching) detach(div);
			mounted = false;
			dispose();
		}
	};
}

// (196:12) {:else}
function create_else_block$1(ctx) {
	let button;
	let i;
	let t0;
	let t1_value = localize("Okay") + "";
	let t1;
	let mounted;
	let dispose;

	return {
		c() {
			button = element("button");
			i = element("i");
			t0 = space();
			t1 = text(t1_value);
			attr(i, "class", "fas fa-check");
			attr(button, "type", "button");
			attr(button, "class", "dialog-button");
		},
		m(target, anchor) {
			insert(target, button, anchor);
			append(button, i);
			append(button, t0);
			append(button, t1);

			if (!mounted) {
				dispose = listen(button, "click", /*cancel*/ ctx[15]);
				mounted = true;
			}
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(button);
			mounted = false;
			dispose();
		}
	};
}

// (191:12) {#if enableShortRest}
function create_if_block$1(ctx) {
	let button;
	let i;
	let t0;
	let t1_value = localize("DND5E.Rest") + "";
	let t1;
	let t2;
	let if_block_anchor;
	let mounted;
	let dispose;
	let if_block = !/*startedShortRest*/ ctx[2] && create_if_block_1$1(ctx);

	return {
		c() {
			button = element("button");
			i = element("i");
			t0 = space();
			t1 = text(t1_value);
			t2 = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			attr(i, "class", "fas fa-bed");
			attr(button, "type", "button");
			attr(button, "class", "dialog-button");
		},
		m(target, anchor) {
			insert(target, button, anchor);
			append(button, i);
			append(button, t0);
			append(button, t1);
			insert(target, t2, anchor);
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);

			if (!mounted) {
				dispose = listen(button, "click", /*requestSubmit*/ ctx[1]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (!/*startedShortRest*/ ctx[2]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_1$1(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		d(detaching) {
			if (detaching) detach(button);
			if (detaching) detach(t2);
			if (if_block) if_block.d(detaching);
			if (detaching) detach(if_block_anchor);
			mounted = false;
			dispose();
		}
	};
}

// (193:16) {#if !startedShortRest}
function create_if_block_1$1(ctx) {
	let button;
	let i;
	let t0;
	let t1_value = localize("Cancel") + "";
	let t1;
	let mounted;
	let dispose;

	return {
		c() {
			button = element("button");
			i = element("i");
			t0 = space();
			t1 = text(t1_value);
			attr(i, "class", "fas fa-times");
			attr(button, "type", "button");
			attr(button, "class", "dialog-button");
		},
		m(target, anchor) {
			insert(target, button, anchor);
			append(button, i);
			append(button, t0);
			append(button, t1);

			if (!mounted) {
				dispose = listen(button, "click", /*cancel*/ ctx[15]);
				mounted = true;
			}
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(button);
			mounted = false;
			dispose();
		}
	};
}

// (111:0) <ApplicationShell bind:elementRoot>
function create_default_slot$2(ctx) {
	let form_1;
	let current_block_type_index;
	let if_block0;
	let t0;
	let healthbar;
	let t1;
	let footer;
	let current;
	let mounted;
	let dispose;
	const if_block_creators = [create_if_block_2$1, create_else_block_2];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*enableShortRest*/ ctx[11]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	healthbar = new HealthBar({
			props: {
				text: "HP: " + /*currHP*/ ctx[3] + " / " + /*maxHP*/ ctx[4],
				progress: /*healthPercentage*/ ctx[5]
			}
		});

	function select_block_type_2(ctx, dirty) {
		if (/*enableShortRest*/ ctx[11]) return create_if_block$1;
		return create_else_block$1;
	}

	let current_block_type = select_block_type_2(ctx);
	let if_block1 = current_block_type(ctx);

	return {
		c() {
			form_1 = element("form");
			if_block0.c();
			t0 = space();
			create_component(healthbar.$$.fragment);
			t1 = space();
			footer = element("footer");
			if_block1.c();
			attr(footer, "class", "flexrow");
			set_style(footer, "margin-top", "0.5rem");
			attr(form_1, "autocomplete", "off");
			attr(form_1, "id", "short-rest-hd");
			attr(form_1, "class", "dialog-content");
		},
		m(target, anchor) {
			insert(target, form_1, anchor);
			if_blocks[current_block_type_index].m(form_1, null);
			append(form_1, t0);
			mount_component(healthbar, form_1, null);
			append(form_1, t1);
			append(form_1, footer);
			if_block1.m(footer, null);
			/*form_1_binding*/ ctx[24](form_1);
			current = true;

			if (!mounted) {
				dispose = listen(form_1, "submit", prevent_default(/*updateSettings*/ ctx[14]));
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if_block0.p(ctx, dirty);
			const healthbar_changes = {};
			if (dirty[0] & /*currHP, maxHP*/ 24) healthbar_changes.text = "HP: " + /*currHP*/ ctx[3] + " / " + /*maxHP*/ ctx[4];
			if (dirty[0] & /*healthPercentage*/ 32) healthbar_changes.progress = /*healthPercentage*/ ctx[5];
			healthbar.$set(healthbar_changes);
			if_block1.p(ctx, dirty);
		},
		i(local) {
			if (current) return;
			transition_in(if_block0);
			transition_in(healthbar.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(if_block0);
			transition_out(healthbar.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(form_1);
			if_blocks[current_block_type_index].d();
			destroy_component(healthbar);
			if_block1.d();
			/*form_1_binding*/ ctx[24](null);
			mounted = false;
			dispose();
		}
	};
}

function create_fragment$3(ctx) {
	let applicationshell;
	let updating_elementRoot;
	let current;

	function applicationshell_elementRoot_binding(value) {
		/*applicationshell_elementRoot_binding*/ ctx[25](value);
	}

	let applicationshell_props = {
		$$slots: { default: [create_default_slot$2] },
		$$scope: { ctx }
	};

	if (/*elementRoot*/ ctx[0] !== void 0) {
		applicationshell_props.elementRoot = /*elementRoot*/ ctx[0];
	}

	applicationshell = new ApplicationShell({ props: applicationshell_props });
	binding_callbacks.push(() => bind(applicationshell, 'elementRoot', applicationshell_elementRoot_binding));

	return {
		c() {
			create_component(applicationshell.$$.fragment);
		},
		m(target, anchor) {
			mount_component(applicationshell, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const applicationshell_changes = {};

			if (dirty[0] & /*form, startedShortRest, currHP, maxHP, healthPercentage, newDay, spellData, healthData*/ 1020 | dirty[1] & /*$$scope*/ 32) {
				applicationshell_changes.$$scope = { dirty, ctx };
			}

			if (!updating_elementRoot && dirty[0] & /*elementRoot*/ 1) {
				updating_elementRoot = true;
				applicationshell_changes.elementRoot = /*elementRoot*/ ctx[0];
				add_flush_callback(() => updating_elementRoot = false);
			}

			applicationshell.$set(applicationshell_changes);
		},
		i(local) {
			if (current) return;
			transition_in(applicationshell.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(applicationshell.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(applicationshell, detaching);
		}
	};
}

function instance$3($$self, $$props, $$invalidate) {
	const { application } = getContext('external');
	let { elementRoot } = $$props;
	let { actor } = $$props;
	let currHP;
	let maxHP;
	let healthPercentage;
	let form;
	let startedShortRest = false;
	const maxShortRests = getSetting(CONSTANTS.SETTINGS.MAX_SHORT_RESTS);
	const currentShortRests = actor.getFlag(CONSTANTS.MODULE_NAME, CONSTANTS.FLAG_NAME)?.currentShortRests || 0;
	const enableShortRest = maxShortRests === 0 || currentShortRests < maxShortRests;
	let newDay = false;
	let promptNewDay = game.settings.get("dnd5e", "restVariant") !== "epic";
	const workflow = RestWorkflow.get(actor);
	let healthData = workflow.healthData;
	let spellData = workflow.spellData;
	let selectedHitDice = Object.entries(workflow.healthData.availableHitDice).filter(entry => entry[1])?.[0]?.[0];
	updateHealthBar();

	async function requestSubmit() {
		if (workflow.healthPercentage < 0.5 && workflow.healthRegained === 0 && workflow.totalHitDice > 0) {
			const doContinue = await TJSDialog.confirm({
				title: localize("REST-RECOVERY.Dialogs.ShortRestWarning.Title"),
				content: {
					class: Dialog$1,
					props: {
						icon: "fas fa-exclamation-triangle",
						header: localize("REST-RECOVERY.Dialogs.ShortRestWarning.Title"),
						content: localize("REST-RECOVERY.Dialogs.ShortRestWarning.Content")
					}
				},
				modal: true,
				draggable: false,
				options: {
					height: "auto",
					headerButtonNoClose: true
				}
			});

			if (!doContinue) return false;
		}

		form.requestSubmit();
	}

	async function updateSettings() {
		workflow.finished = true;
		application.options.resolve(newDay);
		application.close();
	}

	async function cancel() {
		application.options.reject();
		application.close();
	}

	async function rollHitDice(event) {
		const rolled = await workflow.rollHitDice(selectedHitDice, event.ctrlKey === getSetting("quick-hd-roll"));
		if (!rolled) return;
		$$invalidate(8, healthData = workflow.healthData);
		$$invalidate(2, startedShortRest = true);
	}

	async function autoRollHitDie() {
		await workflow.autoSpendHitDice();
		$$invalidate(8, healthData = workflow.healthData);
		$$invalidate(2, startedShortRest = true);
	}

	function spendSpellPoint(event, level) {
		workflow.spendSpellPoint(level, event.target.checked);
		$$invalidate(9, spellData = workflow.spellData);
	}

	async function updateHealthBar() {
		if (!startedShortRest) {
			workflow.refreshHealthData();
			$$invalidate(8, healthData = workflow.healthData);
		}

		$$invalidate(3, currHP = workflow.currHP);
		$$invalidate(4, maxHP = workflow.maxHP);
		$$invalidate(5, healthPercentage = currHP / maxHP);
	}

	function input_change_handler(each_value_1, slotIndex) {
		each_value_1[slotIndex].checked = this.checked;
		$$invalidate(9, spellData);
	}

	const change_handler = (level, slotIndex, event) => {
		spendSpellPoint(event, level);
	};

	function input_change_handler_1() {
		newDay = this.checked;
		$$invalidate(7, newDay);
	}

	function form_1_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			form = $$value;
			$$invalidate(6, form);
		});
	}

	function applicationshell_elementRoot_binding(value) {
		elementRoot = value;
		$$invalidate(0, elementRoot);
	}

	$$self.$$set = $$props => {
		if ('elementRoot' in $$props) $$invalidate(0, elementRoot = $$props.elementRoot);
		if ('actor' in $$props) $$invalidate(19, actor = $$props.actor);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*startedShortRest*/ 4) {
			application.reactive.headerButtonNoClose = startedShortRest;
		}
	};

	return [
		elementRoot,
		requestSubmit,
		startedShortRest,
		currHP,
		maxHP,
		healthPercentage,
		form,
		newDay,
		healthData,
		spellData,
		maxShortRests,
		enableShortRest,
		promptNewDay,
		selectedHitDice,
		updateSettings,
		cancel,
		rollHitDice,
		autoRollHitDie,
		spendSpellPoint,
		actor,
		updateHealthBar,
		input_change_handler,
		change_handler,
		input_change_handler_1,
		form_1_binding,
		applicationshell_elementRoot_binding
	];
}

class Short_rest_shell extends SvelteComponent {
	constructor(options) {
		super();

		init(
			this,
			options,
			instance$3,
			create_fragment$3,
			safe_not_equal,
			{
				elementRoot: 0,
				actor: 19,
				requestSubmit: 1,
				updateHealthBar: 20
			},
			null,
			[-1, -1]
		);
	}

	get elementRoot() {
		return this.$$.ctx[0];
	}

	set elementRoot(elementRoot) {
		this.$$set({ elementRoot });
		flush();
	}

	get actor() {
		return this.$$.ctx[19];
	}

	set actor(actor) {
		this.$$set({ actor });
		flush();
	}

	get requestSubmit() {
		return this.$$.ctx[1];
	}

	get updateHealthBar() {
		return this.$$.ctx[20];
	}
}

class ShortRestDialog extends SvelteApplication {
  constructor(actor, options = {}, dialogData = {}) {
    super(_objectSpread2({
      title: `${game.i18n.localize("DND5E.ShortRest")}: ${actor.name}`,
      zIndex: 102,
      svelte: {
        class: Short_rest_shell,
        target: document.body,
        props: {
          actor
        }
      },
      close: () => this.options.reject()
    }, options), dialogData);
    this.hookId = Hooks.on('updateActor', changedActor => {
      if (changedActor !== actor) return;
      setTimeout(() => {
        this.svelte.applicationShell.updateHealthBar();
      }, 100);
    });
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      closeOnSubmit: false,
      width: 350,
      height: "auto",
      classes: ["dnd5e dialog"]
    });
  }

  static getActiveApp(actor) {
    return Object.values(ui.windows).find(app => app instanceof this && (app === null || app === void 0 ? void 0 : app.actor) === actor);
  }

  static async show({
    actor
  } = {}, options = {}, dialogData = {}) {
    const app = this.getActiveApp(actor);
    if (app) return app.render(false, {
      focus: true
    });
    return new Promise((resolve, reject) => {
      options.resolve = resolve;
      options.reject = reject;
      new this(actor, options, dialogData).render(true, {
        focus: true
      });
    });
  }

  async close(options) {
    super.close(options);
    Hooks.off("updateActor", this.hookId);
  }

}

/* scripts/formapplications/long-rest/CustomSettingsDialog.svelte generated by Svelte v3.46.4 */

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[1] = list[i];
	child_ctx[3] = i;
	return child_ctx;
}

// (33:8) {#each settings as setting, index (index)}
function create_each_block$1(key_1, ctx) {
	let tr;
	let td0;
	let t0_value = /*setting*/ ctx[1].name + "";
	let t0;
	let t1;
	let td1;
	let t2_value = /*setting*/ ctx[1].value + "";
	let t2;
	let t3;

	return {
		key: key_1,
		first: null,
		c() {
			tr = element("tr");
			td0 = element("td");
			t0 = text(t0_value);
			t1 = space();
			td1 = element("td");
			t2 = text(t2_value);
			t3 = space();
			this.first = tr;
		},
		m(target, anchor) {
			insert(target, tr, anchor);
			append(tr, td0);
			append(td0, t0);
			append(tr, t1);
			append(tr, td1);
			append(td1, t2);
			append(tr, t3);
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
		},
		d(detaching) {
			if (detaching) detach(tr);
		}
	};
}

function create_fragment$2(ctx) {
	let div;
	let h3;
	let t1;
	let p;
	let t3;
	let table;
	let tr;
	let t7;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let each_value = /*settings*/ ctx[0];
	const get_key = ctx => /*index*/ ctx[3];

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context$1(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
	}

	return {
		c() {
			div = element("div");
			h3 = element("h3");
			h3.textContent = `${localize("REST-RECOVERY.Dialogs.LongRestSettingsDialog.Title")}`;
			t1 = space();
			p = element("p");
			p.textContent = `${localize("REST-RECOVERY.Dialogs.LongRestSettingsDialog.Content")}`;
			t3 = space();
			table = element("table");
			tr = element("tr");

			tr.innerHTML = `<th class="svelte-gs48np">Setting</th> 
            <th class="svelte-gs48np">Value</th>`;

			t7 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(table, "class", "svelte-gs48np");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, h3);
			append(div, t1);
			append(div, p);
			append(div, t3);
			append(div, table);
			append(table, tr);
			append(table, t7);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(table, null);
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*settings*/ 1) {
				each_value = /*settings*/ ctx[0];
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, table, destroy_block, create_each_block$1, null, get_each_context$1);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}
		}
	};
}

function instance$2($$self) {
	const settings = Object.entries(CONSTANTS.GET_DEFAULT_SETTINGS()).filter(setting => setting[1].customSettingsDialog).map(entry => {
		let [key, setting] = entry;
		setting.name = localize(setting.name);
		setting.value = getSetting(key);

		if (typeof setting.value === "boolean") {
			setting.value = setting.value ? "Yes" : "No";
		} else if (typeof setting.value === "string") {
			setting.value = localize(setting.choices[setting.value]);
		}

		return setting;
	});

	return [settings];
}

class CustomSettingsDialog extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});
	}
}

/* scripts/formapplications/long-rest/long-rest-shell.svelte generated by Svelte v3.46.4 */

function create_else_block_1(ctx) {
	let p0;
	let t1;
	let p1;
	let a;
	let mounted;
	let dispose;

	return {
		c() {
			p0 = element("p");
			p0.textContent = `${localize("REST-RECOVERY.Dialogs.LongRest.CustomRules")}`;
			t1 = space();
			p1 = element("p");
			a = element("a");
			a.textContent = `${localize("REST-RECOVERY.Dialogs.LongRest.CustomRulesLink")}`;
			set_style(a, "color", "var(--color-text-hyperlink)");
			attr(p1, "class", "notes");
		},
		m(target, anchor) {
			insert(target, p0, anchor);
			insert(target, t1, anchor);
			insert(target, p1, anchor);
			append(p1, a);

			if (!mounted) {
				dispose = listen(a, "click", /*showCustomRulesDialog*/ ctx[22]);
				mounted = true;
			}
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(p0);
			if (detaching) detach(t1);
			if (detaching) detach(p1);
			mounted = false;
			dispose();
		}
	};
}

// (140:8) {#if usingDefaultSettings}
function create_if_block_6(ctx) {
	let p;

	return {
		c() {
			p = element("p");
			p.textContent = `${localize("DND5E.LongRestHint")}`;
		},
		m(target, anchor) {
			insert(target, p, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(p);
		}
	};
}

// (154:8) {:else}
function create_else_block(ctx) {
	let t;
	let if_block1_anchor;
	let current;
	let if_block0 = /*enableRollHitDice*/ ctx[14] && create_if_block_5(ctx);
	let if_block1 = /*promptNewDay*/ ctx[12] && create_if_block_4(ctx);

	return {
		c() {
			if (if_block0) if_block0.c();
			t = space();
			if (if_block1) if_block1.c();
			if_block1_anchor = empty();
		},
		m(target, anchor) {
			if (if_block0) if_block0.m(target, anchor);
			insert(target, t, anchor);
			if (if_block1) if_block1.m(target, anchor);
			insert(target, if_block1_anchor, anchor);
			current = true;
		},
		p(ctx, dirty) {
			if (/*enableRollHitDice*/ ctx[14]) if_block0.p(ctx, dirty);
			if (/*promptNewDay*/ ctx[12]) if_block1.p(ctx, dirty);
		},
		i(local) {
			if (current) return;
			transition_in(if_block0);
			current = true;
		},
		o(local) {
			transition_out(if_block0);
			current = false;
		},
		d(detaching) {
			if (if_block0) if_block0.d(detaching);
			if (detaching) detach(t);
			if (if_block1) if_block1.d(detaching);
			if (detaching) detach(if_block1_anchor);
		}
	};
}

// (147:8) {#if showStartLongRestButton}
function create_if_block_3(ctx) {
	let div;
	let button;
	let i;
	let t0;
	let t1_value = localize("REST-RECOVERY.Dialogs.LongRest.Begin") + "";
	let t1;
	let t2;
	let p;
	let mounted;
	let dispose;

	return {
		c() {
			div = element("div");
			button = element("button");
			i = element("i");
			t0 = space();
			t1 = text(t1_value);
			t2 = space();
			p = element("p");
			p.textContent = `${localize("REST-RECOVERY.Dialogs.LongRest.BeginExplanation")}`;
			attr(i, "class", "fas fa-bed");
			attr(button, "type", "button");
			set_style(button, "flex", "0 1 auto");
			attr(p, "class", "notes");
			attr(div, "class", "form-group");
			set_style(div, "margin", "1rem 0");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, button);
			append(button, i);
			append(button, t0);
			append(button, t1);
			append(div, t2);
			append(div, p);

			if (!mounted) {
				dispose = listen(button, "click", /*startLongRest*/ ctx[20]);
				mounted = true;
			}
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			mounted = false;
			dispose();
		}
	};
}

// (155:12) {#if enableRollHitDice}
function create_if_block_5(ctx) {
	let hitdieroller;
	let current;

	hitdieroller = new HitDieRoller({
			props: {
				selectedHitDice: /*selectedHitDice*/ ctx[16],
				healthData: /*healthData*/ ctx[11],
				isAtMaxHP: /*currHP*/ ctx[4] >= /*maxHP*/ ctx[5],
				onHitDiceFunction: /*rollHitDice*/ ctx[19],
				onAutoFunction: /*autoRollHitDie*/ ctx[21]
			}
		});

	return {
		c() {
			create_component(hitdieroller.$$.fragment);
		},
		m(target, anchor) {
			mount_component(hitdieroller, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const hitdieroller_changes = {};
			if (dirty[0] & /*healthData*/ 2048) hitdieroller_changes.healthData = /*healthData*/ ctx[11];
			if (dirty[0] & /*currHP, maxHP*/ 48) hitdieroller_changes.isAtMaxHP = /*currHP*/ ctx[4] >= /*maxHP*/ ctx[5];
			hitdieroller.$set(hitdieroller_changes);
		},
		i(local) {
			if (current) return;
			transition_in(hitdieroller.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(hitdieroller.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(hitdieroller, detaching);
		}
	};
}

// (165:12) {#if promptNewDay}
function create_if_block_4(ctx) {
	let div;
	let label;
	let t1;
	let input;
	let t2;
	let p;
	let mounted;
	let dispose;

	return {
		c() {
			div = element("div");
			label = element("label");
			label.textContent = `${localize("DND5E.NewDay")}`;
			t1 = space();
			input = element("input");
			t2 = space();
			p = element("p");
			p.textContent = `${localize("DND5E.NewDayHint")}`;
			attr(input, "type", "checkbox");
			attr(input, "name", "newDay");
			attr(p, "class", "hint");
			attr(div, "class", "form-group");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, label);
			append(div, t1);
			append(div, input);
			input.checked = /*newDay*/ ctx[9];
			append(div, t2);
			append(div, p);

			if (!mounted) {
				dispose = listen(input, "change", /*input_change_handler*/ ctx[25]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*newDay*/ 512) {
				input.checked = /*newDay*/ ctx[9];
			}
		},
		d(detaching) {
			if (detaching) detach(div);
			mounted = false;
			dispose();
		}
	};
}

// (174:8) {#if showHealthBar}
function create_if_block_2(ctx) {
	let healthbar;
	let current;

	healthbar = new HealthBar({
			props: {
				text: /*healthBarText*/ ctx[3],
				progress: /*healthPercentage*/ ctx[6],
				progressGhost: /*healthPercentageToGain*/ ctx[7]
			}
		});

	return {
		c() {
			create_component(healthbar.$$.fragment);
		},
		m(target, anchor) {
			mount_component(healthbar, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const healthbar_changes = {};
			if (dirty[0] & /*healthBarText*/ 8) healthbar_changes.text = /*healthBarText*/ ctx[3];
			if (dirty[0] & /*healthPercentage*/ 64) healthbar_changes.progress = /*healthPercentage*/ ctx[6];
			if (dirty[0] & /*healthPercentageToGain*/ 128) healthbar_changes.progressGhost = /*healthPercentageToGain*/ ctx[7];
			healthbar.$set(healthbar_changes);
		},
		i(local) {
			if (current) return;
			transition_in(healthbar.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(healthbar.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(healthbar, detaching);
		}
	};
}

// (179:12) {#if !showStartLongRestButton}
function create_if_block_1(ctx) {
	let button;
	let i;
	let t0;
	let t1_value = localize("DND5E.Rest") + "";
	let t1;
	let mounted;
	let dispose;

	return {
		c() {
			button = element("button");
			i = element("i");
			t0 = space();
			t1 = text(t1_value);
			attr(i, "class", "fas fa-bed");
			attr(button, "type", "button");
			attr(button, "class", "dialog-button");
		},
		m(target, anchor) {
			insert(target, button, anchor);
			append(button, i);
			append(button, t0);
			append(button, t1);

			if (!mounted) {
				dispose = listen(button, "click", /*requestSubmit*/ ctx[1]);
				mounted = true;
			}
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(button);
			mounted = false;
			dispose();
		}
	};
}

// (182:12) {#if !startedLongRest}
function create_if_block(ctx) {
	let button;
	let i;
	let t0;
	let t1_value = localize("Cancel") + "";
	let t1;
	let mounted;
	let dispose;

	return {
		c() {
			button = element("button");
			i = element("i");
			t0 = space();
			t1 = text(t1_value);
			attr(i, "class", "fas fa-times");
			attr(button, "type", "button");
			attr(button, "class", "dialog-button");
		},
		m(target, anchor) {
			insert(target, button, anchor);
			append(button, i);
			append(button, t0);
			append(button, t1);

			if (!mounted) {
				dispose = listen(button, "click", /*cancel*/ ctx[18]);
				mounted = true;
			}
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(button);
			mounted = false;
			dispose();
		}
	};
}

// (137:0) <ApplicationShell bind:elementRoot>
function create_default_slot$1(ctx) {
	let form_1;
	let t0;
	let current_block_type_index;
	let if_block1;
	let t1;
	let t2;
	let footer;
	let t3;
	let current;
	let mounted;
	let dispose;

	function select_block_type(ctx, dirty) {
		if (/*usingDefaultSettings*/ ctx[13]) return create_if_block_6;
		return create_else_block_1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block0 = current_block_type(ctx);
	const if_block_creators = [create_if_block_3, create_else_block];
	const if_blocks = [];

	function select_block_type_1(ctx, dirty) {
		if (/*showStartLongRestButton*/ ctx[10]) return 0;
		return 1;
	}

	current_block_type_index = select_block_type_1(ctx);
	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	let if_block2 = /*showHealthBar*/ ctx[15] && create_if_block_2(ctx);
	let if_block3 = !/*showStartLongRestButton*/ ctx[10] && create_if_block_1(ctx);
	let if_block4 = !/*startedLongRest*/ ctx[2] && create_if_block(ctx);

	return {
		c() {
			form_1 = element("form");
			if_block0.c();
			t0 = space();
			if_block1.c();
			t1 = space();
			if (if_block2) if_block2.c();
			t2 = space();
			footer = element("footer");
			if (if_block3) if_block3.c();
			t3 = space();
			if (if_block4) if_block4.c();
			attr(footer, "class", "flexrow");
			set_style(footer, "margin-top", "0.5rem");
			attr(form_1, "autocomplete", "off");
			attr(form_1, "id", "short-rest-hd");
			attr(form_1, "class", "dialog-content");
		},
		m(target, anchor) {
			insert(target, form_1, anchor);
			if_block0.m(form_1, null);
			append(form_1, t0);
			if_blocks[current_block_type_index].m(form_1, null);
			append(form_1, t1);
			if (if_block2) if_block2.m(form_1, null);
			append(form_1, t2);
			append(form_1, footer);
			if (if_block3) if_block3.m(footer, null);
			append(footer, t3);
			if (if_block4) if_block4.m(footer, null);
			/*form_1_binding*/ ctx[26](form_1);
			current = true;

			if (!mounted) {
				dispose = listen(form_1, "submit", prevent_default(/*updateSettings*/ ctx[17]));
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if_block0.p(ctx, dirty);
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type_1(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block1 = if_blocks[current_block_type_index];

				if (!if_block1) {
					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block1.c();
				} else {
					if_block1.p(ctx, dirty);
				}

				transition_in(if_block1, 1);
				if_block1.m(form_1, t1);
			}

			if (/*showHealthBar*/ ctx[15]) if_block2.p(ctx, dirty);

			if (!/*showStartLongRestButton*/ ctx[10]) {
				if (if_block3) {
					if_block3.p(ctx, dirty);
				} else {
					if_block3 = create_if_block_1(ctx);
					if_block3.c();
					if_block3.m(footer, t3);
				}
			} else if (if_block3) {
				if_block3.d(1);
				if_block3 = null;
			}

			if (!/*startedLongRest*/ ctx[2]) {
				if (if_block4) {
					if_block4.p(ctx, dirty);
				} else {
					if_block4 = create_if_block(ctx);
					if_block4.c();
					if_block4.m(footer, null);
				}
			} else if (if_block4) {
				if_block4.d(1);
				if_block4 = null;
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block1);
			transition_in(if_block2);
			current = true;
		},
		o(local) {
			transition_out(if_block1);
			transition_out(if_block2);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(form_1);
			if_block0.d();
			if_blocks[current_block_type_index].d();
			if (if_block2) if_block2.d();
			if (if_block3) if_block3.d();
			if (if_block4) if_block4.d();
			/*form_1_binding*/ ctx[26](null);
			mounted = false;
			dispose();
		}
	};
}

function create_fragment$1(ctx) {
	let applicationshell;
	let updating_elementRoot;
	let current;

	function applicationshell_elementRoot_binding(value) {
		/*applicationshell_elementRoot_binding*/ ctx[27](value);
	}

	let applicationshell_props = {
		$$slots: { default: [create_default_slot$1] },
		$$scope: { ctx }
	};

	if (/*elementRoot*/ ctx[0] !== void 0) {
		applicationshell_props.elementRoot = /*elementRoot*/ ctx[0];
	}

	applicationshell = new ApplicationShell({ props: applicationshell_props });
	binding_callbacks.push(() => bind(applicationshell, 'elementRoot', applicationshell_elementRoot_binding));

	return {
		c() {
			create_component(applicationshell.$$.fragment);
		},
		m(target, anchor) {
			mount_component(applicationshell, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const applicationshell_changes = {};

			if (dirty[0] & /*form, startedLongRest, showStartLongRestButton, healthBarText, healthPercentage, healthPercentageToGain, newDay, healthData, currHP, maxHP*/ 4092 | dirty[1] & /*$$scope*/ 1) {
				applicationshell_changes.$$scope = { dirty, ctx };
			}

			if (!updating_elementRoot && dirty[0] & /*elementRoot*/ 1) {
				updating_elementRoot = true;
				applicationshell_changes.elementRoot = /*elementRoot*/ ctx[0];
				add_flush_callback(() => updating_elementRoot = false);
			}

			applicationshell.$set(applicationshell_changes);
		},
		i(local) {
			if (current) return;
			transition_in(applicationshell.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(applicationshell.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(applicationshell, detaching);
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	const { application } = getContext('external');
	let { elementRoot } = $$props;
	let { actor } = $$props;
	let healthBarText;
	let currHP;
	let maxHP;
	let healthPercentage;
	let healthPercentageToGain;
	let form;
	let startedLongRest = false;
	let variant = game.settings.get("dnd5e", "restVariant");
	let promptNewDay = variant !== "gritty";
	let newDay = variant === "normal";
	let usingDefaultSettings = CONSTANTS.USING_DEFAULT_LONG_REST_SETTINGS();
	let enableRollHitDice = getSetting(CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE);
	let showHealthBar = enableRollHitDice || getSetting(CONSTANTS.SETTINGS.HP_MULTIPLIER) !== CONSTANTS.RECOVERY.FULL;
	let showStartLongRestButton = getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE);
	const workflow = RestWorkflow.get(actor);
	let healthData = workflow.healthData;
	updateHealthBar();
	let selectedHitDice = Object.entries(workflow.healthData.availableHitDice).filter(entry => entry[1])?.[0]?.[0];

	async function requestSubmit() {
		if (enableRollHitDice && healthData.hitDiceSpent === 0 && healthPercentageToGain < 0.75 && workflow.healthRegained === 0 && workflow.totalHitDice > 0) {
			const doContinue = await TJSDialog.confirm({
				title: localize("REST-RECOVERY.Dialogs.LongRestWarning.Title"),
				content: {
					class: Dialog$1,
					props: {
						icon: "fas fa-exclamation-triangle",
						header: localize("REST-RECOVERY.Dialogs.LongRestWarning.Title"),
						content: localize("REST-RECOVERY.Dialogs.LongRestWarning.Content")
					}
				},
				modal: true,
				draggable: false,
				options: {
					height: "auto",
					headerButtonNoClose: true
				}
			});

			if (!doContinue) return false;
		}

		form.requestSubmit();
	}

	async function updateSettings() {
		application.options.resolve(newDay);
		application.close();
	}

	async function cancel() {
		workflow.finished = true;
		application.options.reject();
		application.close();
	}

	async function rollHitDice(event) {
		const rolled = await workflow.rollHitDice(selectedHitDice, event.ctrlKey === getSetting("quick-hd-roll"));
		if (!rolled) return;
		$$invalidate(11, healthData = workflow.healthData);
	}

	async function startLongRest() {
		$$invalidate(10, showStartLongRestButton = false);
		$$invalidate(2, startedLongRest = true);
		await workflow.regainHitDice();
		$$invalidate(11, healthData = workflow.healthData);
	}

	async function autoRollHitDie() {
		await workflow.autoSpendHitDice();
		$$invalidate(11, healthData = workflow.healthData);
		$$invalidate(2, startedLongRest = true);
	}

	async function updateHealthBar() {
		if (!startedLongRest) {
			workflow.refreshHealthData();
			$$invalidate(11, healthData = workflow.healthData);
		}

		$$invalidate(4, currHP = workflow.currHP);
		$$invalidate(5, maxHP = workflow.maxHP);
		$$invalidate(6, healthPercentage = currHP / maxHP);
		$$invalidate(7, healthPercentageToGain = (currHP + healthData.hitPointsToRegain) / maxHP);
		$$invalidate(3, healthBarText = `HP: ${currHP} / ${maxHP}`);

		if (healthData.hitPointsToRegain) {
			$$invalidate(3, healthBarText += ` (+${healthData.hitPointsToRegain})`);
		}
	}

	function showCustomRulesDialog() {
		TJSDialog.prompt({
			title: localize("REST-RECOVERY.Dialogs.LongRestSettingsDialog.Title"),
			content: { class: CustomSettingsDialog },
			label: "Okay",
			modal: true,
			draggable: false,
			options: {
				height: "auto",
				headerButtonNoClose: true
			}
		});
	}

	function input_change_handler() {
		newDay = this.checked;
		$$invalidate(9, newDay);
	}

	function form_1_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			form = $$value;
			$$invalidate(8, form);
		});
	}

	function applicationshell_elementRoot_binding(value) {
		elementRoot = value;
		$$invalidate(0, elementRoot);
	}

	$$self.$$set = $$props => {
		if ('elementRoot' in $$props) $$invalidate(0, elementRoot = $$props.elementRoot);
		if ('actor' in $$props) $$invalidate(23, actor = $$props.actor);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*startedLongRest*/ 4) {
			application.reactive.headerButtonNoClose = startedLongRest;
		}
	};

	return [
		elementRoot,
		requestSubmit,
		startedLongRest,
		healthBarText,
		currHP,
		maxHP,
		healthPercentage,
		healthPercentageToGain,
		form,
		newDay,
		showStartLongRestButton,
		healthData,
		promptNewDay,
		usingDefaultSettings,
		enableRollHitDice,
		showHealthBar,
		selectedHitDice,
		updateSettings,
		cancel,
		rollHitDice,
		startLongRest,
		autoRollHitDie,
		showCustomRulesDialog,
		actor,
		updateHealthBar,
		input_change_handler,
		form_1_binding,
		applicationshell_elementRoot_binding
	];
}

class Long_rest_shell extends SvelteComponent {
	constructor(options) {
		super();

		init(
			this,
			options,
			instance$1,
			create_fragment$1,
			safe_not_equal,
			{
				elementRoot: 0,
				actor: 23,
				requestSubmit: 1,
				updateHealthBar: 24
			},
			null,
			[-1, -1]
		);
	}

	get elementRoot() {
		return this.$$.ctx[0];
	}

	set elementRoot(elementRoot) {
		this.$$set({ elementRoot });
		flush();
	}

	get actor() {
		return this.$$.ctx[23];
	}

	set actor(actor) {
		this.$$set({ actor });
		flush();
	}

	get requestSubmit() {
		return this.$$.ctx[1];
	}

	get updateHealthBar() {
		return this.$$.ctx[24];
	}
}

class LongRestDialog extends SvelteApplication {
  constructor(actor, options = {}, dialogData = {}) {
    super(_objectSpread2({
      title: `${game.i18n.localize("DND5E.LongRest")}: ${actor.name}`,
      zIndex: 102,
      svelte: {
        class: Long_rest_shell,
        target: document.body,
        props: {
          actor
        }
      },
      close: () => this.options.reject()
    }, options), dialogData);
    this.hookId = Hooks.on('updateActor', changedActor => {
      if (changedActor !== actor) return;
      setTimeout(() => {
        this.svelte.applicationShell.updateHealthBar();
      }, 100);
    });
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      closeOnSubmit: false,
      width: 350,
      height: "auto",
      classes: ["dnd5e dialog"]
    });
  }

  static getActiveApp(actor) {
    return Object.values(ui.windows).find(app => app instanceof this && (app === null || app === void 0 ? void 0 : app.actor) === actor);
  }

  static async show({
    actor
  } = {}, options = {}, dialogData = {}) {
    const app = this.getActiveApp(actor);
    if (app) return app.render(false, {
      focus: true
    });
    return new Promise((resolve, reject) => {
      options.resolve = resolve;
      options.reject = reject;
      new this(actor, options, dialogData).render(true, {
        focus: true
      });
    });
  }

  async close(options) {
    super.close(options);
    Hooks.off('updateActor', this.hookId);
  }

}

function registerLibwrappers() {
  patch_shortRest();
  patch_longRest();
  patch_rollHitDie();
  patch_getRestHitPointRecovery();
  patch_getRestHitDiceRecovery();
  patch_getRestResourceRecovery();
  patch_getRestSpellRecovery();
  patch_getRestItemUsesRecovery();
}

function patch_shortRest() {
  libWrapper.register(CONSTANTS.MODULE_NAME, "CONFIG.Actor.documentClass.prototype.shortRest", async function ({
    dialog = true,
    chat = true,
    autoHD = false,
    autoHDThreshold = 3
  } = {}) {
    // Take note of the initial hit points and number of hit dice the Actor has
    const hd0 = this.data.data.attributes.hd;
    const hp0 = this.data.data.attributes.hp.value;
    let newDay = false;
    RestWorkflow.make(this); // Display a Dialog for rolling hit dice

    if (dialog) {
      try {
        newDay = await ShortRestDialog.show({
          actor: this
        });
      } catch (err) {
        return;
      }
    } // Automatically spend hit dice
    else if (autoHD) {
      await this.autoSpendHitDice({
        threshold: autoHDThreshold
      });
    }

    return this._rest(chat, newDay, false, this.data.data.attributes.hd - hd0, this.data.data.attributes.hp.value - hp0);
  }, "OVERRIDE");
}

function patch_longRest() {
  libWrapper.register(CONSTANTS.MODULE_NAME, "CONFIG.Actor.documentClass.prototype.longRest", async function ({
    dialog = true,
    chat = true,
    newDay = true
  } = {}) {
    RestWorkflow.make(this, true);

    if (dialog) {
      try {
        newDay = await LongRestDialog.show({
          actor: this
        });
      } catch (err) {
        return;
      }
    }

    return this._rest(chat, newDay, true);
  }, "OVERRIDE");
}

function patch_rollHitDie() {
  libWrapper.register(CONSTANTS.MODULE_NAME, "CONFIG.Actor.documentClass.prototype.rollHitDie", async function (denomination, {
    dialog = true
  } = {}) {
    var _periapt$data, _periapt$data$data, _blessing$data, _durable$data, _blackBlood$data, _hp$tempmax;

    // If no denomination was provided, choose the first available
    let cls;

    if (!denomination) {
      cls = this.itemTypes.class.find(c => c.data.data.hitDiceUsed < c.data.data.levels);
      if (!cls) return null;
      denomination = cls.data.data.hitDice;
    } // Otherwise locate a class (if any) which has an available hit die of the requested denomination
    else {
      cls = this.items.find(i => {
        const d = i.data.data;
        return d.hitDice === denomination && (d.hitDiceUsed || 0) < (d.levels || 1);
      });
    } // If no class is available, display an error notification


    if (!cls) {
      ui.notifications.error(game.i18n.format("DND5E.HitDiceWarn", {
        name: this.name,
        formula: denomination
      }));
      return null;
    } // Prepare roll data


    let parts = [`1${denomination}`, "@abilities.con.mod"];
    const title = `${game.i18n.localize("DND5E.HitDiceRoll")}: ${this.name}`;
    const rollData = foundry.utils.deepClone(this.data.data);
    const periapt = getSetting(CONSTANTS.SETTINGS.PERIAPT_ITEM) ? this.items.getName(getSetting(CONSTANTS.SETTINGS.PERIAPT_ITEM, true)) : false;
    const blessing = getSetting(CONSTANTS.SETTINGS.WOUND_CLOSURE_BLESSING) ? this.items.getName(getSetting(CONSTANTS.SETTINGS.WOUND_CLOSURE_BLESSING, true)) : false;
    const woundClosure = periapt && (periapt === null || periapt === void 0 ? void 0 : (_periapt$data = periapt.data) === null || _periapt$data === void 0 ? void 0 : (_periapt$data$data = _periapt$data.data) === null || _periapt$data$data === void 0 ? void 0 : _periapt$data$data.attunement) === 2 || blessing && (blessing === null || blessing === void 0 ? void 0 : (_blessing$data = blessing.data) === null || _blessing$data === void 0 ? void 0 : _blessing$data.type) === "feat";
    const durable = getSetting(CONSTANTS.SETTINGS.DURABLE_FEAT) ? this.items.getName(getSetting(CONSTANTS.SETTINGS.DURABLE_FEAT, true)) : false;
    const isDurable = durable && (durable === null || durable === void 0 ? void 0 : (_durable$data = durable.data) === null || _durable$data === void 0 ? void 0 : _durable$data.type) === "feat";
    const blackBlood = getSetting(CONSTANTS.SETTINGS.BLACK_BLOOD_FEATURE) ? this.items.getName(getSetting(CONSTANTS.SETTINGS.BLACK_BLOOD_FEATURE, true)) : false;
    let hasBlackBlood = blackBlood && (blackBlood === null || blackBlood === void 0 ? void 0 : (_blackBlood$data = blackBlood.data) === null || _blackBlood$data === void 0 ? void 0 : _blackBlood$data.type) === "feat";
    const conMod = this.data.data.abilities.con.mod;
    const durableMod = Math.max(2, conMod * 2);

    if (hasBlackBlood) {
      denomination += "r<3";
    }

    if (woundClosure && isDurable) {
      parts = [`{1${denomination}*2+${conMod},${durableMod}}kh`];
    } else if (woundClosure) {
      parts[0] = "(" + parts[0] + "*2)";
    } else if (isDurable) {
      parts = [`{1${denomination}+${conMod},${durableMod}}kh`];
    } // Call the roll helper utility


    const roll = await damageRoll({
      event: new Event("hitDie"),
      parts: parts,
      data: rollData,
      title: title,
      allowCritical: false,
      fastForward: !dialog,
      dialogOptions: {
        width: 350
      },
      messageData: {
        speaker: ChatMessage.getSpeaker({
          actor: this
        }),
        "flags.dnd5e.roll": {
          type: "hitDie"
        }
      }
    });
    if (!roll) return null; // Adjust actor data

    await cls.update({
      "data.hitDiceUsed": cls.data.data.hitDiceUsed + 1
    });
    const hp = this.data.data.attributes.hp;
    const dhp = Math.min(hp.max + ((_hp$tempmax = hp.tempmax) !== null && _hp$tempmax !== void 0 ? _hp$tempmax : 0) - hp.value, roll.total);
    await this.update({
      "data.attributes.hp.value": hp.value + dhp
    });
    return roll;
  }, "OVERRIDE");
}

function patch_getRestHitPointRecovery() {
  libWrapper.register(CONSTANTS.MODULE_NAME, "CONFIG.Actor.documentClass.prototype._getRestHitPointRecovery", function (wrapped, args) {
    return RestWorkflow.wrapperFn(this, wrapped, args, "_getRestHitPointRecovery");
  });
}

function patch_getRestHitDiceRecovery() {
  libWrapper.register(CONSTANTS.MODULE_NAME, "CONFIG.Actor.documentClass.prototype._getRestHitDiceRecovery", function (wrapped, args) {
    if (getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE)) {
      return RestWorkflow.wrapperFn(this, wrapped, args, "_getRestHitDiceRecoveryPost");
    }

    return RestWorkflow.wrapperFn(this, wrapped, args, "_getRestHitDiceRecoveryPre", false);
  });
}

function patch_getRestResourceRecovery() {
  libWrapper.register(CONSTANTS.MODULE_NAME, "CONFIG.Actor.documentClass.prototype._getRestResourceRecovery", function (wrapped, args) {
    return RestWorkflow.wrapperFn(this, wrapped, args, "_getRestResourceRecovery");
  });
}

function patch_getRestSpellRecovery() {
  libWrapper.register(CONSTANTS.MODULE_NAME, "CONFIG.Actor.documentClass.prototype._getRestSpellRecovery", function (wrapped, args) {
    return RestWorkflow.wrapperFn(this, wrapped, args, "_getRestSpellRecovery");
  });
}

function patch_getRestItemUsesRecovery() {
  libWrapper.register(CONSTANTS.MODULE_NAME, "CONFIG.Actor.documentClass.prototype._getRestItemUsesRecovery", function (wrapped, args) {
    return RestWorkflow.wrapperFn(this, wrapped, args, "_getRestItemUsesRecovery");
  });
}
/*
    Shamelessly stolen from the D&D 5e system, as these cannot be imported
 */


async function damageRoll({
  parts = [],
  data,
  // Roll creation
  critical = false,
  criticalBonusDice,
  criticalMultiplier,
  multiplyNumeric,
  powerfulCritical,
  criticalBonusDamage,
  // Damage customization
  fastForward = false,
  event,
  allowCritical = true,
  template,
  title,
  dialogOptions,
  // Dialog configuration
  chatMessage = true,
  messageData = {},
  rollMode,
  speaker,
  flavor // Chat Message customization

} = {}) {
  // Handle input arguments
  const defaultRollMode = rollMode || game.settings.get("core", "rollMode"); // Construct the DamageRoll instance

  const formula = parts.join(" + ");

  const {
    isCritical,
    isFF
  } = _determineCriticalMode({
    critical,
    fastForward,
    event
  });

  const roll = new CONFIG.Dice.DamageRoll(formula, data, {
    flavor: flavor || title,
    critical: isFF ? isCritical : false,
    criticalBonusDice,
    criticalMultiplier,
    criticalBonusDamage,
    multiplyNumeric: multiplyNumeric !== null && multiplyNumeric !== void 0 ? multiplyNumeric : game.settings.get("dnd5e", "criticalDamageModifiers"),
    powerfulCritical: powerfulCritical !== null && powerfulCritical !== void 0 ? powerfulCritical : game.settings.get("dnd5e", "criticalDamageMaxDice")
  }); // Prompt a Dialog to further configure the DamageRoll

  if (!isFF) {
    const configured = await roll.configureDialog({
      title,
      defaultRollMode: defaultRollMode,
      defaultCritical: isCritical,
      template,
      allowCritical
    }, dialogOptions);
    if (configured === null) return null;
  } // Evaluate the configured roll


  await roll.evaluate({
    async: true
  }); // Create a Chat Message

  if (speaker) {
    console.warn("You are passing the speaker argument to the damageRoll function directly which should instead be passed as an internal key of messageData");
    messageData.speaker = speaker;
  }

  if (roll && chatMessage) await roll.toMessage(messageData);
  return roll;
}

function _determineCriticalMode({
  event,
  critical = false,
  fastForward = false
} = {}) {
  const isFF = fastForward || event && (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey);
  if (event !== null && event !== void 0 && event.altKey) critical = true;
  return {
    isFF,
    isCritical: critical
  };
}

/* scripts/formapplications/resource-config/resource-config-shell.svelte generated by Svelte v3.46.4 */

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[15] = list[i];
	child_ctx[16] = list;
	child_ctx[17] = i;
	return child_ctx;
}

// (59:16) {#each resources as resource, index (index)}
function create_each_block(key_1, ctx) {
	let tr;
	let td0;
	let input0;
	let t0;
	let td1;
	let div;
	let input1;
	let t1;
	let span;
	let t3;
	let input2;
	let t4;
	let td2;
	let input3;
	let t5;
	let td3;
	let input4;
	let t6;
	let td4;
	let input5;
	let t7;
	let mounted;
	let dispose;

	function input0_input_handler() {
		/*input0_input_handler*/ ctx[5].call(input0, /*each_value*/ ctx[16], /*index*/ ctx[17]);
	}

	function input1_input_handler() {
		/*input1_input_handler*/ ctx[6].call(input1, /*each_value*/ ctx[16], /*index*/ ctx[17]);
	}

	function input2_input_handler() {
		/*input2_input_handler*/ ctx[7].call(input2, /*each_value*/ ctx[16], /*index*/ ctx[17]);
	}

	function input3_change_handler() {
		/*input3_change_handler*/ ctx[8].call(input3, /*each_value*/ ctx[16], /*index*/ ctx[17]);
	}

	function input4_change_handler() {
		/*input4_change_handler*/ ctx[9].call(input4, /*each_value*/ ctx[16], /*index*/ ctx[17]);
	}

	function input5_input_handler() {
		/*input5_input_handler*/ ctx[10].call(input5, /*each_value*/ ctx[16], /*index*/ ctx[17]);
	}

	return {
		key: key_1,
		first: null,
		c() {
			tr = element("tr");
			td0 = element("td");
			input0 = element("input");
			t0 = space();
			td1 = element("td");
			div = element("div");
			input1 = element("input");
			t1 = space();
			span = element("span");
			span.textContent = "/";
			t3 = space();
			input2 = element("input");
			t4 = space();
			td2 = element("td");
			input3 = element("input");
			t5 = space();
			td3 = element("td");
			input4 = element("input");
			t6 = space();
			td4 = element("td");
			input5 = element("input");
			t7 = space();
			attr(input0, "type", "text");
			attr(input1, "type", "number");
			set_style(input1, "text-align", "right");
			attr(span, "class", "sep svelte-kcw6kv");
			attr(input2, "type", "number");
			attr(div, "class", "flexrow");
			attr(input3, "type", "checkbox");
			attr(td2, "class", "text-center svelte-kcw6kv");
			attr(input4, "type", "checkbox");
			attr(td3, "class", "text-center svelte-kcw6kv");
			attr(input5, "type", "text");
			this.first = tr;
		},
		m(target, anchor) {
			insert(target, tr, anchor);
			append(tr, td0);
			append(td0, input0);
			set_input_value(input0, /*resource*/ ctx[15].label);
			append(tr, t0);
			append(tr, td1);
			append(td1, div);
			append(div, input1);
			set_input_value(input1, /*resource*/ ctx[15].value);
			append(div, t1);
			append(div, span);
			append(div, t3);
			append(div, input2);
			set_input_value(input2, /*resource*/ ctx[15].max);
			append(tr, t4);
			append(tr, td2);
			append(td2, input3);
			set_input_value(input3, /*resource*/ ctx[15].lr);
			append(tr, t5);
			append(tr, td3);
			append(td3, input4);
			set_input_value(input4, /*resource*/ ctx[15].sr);
			append(tr, t6);
			append(tr, td4);
			append(td4, input5);
			set_input_value(input5, /*resource*/ ctx[15].flags.formula);
			append(tr, t7);

			if (!mounted) {
				dispose = [
					listen(input0, "input", input0_input_handler),
					listen(input1, "input", input1_input_handler),
					listen(input2, "input", input2_input_handler),
					listen(input3, "change", input3_change_handler),
					listen(input4, "change", input4_change_handler),
					listen(input5, "input", input5_input_handler)
				];

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*resources*/ 4 && input0.value !== /*resource*/ ctx[15].label) {
				set_input_value(input0, /*resource*/ ctx[15].label);
			}

			if (dirty & /*resources*/ 4 && to_number(input1.value) !== /*resource*/ ctx[15].value) {
				set_input_value(input1, /*resource*/ ctx[15].value);
			}

			if (dirty & /*resources*/ 4 && to_number(input2.value) !== /*resource*/ ctx[15].max) {
				set_input_value(input2, /*resource*/ ctx[15].max);
			}

			if (dirty & /*resources*/ 4) {
				set_input_value(input3, /*resource*/ ctx[15].lr);
			}

			if (dirty & /*resources*/ 4) {
				set_input_value(input4, /*resource*/ ctx[15].sr);
			}

			if (dirty & /*resources*/ 4 && input5.value !== /*resource*/ ctx[15].flags.formula) {
				set_input_value(input5, /*resource*/ ctx[15].flags.formula);
			}
		},
		d(detaching) {
			if (detaching) detach(tr);
			mounted = false;
			run_all(dispose);
		}
	};
}

// (43:0) <ApplicationShell bind:elementRoot>
function create_default_slot(ctx) {
	let form_1;
	let div;
	let table;
	let tr;
	let t9;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let t10;
	let footer;
	let button;
	let i;
	let t11;
	let t12_value = localize("Submit") + "";
	let t12;
	let mounted;
	let dispose;
	let each_value = /*resources*/ ctx[2];
	const get_key = ctx => /*index*/ ctx[17];

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
	}

	return {
		c() {
			form_1 = element("form");
			div = element("div");
			table = element("table");
			tr = element("tr");

			tr.innerHTML = `<th style="width:auto;">Name</th> 
                    <th style="width:20%;">Value</th> 
                    <th style="width:auto;">Short Rest</th> 
                    <th style="width:auto;">Long Rest</th> 
                    <th style="width:auto;">Recovery Formula</th>`;

			t9 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t10 = space();
			footer = element("footer");
			button = element("button");
			i = element("i");
			t11 = space();
			t12 = text(t12_value);
			attr(div, "class", "container svelte-kcw6kv");
			attr(i, "class", "fas fa-check");
			attr(button, "type", "button");
			attr(button, "class", "dialog-button");
			attr(footer, "class", "flexrow");
			set_style(footer, "margin-top", "0.5rem");
			attr(form_1, "autocomplete", "off");
		},
		m(target, anchor) {
			insert(target, form_1, anchor);
			append(form_1, div);
			append(div, table);
			append(table, tr);
			append(table, t9);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(table, null);
			}

			append(form_1, t10);
			append(form_1, footer);
			append(footer, button);
			append(button, i);
			append(button, t11);
			append(button, t12);
			/*form_1_binding*/ ctx[11](form_1);

			if (!mounted) {
				dispose = [
					listen(button, "click", /*requestSubmit*/ ctx[3]),
					listen(form_1, "submit", prevent_default(updateSettings))
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty & /*resources*/ 4) {
				each_value = /*resources*/ ctx[2];
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, table, destroy_block, create_each_block, null, get_each_context);
			}
		},
		d(detaching) {
			if (detaching) detach(form_1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}

			/*form_1_binding*/ ctx[11](null);
			mounted = false;
			run_all(dispose);
		}
	};
}

function create_fragment(ctx) {
	let applicationshell;
	let updating_elementRoot;
	let current;

	function applicationshell_elementRoot_binding(value) {
		/*applicationshell_elementRoot_binding*/ ctx[12](value);
	}

	let applicationshell_props = {
		$$slots: { default: [create_default_slot] },
		$$scope: { ctx }
	};

	if (/*elementRoot*/ ctx[0] !== void 0) {
		applicationshell_props.elementRoot = /*elementRoot*/ ctx[0];
	}

	applicationshell = new ApplicationShell({ props: applicationshell_props });
	binding_callbacks.push(() => bind(applicationshell, 'elementRoot', applicationshell_elementRoot_binding));

	return {
		c() {
			create_component(applicationshell.$$.fragment);
		},
		m(target, anchor) {
			mount_component(applicationshell, target, anchor);
			current = true;
		},
		p(ctx, [dirty]) {
			const applicationshell_changes = {};

			if (dirty & /*$$scope, form, resources*/ 262150) {
				applicationshell_changes.$$scope = { dirty, ctx };
			}

			if (!updating_elementRoot && dirty & /*elementRoot*/ 1) {
				updating_elementRoot = true;
				applicationshell_changes.elementRoot = /*elementRoot*/ ctx[0];
				add_flush_callback(() => updating_elementRoot = false);
			}

			applicationshell.$set(applicationshell_changes);
		},
		i(local) {
			if (current) return;
			transition_in(applicationshell.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(applicationshell.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(applicationshell, detaching);
		}
	};
}

function updateSettings() {
	
}

function instance($$self, $$props, $$invalidate) {
	getContext('external');
	let { elementRoot } = $$props;
	let { actor } = $$props;
	let form;
	const count = actor.data.data.resources['count']?.value ?? 3;

	const resources = Object.entries(actor.data.data.resources).map(entry => {
		let resource = entry[1];
		resource.path = entry[0];
		resource.flags = { formula: "", evaluated_formula: "" };
		return resource;
	}).filter((resource, index) => resource.path !== "count" && index < count);

	function requestSubmit() {
		form.requestSubmit();
	}

	function input0_input_handler(each_value, index) {
		each_value[index].label = this.value;
		$$invalidate(2, resources);
	}

	function input1_input_handler(each_value, index) {
		each_value[index].value = to_number(this.value);
		$$invalidate(2, resources);
	}

	function input2_input_handler(each_value, index) {
		each_value[index].max = to_number(this.value);
		$$invalidate(2, resources);
	}

	function input3_change_handler(each_value, index) {
		each_value[index].lr = this.value;
		$$invalidate(2, resources);
	}

	function input4_change_handler(each_value, index) {
		each_value[index].sr = this.value;
		$$invalidate(2, resources);
	}

	function input5_input_handler(each_value, index) {
		each_value[index].flags.formula = this.value;
		$$invalidate(2, resources);
	}

	function form_1_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			form = $$value;
			$$invalidate(1, form);
		});
	}

	function applicationshell_elementRoot_binding(value) {
		elementRoot = value;
		$$invalidate(0, elementRoot);
	}

	$$self.$$set = $$props => {
		if ('elementRoot' in $$props) $$invalidate(0, elementRoot = $$props.elementRoot);
		if ('actor' in $$props) $$invalidate(4, actor = $$props.actor);
	};

	return [
		elementRoot,
		form,
		resources,
		requestSubmit,
		actor,
		input0_input_handler,
		input1_input_handler,
		input2_input_handler,
		input3_change_handler,
		input4_change_handler,
		input5_input_handler,
		form_1_binding,
		applicationshell_elementRoot_binding
	];
}

class Resource_config_shell extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { elementRoot: 0, actor: 4 });
	}

	get elementRoot() {
		return this.$$.ctx[0];
	}

	set elementRoot(elementRoot) {
		this.$$set({ elementRoot });
		flush();
	}

	get actor() {
		return this.$$.ctx[4];
	}

	set actor(actor) {
		this.$$set({ actor });
		flush();
	}
}

class ResourceConfig extends SvelteApplication {
  constructor(actor, options = {}, dialogData = {}) {
    super(_objectSpread2({
      title: `${game.i18n.localize("DND5E.ShortRest")}: ${actor.name}`,
      zIndex: 102,
      svelte: {
        class: Resource_config_shell,
        target: document.body,
        props: {
          actor
        }
      },
      close: () => this.options.reject()
    }, options), _objectSpread2({
      resizable: true
    }, dialogData));
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      closeOnSubmit: false,
      width: 550,
      height: "auto",
      classes: ["dnd5e dialog"]
    });
  }

  static getActiveApp(actor) {
    return Object.values(ui.windows).find(app => app instanceof this && (app === null || app === void 0 ? void 0 : app.actor) === actor);
  }

  static async show({
    actor
  } = {}, options = {}, dialogData = {}) {
    const app = this.getActiveApp(actor);
    if (app) return app.render(false, {
      focus: true
    });
    return new Promise((resolve, reject) => {
      options.resolve = resolve;
      options.reject = reject;
      new this(actor, options, dialogData).render(true, {
        focus: true
      });
    });
  }

}

Hooks.once("init", () => {
  registerSettings();
  registerLibwrappers();
  console.log("Rest Recovery 5e | Initialized");
});
Hooks.on("ready", () => {
  new ResourceConfig(game.actors.getName("Another Player")).render(true);
});
Hooks.on('updateActor', actor => {
  const workflow = RestWorkflow.get(actor);

  if (workflow && workflow.finished && !foundry.utils.isObjectEmpty(workflow.recoveredSlots)) {
    workflow.preFinishRestMessage();
  }
});
Hooks.on("restCompleted", actor => {
  RestWorkflow.remove(actor);
});
//# sourceMappingURL=module.js.map
