# Rest Recovery Changelog

## Version 1.1.1
- Added `Hit Die Bonus` under the Special Traits menu of characters, which can be used to add a modifier to the characters' hit die rolls.
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