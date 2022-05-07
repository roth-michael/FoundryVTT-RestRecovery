import CustomSvelteApplication from "../custom-svelte-application.js";
import ShortRestShell from './short-rest-shell.svelte';

export default class ShortRestDialog extends CustomSvelteApplication {

    constructor(actor, options = {}, dialogData = {}) {
        super({
            title: `${game.i18n.localize("DND5E.ShortRest")}: ${actor.name}`,
            zIndex: 102,
            svelte: {
                class: ShortRestShell,
                target: document.body,
                props: {
                    actor
                }
            },
            close: () => this.options.reject(),
            ...options
        }, dialogData);
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            closeOnSubmit: false,
            width: 350,
            height: "auto",
            classes: ["dnd5e dialog"]
        })
    }
}