import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';
import ShortRestShell from './short-rest-shell.svelte';

export default class ShortRestDialog extends SvelteApplication {

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

        this.hookId = Hooks.on('updateActor', (changedActor) => {
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
        })
    }

    static getActiveApp(actor) {
        return Object.values(ui.windows).find(app => app instanceof this && app?.actor === actor);
    }

    static async show({ actor } = {}, options = {}, dialogData = {}) {
        const app = this.getActiveApp(actor)
        if (app) return app.render(false, { focus: true });
        return new Promise((resolve, reject) => {
            options.resolve = resolve;
            options.reject = reject;
            new this(actor, options, dialogData).render(true, { focus: true });
        });
    }

    async close(options) {
        super.close(options)
        Hooks.off("updateActor", this.hookId);
    }

}