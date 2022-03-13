import registerSettings from "./settings.js";
import registerLibwrappers from "./libwrapper.js";
import { ordinalSuffixOf } from "./lib/lib.js";
import RestWorkflow from "./rest-workflow.js";

Hooks.once("init", () => {
    registerSettings();
    registerLibwrappers();
    console.log("Rest Recovery | Initialized");
});


Hooks.on('updateActor', (actor) => {
    const workflow = RestWorkflow.get(actor);
    if(workflow && !foundry.utils.isObjectEmpty(workflow.recoveredSlots)){
        workflow.preFinishRestMessage();
    }
});

Hooks.on("restCompleted", (actor) => {
    RestWorkflow.remove(actor);
});