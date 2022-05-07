import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';

export default class CustomSvelteApplication extends SvelteApplication {

    constructor(options, dialogData) {
        super(options, dialogData);
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

}