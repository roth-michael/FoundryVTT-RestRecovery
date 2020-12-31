# Short Rest Recovery
This module adds support for the various short rest mechanics in D&D 5E. These are the added features in this module:

## Feature: Arcane Recovery (Wizards), Natural Recovery (Druids)

This module adds support for Wizards' Arcane Recovery and Land Druids' Natural Recovery within the short rest dialog.

![Image of the new short rest dialog with checkboxes for spell recovery](/docs/short-rest-dialog.jpg)

If the Arcane/Natural Recovery Feature does not have any uses remaining or if there are no spell slots to recover, the spell slot UI shown in the above image will be hidden.

## [Feature: Song of Rest](https://www.dndbeyond.com/classes/bard#SongofRest-80)

Whenever there's a character with the bard class that is assigned to a player, it'll automatically roll the appropriate dice based on the bard's level.

![Image of a character gaining hit points from a bard's song of rest](/docs/song-of-rest.jpg)

## [Item: Periapt of Wound Closure](https://www.dndbeyond.com/magic-items/periapt-of-wound-closure)

If a character is **attuned** to this item (important to be attuned), whenever they roll hit dice the hit points regained is doubled.

![Image of a hit dice roll with the periapt of wound closure](/docs/periapt-of-wound-closure.jpg)

## [Feat: Durable](https://www.dndbeyond.com/feats/durable)

If a character has the Durable feat, the minimum they can roll with hit dice is equal to twice their constitution modifier (works with the Periapt of Wound Closure).

![Image of a hit dice roll with the durable feat](/docs/durable.jpg)

## [Feat: Chef](https://www.dndbeyond.com/feats/chef)

If a character that is assigned to a player possesses the Chef feat as well as Chef's Utensils, each character in the party will roll an additional 1d8 as a part of the short rest.

![Image of a two rolls, one for the chef rolling a 1d8 for themselves, and another non-chef rolling a 1d8 for themselves](/docs/chef.jpg)

# Installation
Use this manifest URL to install the module:

`https://raw.githubusercontent.com/Haxxer/FoundryVTT-ShortRestRecovery/main/short-rest-recovery/module.json`

# Module Settings
* **Quick-roll Hit Dice**
  * If this setting is enabled, it will make it so that when you press the "Roll" button on the short rest UI, no hit dice dialog will be prompted, and the hit dice will be rolled immediately.

* **Show Chat Message**
  * If this is enabled, each character that finishes a short rest will post a public message with a summary what they regained during the short rest.

# To-do:
- ~~Hide spell slot recovery checkboxes when user has all spell slots~~
- ~~Add support for Land Druids' Natural Recovery~~
- ~~Add support for Bard's Song of Rest~~
- ~~Add support for Periapt of Wound Closure~~
- ~~Add support for the Durable feat~~
- ~~Add support for the Chef feat~~
- Add support for Wizard/Druid multiclass (fml...)
