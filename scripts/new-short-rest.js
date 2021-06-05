
export default class newShortRestDialog extends Dialog {
	
	constructor(actor, dialogData={}, options={}) {
		super(dialogData, options);

		/**
		 * Store a reference to the Actor entity which is resting
		 * @type {Actor}
		 */
		this.actor = actor;

		/**
		 * Track the most recently used HD denomination for re-rendering the form
		 * @type {string}
		 */
		this._denom = null;

		this._data = {}

		this.used_song_of_rest = false;
		this.used_chef = false;

	}

	/* -------------------------------------------- */

	/** @override */
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			template: `modules/short-rest-recovery/templates/new-short-rest.html`,
			classes: ["dnd5e", "dialog"]
		});
	}

	/* -------------------------------------------- */

	/** @override */
	getData() {

		this._data = super.getData();

		this._data.hd = this.get_hitdice();

		this._data.class_data = this.get_class_resource();

		// Determine rest type
		const variant = game.settings.get("dnd5e", "restVariant");
		this._data.promptNewDay = variant !== "epic";     // It's never a new day when only resting 1 minute
		this._data.newDay = false;                        // It may be a new day, but not by default

		return this._data;
	}
	
	get_hitdice(){

		let hd = {}
		// Determine Hit Dice
		hd.availableHD = this.actor.data.items.reduce((hd, item) => {
			if ( item.type === "class" ) {
				const d = item.data.data;
				const denom = d.hitDice || "d6";
				const available = parseInt(d.levels || 1) - parseInt(d.hitDiceUsed || 0);
				hd[denom] = denom in hd ? hd[denom] + available : available;
			}
			return hd;
		}, {});
		hd.canRoll = this.actor.data.data.attributes.hd > 0;
		hd.denomination = this._denom;

		return hd;

	}

	get_class_resource(){

		let class_data = {
			has_feature: false,
			slots: {},
			sp_total: 0,
			sp_left: 0,
			class: "",
			song_of_rest: false,
			chef: []
		}

		let wizard_druid_class_item = this.actor.items.find(i => i.type === "class" && (i.name.toLowerCase() === "wizard" || i.name.toLowerCase() === "druid"));
		
		let item = this.actor.items.find(i => i.name.toLowerCase() === "arcane recovery" || i.name.toLowerCase() === "natural recovery");

		if(wizard_druid_class_item && wizard_druid_class_item.data.data.levels > 1 && item && item.data.data.uses.value !== 0){

			let missing_spells = Object.entries(this.actor.data.data.spells).filter(slot => slot[0] !== "pact" && Number(slot[0].substr(5)) < 6 && slot[1].value !== slot[1].max);

			if(missing_spells.length !== 0){

				class_data.class = wizard_druid_class_item.name;

				let spellLevels = [];
				// Recover spell slots
				for (let [k, v] of Object.entries(this.actor.data.data.spells)) {
						if((!v.max && !v.override) || k === "pact"){
							continue;
						}
						let level = k.substr(5)
						if(Number(level) > 5){
							break;
						}
						spellLevels.push(Number(level))
						class_data.slots[level] = [];
						for(let i = 0; i < v.max; i++){
							class_data.slots[level].push(i >= v.value)
						}
				}

				class_data.has_feature = true;
				class_data.sp_total = Math.ceil(wizard_druid_class_item.data.data.levels/2);
				class_data.sp_left = Math.ceil(wizard_druid_class_item.data.data.levels/2);

			}

		}

		let bard_level = false;
		let bard = false;
		let characters = game.actors.filter(actor => actor.data.type === "character" && actor.hasPlayerOwner);

		characters.forEach(actor => {
			// Only consider the bard if it has more than 0 hp, as the song of rest cannot be used if the bard is incapacitated
			if(actor_has_item(actor, "song of rest") && actor.data.data.attributes.hp.value > 0){
				let level = actor.items.find(i => i.type === "class" && i.name.toLowerCase() === "bard").data.data.levels;
				bard_level = bard_level ? (level > bard_level ? level : bard_level) : level;
				bard = bard ? (level > bard_level ? actor : bard) : actor;
			}

			if(actor_has_item(actor, "chef") && actor_has_item(actor, "cook's utensils") && actor.data.data.attributes.hp.value > 0){
				class_data.chef.push(actor);
			}
		});

		class_data.song_of_rest = bard_level >= 17 ? "1d12" : bard_level >= 13 ? "1d10" : bard_level >= 9 ? "1d8" : bard_level >= 2 ? "1d6" : false;
		class_data.bard = bard ?? false;

		return class_data;

	}

	/* -------------------------------------------- */


	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		let btn = html.find("#roll-hd");
		btn.click(this._onRollHitDie.bind(this));
		
		let chk = html.find(".spend-spell-point");
		chk.click(this._onSpendSpellPoint.bind(this));
	}

	/* -------------------------------------------- */

	/**
	 * Handle rolling a Hit Die as part of a Short Rest action
	 * @param {Event} event     The triggering click event
	 * @private
	 */
	async _onRollHitDie(event) {
		event.preventDefault();
		const btn = event.currentTarget;
		this._denom = btn.form.hd.value;

		await this.actor.rollHitDie(this._denom, { dialog: !game.settings.get("short-rest-recovery", "quickHDRoll") });

		if(this._data.class_data.song_of_rest && !this.used_song_of_rest){

			let roll = await new Roll(this._data.class_data.song_of_rest).roll({async: true});
			
			const hp = this.actor.data.data.attributes.hp;
			const dhp = Math.min(hp.max + (hp.tempmax ?? 0) - hp.value, roll.total);
			await this.actor.update({"data.attributes.hp.value": hp.value + dhp});

			roll.toMessage({
				flavor: game.i18n.format("DND5E.ShortRestSongOfRest", { name: this.actor.name, bard: this._data.class_data.bard.name }),
				speaker: ChatMessage.getSpeaker({token: this.actor})
			})

			this.used_song_of_rest = true;

		}

		if(this._data.class_data.chef.length > 0 && !this.used_chef){

			let chef = this._data.class_data.chef[Math.floor(Math.random() * this._data.class_data.chef.length)];

			let roll = await new Roll('1d8').roll({async: true});
			
			const hp = this.actor.data.data.attributes.hp;
			const dhp = Math.min(hp.max + (hp.tempmax ?? 0) - hp.value, roll.total);
			await this.actor.update({"data.attributes.hp.value": hp.value + dhp});

			let flavor = chef !== this.actor ? game.i18n.format("DND5E.ShortRestChef", { name: this.actor.name, chef: chef.name }) : game.i18n.format("DND5E.ShortRestChefSelf", { name: this.actor.name });

			roll.toMessage({
				flavor: flavor,
				speaker: ChatMessage.getSpeaker({token: this.actor})
			})

			this.used_chef = true;

		}
		
		this.update_hd();
	}

	/* -------------------------------------------- */

	/**
	 * Updates the hit dice section of the UI
	 * @private
	 */
	update_hd(){
		this._data.hd = this.get_hitdice();
		for(let hd in this._data.hd.availableHD){
			this._element.find(`option[value=${hd}]`).text(`${hd} (${this._data.hd.availableHD[hd]} ${game.i18n.localize("DND5E.available")})`);
		}
		this._data.hd.canRoll = this.actor.data.data.attributes.hd > 0;
		this._element.find('#roll-hd').prop('disabled', !this._data.hd.canRoll);
	}


	/* -------------------------------------------- */

	/**
	 * Handle clicking on the spell point checkboxes
	 * @param {Event} event     The triggering click event
	 * @private
	 */
	async _onSpendSpellPoint(event) {
		this.update_spellpoints();
	}


	/* -------------------------------------------- */

	/**
	 * Updates the spell point section of the UI
	 * @private
	 */
	update_spellpoints(){

		let sp_left = this._data.class_data.sp_left;

		let checkboxes = this._element.find(".spend-spell-point");

		// Let's keep this around if I decide to return to this
		// Checks the left-most checkbox in the series, instead of whichever one the user selected

		/*let check_checkboxes = [
			this._element.find(".spend-spell-point[value='1']"),
			this._element.find(".spend-spell-point[value='2']"),
			this._element.find(".spend-spell-point[value='3']"),
			this._element.find(".spend-spell-point[value='4']"),
			this._element.find(".spend-spell-point[value='5']")
		]

		for(let level = 0; level < check_checkboxes.length; level++){

			let checkbox_set = check_checkboxes[level];

			for(let i = checkbox_set.length-1; i >= 1; i--){
			
				let checkbox = checkbox_set[i];
				
				for(let j = i-1; j >= 0; j--){

					let prev_checkbox = checkbox_set[j];

					if(!prev_checkbox.checked && checkbox.checked){
						prev_checkbox.checked = true;
						checkbox.checked = false;
					}

				}

			}

		}*/

		for(let i = 0; i < checkboxes.length; i++){

			let checkbox = checkboxes[i];

			let level = Number(checkbox.value);

			if(checkbox.checked){
				sp_left -= level;
			}
		}

		for(let i = 0; i < checkboxes.length; i++){

			let checkbox = checkboxes[i];

			let level = Number(checkbox.value);

			if(sp_left - level < 0 && !checkbox.checked){
				checkbox.setAttribute("disabled", "");
			}else{
				checkbox.removeAttribute("disabled");
			}
		}

		this._element.find('#sp-left').text(sp_left);

	}

	/* -------------------------------------------- */

	/**
	 * A helper constructor function which displays the Short Rest dialog and returns a Promise once it's workflow has
	 * been resolved.
	 * @param {Actor5e} actor
	 * @return {Promise}
	 */
	static async shortRestDialog({actor}={}) {
		return new Promise((resolve, reject) => {
			const dlg = new this(actor, {
				title: "Short Rest",
				buttons: {
					rest: {
						icon: '<i class="fas fa-bed"></i>',
						label: "Rest",
						callback: html => {

							let checkboxes = html.find(".spend-spell-point");

							let levels_regained = false

							if(checkboxes.length > 0){

								levels_regained = {};

								for(let i = 0; i < checkboxes.length; i++){

									let checkbox = checkboxes[i];

									if(checkbox.checked){
										let level = Number(checkbox.value);
										if(levels_regained[level] === undefined){
											levels_regained[level] = 0;
										}
										levels_regained[level]++;
									}
								}

								if(Object.keys(levels_regained).length === 0){
									levels_regained = false;
								}

							}


							let newDay = false;
							if (game.settings.get("dnd5e", "restVariant") === "gritty")
								newDay = html.find('input[name="newDay"]')[0].checked;

							resolve({
								newDay: newDay,
								levels_regained: levels_regained
							});
						}
					},
					cancel: {
						icon: '<i class="fas fa-times"></i>',
						label: "Cancel",
						callback: reject
					}
				},
				close: reject
			});
			dlg.render(true);
		});
	}

}

function actor_has_item(actor, item_name){
	return actor.items.find(i => i.name.toLowerCase().indexOf(item_name.toLowerCase()) > -1);
}