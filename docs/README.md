## Table of Contents

* [API & Functions](Rest-Recovery-API.md)
* [General Settings](general-settings.md)
* [Actor Traits](Actor-Traits.md)
* [Long Rest Settings](long-rest-settings.md)
* [Short Rest Settings](short-rest-settings.md)
* [Food & Water Settings](food-&-water-settings.md)
* [Item Recognition Settings](item-recognition-settings.md)

# Short Rest Features

![Image of a Fighter/Wizard multiclass with the Durable feat, Periapt of Wound Closure, and Arcane Recovery, in a party with a Bard with Song of Rest and the Chef feat](https://raw.githubusercontent.com/roth-michael/FoundryVTT-RestRecovery/main/docs/all-together-now.png)

## Class Feature: [Arcane Recovery](https://www.dndbeyond.com/classes/wizard#ArcaneRecovery-411) (Wizards), [Natural Recovery](https://www.dndbeyond.com/classes/druid#CircleoftheLand) (Druids)

This module adds support for Wizards' Arcane Recovery and Land Druids' Natural Recovery within the short rest dialog.

If the Arcane/Natural Recovery Feature does not have any uses remaining or if there are no spell slots to recover, the spell slot UI will be hidden.

## Class Feature: [Song of Rest](https://www.dndbeyond.com/classes/bard#SongofRest-80)

If there's a character that is assigned to a player with levels in the Bard class and someone rolls hit dice, the module will automatically roll the appropriate dice based on the bard's level.

## Feat: [Durable](https://www.dndbeyond.com/feats/durable)

If a character has the Durable feat, the minimum they can roll with hit dice is equal to twice their constitution modifier (works with the Periapt of Wound Closure).

## Feat: [Chef](https://www.dndbeyond.com/feats/chef)

If a character that is assigned to a player possesses the Chef feat as well as Chef's Utensils, each character in the party will roll an additional 1d8 as a part of the short rest.

## Lineage Feature: [Black Blood Healing](https://www.dndbeyond.com/sources/ai/player-options#VerdanTraits)

If a character has the lineage feature of a Verdan's Black Blood Healing, any hit dice with a 1 or 2 on the hit die roll will be automatically rerolled.

## Item: [Periapt of Wound Closure](https://www.dndbeyond.com/magic-items/periapt-of-wound-closure)

If a character is **attuned** to this item, any hit die rolled is doubled. According to RAW, this doubling happens _before_ the constitution modifier is added to the hit die roll.

## Feature: [Blessing of Wound Closure](https://www.dndbeyond.com/sources/dmg/other-rewards#BlessingOfWoundClosure)

Similar to above, but as a feature.
