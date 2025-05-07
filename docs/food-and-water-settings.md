## Important Notes

Consumable items may require some setup from you. By default, the system has a "Food" consumable type, but no subtypes for that; installing Rest Recovery adds "Food", "Water", and "Food & Water" subtypes, which must be selected in order to use food consumables for food/water.

## Enable food and water automation
This enables sub-features relating to food and water automation, as seen below.

## Units of food required per day
This configures how many units of food characters needs per day. Setting this to 0 disables food requirement altogether.

## Units of water required per day
This configures how many units of water characters needs per day. Setting this to 0 disables water requirement altogether.

## Access to external food source
This configures whether players will be able to pick "External Food Source" during long rests as a replacement for consumable items.

Available choices for this setting are as follows:
* None
* Half
* Full *(Default)*

"Full" means full access like in inns and cities, "Half" means limited access or poor food, "None" means wilderness or starvation.

## External food has cost
Whether "external food" has a financial cost, such as the cost of a meal at a tavern.

## Cost of Full food
The cost of acquiring the full amount of food required during a rest.

## Cost of Half food
The cost of acquiring half the amount of of food required during a rest.

## Access to external water source
Same as above, but for water.

Available choices for this setting are as follows:
* None
* Half
* Full *(Default)*

Keep in mind that "Half" and "None" will cause characters to experience exhaustion almost immediately unless they have access to consumable items.

## External water has cost
Whether "external water" has a financial cost, such as the cost of a drink at a tavern.

## Cost of Full water
The cost of acquiring the full amount of water required during a rest.

## Cost of Half water
The cost of acquiring half the amount of of water required during a rest.

## Automate food & water exhaustion
Enabling this makes it so that characters suffer exhaustion if they do not eat or drink enough. Requires [rest exhaustion automation](https://github.com/roth-michael/FoundryVTT-RestRecovery/wiki/long-rest-settings#enable-exhaustion-automation) to be enabled.

## Maximum days with no food
This configures how many days characters can survive without eating food before suffering from automatic exhaustion.

## Half water exhaustion DC
This configures the Constitution saving throw DC that characters must make if they drink only half of the required amount of water.

## Prompt food & water consumption on new day
If enabled, food & water consumption will be requested only when a rest results in a "new day", regardless of whether it is short or long.