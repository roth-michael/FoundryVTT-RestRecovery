## Use Request chat card for prompted rests
If enabled, uses the system's "Request" chat card, rather than socketing rest requests to connected players.

## Prevent User Rest
This prevents users from initiating rests themselves, and must be prompted to rest by the GM.

## Enable hit dice auto roll button
This adds a button to the long and short rest UI so that players can auto-roll hit dice until their HP is almost full.

## Enable automatic time passage on prompt rest
This enables time passing whenever players and prompted to rest by a GM. This may cause time-based active effects on characters to expire.

## Enable Simple Calendar integration
Enabling this makes the "New Day" button in the prompt rest UI and in the long/short rest UI for players automated based on the current time of the calendar. Requires the [Simple Calendar](https://foundryvtt.com/packages/foundryvtt-simple-calendar) module.

## Enable Simple Calendar notes
Enabling this will create a Simple Calendar note for each character's short/long rests, the content of which will be identical to the chat message outputted at the end of the rest. Requires the [Simple Calendar](https://foundryvtt.com/packages/foundryvtt-simple-calendar) module.

**Note: Players must have "Create Journal Entries" permissions & "Add Notes" Simple Calendar permissions enabled if resting while online.**

## Enable notes only on prompted rests
Enabling this will create Simple Calendar notes only when a rest has been prompted by the GM. Requires the above setting to be enabled.

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
