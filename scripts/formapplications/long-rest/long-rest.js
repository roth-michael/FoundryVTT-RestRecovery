import { TJSDialog } from '@typhonjs-fvtt/runtime/svelte/application';
import LongRestShell from './long-rest-shell.svelte';

export default class LongRestDialog extends TJSDialog {

    constructor(actor, options = {}, dialogData = {}) {

        super({
            ...dialogData,
            title: `${game.i18n.localize("DND5E.LongRest")}: ${actor.name}`,
            zIndex: 102,
            content: {
                class: LongRestShell,
                props: {
                    actor
                }
            },
            autoClose: false, // Don't automatically close on button onclick.
            close: () => this.options.reject()
        }, {
            ...options,
            height: "auto",
            classes: ["dnd5e dialog"]
        });

    }

    static getActiveApp(actor){
        return Object.values(ui.windows).find(app => app instanceof this && app?.actor === actor);
    }

    static async show({ actor }={}, options = {}, dialogData = {}) {
        const app = this.getActiveApp(actor)
        if(app) return app.render(false, { focus: true });
        return new Promise((resolve, reject) => {
            options.resolve = resolve;
            options.reject = reject;
            new this(actor, options, dialogData).render(true, { focus: true });
        });
    }

}