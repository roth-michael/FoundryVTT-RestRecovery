const CONSTANTS = {
  MODULE_NAME: "rest-recovery",
  FLAG_NAME: "data",
  SETTINGS: {
    IGNORE_INACTIVE_PLAYERS: "ignore-inactive-players",
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
    LONG_REST_ROLL_HIT_DICE: "long-rest-roll-hit-dice",
    PRE_REST_REGAIN_HIT_DICE: "pre-rest-regain-hit-dice",
    HP_MULTIPLIER: "recovery-hitpoints",
    HD_MULTIPLIER: "recovery-hitdice",
    HD_ROUNDING: "recovery-rounding",
    RESOURCES_MULTIPLIER: "recovery-resources",
    SPELLS_MULTIPLIER: "recovery-spells",
    USES_OTHERS_MULTIPLIER: "recovery-uses-others",
    USES_FEATS_MULTIPLIER: "recovery-uses-feats",
    USES_DAILY_MULTIPLIER: "recovery-day"
  },

  get DEFAULT_SETTINGS() {
    return {
      [CONSTANTS.SETTINGS.IGNORE_INACTIVE_PLAYERS]: {
        name: "REST-RECOVERY.Settings.ShortRest.IgnoreInactive.Title",
        hint: "REST-RECOVERY.Settings.ShortRest.IgnoreInactive.Hint",
        scope: "world",
        group: "shortrest",
        config: false,
        default: false,
        type: Boolean
      },
      [CONSTANTS.SETTINGS.WIZARD_CLASS]: {
        name: "REST-RECOVERY.Settings.ShortRest.WizardClassName.Title",
        hint: "REST-RECOVERY.Settings.ShortRest.WizardClassName.Hint",
        scope: "world",
        group: "shortrest",
        config: false,
        default: "REST-RECOVERY.ClassNames.Wizard",
        type: String
      },
      [CONSTANTS.SETTINGS.DRUID_CLASS]: {
        name: "REST-RECOVERY.Settings.ShortRest.DruidClassName.Title",
        hint: "REST-RECOVERY.Settings.ShortRest.DruidClassName.Hint",
        scope: "world",
        group: "shortrest",
        config: false,
        default: "REST-RECOVERY.ClassNames.Druid",
        type: String
      },
      [CONSTANTS.SETTINGS.BARD_CLASS]: {
        name: "REST-RECOVERY.Settings.ShortRest.BardClassName.Title",
        hint: "REST-RECOVERY.Settings.ShortRest.BardClassName.Hint",
        scope: "world",
        group: "shortrest",
        config: false,
        default: "REST-RECOVERY.ClassNames.Bard",
        type: String
      },
      [CONSTANTS.SETTINGS.ARCANE_RECOVERY]: {
        name: "REST-RECOVERY.Settings.ShortRest.ArcaneRecovery.Title",
        hint: "REST-RECOVERY.Settings.ShortRest.ArcaneRecovery.Hint",
        scope: "world",
        group: "shortrest",
        config: false,
        default: "REST-RECOVERY.FeatureNames.ArcaneRecovery",
        type: String
      },
      [CONSTANTS.SETTINGS.NATURAL_RECOVERY]: {
        name: "REST-RECOVERY.Settings.ShortRest.NaturalRecovery.Title",
        hint: "REST-RECOVERY.Settings.ShortRest.NaturalRecovery.Hint",
        scope: "world",
        group: "shortrest",
        config: false,
        default: "REST-RECOVERY.FeatureNames.NaturalRecovery",
        type: String
      },
      [CONSTANTS.SETTINGS.SONG_OF_REST]: {
        name: "REST-RECOVERY.Settings.ShortRest.SongOfRest.Title",
        hint: "REST-RECOVERY.Settings.ShortRest.SongOfRest.Hint",
        scope: "world",
        group: "shortrest",
        config: false,
        default: "REST-RECOVERY.FeatureNames.SongOfRest",
        type: String
      },
      [CONSTANTS.SETTINGS.CHEF_FEAT]: {
        name: "REST-RECOVERY.Settings.ShortRest.ChefFeat.Title",
        hint: "REST-RECOVERY.Settings.ShortRest.ChefFeat.Hint",
        scope: "world",
        group: "shortrest",
        config: false,
        default: "REST-RECOVERY.FeatureNames.ChefFeat",
        type: String
      },
      [CONSTANTS.SETTINGS.CHEF_TOOLS]: {
        name: "REST-RECOVERY.Settings.ShortRest.ChefTools.Title",
        hint: "REST-RECOVERY.Settings.ShortRest.ChefTools.Hint",
        scope: "world",
        group: "shortrest",
        config: false,
        default: "REST-RECOVERY.FeatureNames.ChefTools",
        type: String
      },
      [CONSTANTS.SETTINGS.DURABLE_FEAT]: {
        name: "REST-RECOVERY.Settings.ShortRest.DurableFeat.Title",
        hint: "REST-RECOVERY.Settings.ShortRest.DurableFeat.Hint",
        scope: "world",
        group: "shortrest",
        config: false,
        default: "REST-RECOVERY.FeatureNames.DurableFeat",
        type: String
      },
      [CONSTANTS.SETTINGS.PERIAPT_ITEM]: {
        name: "REST-RECOVERY.Settings.ShortRest.PeriaptItem.Title",
        hint: "REST-RECOVERY.Settings.ShortRest.PeriaptItem.Hint",
        scope: "world",
        group: "shortrest",
        config: false,
        default: "REST-RECOVERY.FeatureNames.PeriaptItem",
        type: String
      },
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
      [CONSTANTS.SETTINGS.HP_MULTIPLIER]: {
        name: "REST-RECOVERY.Settings.LongRest.HitPointsRecoveryFraction.Title",
        hint: "REST-RECOVERY.Settings.LongRest.HitPointsRecoveryFraction.Hint",
        scope: "world",
        group: "longrest",
        config: false,
        type: String,
        choices: {
          none: "REST-RECOVERY.Fractions.None",
          quarter: "REST-RECOVERY.Fractions.Quarter",
          half: "REST-RECOVERY.Fractions.Half",
          full: "REST-RECOVERY.Fractions.Full"
        },
        default: "full"
      },
      [CONSTANTS.SETTINGS.HD_MULTIPLIER]: {
        name: "REST-RECOVERY.Settings.LongRest.HitDiceRecoveryFraction.Title",
        hint: "REST-RECOVERY.Settings.LongRest.HitDiceRecoveryFraction.Hint",
        scope: "world",
        group: "longrest",
        config: false,
        type: String,
        choices: {
          none: "REST-RECOVERY.Fractions.None",
          quarter: "REST-RECOVERY.Fractions.Quarter",
          half: "REST-RECOVERY.Fractions.Half",
          full: "REST-RECOVERY.Fractions.Full"
        },
        default: "half"
      },
      [CONSTANTS.SETTINGS.HD_ROUNDING]: {
        name: "REST-RECOVERY.Settings.LongRest.HitDiceRecoveryRounding.Title",
        hint: "REST-RECOVERY.Settings.LongRest.HitDiceRecoveryRounding.Hint",
        scope: "world",
        group: "longrest",
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
        config: false,
        type: String,
        choices: {
          none: "REST-RECOVERY.Fractions.None",
          quarter: "REST-RECOVERY.Fractions.Quarter",
          half: "REST-RECOVERY.Fractions.Half",
          full: "REST-RECOVERY.Fractions.Full"
        },
        default: "full"
      },
      [CONSTANTS.SETTINGS.SPELLS_MULTIPLIER]: {
        name: "REST-RECOVERY.Settings.LongRest.SpellSlotsRecoveryFraction.Title",
        hint: "REST-RECOVERY.Settings.LongRest.SpellSlotsRecoveryFraction.Hint",
        scope: "world",
        group: "longrest",
        config: false,
        type: String,
        choices: {
          none: "REST-RECOVERY.Fractions.None",
          quarter: "REST-RECOVERY.Fractions.Quarter",
          half: "REST-RECOVERY.Fractions.Half",
          full: "REST-RECOVERY.Fractions.Full"
        },
        default: "full"
      },
      [CONSTANTS.SETTINGS.USES_OTHERS_MULTIPLIER]: {
        name: "REST-RECOVERY.Settings.LongRest.ItemUsesRecoveryFraction.Title",
        hint: "REST-RECOVERY.Settings.LongRest.ItemUsesRecoveryFraction.Hint",
        scope: "world",
        group: "longrest",
        config: false,
        type: String,
        choices: {
          none: "REST-RECOVERY.Fractions.None",
          quarter: "REST-RECOVERY.Fractions.Quarter",
          half: "REST-RECOVERY.Fractions.Half",
          full: "REST-RECOVERY.Fractions.Full"
        },
        default: "full"
      },
      [CONSTANTS.SETTINGS.USES_FEATS_MULTIPLIER]: {
        name: "REST-RECOVERY.Settings.LongRest.FeatUsesRecoveryFraction.Title",
        hint: "REST-RECOVERY.Settings.LongRest.FeatUsesRecoveryFraction.Hint",
        scope: "world",
        group: "longrest",
        config: false,
        type: String,
        choices: {
          none: "REST-RECOVERY.Fractions.None",
          quarter: "REST-RECOVERY.Fractions.Quarter",
          half: "REST-RECOVERY.Fractions.Half",
          full: "REST-RECOVERY.Fractions.Full"
        },
        default: "full"
      },
      [CONSTANTS.SETTINGS.USES_DAILY_MULTIPLIER]: {
        name: "REST-RECOVERY.Settings.LongRest.DailyUsesRecoveryFraction.Title",
        hint: "REST-RECOVERY.Settings.LongRest.DailyUsesRecoveryFraction.Hint",
        scope: "world",
        group: "longrest",
        config: false,
        type: String,
        choices: {
          none: "REST-RECOVERY.Fractions.None",
          quarter: "REST-RECOVERY.Fractions.Quarter",
          half: "REST-RECOVERY.Fractions.Half",
          full: "REST-RECOVERY.Fractions.Full"
        },
        default: "full"
      }
    };
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


function lerp(start, end, amount) {
  return (1 - amount) * start + amount * end;
}
/**
 * Defines the application shell contract. If Svelte components export getter / setters for the following properties
 * then that component is considered an application shell.
 *
 * @type {string[]}
 */


const applicationShellContract$1 = ['elementRoot'];
Object.freeze(applicationShellContract$1);
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

  for (const accessor of applicationShellContract$1) {
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
    interpolate = lerp
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
    interpolate = lerp
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
   * Returns the minimizable app option.
   *
   * @returns {boolean} Minimizable app option.
   */


  get minimizable() {
    var _classPrivateFieldGet8, _classPrivateFieldGet9;

    return (_classPrivateFieldGet8 = _classPrivateFieldGet(this, _application$1)) === null || _classPrivateFieldGet8 === void 0 ? void 0 : (_classPrivateFieldGet9 = _classPrivateFieldGet8.options) === null || _classPrivateFieldGet9 === void 0 ? void 0 : _classPrivateFieldGet9.minimizable;
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
    var _classPrivateFieldGet10, _classPrivateFieldGet11;

    return (_classPrivateFieldGet10 = _classPrivateFieldGet(this, _application$1)) === null || _classPrivateFieldGet10 === void 0 ? void 0 : (_classPrivateFieldGet11 = _classPrivateFieldGet10.options) === null || _classPrivateFieldGet11 === void 0 ? void 0 : _classPrivateFieldGet11.resizable;
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

let _Symbol$iterator;

var _validatorData = /*#__PURE__*/new WeakMap();

var _mapUnsubscribe = /*#__PURE__*/new WeakMap();

_Symbol$iterator = Symbol.iterator;

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


  *[_Symbol$iterator]() {
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
   * @type {StorePosition}
   */

  /**
   * @type {Record<string, string>}
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
        transformOrigin: s_TRANSFORM_ORIGIN_DEFAULT,
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

    _classPrivateFieldInitSpec(this, _stores$1, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _transforms, {
      writable: true,
      value: {}
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

    const _data2 = _classPrivateFieldGet(this, _data$1); // Set default value from options.


    if (typeof options === 'object') {
      if (Number.isFinite(options.height) || options.height === 'auto' || options.height === null) {
        _data2.height = typeof options.height === 'number' ? Math.round(options.height) : options.height;
      }

      if (Number.isFinite(options.left) || options.left === null) {
        _data2.left = typeof options.left === 'number' ? Math.round(options.left) : options.left;
      }

      if (Number.isFinite(options.rotateX) || options.rotateX === null) {
        _data2.rotateX = options.rotateX;

        if (Number.isFinite(_data2.rotateX)) {
          _classPrivateFieldGet(this, _transforms).rotateX = `rotateX(${_data2.rotateX}deg)`;
        }
      }

      if (Number.isFinite(options.rotateY) || options.rotateY === null) {
        _data2.rotateY = options.rotateY;

        if (Number.isFinite(_data2.rotateY)) {
          _classPrivateFieldGet(this, _transforms).rotateY = `rotateY(${_data2.rotateY}deg)`;
        }
      }

      if (Number.isFinite(options.rotateZ) || options.rotateZ === null) {
        _data2.rotateZ = options.rotateZ;

        if (Number.isFinite(_data2.rotateZ)) {
          _classPrivateFieldGet(this, _transforms).rotateZ = `rotateZ(${_data2.rotateZ}deg)`;
        }
      }

      if (Number.isFinite(options.scale) || options.scale === null) {
        _data2.scale = options.scale;

        if (Number.isFinite(_data2.scale)) {
          _classPrivateFieldGet(this, _transforms).scale = `scale(${_data2.scale})`;
        }
      }

      if (Number.isFinite(options.top) || options.top === null) {
        _data2.top = typeof options.top === 'number' ? Math.round(options.top) : options.top;
      }

      if (typeof options.transformOrigin === 'string' && s_TRANSFORM_ORIGINS.includes(options.transformOrigin)) {
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

    _classPrivateFieldGet(this, _stores$1).transformOrigin.values = s_TRANSFORM_ORIGINS;
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
    if (s_TRANSFORM_ORIGINS.includes(transformOrigin)) {
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
    interpolate = lerp
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
    } // If current minimized invoke `maximize`.


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
    interpolate = lerp
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
        data.rotateX = position.rotateX;
        updateTransform = modified = true;

        if (typeof position.rotateX === 'number') {
          transforms.rotateX = `rotateX(${position.rotateX}deg)`;
        } else {
          delete transforms.rotateX;
        }
      } else if (transforms.rotateX && !currentTransform.includes('rotateX(')) {
        updateTransform = true;
      }
    }

    if (typeof position.rotateY === 'number' || position.rotateY === null) {
      if (data.rotateY !== position.rotateY) {
        data.rotateY = position.rotateY;
        updateTransform = modified = true;

        if (typeof position.rotateY === 'number') {
          transforms.rotateY = `rotateY(${position.rotateY}deg)`;
        } else {
          delete transforms.rotateY;
        }
      } else if (transforms.rotateY && !currentTransform.includes('rotateY(')) {
        updateTransform = true;
      }
    }

    if (typeof position.rotateZ === 'number' || position.rotateZ === null) {
      if (data.rotateZ !== position.rotateZ) {
        data.rotateZ = position.rotateZ;
        updateTransform = modified = true;

        if (typeof position.rotateZ === 'number') {
          transforms.rotateZ = `rotateZ(${position.rotateZ}deg)`;
        } else {
          delete transforms.rotateZ;
        }
      } else if (transforms.rotateZ && !currentTransform.includes('rotateZ(')) {
        updateTransform = true;
      }
    }

    if (typeof position.scale === 'number' || position.scale === null) {
      position.scale = typeof position.scale === 'number' ? Math.max(0, Math.min(position.scale, 1000)) : null;

      if (data.scale !== position.scale) {
        data.scale = position.scale;
        updateTransform = modified = true;

        if (typeof position.scale === 'number') {
          transforms.scale = `scale(${position.scale})`;
        } else {
          delete transforms.scale;
        }
      } else if (transforms.scale && !currentTransform.includes('scale(')) {
        updateTransform = true;
      }
    }

    if (typeof position.transformOrigin !== void 0) {
      position.transformOrigin = s_TRANSFORM_ORIGINS.includes(position.transformOrigin) ? position.transformOrigin : s_TRANSFORM_ORIGIN_DEFAULT;

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
    _classPrivateFieldSet(this, _transformUpdate, false);

    let transformString = '';

    const transforms = _classPrivateFieldGet(this, _transforms);

    for (const key in transforms) {
      transformString += transforms[key];
    }

    el.style.transformOrigin = data.transformOrigin;
    el.style.transform = transformString;
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
    currentPosition.transformOrigin = s_TRANSFORM_ORIGINS.includes(transformOrigin) ? transformOrigin : s_TRANSFORM_ORIGIN_DEFAULT;
  }

  if (typeof zIndex === 'number' || zIndex === null) {
    currentPosition.zIndex = typeof zIndex === 'number' ? Math.round(zIndex) : zIndex;
  } // Return the updated position object.


  return currentPosition;
}

const s_TRANSFORM_ORIGIN_DEFAULT = 'top left';
/**
 * Defines the valid transform origins.
 *
 * @type {string[]}
 */

const s_TRANSFORM_ORIGINS = ['top left', 'top center', 'top right', 'center left', 'center', 'center right', 'bottom left', 'bottom center', 'bottom right'];
Object.freeze(s_TRANSFORM_ORIGINS);

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

      if (className.includes('window-title') || className.includes('close')) {
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
 * Defines the application shell contract. If Svelte components export getter / setters for the following properties
 * then that component is considered an application shell.
 *
 * @type {string[]}
 */


const applicationShellContract = ['elementRoot'];
Object.freeze(applicationShellContract);

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


function create_if_block_1$3(ctx) {
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


function create_if_block$5(ctx) {
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
  const if_block_creators = [create_if_block$5, create_if_block_1$3];
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

function create_fragment$8(ctx) {
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

function instance$8($$self, $$props, $$invalidate) {
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
    init(this, options, instance$8, create_fragment$8, safe_not_equal, {
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


function create_fragment$7(ctx) {
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

function instance$7($$self, $$props, $$invalidate) {
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
    init(this, options, instance$7, create_fragment$7, safe_not_equal, {
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
  child_ctx[11] = list[i];
  return child_ctx;
} // (42:4) {#each $storeHeaderButtons as button}


function create_each_block$1$1(ctx) {
  let tjsheaderbutton;
  let current;
  tjsheaderbutton = new TJSHeaderButton({
    props: {
      button:
      /*button*/
      ctx[11]
    }
  });
  return {
    c() {
      create_component(tjsheaderbutton.$$.fragment);
    },

    m(target, anchor) {
      mount_component(tjsheaderbutton, target, anchor);
      current = true;
    },

    p(ctx, dirty) {
      const tjsheaderbutton_changes = {};
      if (dirty &
      /*$storeHeaderButtons*/
      8) tjsheaderbutton_changes.button =
      /*button*/
      ctx[11];
      tjsheaderbutton.$set(tjsheaderbutton_changes);
    },

    i(local) {
      if (current) return;
      transition_in(tjsheaderbutton.$$.fragment, local);
      current = true;
    },

    o(local) {
      transition_out(tjsheaderbutton.$$.fragment, local);
      current = false;
    },

    d(detaching) {
      destroy_component(tjsheaderbutton, detaching);
    }

  };
}

function create_fragment$6(ctx) {
  let header;
  let h4;
  let t0_value = localize(
  /*$storeTitle*/
  ctx[2]) + "";
  let t0;
  let t1;
  let draggable_action;
  let minimizable_action;
  let current;
  let mounted;
  let dispose;
  let each_value =
  /*$storeHeaderButtons*/
  ctx[3];
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
          ctx[4].position,
          active:
          /*$storeDraggable*/
          ctx[0],
          storeDragging:
          /*storeDragging*/
          ctx[7]
        })), action_destroyer(minimizable_action =
        /*minimizable*/
        ctx[10].call(null, header,
        /*$storeMinimizable*/
        ctx[1]))];
        mounted = true;
      }
    },

    p(ctx, [dirty]) {
      if ((!current || dirty &
      /*$storeTitle*/
      4) && t0_value !== (t0_value = localize(
      /*$storeTitle*/
      ctx[2]) + "")) set_data(t0, t0_value);

      if (dirty &
      /*$storeHeaderButtons*/
      8) {
        each_value =
        /*$storeHeaderButtons*/
        ctx[3];
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
      1) draggable_action.update.call(null, {
        position:
        /*application*/
        ctx[4].position,
        active:
        /*$storeDraggable*/
        ctx[0],
        storeDragging:
        /*storeDragging*/
        ctx[7]
      });
      if (minimizable_action && is_function(minimizable_action.update) && dirty &
      /*$storeMinimizable*/
      2) minimizable_action.update.call(null,
      /*$storeMinimizable*/
      ctx[1]);
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

function instance$6($$self, $$props, $$invalidate) {
  let $storeDraggable;
  let $storeMinimizable;
  let $storeTitle;
  let $storeHeaderButtons;
  const application = getContext('external').application;
  const storeTitle = application.reactive.storeAppOptions.title;
  component_subscribe($$self, storeTitle, value => $$invalidate(2, $storeTitle = value));
  const storeDraggable = application.reactive.storeAppOptions.draggable;
  component_subscribe($$self, storeDraggable, value => $$invalidate(0, $storeDraggable = value));
  const storeDragging = application.reactive.storeUIState.dragging;
  const storeHeaderButtons = application.reactive.storeUIState.headerButtons;
  component_subscribe($$self, storeHeaderButtons, value => $$invalidate(3, $storeHeaderButtons = value));
  const storeMinimizable = application.reactive.storeAppOptions.minimizable;
  component_subscribe($$self, storeMinimizable, value => $$invalidate(1, $storeMinimizable = value));

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

  return [$storeDraggable, $storeMinimizable, $storeTitle, $storeHeaderButtons, application, storeTitle, storeDraggable, storeDragging, storeHeaderButtons, storeMinimizable, minimizable];
}

class TJSApplicationHeader extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$6, create_fragment$6, safe_not_equal, {});
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


function create_fragment$5(ctx) {
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

function instance$5($$self, $$props, $$invalidate) {
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
    init(this, options, instance$5, create_fragment$5, safe_not_equal, {
      isResizable: 7
    });
  }

}
/* src\component\core\application\ApplicationShell.svelte generated by Svelte v3.46.0 */


function add_css$2(target) {
  append_styles(target, "svelte-3vt5in", ".window-app.svelte-3vt5in{overflow:inherit}");
} // (166:0) {:else}


function create_else_block_1$1(ctx) {
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


function create_if_block$4(ctx) {
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
  const if_block_creators = [create_if_block$4, create_else_block_1$1];
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

function get_each_context$3(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[15] = list[i];
  return child_ctx;
} // (202:29) 


function create_if_block_3$2(ctx) {
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


function create_if_block_2$3(ctx) {
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
    let child_ctx = get_each_context$3(ctx, each_value, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
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
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, destroy_block, create_each_block$3, null, get_each_context$3);
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


function create_if_block_1$4(ctx) {
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


function create_each_block$3(key_1, ctx) {
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
  ctx[15].icon && create_if_block_1$4(ctx);

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
          if_block = create_if_block_1$4(ctx);
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
  const if_block_creators = [create_if_block_2$3, create_if_block_3$2];
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


function create_if_block$3(ctx) {
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
      default: [create_default_slot$3]
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


function create_default_slot$3(ctx) {
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
  const if_block_creators = [create_if_block$3, create_else_block$4];
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
    return i + 'st';
  }

  if (j === 2 && k !== 12) {
    return i + 'nd';
  }

  if (j === 3 && k !== 13) {
    return i + 'rd';
  }

  return i + 'th';
}
function dialogLayout({
  title = "Short Rest",
  message,
  icon = "fas fa-exclamation-triangle"
} = {}) {
  return `
    <div style="margin-bottom: 1rem; font-size: 0.9rem; text-align: center;">
        <p><i style="font-size:3rem;" class="${icon}"></i></p>
        <p style="margin-bottom: 1rem"><strong style="font-size:1.2rem;">${title}</strong></p>
        <p>${message}</p>
    </div>
    `;
}
function determineLongRestMultiplier(settingKey) {
  const multiplierSetting = getSetting(settingKey);

  switch (multiplierSetting) {
    case "none":
      return 0;

    case "quarter":
      return 0.25;

    case "half":
      return 0.5;

    case "full":
      return 1.0;

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

/* scripts\formapplications\settings\settings-shell.svelte generated by Svelte v3.46.4 */

const { Map: Map_1 } = globals;

function get_each_context$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[16] = list[i];
	child_ctx[18] = i;
	return child_ctx;
}

function get_each_context_1$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[19] = list[i][0];
	child_ctx[20] = list[i][1];
	child_ctx[21] = list;
	child_ctx[22] = i;
	return child_ctx;
}

function get_each_context_2$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[19] = list[i][0];
	child_ctx[23] = list[i][1];
	child_ctx[18] = i;
	return child_ctx;
}

// (97:24) {:else}
function create_else_block$2(ctx) {
	let input;
	let mounted;
	let dispose;

	function input_input_handler_1() {
		/*input_input_handler_1*/ ctx[11].call(input, /*each_value_1*/ ctx[21], /*setting_index*/ ctx[22]);
	}

	return {
		c() {
			input = element("input");
			attr(input, "type", "text");
			attr(input, "class", "svelte-1xzged7");
		},
		m(target, anchor) {
			insert(target, input, anchor);
			set_input_value(input, /*setting*/ ctx[20].value);

			if (!mounted) {
				dispose = [
					listen(input, "input", input_input_handler_1),
					listen(input, "change", /*validateSettings*/ ctx[3])
				];

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*settings, Object*/ 4 && input.value !== /*setting*/ ctx[20].value) {
				set_input_value(input, /*setting*/ ctx[20].value);
			}
		},
		d(detaching) {
			if (detaching) detach(input);
			mounted = false;
			run_all(dispose);
		}
	};
}

// (93:68) 
function create_if_block_2$2(ctx) {
	let input;
	let mounted;
	let dispose;

	function input_input_handler() {
		/*input_input_handler*/ ctx[10].call(input, /*each_value_1*/ ctx[21], /*setting_index*/ ctx[22]);
	}

	return {
		c() {
			input = element("input");
			attr(input, "type", "number");
			attr(input, "class", "svelte-1xzged7");
		},
		m(target, anchor) {
			insert(target, input, anchor);
			set_input_value(input, /*setting*/ ctx[20].value);

			if (!mounted) {
				dispose = [
					listen(input, "input", input_input_handler),
					listen(input, "change", /*validateSettings*/ ctx[3])
				];

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*settings, Object*/ 4 && to_number(input.value) !== /*setting*/ ctx[20].value) {
				set_input_value(input, /*setting*/ ctx[20].value);
			}
		},
		d(detaching) {
			if (detaching) detach(input);
			mounted = false;
			run_all(dispose);
		}
	};
}

// (85:50) 
function create_if_block_1$2(ctx) {
	let select;
	let each_blocks = [];
	let each_1_lookup = new Map_1();
	let mounted;
	let dispose;
	let each_value_2 = Object.entries(/*setting*/ ctx[20].choices);
	const get_key = ctx => /*index*/ ctx[18];

	for (let i = 0; i < each_value_2.length; i += 1) {
		let child_ctx = get_each_context_2$1(ctx, each_value_2, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block_2$1(key, child_ctx));
	}

	function select_change_handler() {
		/*select_change_handler*/ ctx[9].call(select, /*each_value_1*/ ctx[21], /*setting_index*/ ctx[22]);
	}

	return {
		c() {
			select = element("select");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(select, "class", "svelte-1xzged7");
			if (/*setting*/ ctx[20].value === void 0) add_render_callback(select_change_handler);
		},
		m(target, anchor) {
			insert(target, select, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(select, null);
			}

			select_option(select, /*setting*/ ctx[20].value);

			if (!mounted) {
				dispose = [
					listen(select, "change", select_change_handler),
					listen(select, "change", /*validateSettings*/ ctx[3])
				];

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*Object, settings, localize*/ 4) {
				each_value_2 = Object.entries(/*setting*/ ctx[20].choices);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_2, each_1_lookup, select, destroy_block, create_each_block_2$1, null, get_each_context_2$1);
			}

			if (dirty & /*settings, Object*/ 4) {
				select_option(select, /*setting*/ ctx[20].value);
			}
		},
		d(detaching) {
			if (detaching) detach(select);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}

			mounted = false;
			run_all(dispose);
		}
	};
}

// (81:24) {#if typeof setting.value === "boolean"}
function create_if_block$2(ctx) {
	let input;
	let input_disabled_value;
	let mounted;
	let dispose;

	function input_change_handler() {
		/*input_change_handler*/ ctx[8].call(input, /*each_value_1*/ ctx[21], /*setting_index*/ ctx[22]);
	}

	return {
		c() {
			input = element("input");
			attr(input, "type", "checkbox");
			input.disabled = input_disabled_value = /*setting*/ ctx[20].disabled;
		},
		m(target, anchor) {
			insert(target, input, anchor);
			input.checked = /*setting*/ ctx[20].value;

			if (!mounted) {
				dispose = [
					listen(input, "change", input_change_handler),
					listen(input, "change", /*validateSettings*/ ctx[3])
				];

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*settings, Object*/ 4 && input_disabled_value !== (input_disabled_value = /*setting*/ ctx[20].disabled)) {
				input.disabled = input_disabled_value;
			}

			if (dirty & /*settings, Object*/ 4) {
				input.checked = /*setting*/ ctx[20].value;
			}
		},
		d(detaching) {
			if (detaching) detach(input);
			mounted = false;
			run_all(dispose);
		}
	};
}

// (88:28) {#each Object.entries(setting.choices) as [key, choice], index (index)}
function create_each_block_2$1(key_1, ctx) {
	let option;
	let t_value = localize(/*choice*/ ctx[23]) + "";
	let t;
	let option_value_value;

	return {
		key: key_1,
		first: null,
		c() {
			option = element("option");
			t = text(t_value);
			option.__value = option_value_value = /*key*/ ctx[19];
			option.value = option.__value;
			this.first = option;
		},
		m(target, anchor) {
			insert(target, option, anchor);
			append(option, t);
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*Object, settings*/ 4 && t_value !== (t_value = localize(/*choice*/ ctx[23]) + "")) set_data(t, t_value);

			if (dirty & /*Object, settings*/ 4 && option_value_value !== (option_value_value = /*key*/ ctx[19])) {
				option.__value = option_value_value;
				option.value = option.__value;
			}
		},
		d(detaching) {
			if (detaching) detach(option);
		}
	};
}

// (77:16) {#each settings[group] as [key, setting], setting_index (key)}
function create_each_block_1$1(key_1, ctx) {
	let div1;
	let label;
	let t0_value = localize(/*setting*/ ctx[20].name) + "";
	let t0;
	let t1;
	let a;
	let i;
	let t2;
	let div0;
	let t3;
	let p;
	let t4_value = localize(/*setting*/ ctx[20].hint) + "";
	let t4;
	let mounted;
	let dispose;

	function click_handler() {
		return /*click_handler*/ ctx[7](/*group*/ ctx[16], /*setting_index*/ ctx[22]);
	}

	function select_block_type(ctx, dirty) {
		if (typeof /*setting*/ ctx[20].value === "boolean") return create_if_block$2;
		if (/*setting*/ ctx[20].choices) return create_if_block_1$2;
		if (typeof /*setting*/ ctx[20].value === 'number') return create_if_block_2$2;
		return create_else_block$2;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type(ctx);

	return {
		key: key_1,
		first: null,
		c() {
			div1 = element("div");
			label = element("label");
			t0 = text(t0_value);
			t1 = space();
			a = element("a");
			i = element("i");
			t2 = space();
			div0 = element("div");
			if_block.c();
			t3 = space();
			p = element("p");
			t4 = text(t4_value);
			attr(i, "title", "Reset setting");
			attr(i, "class", "fas fa-undo reset-setting svelte-1xzged7");
			attr(label, "class", "svelte-1xzged7");
			attr(div0, "class", "form-fields svelte-1xzged7");
			attr(p, "class", "notes");
			attr(div1, "class", "form-group svelte-1xzged7");
			this.first = div1;
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, label);
			append(label, t0);
			append(label, t1);
			append(label, a);
			append(a, i);
			append(div1, t2);
			append(div1, div0);
			if_block.m(div0, null);
			append(div1, t3);
			append(div1, p);
			append(p, t4);

			if (!mounted) {
				dispose = listen(i, "click", click_handler);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*settings, Object*/ 4 && t0_value !== (t0_value = localize(/*setting*/ ctx[20].name) + "")) set_data(t0, t0_value);

			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(div0, null);
				}
			}

			if (dirty & /*settings, Object*/ 4 && t4_value !== (t4_value = localize(/*setting*/ ctx[20].hint) + "")) set_data(t4, t4_value);
		},
		d(detaching) {
			if (detaching) detach(div1);
			if_block.d();
			mounted = false;
			dispose();
		}
	};
}

// (74:12) {#each Object.keys(settings) as group, index (index)}
function create_each_block$2(key_1, ctx) {
	let div;
	let each_blocks = [];
	let each_1_lookup = new Map_1();
	let t;
	let div_data_tab_value;
	let each_value_1 = /*settings*/ ctx[2][/*group*/ ctx[16]];
	const get_key = ctx => /*key*/ ctx[19];

	for (let i = 0; i < each_value_1.length; i += 1) {
		let child_ctx = get_each_context_1$1(ctx, each_value_1, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block_1$1(key, child_ctx));
	}

	return {
		key: key_1,
		first: null,
		c() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t = space();
			attr(div, "class", "tab flex");
			attr(div, "data-group", "primary");
			attr(div, "data-tab", div_data_tab_value = /*group*/ ctx[16]);
			this.first = div;
		},
		m(target, anchor) {
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			append(div, t);
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*localize, settings, Object, validateSettings, resetSetting*/ 28) {
				each_value_1 = /*settings*/ ctx[2][/*group*/ ctx[16]];
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, div, destroy_block, create_each_block_1$1, t, get_each_context_1$1);
			}

			if (dirty & /*Object, settings*/ 4 && div_data_tab_value !== (div_data_tab_value = /*group*/ ctx[16])) {
				attr(div, "data-tab", div_data_tab_value);
			}
		},
		d(detaching) {
			if (detaching) detach(div);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}
		}
	};
}

// (61:0) <ApplicationShell bind:elementRoot>
function create_default_slot$2(ctx) {
	let form_1;
	let h2;
	let t1;
	let nav;
	let a0;
	let t3;
	let a1;
	let t5;
	let section;
	let each_blocks = [];
	let each_1_lookup = new Map_1();
	let t6;
	let footer;
	let button;
	let i;
	let t7;
	let t8_value = localize("REST-RECOVERY.Dialogs.ModuleConfig.Submit") + "";
	let t8;
	let mounted;
	let dispose;
	let each_value = Object.keys(/*settings*/ ctx[2]);
	const get_key = ctx => /*index*/ ctx[18];

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context$2(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
	}

	return {
		c() {
			form_1 = element("form");
			h2 = element("h2");
			h2.textContent = `${localize("REST-RECOVERY.Dialogs.ModuleConfig.Title")}`;
			t1 = space();
			nav = element("nav");
			a0 = element("a");
			a0.textContent = `${localize("REST-RECOVERY.Dialogs.ModuleConfig.LongRest")}`;
			t3 = space();
			a1 = element("a");
			a1.textContent = `${localize("REST-RECOVERY.Dialogs.ModuleConfig.ShortRest")}`;
			t5 = space();
			section = element("section");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t6 = space();
			footer = element("footer");
			button = element("button");
			i = element("i");
			t7 = space();
			t8 = text(t8_value);
			set_style(h2, "text-align", "center");
			set_style(h2, "margin-bottom", "1rem");
			attr(a0, "class", "item active");
			attr(a0, "data-tab", "longrest");
			attr(a1, "class", "item");
			attr(a1, "data-tab", "shortrest");
			attr(nav, "class", "tabs svelte-1xzged7");
			attr(nav, "data-group", "primary");
			attr(section, "class", "tab-body svelte-1xzged7");
			attr(i, "class", "far fa-save");
			attr(button, "type", "button");
			attr(footer, "class", "svelte-1xzged7");
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
			append(form_1, t5);
			append(form_1, section);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(section, null);
			}

			append(form_1, t6);
			append(form_1, footer);
			append(footer, button);
			append(button, i);
			append(button, t7);
			append(button, t8);
			/*form_1_binding*/ ctx[12](form_1);

			if (!mounted) {
				dispose = [
					listen(button, "click", /*requestSubmit*/ ctx[5]),
					listen(form_1, "submit", prevent_default(/*updateSettings*/ ctx[6]), { once: true })
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty & /*Object, settings, localize, validateSettings, resetSetting*/ 28) {
				each_value = Object.keys(/*settings*/ ctx[2]);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, section, destroy_block, create_each_block$2, null, get_each_context$2);
			}
		},
		d(detaching) {
			if (detaching) detach(form_1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}

			/*form_1_binding*/ ctx[12](null);
			mounted = false;
			run_all(dispose);
		}
	};
}

function create_fragment$4(ctx) {
	let applicationshell;
	let updating_elementRoot;
	let current;

	function applicationshell_elementRoot_binding(value) {
		/*applicationshell_elementRoot_binding*/ ctx[13](value);
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
		p(ctx, [dirty]) {
			const applicationshell_changes = {};

			if (dirty & /*$$scope, form, Object, settings*/ 33554438) {
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

function instance$4($$self, $$props, $$invalidate) {
	const { application } = getContext('external');
	let { elementRoot } = $$props;
	let form;
	let settingsMap = new Map();

	let settings = Object.entries(CONSTANTS.DEFAULT_SETTINGS).map(entry => {
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

	async function requestSubmit() {
		for (let group of Object.values(settings)) {
			for (let [key, setting] of group) {
				await game.settings.set(CONSTANTS.MODULE_NAME, key, setting.value);
			}
		}

		form.requestSubmit();
	}

	function updateSettings() {
		application.close();
	}

	const click_handler = (group, setting_index) => {
		resetSetting(group, setting_index);
	};

	function input_change_handler(each_value_1, setting_index) {
		each_value_1[setting_index][1].value = this.checked;
		$$invalidate(2, settings);
	}

	function select_change_handler(each_value_1, setting_index) {
		each_value_1[setting_index][1].value = select_value(this);
		$$invalidate(2, settings);
	}

	function input_input_handler(each_value_1, setting_index) {
		each_value_1[setting_index][1].value = to_number(this.value);
		$$invalidate(2, settings);
	}

	function input_input_handler_1(each_value_1, setting_index) {
		each_value_1[setting_index][1].value = this.value;
		$$invalidate(2, settings);
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
		validateSettings,
		resetSetting,
		requestSubmit,
		updateSettings,
		click_handler,
		input_change_handler,
		select_change_handler,
		input_input_handler,
		input_input_handler_1,
		form_1_binding,
		applicationshell_elementRoot_binding
	];
}

class Settings_shell extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$4, create_fragment$4, safe_not_equal, { elementRoot: 0 });
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

  for (const [name, data] of Object.entries(CONSTANTS.DEFAULT_SETTINGS)) {
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
  game.settings.register(CONSTANTS.MODULE_NAME, "debug", {
    name: "REST-RECOVERY.Settings.Debug.Title",
    hint: "REST-RECOVERY.Settings.Debug.Label",
    scope: "client",
    config: true,
    default: false,
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
  for (const [name, data] of Object.entries(CONSTANTS.DEFAULT_SETTINGS)) {
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

/* scripts\formapplications\components\Healthbar.svelte generated by Svelte v3.46.4 */

function create_fragment$3(ctx) {
	let div3;
	let div2;
	let div0;
	let t0;
	let div1;
	let t1;

	return {
		c() {
			div3 = element("div");
			div2 = element("div");
			div0 = element("div");
			t0 = space();
			div1 = element("div");
			t1 = text(/*text*/ ctx[0]);
			attr(div0, "class", "progress svelte-1307vsu");
			set_style(div0, "width", /*$progressBar*/ ctx[2] * 100 + "%");
			attr(div1, "class", "overlay svelte-1307vsu");
			attr(div2, "class", "healthbar svelte-1307vsu");
		},
		m(target, anchor) {
			insert(target, div3, anchor);
			append(div3, div2);
			append(div2, div0);
			append(div2, t0);
			append(div2, div1);
			append(div1, t1);
		},
		p(ctx, [dirty]) {
			if (dirty & /*$progressBar*/ 4) {
				set_style(div0, "width", /*$progressBar*/ ctx[2] * 100 + "%");
			}

			if (dirty & /*text*/ 1) set_data(t1, /*text*/ ctx[0]);
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div3);
		}
	};
}

function instance$3($$self, $$props, $$invalidate) {
	let $progressBar,
		$$unsubscribe_progressBar = noop,
		$$subscribe_progressBar = () => ($$unsubscribe_progressBar(), $$unsubscribe_progressBar = subscribe(progressBar, $$value => $$invalidate(2, $progressBar = $$value)), progressBar);

	$$self.$$.on_destroy.push(() => $$unsubscribe_progressBar());
	let { text } = $$props;
	let { progress } = $$props;
	let { progressBar = tweened(0, { duration: 400, easing: cubicOut }) } = $$props;
	$$subscribe_progressBar();

	function updateProgress() {
		progressBar.set(progress);
	}

	$$self.$$set = $$props => {
		if ('text' in $$props) $$invalidate(0, text = $$props.text);
		if ('progress' in $$props) $$invalidate(3, progress = $$props.progress);
		if ('progressBar' in $$props) $$subscribe_progressBar($$invalidate(1, progressBar = $$props.progressBar));
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*progress*/ 8) {
			(updateProgress());
		}
	};

	return [text, progressBar, $progressBar, progress];
}

class Healthbar extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$3, create_fragment$3, safe_not_equal, { text: 0, progress: 3, progressBar: 1 });
	}
}

const rests = new Map();
class RestWorkflow {
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
    return workflow;
  }

  constructor(actor, longRest) {
    this.actor = actor;
    this.longRest = longRest;
    this.finished = false;
    this.fetchHealthData();
    this.fetchSpellData();
    this.fetchFeatures();
  }

  get healthPercentage() {
    return this.actor.data.data.attributes.hp.value / this.actor.data.data.attributes.hp.max;
  }

  get healthRegained() {
    return this.actor.data.data.attributes.hp.value - this.healthData.startingHealth;
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

  fetchHealthData() {
    this.healthData = {
      startingHitDice: this.actor.data.data.attributes.hd,
      startingHealth: this.actor.data.data.attributes.hp.value,
      availableHitDice: this.getHitDice(),
      totalHitDice: this.totalHitDice,
      totalHealthRegained: 0
    };
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

  fetchSpellData() {
    var _this$actor$items$fin, _this$actor$items$fin2, _this$actor$items$fin3, _this$actor$items$fin4, _this$actor$items$fin5, _this$actor$items$fin6, _this$actor$items$get, _wizardFeature$data, _wizardFeature$data$d, _wizardFeature$data$d2, _druidFeature$data, _druidFeature$data$da, _druidFeature$data$da2;

    this.spellData = {
      slots: {},
      missingSlots: false,
      feature: false,
      pointsSpent: 0,
      pointsTotal: 0,
      className: ""
    };
    const wizardLevel = ((_this$actor$items$fin = this.actor.items.find(item => {
      return item.type === "class" && item.data.data.levels >= 2 && item.name === getSetting(CONSTANTS.SETTINGS.WIZARD_CLASS, true);
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

    const wizardFeatureUse = wizardLevel && wizardFeature && (wizardFeature === null || wizardFeature === void 0 ? void 0 : (_wizardFeature$data = wizardFeature.data) === null || _wizardFeature$data === void 0 ? void 0 : (_wizardFeature$data$d = _wizardFeature$data.data) === null || _wizardFeature$data$d === void 0 ? void 0 : (_wizardFeature$data$d2 = _wizardFeature$data$d.uses) === null || _wizardFeature$data$d2 === void 0 ? void 0 : _wizardFeature$data$d2.value) > 0;
    const druidFeatureUse = druidLevel && druidFeature && (druidFeature === null || druidFeature === void 0 ? void 0 : (_druidFeature$data = druidFeature.data) === null || _druidFeature$data === void 0 ? void 0 : (_druidFeature$data$da = _druidFeature$data.data) === null || _druidFeature$data$da === void 0 ? void 0 : (_druidFeature$data$da2 = _druidFeature$data$da.uses) === null || _druidFeature$data$da2 === void 0 ? void 0 : _druidFeature$data$da2.value) > 0;

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

    this.patchSpellFeature();
  }

  async patchSpellFeature() {
    if (this.spellData.feature && (this.spellData.feature.data.data.activation.type !== "special" || this.spellData.feature.data.data.uses.value === null || this.spellData.feature.data.data.uses.max === null || this.spellData.feature.data.data.uses.per !== "lr")) {
      await this.actor.updateEmbeddedDocuments("Item", [{
        _id: this.spellData.feature.id,
        "data.activation.type": "special",
        "data.uses.value": 1,
        "data.uses.max": 1,
        "data.uses.per": "lr"
      }]);
      ui.notifications.info(game.i18n.format("REST-RECOVERY.PatchedRecovery", {
        actorName: this.actor.name,
        recoveryName: this.spellData.feature.name
      }));
    }
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
    const ignoreInactivePlayers = getSetting(CONSTANTS.SETTINGS.IGNORE_INACTIVE_PLAYERS, true);
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
      var _this$actor$data$data;

      const curHP = this.actor.data.data.attributes.hp.value;
      const maxHP = this.actor.data.data.attributes.hp.max + ((_this$actor$data$data = this.actor.data.data.attributes.hp.tempmax) !== null && _this$actor$data$data !== void 0 ? _this$actor$data$data : 0);
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

  _getRestHitPointRecovery(result) {
    if (!this.longRest) {
      result.hitPointsRecovered = Math.max(0, result.hitPointsRecovered);
      return result;
    }

    const multiplier = determineLongRestMultiplier(CONSTANTS.SETTINGS.HP_MULTIPLIER);
    const maxHP = this.actor.data.data.attributes.hp.max;
    const currentHP = this.actor.data.data.attributes.hp.value;
    const recoveredHP = Math.floor(maxHP * multiplier);
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

  _getRestHitDiceRecoveryPost({
    updates,
    hitDiceRecovered
  } = {}) {
    const sortedClasses = Object.values(this.actor.classes).sort((a, b) => {
      return (parseInt(b.data.data.hitDice.slice(1)) || 0) - (parseInt(a.data.data.hitDice.slice(1)) || 0);
    });

    for (const item of sortedClasses) {
      if (item.data.data.hitDiceUsed < 0) {
        const update = updates.find(update => update._id === item.id);

        if (update) {
          updates[updates.indexOf(update)]["data.hitDiceUsed"] = 0;
        } else {
          updates.push({
            _id: item.id,
            "data.hitDiceUsed": 0
          });
        }

        hitDiceRecovered = Math.max(0, Math.min(this.actor.data.data.details.level, this.totalHitDice) - this.healthData.startingHitDice);
      } else {
        const update = updates.find(update => update._id === item.id);

        if (update) {
          updates.splice(updates.indexOf(update), 1);
        }
      }
    }

    return {
      updates,
      hitDiceRecovered
    };
  }

  _getMaxHitDiceRecovery({
    maxHitDice = undefined
  } = {}) {
    var _maxHitDice;

    const multiplier = determineLongRestMultiplier(CONSTANTS.SETTINGS.HD_MULTIPLIER);
    const roundingMethod = determineRoundingMethod(CONSTANTS.SETTINGS.HD_ROUNDING);
    const actorLevel = this.actor.data.data.details.level;
    maxHitDice = Math.clamped(roundingMethod(actorLevel * multiplier), multiplier ? 1 : 0, (_maxHitDice = maxHitDice) !== null && _maxHitDice !== void 0 ? _maxHitDice : actorLevel);
    return {
      maxHitDice
    };
  }

  _getRestResourceRecovery(updates, {
    recoverShortRestResources = true,
    recoverLongRestResources = true
  } = {}) {
    const multiplier = determineLongRestMultiplier(CONSTANTS.SETTINGS.RESOURCES_MULTIPLIER);
    if (multiplier === 1.0) return updates;
    if (!multiplier) return {};
    updates = {};

    for (const [key, resource] of Object.entries(this.actor.data.data.resources)) {
      if (Number.isNumeric(resource.max)) {
        if (recoverShortRestResources && resource.sr) {
          updates[`data.resources.${key}.value`] = Number(resource.max);
        } else if (recoverLongRestResources && resource.lr) {
          const recoverResources = Math.max(Math.floor(resource.max * multiplier), multiplier ? 1 : 0);
          updates[`data.resources.${key}.value`] = Math.min(resource.value + recoverResources, resource.max);
        }
      }
    }

    return updates;
  }

  _getRestSpellRecovery(updates, {
    recoverSpells = true
  } = {}) {
    if (!recoverSpells && this.spellData.feature) {
      for (const [slot, num] of Object.entries(this.recoveredSlots)) {
        const prop = `data.spells.spell${slot}.value`;
        updates[prop] = (updates[prop] || foundry.utils.getProperty(this.actor.data, prop) || 0) + num;
      }

      return updates;
    }

    const multiplier = determineLongRestMultiplier(CONSTANTS.SETTINGS.SPELLS_MULTIPLIER);

    for (let [level, slot] of Object.entries(this.actor.data.data.spells)) {
      if (!slot.override && !slot.max) continue;
      let spellMax = slot.override || slot.max;

      let _recoverSpells = Math.max(Math.floor(spellMax * multiplier), multiplier ? 1 : multiplier);

      updates[`data.spells.${level}.value`] = Math.min(slot.value + _recoverSpells, spellMax);
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
    const amountToRecover = Math.max(Math.floor(usesMax * multiplier), multiplier ? 1 : 0);
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

/* scripts\formapplications\short-rest\short-rest-shell.svelte generated by Svelte v3.46.4 */

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[26] = list[i][0];
	child_ctx[27] = list[i][1];
	child_ctx[29] = i;
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[30] = list[i];
	child_ctx[31] = list;
	child_ctx[32] = i;
	return child_ctx;
}

function get_each_context_2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[33] = list[i][0];
	child_ctx[34] = list[i][1];
	child_ctx[36] = i;
	return child_ctx;
}

// (98:16) {#each Object.entries(healthData.availableHitDice) as [hitDice, num], index (index)}
function create_each_block_2(key_1, ctx) {
	let option;
	let t0_value = /*hitDice*/ ctx[33] + "";
	let t0;
	let t1;
	let t2_value = /*num*/ ctx[34] + "";
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
			option.__value = option_value_value = /*hitDice*/ ctx[33];
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
			if (dirty[0] & /*healthData*/ 256 && t0_value !== (t0_value = /*hitDice*/ ctx[33] + "")) set_data(t0, t0_value);
			if (dirty[0] & /*healthData*/ 256 && t2_value !== (t2_value = /*num*/ ctx[34] + "")) set_data(t2, t2_value);

			if (dirty[0] & /*healthData*/ 256 && option_value_value !== (option_value_value = /*hitDice*/ ctx[33])) {
				option.__value = option_value_value;
				option.value = option.__value;
			}
		},
		d(detaching) {
			if (detaching) detach(option);
		}
	};
}

// (106:12) {#if healthData.totalHitDice === 0}
function create_if_block_6$1(ctx) {
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

// (109:12) {#if currHP >= maxHP}
function create_if_block_5$1(ctx) {
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

// (114:8) {#if spellData.feature}
function create_if_block_2$1(ctx) {
	let div;
	let label;

	let t0_value = localize("REST-RECOVERY.Dialogs.ShortRest.SpellSlotRecovery", {
		featureName: /*spellData*/ ctx[9].feature.name
	}) + "";

	let t0;
	let t1;
	let if_block_anchor;

	function select_block_type(ctx, dirty) {
		if (/*spellData*/ ctx[9].missingSlots && !/*spellData*/ ctx[9].has_feature_use) return create_if_block_3$1;
		if (/*spellData*/ ctx[9].missingSlots) return create_if_block_4$1;
		return create_else_block$1;
	}

	let current_block_type = select_block_type(ctx);
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

			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
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

// (150:12) {:else}
function create_else_block$1(ctx) {
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

// (126:45) 
function create_if_block_4$1(ctx) {
	let each_blocks = [];
	let each_1_lookup = new Map();
	let t0;
	let p;

	let t1_value = localize("REST-RECOVERY.Dialogs.ShortRest.SpellSlotsLeft", {
		spellSlotsLeft: /*spellData*/ ctx[9].pointsTotal - /*spellData*/ ctx[9].pointsSpent
	}) + "";

	let t1;
	let each_value = Object.entries(/*spellData*/ ctx[9].slots);
	const get_key = ctx => /*levelIndex*/ ctx[29];

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context$1(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
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
			if (dirty[0] & /*spellData, spendSpellPoint*/ 33280) {
				each_value = Object.entries(/*spellData*/ ctx[9].slots);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, t0.parentNode, destroy_block, create_each_block$1, t0, get_each_context$1);
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

// (120:12) {#if spellData.missingSlots && !spellData.has_feature_use}
function create_if_block_3$1(ctx) {
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

// (133:32) {#each slots as slot, slotIndex (slotIndex)}
function create_each_block_1(key_1, ctx) {
	let input;
	let input_disabled_value;
	let mounted;
	let dispose;

	function input_change_handler() {
		/*input_change_handler*/ ctx[19].call(input, /*each_value_1*/ ctx[31], /*slotIndex*/ ctx[32]);
	}

	function change_handler(...args) {
		return /*change_handler*/ ctx[20](/*level*/ ctx[26], /*slotIndex*/ ctx[32], ...args);
	}

	return {
		key: key_1,
		first: null,
		c() {
			input = element("input");
			attr(input, "type", "checkbox");
			input.disabled = input_disabled_value = /*slot*/ ctx[30].disabled || /*slot*/ ctx[30].alwaysDisabled;
			this.first = input;
		},
		m(target, anchor) {
			insert(target, input, anchor);
			input.checked = /*slot*/ ctx[30].checked;

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

			if (dirty[0] & /*spellData*/ 512 && input_disabled_value !== (input_disabled_value = /*slot*/ ctx[30].disabled || /*slot*/ ctx[30].alwaysDisabled)) {
				input.disabled = input_disabled_value;
			}

			if (dirty[0] & /*spellData*/ 512) {
				input.checked = /*slot*/ ctx[30].checked;
			}
		},
		d(detaching) {
			if (detaching) detach(input);
			mounted = false;
			run_all(dispose);
		}
	};
}

// (128:16) {#each Object.entries(spellData.slots) as [level, slots], levelIndex (levelIndex)}
function create_each_block$1(key_1, ctx) {
	let div3;
	let div2;
	let div0;
	let t0;
	let t1_value = /*level*/ ctx[26] + "";
	let t1;
	let t2;
	let t3;
	let div1;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let each_value_1 = /*slots*/ ctx[27];
	const get_key = ctx => /*slotIndex*/ ctx[32];

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
			if (dirty[0] & /*spellData*/ 512 && t1_value !== (t1_value = /*level*/ ctx[26] + "")) set_data(t1, t1_value);

			if (dirty[0] & /*spellData, spendSpellPoint*/ 33280) {
				each_value_1 = /*slots*/ ctx[27];
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

// (158:8) {#if promptNewDay}
function create_if_block_1$1(ctx) {
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
				dispose = listen(input, "change", /*input_change_handler_1*/ ctx[21]);
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

// (170:12) {#if !startedShortRest}
function create_if_block$1(ctx) {
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
				dispose = listen(button, "click", /*cancel*/ ctx[13]);
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

// (89:0) <ApplicationShell bind:elementRoot>
function create_default_slot$1(ctx) {
	let form_1;
	let p;
	let t1;
	let div1;
	let label;
	let t3;
	let div0;
	let select;
	let each_blocks = [];
	let each_1_lookup = new Map();
	let t4;
	let button0;
	let i0;
	let t5;
	let t6_value = localize("DND5E.Roll") + "";
	let t6;
	let button0_disabled_value;
	let t7;
	let t8;
	let t9;
	let t10;
	let t11;
	let healthbar;
	let t12;
	let footer;
	let button1;
	let i1;
	let t13;
	let t14_value = localize("DND5E.Rest") + "";
	let t14;
	let t15;
	let current;
	let mounted;
	let dispose;
	let each_value_2 = Object.entries(/*healthData*/ ctx[8].availableHitDice);
	const get_key = ctx => /*index*/ ctx[36];

	for (let i = 0; i < each_value_2.length; i += 1) {
		let child_ctx = get_each_context_2(ctx, each_value_2, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block_2(key, child_ctx));
	}

	let if_block0 = /*healthData*/ ctx[8].totalHitDice === 0 && create_if_block_6$1();
	let if_block1 = /*currHP*/ ctx[3] >= /*maxHP*/ ctx[4] && create_if_block_5$1();
	let if_block2 = /*spellData*/ ctx[9].feature && create_if_block_2$1(ctx);
	let if_block3 = /*promptNewDay*/ ctx[11] && create_if_block_1$1(ctx);

	healthbar = new Healthbar({
			props: {
				text: "HP: " + /*currHP*/ ctx[3] + " / " + /*maxHP*/ ctx[4],
				progress: /*healthPercentage*/ ctx[5]
			}
		});

	let if_block4 = !/*startedShortRest*/ ctx[2] && create_if_block$1(ctx);

	return {
		c() {
			form_1 = element("form");
			p = element("p");
			p.textContent = `${localize("DND5E.ShortRestHint")}`;
			t1 = space();
			div1 = element("div");
			label = element("label");
			label.textContent = `${localize("DND5E.ShortRestSelect")}`;
			t3 = space();
			div0 = element("div");
			select = element("select");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t4 = space();
			button0 = element("button");
			i0 = element("i");
			t5 = space();
			t6 = text(t6_value);
			t7 = space();
			if (if_block0) if_block0.c();
			t8 = space();
			if (if_block1) if_block1.c();
			t9 = space();
			if (if_block2) if_block2.c();
			t10 = space();
			if (if_block3) if_block3.c();
			t11 = space();
			create_component(healthbar.$$.fragment);
			t12 = space();
			footer = element("footer");
			button1 = element("button");
			i1 = element("i");
			t13 = space();
			t14 = text(t14_value);
			t15 = space();
			if (if_block4) if_block4.c();
			attr(select, "name", "hd");
			if (/*selectedHitDice*/ ctx[10] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[18].call(select));
			attr(i0, "class", "fas fa-dice-d20");
			attr(button0, "type", "button");
			button0.disabled = button0_disabled_value = /*currHP*/ ctx[3] >= /*maxHP*/ ctx[4] || /*healthData*/ ctx[8].totalHitDice === 0 || /*healthData*/ ctx[8].availableHitDice[/*selectedHitDice*/ ctx[10]] === 0;
			attr(div0, "class", "form-fields");
			attr(div1, "class", "form-group");
			attr(i1, "class", "fas fa-bed");
			attr(button1, "type", "button");
			attr(button1, "class", "dialog-button");
			attr(footer, "class", "flexrow");
			set_style(footer, "margin-top", "0.5rem");
			attr(form_1, "autocomplete", "off");
			attr(form_1, "id", "short-rest-hd");
			attr(form_1, "class", "dialog-content");
		},
		m(target, anchor) {
			insert(target, form_1, anchor);
			append(form_1, p);
			append(form_1, t1);
			append(form_1, div1);
			append(div1, label);
			append(div1, t3);
			append(div1, div0);
			append(div0, select);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(select, null);
			}

			select_option(select, /*selectedHitDice*/ ctx[10]);
			append(div0, t4);
			append(div0, button0);
			append(button0, i0);
			append(button0, t5);
			append(button0, t6);
			append(div1, t7);
			if (if_block0) if_block0.m(div1, null);
			append(div1, t8);
			if (if_block1) if_block1.m(div1, null);
			append(form_1, t9);
			if (if_block2) if_block2.m(form_1, null);
			append(form_1, t10);
			if (if_block3) if_block3.m(form_1, null);
			append(form_1, t11);
			mount_component(healthbar, form_1, null);
			append(form_1, t12);
			append(form_1, footer);
			append(footer, button1);
			append(button1, i1);
			append(button1, t13);
			append(button1, t14);
			append(footer, t15);
			if (if_block4) if_block4.m(footer, null);
			/*form_1_binding*/ ctx[22](form_1);
			current = true;

			if (!mounted) {
				dispose = [
					listen(select, "change", /*select_change_handler*/ ctx[18]),
					listen(button0, "click", /*rollHitDice*/ ctx[14]),
					listen(button1, "click", /*requestSubmit*/ ctx[1]),
					listen(form_1, "submit", prevent_default(/*updateSettings*/ ctx[12]))
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*healthData*/ 256) {
				each_value_2 = Object.entries(/*healthData*/ ctx[8].availableHitDice);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_2, each_1_lookup, select, destroy_block, create_each_block_2, null, get_each_context_2);
			}

			if (dirty[0] & /*selectedHitDice, healthData*/ 1280) {
				select_option(select, /*selectedHitDice*/ ctx[10]);
			}

			if (!current || dirty[0] & /*currHP, maxHP, healthData, selectedHitDice*/ 1304 && button0_disabled_value !== (button0_disabled_value = /*currHP*/ ctx[3] >= /*maxHP*/ ctx[4] || /*healthData*/ ctx[8].totalHitDice === 0 || /*healthData*/ ctx[8].availableHitDice[/*selectedHitDice*/ ctx[10]] === 0)) {
				button0.disabled = button0_disabled_value;
			}

			if (/*healthData*/ ctx[8].totalHitDice === 0) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_6$1();
					if_block0.c();
					if_block0.m(div1, t8);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*currHP*/ ctx[3] >= /*maxHP*/ ctx[4]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_5$1();
					if_block1.c();
					if_block1.m(div1, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (/*spellData*/ ctx[9].feature) {
				if (if_block2) {
					if_block2.p(ctx, dirty);
				} else {
					if_block2 = create_if_block_2$1(ctx);
					if_block2.c();
					if_block2.m(form_1, t10);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (/*promptNewDay*/ ctx[11]) if_block3.p(ctx, dirty);
			const healthbar_changes = {};
			if (dirty[0] & /*currHP, maxHP*/ 24) healthbar_changes.text = "HP: " + /*currHP*/ ctx[3] + " / " + /*maxHP*/ ctx[4];
			if (dirty[0] & /*healthPercentage*/ 32) healthbar_changes.progress = /*healthPercentage*/ ctx[5];
			healthbar.$set(healthbar_changes);

			if (!/*startedShortRest*/ ctx[2]) {
				if (if_block4) {
					if_block4.p(ctx, dirty);
				} else {
					if_block4 = create_if_block$1(ctx);
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
			transition_in(healthbar.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(healthbar.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(form_1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}

			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			if (if_block3) if_block3.d();
			destroy_component(healthbar);
			if (if_block4) if_block4.d();
			/*form_1_binding*/ ctx[22](null);
			mounted = false;
			run_all(dispose);
		}
	};
}

function create_fragment$2(ctx) {
	let applicationshell;
	let updating_elementRoot;
	let current;

	function applicationshell_elementRoot_binding(value) {
		/*applicationshell_elementRoot_binding*/ ctx[23](value);
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

			if (dirty[0] & /*form, startedShortRest, currHP, maxHP, healthPercentage, newDay, spellData, healthData, selectedHitDice*/ 2044 | dirty[1] & /*$$scope*/ 64) {
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

function instance$2($$self, $$props, $$invalidate) {
	const { application } = getContext('external');
	let { elementRoot } = $$props;
	let { actor } = $$props;
	let currHP;
	let maxHP;
	let healthPercentage;
	let form;
	let startedShortRest = false;
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
				title: "Finish Short Rest?",
				content: dialogLayout({
					title: "Finish Short Rest?",
					message: "You haven't spent any hit dice to regain hit points, are you sure you want to finish your short rest?"
				}),
				modal: true,
				draggable: false
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

	function spendSpellPoint(event, level) {
		workflow.spendSpellPoint(level, event.target.checked);
		$$invalidate(9, spellData = workflow.spellData);
	}

	async function updateHealthBar() {
		$$invalidate(3, currHP = actor.data.data.attributes.hp.value);
		$$invalidate(4, maxHP = actor.data.data.attributes.hp.max);
		$$invalidate(5, healthPercentage = currHP / maxHP);
	}

	function select_change_handler() {
		selectedHitDice = select_value(this);
		$$invalidate(10, selectedHitDice);
		$$invalidate(8, healthData);
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
		if ('actor' in $$props) $$invalidate(16, actor = $$props.actor);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*startedShortRest*/ 4) {
			// This is a reactive statement. When `draggable` changes `foundryApp.reactive.draggable` is set.
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
		selectedHitDice,
		promptNewDay,
		updateSettings,
		cancel,
		rollHitDice,
		spendSpellPoint,
		actor,
		updateHealthBar,
		select_change_handler,
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
			instance$2,
			create_fragment$2,
			safe_not_equal,
			{
				elementRoot: 0,
				actor: 16,
				requestSubmit: 1,
				updateHealthBar: 17
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
		return this.$$.ctx[16];
	}

	set actor(actor) {
		this.$$set({ actor });
		flush();
	}

	get requestSubmit() {
		return this.$$.ctx[1];
	}

	get updateHealthBar() {
		return this.$$.ctx[17];
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
      this.svelte.applicationShell.updateHealthBar();
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

/* scripts\formapplications\components\HealthBar.svelte generated by Svelte v3.46.4 */

function create_fragment$1(ctx) {
	let div3;
	let div2;
	let div0;
	let t0;
	let div1;
	let t1;

	return {
		c() {
			div3 = element("div");
			div2 = element("div");
			div0 = element("div");
			t0 = space();
			div1 = element("div");
			t1 = text(/*text*/ ctx[0]);
			attr(div0, "class", "progress svelte-1307vsu");
			set_style(div0, "width", /*$progressBar*/ ctx[2] * 100 + "%");
			attr(div1, "class", "overlay svelte-1307vsu");
			attr(div2, "class", "healthbar svelte-1307vsu");
		},
		m(target, anchor) {
			insert(target, div3, anchor);
			append(div3, div2);
			append(div2, div0);
			append(div2, t0);
			append(div2, div1);
			append(div1, t1);
		},
		p(ctx, [dirty]) {
			if (dirty & /*$progressBar*/ 4) {
				set_style(div0, "width", /*$progressBar*/ ctx[2] * 100 + "%");
			}

			if (dirty & /*text*/ 1) set_data(t1, /*text*/ ctx[0]);
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div3);
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	let $progressBar,
		$$unsubscribe_progressBar = noop,
		$$subscribe_progressBar = () => ($$unsubscribe_progressBar(), $$unsubscribe_progressBar = subscribe(progressBar, $$value => $$invalidate(2, $progressBar = $$value)), progressBar);

	$$self.$$.on_destroy.push(() => $$unsubscribe_progressBar());
	let { text } = $$props;
	let { progress } = $$props;
	let { progressBar = tweened(0, { duration: 400, easing: cubicOut }) } = $$props;
	$$subscribe_progressBar();

	function updateProgress() {
		progressBar.set(progress);
	}

	$$self.$$set = $$props => {
		if ('text' in $$props) $$invalidate(0, text = $$props.text);
		if ('progress' in $$props) $$invalidate(3, progress = $$props.progress);
		if ('progressBar' in $$props) $$subscribe_progressBar($$invalidate(1, progressBar = $$props.progressBar));
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*progress*/ 8) {
			(updateProgress());
		}
	};

	return [text, progressBar, $progressBar, progress];
}

class HealthBar extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { text: 0, progress: 3, progressBar: 1 });
	}
}

/* scripts\formapplications\long-rest\long-rest-shell.svelte generated by Svelte v3.46.4 */

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[27] = list[i][0];
	child_ctx[28] = list[i][1];
	child_ctx[30] = i;
	return child_ctx;
}

// (103:8) {:else}
function create_else_block(ctx) {
	let t;
	let if_block1_anchor;
	let if_block0 = /*enableRollHitDice*/ ctx[12] && create_if_block_5(ctx);
	let if_block1 = /*promptNewDay*/ ctx[11] && create_if_block_4(ctx);

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
		},
		p(ctx, dirty) {
			if (/*enableRollHitDice*/ ctx[12]) if_block0.p(ctx, dirty);
			if (/*promptNewDay*/ ctx[11]) if_block1.p(ctx, dirty);
		},
		d(detaching) {
			if (if_block0) if_block0.d(detaching);
			if (detaching) detach(t);
			if (if_block1) if_block1.d(detaching);
			if (detaching) detach(if_block1_anchor);
		}
	};
}

// (96:8) {#if showStartLongRestButton}
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
				dispose = listen(button, "click", /*startLongRest*/ ctx[16]);
				mounted = true;
			}
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(div);
			mounted = false;
			dispose();
		}
	};
}

// (104:8) {#if enableRollHitDice}
function create_if_block_5(ctx) {
	let div1;
	let label;
	let t1;
	let div0;
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
	let mounted;
	let dispose;
	let each_value = Object.entries(/*healthData*/ ctx[9].availableHitDice);
	const get_key = ctx => /*index*/ ctx[30];

	for (let i = 0; i < each_value.length; i += 1) {
		let child_ctx = get_each_context(ctx, each_value, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
	}

	let if_block0 = /*healthData*/ ctx[9].totalHitDice === 0 && create_if_block_7();
	let if_block1 = /*currHP*/ ctx[3] >= /*maxHP*/ ctx[4] && create_if_block_6();

	return {
		c() {
			div1 = element("div");
			label = element("label");
			label.textContent = `${localize("DND5E.ShortRestSelect")}`;
			t1 = space();
			div0 = element("div");
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
			attr(select, "name", "hd");
			if (/*selectedHitDice*/ ctx[10] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[19].call(select));
			attr(i, "class", "fas fa-dice-d20");
			attr(button, "type", "button");
			button.disabled = button_disabled_value = /*currHP*/ ctx[3] >= /*maxHP*/ ctx[4] || /*healthData*/ ctx[9].totalHitDice === 0 || /*healthData*/ ctx[9].availableHitDice[/*selectedHitDice*/ ctx[10]] === 0;
			attr(div0, "class", "form-fields");
			attr(div1, "class", "form-group");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, label);
			append(div1, t1);
			append(div1, div0);
			append(div0, select);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(select, null);
			}

			select_option(select, /*selectedHitDice*/ ctx[10]);
			append(div0, t2);
			append(div0, button);
			append(button, i);
			append(button, t3);
			append(button, t4);
			append(div1, t5);
			if (if_block0) if_block0.m(div1, null);
			append(div1, t6);
			if (if_block1) if_block1.m(div1, null);

			if (!mounted) {
				dispose = [
					listen(select, "change", /*select_change_handler*/ ctx[19]),
					listen(button, "click", /*click_handler*/ ctx[20])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*healthData*/ 512) {
				each_value = Object.entries(/*healthData*/ ctx[9].availableHitDice);
				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, select, destroy_block, create_each_block, null, get_each_context);
			}

			if (dirty[0] & /*selectedHitDice, healthData*/ 1536) {
				select_option(select, /*selectedHitDice*/ ctx[10]);
			}

			if (dirty[0] & /*currHP, maxHP, healthData, selectedHitDice*/ 1560 && button_disabled_value !== (button_disabled_value = /*currHP*/ ctx[3] >= /*maxHP*/ ctx[4] || /*healthData*/ ctx[9].totalHitDice === 0 || /*healthData*/ ctx[9].availableHitDice[/*selectedHitDice*/ ctx[10]] === 0)) {
				button.disabled = button_disabled_value;
			}

			if (/*healthData*/ ctx[9].totalHitDice === 0) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_7();
					if_block0.c();
					if_block0.m(div1, t6);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*currHP*/ ctx[3] >= /*maxHP*/ ctx[4]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_6();
					if_block1.c();
					if_block1.m(div1, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}
		},
		d(detaching) {
			if (detaching) detach(div1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].d();
			}

			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			mounted = false;
			run_all(dispose);
		}
	};
}

// (109:24) {#each Object.entries(healthData.availableHitDice) as [hitDice, num], index (index)}
function create_each_block(key_1, ctx) {
	let option;
	let t0_value = /*hitDice*/ ctx[27] + "";
	let t0;
	let t1;
	let t2_value = /*num*/ ctx[28] + "";
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
			option.__value = option_value_value = /*hitDice*/ ctx[27];
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
			if (dirty[0] & /*healthData*/ 512 && t0_value !== (t0_value = /*hitDice*/ ctx[27] + "")) set_data(t0, t0_value);
			if (dirty[0] & /*healthData*/ 512 && t2_value !== (t2_value = /*num*/ ctx[28] + "")) set_data(t2, t2_value);

			if (dirty[0] & /*healthData*/ 512 && option_value_value !== (option_value_value = /*hitDice*/ ctx[27])) {
				option.__value = option_value_value;
				option.value = option.__value;
			}
		},
		d(detaching) {
			if (detaching) detach(option);
		}
	};
}

// (117:16) {#if healthData.totalHitDice === 0}
function create_if_block_7(ctx) {
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

// (120:16) {#if currHP >= maxHP}
function create_if_block_6(ctx) {
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

// (126:12) {#if promptNewDay}
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
			input.checked = /*newDay*/ ctx[7];
			append(div, t2);
			append(div, p);

			if (!mounted) {
				dispose = listen(input, "change", /*input_change_handler*/ ctx[21]);
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

// (135:8) {#if enableRollHitDice}
function create_if_block_2(ctx) {
	let healthbar;
	let current;

	healthbar = new HealthBar({
			props: {
				text: "HP: " + /*currHP*/ ctx[3] + " / " + /*maxHP*/ ctx[4],
				progress: /*healthPercentage*/ ctx[5]
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
			if (dirty[0] & /*currHP, maxHP*/ 24) healthbar_changes.text = "HP: " + /*currHP*/ ctx[3] + " / " + /*maxHP*/ ctx[4];
			if (dirty[0] & /*healthPercentage*/ 32) healthbar_changes.progress = /*healthPercentage*/ ctx[5];
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

// (140:12) {#if !showStartLongRestButton}
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

// (143:12) {#if !startedLongRest}
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
				dispose = listen(button, "click", /*cancel*/ ctx[14]);
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

// (92:0) <ApplicationShell bind:elementRoot>
function create_default_slot(ctx) {
	let form_1;
	let p;
	let t1;
	let t2;
	let t3;
	let footer;
	let t4;
	let current;
	let mounted;
	let dispose;

	function select_block_type(ctx, dirty) {
		if (/*showStartLongRestButton*/ ctx[8]) return create_if_block_3;
		return create_else_block;
	}

	let current_block_type = select_block_type(ctx);
	let if_block0 = current_block_type(ctx);
	let if_block1 = /*enableRollHitDice*/ ctx[12] && create_if_block_2(ctx);
	let if_block2 = !/*showStartLongRestButton*/ ctx[8] && create_if_block_1(ctx);
	let if_block3 = !/*startedLongRest*/ ctx[2] && create_if_block(ctx);

	return {
		c() {
			form_1 = element("form");
			p = element("p");
			p.textContent = `${localize("DND5E.LongRestHint")}`;
			t1 = space();
			if_block0.c();
			t2 = space();
			if (if_block1) if_block1.c();
			t3 = space();
			footer = element("footer");
			if (if_block2) if_block2.c();
			t4 = space();
			if (if_block3) if_block3.c();
			attr(footer, "class", "flexrow");
			set_style(footer, "margin-top", "0.5rem");
			attr(form_1, "autocomplete", "off");
			attr(form_1, "id", "short-rest-hd");
			attr(form_1, "class", "dialog-content");
		},
		m(target, anchor) {
			insert(target, form_1, anchor);
			append(form_1, p);
			append(form_1, t1);
			if_block0.m(form_1, null);
			append(form_1, t2);
			if (if_block1) if_block1.m(form_1, null);
			append(form_1, t3);
			append(form_1, footer);
			if (if_block2) if_block2.m(footer, null);
			append(footer, t4);
			if (if_block3) if_block3.m(footer, null);
			/*form_1_binding*/ ctx[22](form_1);
			current = true;

			if (!mounted) {
				dispose = listen(form_1, "submit", prevent_default(/*updateSettings*/ ctx[13]));
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
				if_block0.p(ctx, dirty);
			} else {
				if_block0.d(1);
				if_block0 = current_block_type(ctx);

				if (if_block0) {
					if_block0.c();
					if_block0.m(form_1, t2);
				}
			}

			if (/*enableRollHitDice*/ ctx[12]) if_block1.p(ctx, dirty);

			if (!/*showStartLongRestButton*/ ctx[8]) {
				if (if_block2) {
					if_block2.p(ctx, dirty);
				} else {
					if_block2 = create_if_block_1(ctx);
					if_block2.c();
					if_block2.m(footer, t4);
				}
			} else if (if_block2) {
				if_block2.d(1);
				if_block2 = null;
			}

			if (!/*startedLongRest*/ ctx[2]) {
				if (if_block3) {
					if_block3.p(ctx, dirty);
				} else {
					if_block3 = create_if_block(ctx);
					if_block3.c();
					if_block3.m(footer, null);
				}
			} else if (if_block3) {
				if_block3.d(1);
				if_block3 = null;
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block1);
			current = true;
		},
		o(local) {
			transition_out(if_block1);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(form_1);
			if_block0.d();
			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			if (if_block3) if_block3.d();
			/*form_1_binding*/ ctx[22](null);
			mounted = false;
			dispose();
		}
	};
}

function create_fragment(ctx) {
	let applicationshell;
	let updating_elementRoot;
	let current;

	function applicationshell_elementRoot_binding(value) {
		/*applicationshell_elementRoot_binding*/ ctx[23](value);
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
		p(ctx, dirty) {
			const applicationshell_changes = {};

			if (dirty[0] & /*form, startedLongRest, showStartLongRestButton, currHP, maxHP, healthPercentage, newDay, healthData, selectedHitDice*/ 2044 | dirty[1] & /*$$scope*/ 1) {
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

function instance($$self, $$props, $$invalidate) {
	const { application } = getContext('external');
	let { elementRoot } = $$props;
	let { actor } = $$props;
	let currHP;
	let maxHP;
	let healthPercentage;
	let form;
	let startedLongRest = false;
	let variant = game.settings.get("dnd5e", "restVariant");
	let promptNewDay = variant !== "gritty";
	let newDay = variant === "normal";
	let enableRollHitDice = getSetting(CONSTANTS.SETTINGS.LONG_REST_ROLL_HIT_DICE);
	let showStartLongRestButton = getSetting(CONSTANTS.SETTINGS.PRE_REST_REGAIN_HIT_DICE);
	const workflow = RestWorkflow.get(actor);
	let healthData = workflow.healthData;
	updateHealthBar();
	let selectedHitDice = Object.entries(workflow.healthData.availableHitDice).filter(entry => entry[1])?.[0]?.[0];

	async function requestSubmit() {
		if (workflow.healthPercentage < 0.5 && workflow.healthRegained === 0 && workflow.totalHitDice > 0) {
			const doContinue = await TJSDialog.confirm({
				title: "Finish Long Rest?",
				content: dialogLayout({
					title: "Finish Long Rest?",
					message: "You haven't spent any hit dice to regain hit points, are you sure you want to finish your long rest?"
				}),
				modal: true,
				draggable: false
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
		$$invalidate(9, healthData = workflow.healthData);
		$$invalidate(2, startedLongRest = true);
	}

	async function startLongRest() {
		$$invalidate(8, showStartLongRestButton = false);
		$$invalidate(2, startedLongRest = true);
		await workflow.regainHitDice();
		$$invalidate(9, healthData = workflow.healthData);
	}

	async function updateHealthBar() {
		$$invalidate(3, currHP = actor.data.data.attributes.hp.value);
		$$invalidate(4, maxHP = actor.data.data.attributes.hp.max);
		$$invalidate(5, healthPercentage = currHP / maxHP);
	}

	function select_change_handler() {
		selectedHitDice = select_value(this);
		$$invalidate(10, selectedHitDice);
		$$invalidate(9, healthData);
	}

	const click_handler = event => {
		rollHitDice(event);
	};

	function input_change_handler() {
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
		if ('actor' in $$props) $$invalidate(17, actor = $$props.actor);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*startedLongRest*/ 4) {
			// This is a reactive statement. When `draggable` changes `foundryApp.reactive.draggable` is set.
			application.reactive.headerButtonNoClose = startedLongRest;
		}
	};

	return [
		elementRoot,
		requestSubmit,
		startedLongRest,
		currHP,
		maxHP,
		healthPercentage,
		form,
		newDay,
		showStartLongRestButton,
		healthData,
		selectedHitDice,
		promptNewDay,
		enableRollHitDice,
		updateSettings,
		cancel,
		rollHitDice,
		startLongRest,
		actor,
		updateHealthBar,
		select_change_handler,
		click_handler,
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
			instance,
			create_fragment,
			safe_not_equal,
			{
				elementRoot: 0,
				actor: 17,
				requestSubmit: 1,
				updateHealthBar: 18
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
		return this.$$.ctx[17];
	}

	set actor(actor) {
		this.$$set({ actor });
		flush();
	}

	get requestSubmit() {
		return this.$$.ctx[1];
	}

	get updateHealthBar() {
		return this.$$.ctx[18];
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
      this.svelte.applicationShell.updateHealthBar();
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
    var _periapt, _periapt$data, _periapt$data$data, _durable, _durable$data, _hp$tempmax;

    // If no denomination was provided, choose the first available
    let cls = null;

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
    let periapt = getSetting(CONSTANTS.SETTINGS.PERIAPT_ITEM) ? this.items.getName(getSetting(CONSTANTS.SETTINGS.PERIAPT_ITEM, true)) : false;
    periapt = periapt && ((_periapt = periapt) === null || _periapt === void 0 ? void 0 : (_periapt$data = _periapt.data) === null || _periapt$data === void 0 ? void 0 : (_periapt$data$data = _periapt$data.data) === null || _periapt$data$data === void 0 ? void 0 : _periapt$data$data.attunement) === 2;
    let durable = getSetting(CONSTANTS.SETTINGS.DURABLE_FEAT) ? this.items.getName(getSetting(CONSTANTS.SETTINGS.DURABLE_FEAT, true)) : false;
    durable = durable && ((_durable = durable) === null || _durable === void 0 ? void 0 : (_durable$data = _durable.data) === null || _durable$data === void 0 ? void 0 : _durable$data.type) === "feat";
    const conMod = this.data.data.abilities.con.mod;
    const durableMod = Math.max(2, conMod * 2);

    if (periapt && durable) {
      parts = [`{1${denomination}*2+${conMod},${durableMod}}kh`];
    } else if (periapt) {
      parts[0] = "(" + parts[0] + "*2)";
    } else if (durable) {
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

Hooks.once("init", () => {
  registerSettings();
  registerLibwrappers();
  console.log("Rest Recovery | Initialized");
});
Hooks.on('updateActor', actor => {
  const workflow = RestWorkflow.get(actor);

  if (workflow && workflow.finished && !foundry.utils.isObjectEmpty(workflow.recoveredSlots)) {
    console.log(workflow.recoveredSlots);
    workflow.preFinishRestMessage();
  }
});
Hooks.on("restCompleted", actor => {
  RestWorkflow.remove(actor);
});
//# sourceMappingURL=module.js.map
