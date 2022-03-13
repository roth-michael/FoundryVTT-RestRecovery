import ShortRestDialog from "./formapplications/short-rest/short-rest.js";
import CONSTANTS from "./constants.js";
import RestWorkflow from "./rest-workflow.js";
import LongRestDialog from "./formapplications/long-rest/long-rest.js";

export default function registerLibwrappers() {

    patch_shortRest();
    patch_longRest();

    patch_getRestHitPointRecovery();
    patch_getRestHitDiceRecovery();
    patch_getRestResourceRecovery();
    patch_getRestSpellRecovery();
    patch_getRestItemUsesRecovery();

}
function patch_shortRest(){
    libWrapper.register(
        CONSTANTS.MODULE_NAME,
        "CONFIG.Actor.documentClass.prototype.shortRest",
        async function({dialog=true, chat=true, autoHD=false, autoHDThreshold=3}={}) {
            // Take note of the initial hit points and number of hit dice the Actor has
            const hd0 = this.data.data.attributes.hd;
            const hp0 = this.data.data.attributes.hp.value;
            let newDay = false;

            RestWorkflow.make(this);

            // Display a Dialog for rolling hit dice
            if (dialog) {
                try {
                    newDay = await ShortRestDialog.show({ actor: this });
                } catch (err) {
                    return;
                }
            }

            // Automatically spend hit dice
            else if (autoHD) {
                await this.autoSpendHitDice({ threshold: autoHDThreshold });
            }
            return this._rest(
                chat,
                newDay,
                false,
                this.data.data.attributes.hd - hd0,
                this.data.data.attributes.hp.value - hp0
            );
        },
        "OVERRIDE"
    );
}

function patch_longRest(){
    libWrapper.register(
        CONSTANTS.MODULE_NAME,
        "CONFIG.Actor.documentClass.prototype.longRest",
        async function({dialog=true, chat=true, newDay=true}={}) {

            RestWorkflow.make(this, true);

            if ( dialog ) {
                try {
                    newDay = await LongRestDialog.show({ actor: this });
                } catch(err) {
                    return;
                }
            }

            return this._rest(chat, newDay, true);
        },
        "OVERRIDE"
    );
}

function patch_getRestHitPointRecovery(){
    libWrapper.register(
        CONSTANTS.MODULE_NAME,
        "CONFIG.Actor.documentClass.prototype._getRestHitPointRecovery",
        function (wrapped, args){
            return RestWorkflow.wrapperFn(this, wrapped, args, "_getRestHitPointRecovery")
        }
    )
}

function patch_getRestHitDiceRecovery(){
    libWrapper.register(
        CONSTANTS.MODULE_NAME,
        "CONFIG.Actor.documentClass.prototype._getRestHitDiceRecovery",
        function (wrapped, args){
            return RestWorkflow.wrapperFn(this, wrapped, args, "_getRestHitDiceRecovery", false)
        }
    )
}

function patch_getRestResourceRecovery(){
    libWrapper.register(
        CONSTANTS.MODULE_NAME,
        "CONFIG.Actor.documentClass.prototype._getRestResourceRecovery",
        function (wrapped, args){
            return RestWorkflow.wrapperFn(this, wrapped, args, "_getRestResourceRecovery")
        }
    )
}

function patch_getRestSpellRecovery(){
    libWrapper.register(
        CONSTANTS.MODULE_NAME,
        "CONFIG.Actor.documentClass.prototype._getRestSpellRecovery",
        function (wrapped, args){
            return RestWorkflow.wrapperFn(this, wrapped, args, "_getRestSpellRecovery")
        }
    )
}

function patch_getRestItemUsesRecovery(){
    libWrapper.register(
        CONSTANTS.MODULE_NAME,
        "CONFIG.Actor.documentClass.prototype._getRestItemUsesRecovery",
        function (wrapped, args){
            return RestWorkflow.wrapperFn(this, wrapped, args, "_getRestItemUsesRecovery")
        }
    )
}