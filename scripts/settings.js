Hooks.once("init", () => {
	
	game.settings.register("short-rest-recovery", "quickHDRoll", {
		name: "Quick-roll Hit Dice (skip dialog)",
		hint: "Skip the dialog for rolling hit dice and roll them quickly.",
		scope: "world",
		config: true,
		default: false,
		type: Boolean
	});

	game.settings.register("short-rest-recovery", "showChatMessage", {
		name: "Show Chat Message",
		hint: "At the end of the short rest, show a chat message summarizing the rest.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});

});