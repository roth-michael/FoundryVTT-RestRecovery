# Rest Recovery Changelog

## Version 1.17.2
- One D&D Exhaustion now properly removes normal system exhaustion behavior

## Version 1.17.1
- Fixed attunement check for periapt of wound closure

## Version 1.17.0
- Added compatibility with group sheet rests (they'll now open the "Prompt Rest" dialog with all actors from the sheet selected by default)
- This will _actually_ be the last v11/3.x-compatible release

## Version 1.16.3
- Added localization for small version of Item Piles trade button
- NOTE: Barring any bugs discovered prior to the dnd5e 4.0.0 release, this will likely be the final V11 & dnd5e 3.x compatible release.

## Version 1.16.2
- Fixed bug where Rest Recovery would try to access Tidy5e's settings before they were registered
- Fixed a bug where rolling hit dice on long rest wouldn't update the UI
- Translation updates (thanks Kharmans)

## Version 1.16.1
- Fixed bug where Tidy5e sheet would be adjusted even if exhaustion automation was disabled in Rest Recovery

## Version 1.16.0
- Added a special trait for actors to roll hit dice with advantage
- Added a whispered chat message to the GM if Rest Recovery changes Tidy5e's exhaustion display settings
- Added an API function which might be useful for programmatically handling food/water consumption
- Added a system version max of "4" to prevent activation on dnd5e 4.0.0 when it releases, as Rest Recovery almost certainly won't be immediately compatible

## Version 1.15.1
- Translation updates (thanks Kharmans)

## Version 1.15.0
- Added settings in food & water section to enable or disable food/water requirement according to "new day"
  - If enabled, food & water consumption will be a rest step regardless of short vs long rest, so long as the rest results in a new day
  - Note that if food & water _exhaustion_ is enabled along with this setting, normal exhaustion recovery will occur on long rests, but will also occur on short rests which span a new day (if all food/water required is consumed)
- Use Custom Recovery checkbox & formula will now only show on items when relevant (uses set to short/long rest or "day")
- Fixed a bug where playing with a non-english translation could cause food/water costs to be improperly calculated
- Fixed a bug where actors with "default ownership" of owner wouldn't show up in the rest prompt

## Version 1.14.1
- Fixed a bug where regular exhaustion rules were applied still when Alternative Exhaustion 5e was active
- Fixed a bug where Song of Rest wasn't being applied to players' actors unless the player also owned the bard
- Fixed the chat message displayed for Song of Rest to properly use whatever the configured "Song of Rest" name is
- Fixed a bug where rests called through a macro with `{dialog: false}` would not recover any resources
  - Now such a rest will complete as if there were no food/water restrictions as no player input can be collected without a dialog
  - Similarly, if "spell slot point-like recovery rule" is enabled and a no-dialog rest is prompted via macro, spell slots will be recovered according to the custom formula

## Version 1.14.0
- Added compatibility with [Magic Items](https://foundryvtt.com/packages/magicitems) module (resting should now recharge magic items as appropriate)
  - This relies on Magic Items version 4.1.7 or later
- Added an option to only log Simple Calendar notes if coming from a GM-prompted rest (i.e. not from a rest starting on a character sheet)
- Fixed a bug with chat messages for hp regain on short rests displaying incorrect recovery amount

## Version 1.13.0
- Added option for hp regain on short rests (in addition to hit dice rolls)
- A couple of dialog fixes

## Version 1.12.2
- "Configure Resource Recovery" option now only shows up on default sheet if sheet is in edit mode

## Version 1.12.1
- Translation updates (thanks Kharmans & VirusNik21)
  - Now includes Russian translation

## Version 1.12.0
- Added option to allow Song of Rest to roll with _every_ short rest hit die rolled, rather than only the first

## Version 1.11.5
- Fixed a bug which sometimes prevented Midi QOL from opening its troubleshooter

## Version 1.11.4
- Fixed bug when trying to prompt rest with non-actor tokens on the scene

## Version 1.11.3
- Fixed NPC rests when using Tidy (only from their sheet - still don't support adding them in a prompted rest)
  - Due to improvements made to NPC actor data in dnd5e v3.2.0, NPCs should now mostly be able to benefit from the full Rest Recovery workflow; in dnd5e v3.1.x, however, NPC rests will simply use the core rest methods

## Version 1.11.2
- Actors with tokens on the viewed scene will now appear at the top of the rest prompt list dropdown
- Selected actors for a rest prompt are now remembered across browsers
  - The data will be stored on the user who prompts the rest, upon modifying the selected actors or initiating a rest from the prompt
- Removed some deprecation warnings

## Version 1.11.1
- Updated chat message flavor to reflect custom rest times

## Version 1.11.0
- Added a the ability to configure hit die rolls to be done with advantage, or automatically maxed (thanks f4hy on github!)
- Moved the fractional hp recovery from HD rolls to the general tab, as it effects all hit die rolls, not only those taken during short rests

## Version 1.10.4
- Fixed a forge-only bug when enabling One D&D Exhaustion

## Version 1.10.3
- Fixed a bunch of small bugs relating to various resource/spell recoveries that were introduced in version 1.8.0

## Version 1.10.2
- Updated fractional hp recovery from HD rolls to use the same dropdown as Periapt of Wound Closure's dropdown for how to multiply hit die rolls

## Version 1.10.1
- Removed libwrapper dependency
- Translation updates (thanks Kharmans!)

## Version 1.10.0
- Added an option for fractional hp recovery from hit die rolls (e.g. all HD rolls are halved, quartered, or auto-zero; bonuses - like CON mod - are not multiplied)

## Version 1.9.1
- Fixed a bug where food/water-related special traits wouldn't show up unless world was reloaded

## Version 1.9.0
- Now _fully_ implements RAW exhaustion - in addition to the existing speed & hp max decreases, the appropriate rolls will receive disadvantage at certain exhaustion levels
  - Ability Checks (including skill checks) will receive disadvantage if at exhaustion 1 or above
  - Attack Rolls and Saving Throws (including concentration saves & death saves) will receive disadvantage if at exhaustion 3 or above
  - The above only applies if One D&D Exhaustion is not enabled
  - If "fast-forwarding" rolls, this will happen automatically, rolling with disadvantage, or as a straight roll if it was determined by some other module (or by holding down a keybind) that the roll should have advantage for some reason
  - Otherwise, in roll dialog, the appropriate option (again, either disadvantage or normal) will be highlighted
- Added automatic support for [Automated Conditions 5e](https://foundryvtt.com/packages/automated-conditions-5e) - if installed & AC5e exhaustion automation is enabled, Rest Recovery will let AC5e handle the effects (unless Rest Recovery is set to use One D&D Exhaustion).

## Version 1.8.0
- Should now be V12 and dnd5e 3.2 compatible while maintaining V11 & 3.1.x functionality

## Version 1.7.0
- Updated TyphonJS and Svelte to more current releases, should see no change in user experience, but maybe some improved performance
- Fixed an error being logged to console every time the settings menu was opened

## Version 1.6.9.4
- Fixed (one) error logged to console on world startup

## Version 1.6.9.3
- Fixed bug where world would restart & UI would become unusable after trying to save settings (HUGE thanks to Christopher on discord)

## Version 1.6.9.2
- Fixed bug where One D&D Exhaustion effect would not be removed if exhaustion on an actor changed after reverting from One D&D to normal exhaustion

## Version 1.6.9.1
- Fixed missing compendium & asset data

## Version 1.6.9
- Added automatic recognition of "Rations (1 day)" imported using DDBI.

## Version 1.6.8
- Added reference journal entry for One D&D Exhaustion condition (in Brazilian Portuguese as well - thanks Kharmans!)

## Version 1.6.7
- Various exhaustion fixes
  - New icons for One D&D Exhaustion levels (thanks mythacri!)
  - The "exhaustion integrations" option is currently disabled, as the only option (DFreds CE) doesn't play nice with any exhaustion automations
    - You can still use CE (and even set effects to "replace" now, if you want), just know that the CE exhaustion effects will not be applied
  - If you use the [Alternative Exhaustion 5e](https://foundryvtt.com/packages/alternative-exhaustion-5e) module, you won't have to/be able to enable One D&D Exhaustion in the Rest Recovery settings (it will already be handled by Alternative Exhaustion)
    - If you currently use Alternative Exhaustion with "Manual Adjustment" enabled, and decide to remove it in favor of only using Rest Recovery, ensure you remove any "Global Bonuses" you have set which rely on exhaustion, as the -1 per exhaustion level is automatically handled by Rest Recovery
  - Fixed an issue where using One D&D Exhaustion resulted in the "normal" exhaustion debuffs happening on top of the expected debuffs

## Version 1.6.6.1
- Made One D&D sheet modification an option, so as not to conflict with other potentially compatible exhaustion modules

## Version 1.6.6
- Added compatibility with "new" 5e actor sheet
  - Now shows resource recovery configuration option above "Favorites" section
  - If One D&D exhaustion exabled, will now have 10 exhaustion pips to click
    - Currently exhaustion 6-10 will show the wrong icon, as there are no core icons for those exhaustion levels (besides 6, which shows a little red skull exhaustion icon)
- Translation updates (thanks Kharmans!)

## Version 1.6.5

- Fixed compatibility with Tidy5e sheets
  - Custom resource recovery should now be visible in the traits list in the Attributes tab
  - Enabling/disabling One D&D exhaustion will now enable/disable it for Tidy5e as well (you'll have to save settings at least once if you're already using both Tidy5e and have One D&D exhaustion enabled)
  - Warning will now properly be displayed if a food/water consumable has an invalid number of max charges with food/water automation turned on
  - Custom Recovery checkbox now properly enables the custom recovery formula field
  - Fixed widths of item sheet checkboxes to not cut off text

## Version 1.6.4

- Fixed a bug where consuming the final charge of a food/water item that was set to destroy on empty would not properly update the character's hunger/thirst level
- Added optional cost of fully/half sating hunger and thirst through external sources (e.g. meals/drinks at a tavern)
  - This is currently globally configured, with checkboxes for enabling food & water costs individually, and cost settings for full & half for both
    - Per-scene configuration is unlikely to be implemented, so if you anticipate different costs in the same session I'd recommend creating different rest profiles ahead of time
  - The cost for full or half will be the same regardless of whether the resting characters have already eaten (after all, you don't get a refund for the amount of a meal that you didn't eat)
  - If a character doesn't have enough money to "externally source" the options they've selected, they won't be able to continue the rest until changing their selection to one they can afford
  - The currency will be automatically deducted from the character's inventory, performing currency conversions only when necessary

## Version 1.6.3

- Added new "Custom" rest variant, accessible via the Quick Setup menu in the variant dropdown
  - Selecting this variant will allow you to enter your own custom Long & Short Rest lengths in the Quick Setup menu
  - Lengths are variable down to the nearest 0.05 hours (3 minutes)

## Version 1.6.2

- Removed branding from General Settings
- Added setting that when enabled logs all rests as Simple Calendar notes (requires player permissions for "Create Journal Entries" and Simple Calendar "Add Notes")

## Version 1.6.1

- Fixed spell slots being removed when taking a long rest with "Enable spell slot point-like recovery rule" enabled.

## Version 1.6.0

- Fixed incompatibility with D&D5e 3.1.2
- Fixed GM-handled rests for offline players not registering a new day
- Fixed player-initiated long rests checking new day as if they were short rests
- Fixed GM-prompted rests not properly recognizing new day with Simple Calendar integration
- Fixed long rest hit dice regain text not matching actual hit dice regain

## Version 1.5.4

- Fixed resting throwing an unrecoverable error (thanks to JaysonMendoza on github!)

## Version 1.5.3
- Fixed exhaustion integration with DF Convenient Effects not removing manually placed exhaustion effects
- Fixed finishing short rests would cause hit dice to be recovered

## Version 1.5.2
- Fixed players regaining too many hit dice after rests

## Version 1.5.1
- Fixed minor issue with forgotten code that should not exist

## Version 1.5.0
- Fixed incompatibility with D&D5e 2.4.0
- Fixed bug with food and water items without auto destroy enabled would be consumed anyway

## Version 1.4.17

- Added setting that when enabled prevents exhaustion from being recovered on long rests
- Added active effect support for `flags.dae.rest-recovery.prevent.exhaustionRecovery` - setting this to `1` causes any character affected this active effect from being able to recover from exhaustion
- Added `game.restrecovery.daeFlags` which lists all of the above options
- Tweaked rests that are prompted by GMs to now only consider the prompted characters when determining active features such as Song of Rest and the Chef feat
- Fixed logic handling of consumables that are worth an entire day of food and/or water

## Version 1.4.16

- Fixed healthbar in short rest UI not updating

## Version 1.4.15

- Fixed Periapt of Wound Closure only multiplying the modifier when set to multiply total
- Fixed several issues with consuming multiple units of food or water that had multiple uses & quantities 

## Version 1.4.14
- Added option to set how Periapt of Wound Closure multiplies hit die rolls
- Fixed regaining hit dice before finishing a long rest giving characters their hit dice back before and after the rest
- Fixed hit dice buffer when regaining hit dice before starting a long rest not overflowing the maximum amount
- Fixed food and water items with 1/1 use subtracting 2 quantity of the items when consumed
- Fixed food and water items causing exhaustion even when consuming the correct amounts
- Fixed One D&D Exhaustion not working

## Version 1.4.13
- Added german localization (Thank you mhilbrunner on github!)
- Fixed various food & water bugs surrounding the gritty realism rest variant
- Fixed optional setting to regain hit dice before starting a long rest sometimes not working properly
- Bumped supported D&D version 2.3.0

## Version 1.4.12
- Bumped supported Foundry version to v11
- Bumped supported D&D version to 2.2.0

## Version 1.4.11
- Added support for One D&D Exhaustion with Tidy 5e sheet (simply adds more exhaustion options in the UI)
- Fixed food & water not showing up in the rest dialog if the character didn't need water but needed food
- Turned off exhaustion integrations when One D&D Exhaustion is active due to strange behavior
- Fixed One D&D Exhaustion referencing MidiQOL flags instead of native D&D flags

## Version 1.4.10
- Added support for the War Wizard's Power Surge feature
- Fixed hit dice recovery fraction not being respected when long rest hit dice rolling was not enabled
- Fixed Configure Resource Recovery stretching to take all available space on most character sheets

## Version 1.4.9
- Added option to prevent users from initiating rests without being prompted
- Fixed module being visible and activatable in other systems
- Fixed hit dice recovery fraction not being respected

## Version 1.4.8
- Added Quick Setup for common setups (such as Slow Natural Healing)
- Fixed Prompt Rest UI sometimes pushing elements out of view
- Improved Simple Calendar integration by displaying more helpful information when a new day is not going to happen due to either rest types
- Fixed long rest hit dice max buffer not working

## Version 1.4.7
- Fixed error surrounding the 2.0.x D&D5e updates regarding item recovery rolls 

## Version 1.4.6
- Added optional setting to prevent hit dice recovery on long rests if any hit dice are rolled 
- Added optional setting which limits how many hit dice characters can roll on a long rest 
- Fixed multiple bards with Song of Rest would not select the highest level bard to roll
- Fixed character resource configuration throwing error and not opening properly
- Fixed auto-rolling hit dice on a long rest would sometimes use short rest rules

## Version 1.4.5
- Fixed exhaustion integrations not working properly
- Fixed number food & water quantity inputs not accepting a valid value of 0.5 

## Version 1.4.4
- Added full One D&D exhaustion support without a need for any integrations; any amount of exhaustion now automatically applies penalties
- Added setting that disables the "New Day" automation with Simple Calendar installed
- Added setting that can disable the automatic passage of time when rests are prompted of players
- Tweaked prompt rest UI to enforce the "New Day" checkbox so players cannot pick when it has been pre-picked by the GM
- Fixed characters without a need for food & water getting empty food & water step in rest UIs

## Version 1.4.3
- Added the following flags to use with Dynamic Active Effects:
  - Force maximum number on hit die rolls: `rest-recovery.force.maximiseHitDieRoll 1`
  - Require no food: `rest-recovery.force.noFood 1`
  - Require no water: `rest-recovery.force.noWater 1`
  - Require more food: `rest-recovery.require.food [units of food]`
  - Require more water: `rest-recovery.require.water [units of water]`
- Fixed error when opening the short rest UI when Simple Calendar was active

## Version 1.4.2
- Added support for flags that prevents long and short rests - thank you sasquach45932 for the contribution!
  - Requires you to use DAE or a macro to set these flags on the actor:
    - `flags.dae.rest-recovery.prevent.longRest`
    - `flags.dae.rest-recovery.prevent.shortRest`
  - With DAE, you can use `flags.dae` as the attribute key and `rest-recovery.prevent.[shortRest/longRest] 1` as the value to prevent the rest
- Added `ignoreFlags` secondary argument to `Actor#longRest` and `Actor#shortRest` to ignore the aforementioned behavior 

## Version 1.4.1
- Fixed issue with module profiles

## Version 1.4.0
- Added Simple Calendar support, prompting rests now automatically advances the current date & time
- Added One D&D exhaustion support, and integrated custom active effect into DFred's Conventient Effects
- Added support for spell slot point-like recovery for all classes (similar to Wizards' Arcane Recovery) on long rests
- Added further support for heroic and gritty rest variants - if you are playing with the gritty variant, food can be consumed during short rests, and long rests require 7 days worth of food
- Improved the long/short rest UI; removed tabs and introduced steps to better inform users of things they might want to do
- Fixed error where a player with a 1st level bard without the Song of Rest feature would throw an error every time another player would roll a hit die

## Version 1.3.10
- Made prompt rest button darker

## Version 1.3.9
- Made prompt rest UI remember the character and user selections

## Version 1.3.8
- Actually fixed module profiles

## Version 1.3.7
- Added UI to prompt rests for individual players, button can be found in the bottom left corner, which can be hidden in the module settings
- Added `game.restrecovery.renderPromptRestInterface`, which can render the UI mentioned above through code
- Fixed bug where opening and closing the settings UI would cause it to fail to save and load module profiles
- Moved short rest pact slot recovery setting to the short rest section

## Version 1.3.6
- Actually fixed Hit Die bonus
- Tweaked sleeping in medium armor have the same impact as heavy armor (as per rules)

## Version 1.3.5
- Fixed food & water consumption not working
- Fixed Hit Die bonus, Song of Rest, Chef feat, and Black Blood Healing not working when rolling hit dice
- Made Song of Rest use the feature's formula (falling back on the bard's die scaling) as a basis as to what to dice roll 
- Improved handling of hit die rolls

## Version 1.3.4
- Fixed misnamed Portuguese language file in module.json

## Version 1.3.3
- Added Portuguese localization (thank you eduardopato41!) 
- Fixed health bar not updating in the short and long rest interface
- Fixed error caused by rolling hit dice
- Fixed migration issue that only appeared on fresh worlds with Rest Recovery
- Fixed armor rest penalty text showing up on short rests
- Improved "Check out the custom rules" dialog in the long rest interface

## Version 1.3.2
- **BREAKING** - Fixed some settings that were duplicated, please double-check your long and short rest settings
- Added support for Xanathar's alternative heavy armor resting rule
  - When enabled, wearing heavy armor during a long rest can reduce the number of hit dice you recover on a long rest, and (optionally) prevent exhaustion recovery
- Added setting to configure the number of Warlock pact spell slots recovered on short and long rests
- Fixed Rest Recovery not working in DnD5e 2.0.3
- Updated manifest to be more compatible with V10

## Version 1.3.1
- Fixed spells not working with Rest Recovery enabled

## Version 1.3.0
- Foundry V10 Support
- Fixed Black Blood Healing not working

## Version 1.2.13
- Fixed max short rests not working

## Version 1.2.12
- Fixed being unable to roll hit dice on long rests
- Fixed max hit die spend being visible even when the setting was set to "Full"

## Version 1.2.11
- Added setting to limit how many hit dice a character can roll per short rest
- Fixed hit dice exceeding maximum with "Enable hit dice max buffer" disabled

## Version 1.2.10
- Fixes to 1.5.x D&D version (thank you Varriount!)
- Minor fixes to French localization (thank you DarKDinDoN!)

## Version 1.2.9
- Fixed automated hit dice button being disabled in short rest UI
- General quality of life improvements in the code

## Version 1.2.8
- Slight changes to settings UI

## Version 1.2.7
- Fixed issue with items regaining charges during rests when they should not have

## Version 1.2.6
- Fixed hit dice auto-rolling feature

## Version 1.2.5
- Updated French localization (thank you DarKDinDoN!)
- Third time's a charm with the different D&D system versions
 
## Version 1.2.4
- Actually fixed issues with D&D 5e version 1.5.7 vs 1.6.0
- Fixed auto-roll hit dice button not working

## Version 1.2.3
- Added API under `game.restrecovery`, read more on the [wiki](https://github.com/fantasycalendar/FoundryVTT-RestRecovery/wiki/Rest-Recovery-API)
- Added optional setting for short rests to only be able to be completed if a certain number of hit dice are rolled
- Added short rest recovery settings for items, feats, and resources
- Added patch that automatically turns non-configured Rations and Waterskins into consumable items compatible with Rest Recovery
- Added text displaying how many more short rests an actor can take before having to take a long rest, if that setting is active 
- Fixed wizards and circle of the land druids sometimes throwing errors or warnings surrounding class levels
- Fixed minor issues in the settings UI surrounding loading module profiles
- Fixed issues with D&D 5e version 1.5.7 vs 1.6.0

## Version 1.2.2
- Minor updates to French localization
- Fixed issue with references to old settings
- Fixed minor issue with the module confusing Druid and Wizard spell slot recovery features

## Version 1.2.1
- Updated French localization (again, thank you DarKDinDoN!)
- Added header buttons to the settings UI to export and import module profiles
- Fixed issue that would make characters not regain hit dice during long rests
- Fixed some minor localization issues

## Version 1.2.0
- Added module profile management, you can now quickly configure different settings for different locales or situations
- Added fully featured food & water automation
- Added exhaustion automation, by itself and/or together with food automation
- Added support for exhaustion integration with Combat Utility Belt and DFred's Convenient Effects
- Fixed compatibility warning between Rest Recovery and DnD5e Helpers

## Version 1.1.2
- Updated French localization (thank you DarKDinDoN!)

## Version 1.1.1
- Added `Hit Die Bonus` under the Special Traits menu of characters, which can be used to add a modifier to the characters' hit die rolls
- Fixed issue where multiclassed characters would be unable to roll certain classes' hit die

## Version 1.1.0
- Added custom recovery formula option to items
- Added custom recovery UI for resources, which can be found under the resources in your player sheets (compatible with the [Resources Plus](https://foundryvtt.com/packages/resourcesplus) module)
- Changed Arcane Recovery and Natural Recovery to refer to the "Other Formula" field when determining how many spell slots the feature allows you to regain
- Added setting to disable rolling hit dice during short rests
- Changed description wording of some settings to better reflect what they were actually doing

## Version 1.0.6
- Added custom formula option for each long rest recovery feature
- Added feature to be able to limit how many short rests any given actor can take between long rests
- Added setting that can allow overflowing ones max hit dice at the start of a long rest, losing any over the maximum once the long rest finishes
- Added support for the Verdan lineage's Black Blood Healing feature from Acquisitions Incorporated
- Added support for the Blessing of Wound Closure feature
- Fixed bug that would cause the long rest chat message to have the incorrect number of regained hit dice
- Fixed bug that caused characters to regain more than max HP due to temporary max hit points
- Fixed localization name of Natural Recovery

## Version 1.0.5
- Updated French localization (thank you, DarKDinDoN!)

## Version 1.0.4
- Added auto-roll hit dice in short and long rest dialogs
- Added setting to enable/disable auto-roll button
- Added text to long rest UI health bar to indicate how much HP is to be gained from long resting

## Version 1.0.3
- Added French localization (thank you, DarKDinDoN!)
- Fixed typo in a Svelte component that caused errors on build

## Version 1.0.2
- Added second faded health bar to the Long Rest UI to visualize how much hit points that will be gained once the rest is finished
- Added a dialog to display what custom rules are active, which is accessible through the Long Rest UI 
- Fixed short resting as a non-wizard or land druid would cause the character to regain all of their spell slots
- Added missing localization
- Improved settings configuration UI to display localized strings below their inputs
- Moved name-based settings into its own tab

## Version 1.0.1 Hotfix
- Fixed error when ignore inactive players was enabled

## Version 1.0.0

- Completely refactored module
- Updated all dialogs to be nice and reactive
- Improved internal logic
- Added support for alternate long rest rules
