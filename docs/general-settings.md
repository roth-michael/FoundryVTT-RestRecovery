## Automatically start rest when prompted
If enabled, a GM-prompted rest will automatically start a rest if a user has one of the resting actors selected as their character.

## Enable hit dice auto roll button
This adds a button to the long and short rest UI so that players can auto-roll hit dice until their HP is almost full.

## Enable automatic time passage on prompt rest
This enables time passing whenever players and prompted to rest by a GM. This may cause time-based active effects on characters to expire.

## Enable calendar integration
Enabling this makes the \"New Day\" button in the prompt rest UI and in the long/short rest UI for players automated based on the current time of the calendar.

## Enable Calendaria notes
Enabling this will create a Calendaria note for each character's short/long rests, the content of which will be identical to the chat message outputted at the end of the rest. Requires the [Calendaria](https://github.com/Sayshal/Calendaria) module.

## Enable notes only on prompted rests
Enabling this will create Calendaria notes only when a rest has been prompted by the GM. Requires the above setting to be enabled.

## Hit Die Multiplication Mechanics
This configures how hit die multiplying effects such as the item "Periapt of Wound Closure" and the "Hit Die roll multiplier" setting below handle the multiplication of the hit die roll.

Available choices for this setting are as follows:
* Multiply dice roll *(Default)*
* Multiply total results

## Hit Die formula
This configures the hit die roll formula, allowing for advantage or maximized results.

Available choices for this setting are as follows:
* Normal *(Default)*
* Advantaged
* Maximized

## Hit Die roll multiplier
The fraction of a hit die roll to actually recover as hit points each time a hit die is rolled.

Available choices for this setting are as follows:
* None
* Quarter
* Half
* Full *(Default)*
