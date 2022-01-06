import registerSettings from "./settings.js";
import registerLibwrappers from "./libwrapper.js";

Hooks.on("init", () => {

    registerSettings();
    registerLibwrappers();
    console.log("Rest Recovery | Initialized");

});