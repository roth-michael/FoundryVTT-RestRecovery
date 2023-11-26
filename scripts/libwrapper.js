import CONSTANTS from "./constants.js";
import RestWorkflow from "./rest-workflow.js";

export default function registerLibwrappers() {

  // Actors
  patch_displayRestResultMessage();

}

function patch_displayRestResultMessage() {
  libWrapper.register(
    CONSTANTS.MODULE_NAME,
    "CONFIG.Actor.documentClass.prototype._displayRestResultMessage",
    async function (wrapped, ...args) {
      const result = await wrapped(...args);
      const workflow = RestWorkflow.get(this);
      if (workflow) {
        await workflow._displayRestResultMessage(result)
      }
      return result;
    }
  )
}
