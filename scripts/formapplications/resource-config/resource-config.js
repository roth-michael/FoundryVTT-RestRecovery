import CustomSvelteApplication from "../custom-svelte-application.js";
import ResourceConfigShell from './resource-config-shell.svelte';

export default class ResourceConfig extends CustomSvelteApplication {

    constructor(actor, options = {}, dialogData = {}) {
        super({
            title: `${game.i18n.localize("DND5E.ShortRest")}: ${actor.name}`,
            zIndex: 102,
            svelte: {
                class: ResourceConfigShell,
                target: document.body,
                props: {
                    actor
                }
            },
            close: () => this.options.reject(),
            ...options
        }, {
            resizable: true,
            ...dialogData
        });
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            closeOnSubmit: false,
            width: 550,
            height: "auto",
            classes: ["dnd5e dialog"]
        })
    }
}