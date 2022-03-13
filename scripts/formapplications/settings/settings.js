import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';
import SettingsShell from './settings-shell.svelte';

class Settings extends SvelteApplication {

    constructor(options = {}, dialogData = {}) {

        super({
            id: `rest-recovery-app`,
            title: "Rest Recovery",
            svelte: {
                class: SettingsShell,
                target: document.body
            },
            width: 600,
            tabs: [{ navSelector: ".tabs", contentSelector: ".tab-body", initial: "mainsettings" }],
            ...options
        }, { dialogData });

    }

    static getActiveApp(){
        return Object.values(ui.windows).find(app => app.id === "rest-recovery-app");
    }

    static async show(options = {}, dialogData = {}) {
        const app = this.getActiveApp()
        if(app) return app.render(false, { focus: true });
        return new Promise((resolve) => {
            options.resolve = resolve;
            new this(options, dialogData).render(true, { focus: true });
        })
    }

}

export default class SettingsShim extends FormApplication {

    /**
     * @inheritDoc
     */
    constructor(){
        super({});
        Settings.show();
    }

    async _updateObject(event, formData) {}

    render() { this.close(); }

}