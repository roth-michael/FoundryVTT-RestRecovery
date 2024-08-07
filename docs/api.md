# Important note

All of the functions below should be preceded with `game.restrecovery`, see the examples below.

# Examples:

### Make actor sated of both food and water for the day
```js
const actorD = game.actors.getName("Murderhobo McStabby");
await game.restrecovery.setActorConsumableValues(actorD, { food: 1, water: 1 });
```

### Change the module profile to another one.
```js
await game.restrecovery.setActiveProfile("Desert");
```
This is just an example, you would have to set up a module profile yourself.

This "Desert" module profile could for example set a higher water consumption per day, and limit short rests to 2 per long rest.

# Functions

<dl>
<dt><a href="#getAllProfiles">getAllProfiles()</a> ⇒ <code>Array.&lt;string&gt;</code></dt>
<dd><p>Returns an array containing all the module profile names</p>
</dd>
<dt><a href="#getAllProfilesData">getAllProfilesData()</a> ⇒ <code>object</code></dt>
<dd><p>Returns the module profile object with each ones&#39; settings</p>
</dd>
<dt><a href="#getProfileData">getProfileData(inProfileName)</a> ⇒ <code>object</code></dt>
<dd><p>Returns a given module profile&#39;s data if it exists</p>
</dd>
<dt><a href="#getActiveProfile">getActiveProfile()</a> ⇒ <code>string</code></dt>
<dd><p>Returns the name of the active module profile</p>
</dd>
<dt><a href="#getActiveProfileData">getActiveProfileData()</a> ⇒ <code>object</code></dt>
<dd><p>Returns the data for the active module profile</p>
</dd>
<dt><a href="#setActiveProfile">setActiveProfile(inProfileName)</a> ⇒ <code>Promise.&lt;object&gt;</code></dt>
<dd><p>Sets the current active module profile</p>
</dd>
<dt><a href="#updateProfiles">updateProfiles(inProfiles)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd><p>Updates all module profiles with new settings.  This may be a partial update (such as only updating some keys of some profiles).</p>
</dd>
<dt><a href="#updateProfile">updateProfile(inProfileName, inData)</a> ⇒ <code>Promise.&lt;*&gt;</code></dt>
<dd><p>Applies new settings on a given module profile. This may be a partial update (such as only updating one key of a given profile).</p>
</dd>
<dt><a href="#setActorConsumableValues">setActorConsumableValues(actor, [food], [water], [starvation])</a> ⇒ <code>Promise.&lt;boolean&gt;</code></dt>
<dd><p>Sets the food, water, and/or starvation levels of a given actor.</p>
</dd>
<dt><a href="#getActorConsumableUpdates">getActorConsumableUpdates(item, actor)</a> ⇒ <code>[Object, string] | []</code></dt>
<dd><p>Creates actorUpdate & message data as if the item were consumed by the actor. Does not consume uses of the item, update the actor, or create a message on its own.</p>
</dd>
</dl>

<a name="getAllProfiles"></a>

## getAllProfiles() ⇒ <code>Array.&lt;string&gt;</code>
Returns an array containing all the module profile names

<a name="getAllProfilesData"></a>

## getAllProfilesData() ⇒ <code>object</code>
Returns the module profile object with each ones' settings

<a name="getProfileData"></a>

## getProfileData(inProfileName) ⇒ <code>object</code>
Returns a given module profile's data if it exists


| Param | Type |
| --- | --- |
| inProfileName | <code>string</code> | 

<a name="getActiveProfile"></a>

## getActiveProfile() ⇒ <code>string</code>
Returns the name of the active module profile

<a name="getActiveProfileData"></a>

## getActiveProfileData() ⇒ <code>object</code>
Returns the data for the active module profile

<a name="setActiveProfile"></a>

## setActiveProfile(inProfileName) ⇒ <code>Promise.&lt;object&gt;</code>
Sets the current active module profile


| Param | Type |
| --- | --- |
| inProfileName | <code>string</code> | 

<a name="updateProfiles"></a>

## updateProfiles(inProfiles) ⇒ <code>Promise.&lt;\*&gt;</code>
Updates all module profiles with new settings.  This may be a partial update (such as only updating some keys of some profiles).


| Param | Type |
| --- | --- |
| inProfiles | <code>object</code> | 

<a name="updateProfile"></a>

## updateProfile(inProfileName, inData) ⇒ <code>Promise.&lt;\*&gt;</code>
Applies new settings on a given module profile. This may be a partial update (such as only updating one key of a given profile).


| Param | Type |
| --- | --- |
| inProfileName | <code>string</code> | 
| inData | <code>object</code> | 

<a name="setActorConsumableValues"></a>

## setActorConsumableValues(actor, [food], [water], [starvation]) ⇒ <code>Promise.&lt;boolean&gt;</code>
Sets the food, water, and/or starvation levels of a given actor.


| Param | Type | Description |
| --- | --- | --- |
| actor | <code>Actor</code> |  |
| [food] | <code>number</code> \ <code>null</code> | food |
| [water] | <code>number</code> \ <code>null</code> | water |
| [starvation] | <code>number</code> \ <code>null</code> | starvation |

<a name="getActorConsumableUpdates"></a>

## getActorConsumableUpdates(item, actor) ⇒ <code>[Object, string] | []</code>
Sets the food, water, and/or starvation levels of a given actor.


| Param | Type | Description |
| --- | --- | --- |
| item | <code>Item</code> | the item which would be consumed
| actor | <code>Actor</code> | the actor which would consume |

