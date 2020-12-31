# Short Rest Recovery
This module adds support for Wizards' Arcane Recovery and Land Druids' Natural Recovery within the short rest dialog.

![Image of the new short rest dialog with checkboxes for spell recovery](https://raw.githubusercontent.com/Haxxer/FoundryVTT-ShortRestRecovery/main/docs/short-rest-dialog.jpg)

If the Arcane/Natural Recovery Feature does not have any uses remaining or if there are no spell slots to recover, the spell slot UI shown in the above image will be hidden.

Now with added support for the [Bard's Song of Rest](https://www.dndbeyond.com/classes/bard#SongofRest-80)!

## Installation
Use this manifest URL to install the module:

`https://raw.githubusercontent.com/Haxxer/FoundryVTT-ShortRestRecovery/main/short-rest-recovery/module.json`

## Module Settings
* **Quick-roll Hit Dice**
  * If this setting is enabled, it will make it so that when you press the "Roll" button on the short rest UI, no hit dice dialog will be prompted, and the hit dice will be rolled immediately.

* **Show Chat Message**
  * If this is enabled, each character that finishes a short rest will post a public message with a summary what they regained during the short rest.

## To-do:
- ~~Hide spell slot recovery checkboxes when user has all spell slots~~
- ~~Add support for Land Druids' Natural Recovery~~
- ~~Add support for Bard's Song of Rest~~
- Add support for Periapt of Health
- Add support for the Durable feat
- Add support for the Chef feat
- Add support for Wizard/Druid multiclass (fml...)
