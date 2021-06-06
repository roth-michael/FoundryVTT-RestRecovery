export function register_settings(){
	
	game.settings.register("short-rest-recovery", "quickHDRoll", {
		name: "Quick-roll Hit Dice (skip dialog)",
		hint: "Skip the dialog for rolling hit dice and roll them quickly.",
		scope: "world",
		config: true,
		default: false,
		type: Boolean
	});

	game.settings.register("short-rest-recovery", "skipActivePlayers", {
		name: "Skip inactive player characters",
		hint: "If you have a Bard with the Song of Rest or a Chef in your party, this will only consider them as present if the owning player is active and logged on.",
		scope: "world",
		config: true,
		default: false,
		type: Boolean
	});

}