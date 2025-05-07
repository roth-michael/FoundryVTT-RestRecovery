## Enable exhaustion automation

This makes it so that exhaustion is subtracted by 1 every long rest.

## Enable One D&D Exhaustion
In the new One D&D, exhaustion instead stacks to 10 (upon which you still die), and applies a -1 penalty to Ability Checks, Attack Rolls, Saving Throws, and the character's Spell Save DC per exhaustion level. Simply change the exhaustion level on the characters, and the penalty is automatically applied.

## Prevent Long Rest Exhaustion Recovery
When enabled, this setting prevents characters from recovering exhaustion when finishing a long rest.

## Enable long rest hit dice rolls

Enables the hit dice roll UI in the Long Rest dialog. This enables the "slow natural healing" alternative rule.

## Enable hit dice recovery before finishing long rest

This makes it so that hit dice are recovered before finishing the long rest, so that you can roll them as a part of this rest.

Requires **Enable long rest hit dice rolls** to be enabled.

## Enable hit dice max buffer

This setting causes each character to always regain hit dice, even if it would put their hit dice above their maximum, so that no hit dice are wasted. Any unused hit dice over their maximum will disappear once the long rest is completed.

Requires **Enable hit dice recovery before finishing long rest** to be enabled.

## Prevent hit dice recovery on long rests if rolled
This setting makes it so that characters that roll any hit dice during a long rest will not recover any at the end of the long rest. This is incompatible with the "Enable hit dice recovery before finishing long rest" setting.

## Maximum long rest hit die spend
This prevents characters from rolling hit dice once they have rolled a number of hit dice equal to this setting.

## Hit points recovery fraction

The fraction of hit points to recover on a long rest.

Available choices for this setting are as follows:
* None
* Quarter
* Half
* Full *(Default)*
* Custom Formula

## Hit dice recovery fraction

The fraction of hit dice to recover on a long rest.

Available choices for this setting are as follows:
* None
* Quarter
* Half *(Default)*
* Full
* Custom Formula

## Hit dice recovery rounding

How to round the number of hit dice recovered.

Available choices for this setting are as follows:
* Round Down *(default)*
* Round Up

## Spell slots recovery fraction

The fraction of spell slots to recover on a long rest (pact slots excluded).

Available choices for this setting are as follows:
* None
* Quarter
* Half
* Full *(default)*
* Custom Formula

## Enable spell slot point-like recovery rule
Enabling this setting will cause everyone with spell slots to recover them like the wizard "Arcane Recovery" feature, where you have you choose which spell slots you recover. This setting can only be enabled when "Spell slots recovery fraction" is set to custom. Characters regain a number of spell slots equal to the custom formula's setting.

## Item uses recovery fraction

The fraction of item uses (items, consumables, etc.) to recover on a long rest.

Available choices for this setting are as follows:
* None
* Quarter
* Half
* Full *(default)*
* Custom Formula

## Feat uses recovery fraction

The fraction of feat uses to recover on a long rest.

Available choices for this setting are as follows:
* None
* Quarter
* Half
* Full *(default)*
* Custom Formula

## Daily uses recovery fraction

The fraction of daily uses to recover on a long rest (items with the \"Day\" recovery setting).

Available choices for this setting are as follows:
* None
* Quarter
* Half
* Full *(default)*
* Custom Formula

## Armor long rest automation
With this enabled, non-light armor impedes long rests. Configure below how it impacts the long rest.

## Armor hit dice recovery fraction
If the character is wearing non-light armor during the long rest, this is fraction of hit dice they recover on a long rest.

Available choices for this setting are as follows:
* None
* Quarter *(Default)*
* Half
* Full
* Custom Formula

## Armor prevents exhaustion recovery
When enabled and the character is wearing non-light armor during the long rest, they do not recover from exhaustion. Requires exhaustion automation to be enabled.