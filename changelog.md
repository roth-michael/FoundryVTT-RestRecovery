# Rest Recovery Changelog

## Version 1.4.4
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
