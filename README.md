# Using Playstation DualShock 3 or DualShock 4 in ImpactJS

Use Sony Playstation DualShock 3 or DualShock 4 Wireless Controller in your ImpactJS game on your web browser.
The plugin binds the buttons of the DS3 or DS4 to an action.
The plugin can also map the buttons of the Dualshock with the keyboard.

*Tested on ImpactJS version 1.23*

*Compatibilities: Mozilla Firefox 24+, Google Chrome 21+, Opera 15+*

## Usage

### First example
Copy **gamepad-dualshock.js** to your **lib/plugins/** directory.

Edit **lib/game/main.js** :
```javascript
ig.module( 
	'game.main'
)
.requires(
	// ... ,
	'plugins.gamepad-dualshock',
	// ...
)
.defines(function(){
	
	MyGame = ig.Game.extend({
		// ...
		gamepad: new ig.GamepadDualshock(),
		// ...
		init: function() {
			// Basic method
			ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
			ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
			ig.input.bind( ig.KEY.UP_ARROW, 'jump' );
			
			// METHOD #1: Bind a Dualshock buttons to an action
			this.gamepad
				.bind( ig.DUALSHOCK_KEY.LEFT		, 'left' )
				.bind( ig.DUALSHOCK_KEY.LS_LEFT		, 'left' )
				.bind( ig.DUALSHOCK_KEY.RIGHT		, 'right' )
				.bind( ig.DUALSHOCK_KEY.LS_RIGHT	, 'right' )
				.bind( ig.DUALSHOCK_KEY.CROSS		, 'jump' )
				;
			
			// OR
			// METHOD #2: Mapping a Dualshock buttons to a keyboard
			this.gamepad
				.mapping( ig.DUALSHOCK_KEY.LEFT		, ig.KEY.LEFT_ARROW )
				.mapping( ig.DUALSHOCK_KEY.LS_LEFT	, ig.KEY.LEFT_ARROW )
				.mapping( ig.DUALSHOCK_KEY.RIGHT	, ig.KEY.RIGHT_ARROW )
				.mapping( ig.DUALSHOCK_KEY.LS_RIGHT	, ig.KEY.RIGHT_ARROW )
				.mapping( ig.DUALSHOCK_KEY.CROSS	, ig.KEY.UP_ARROW )
				;
			
			// ...
		},
		// ...
	});
	
});
```


### Using axes when an ig.EntityWeapon spawns
```javascript
	init: function( x, y, settings ) {
		// ...
		var padX = ig.game.gamepad.getAxeValue( ig.DUALSHOCK_AXE.RS_X ),
		    padY = ig.game.gamepad.getAxeValue( ig.DUALSHOCK_AXE.RS_Y );
		if( false !== padX && false !== padY ) {
			this.vel.x = this.maxVel.x * Number(padX);
			this.vel.y = this.maxVel.y * Number(padY);
		} else {
			// ...
		}
		// ...
	},
```


### Multiplayer / Multi-gamepad
```javascript
	player1gamepad: new ig.GamepadDualshock( 0 ),
	player2gamepad: new ig.GamepadDualshock( 1 ),
	player3gamepad: new ig.GamepadDualshock( 2 ),
	// ...
```

## Documentation

### Constantes
* **ig.DUALSHOCK_KEY.** *(eg: `ig.DUALSHOCK_KEY.CROSS`)*
	* `UP`, `RIGHT`, `DOWN`, `LEFT`,
	* `TRIANGLE`, `CIRCLE`, `CROSS`, `SQUARE`,
	* `L1`, `L2`, `R1`, `R2`,
	* `SELECT` or `SHARE`, `START` or `OPTIONS`, *DS3* or *DS4*
	* `PS`,
	* `TOUCHPAD`, *DS4 only*
	* `L3`, `LS_LEFT`, `LS_RIGHT`, `LS_UP`, `LS_DOWN`, *Left stick*
	* `R3`, `RS_LEFT`, `RS_RIGHT`, `RS_UP`, `RS_DOWN`. *Right stick*
* **ig.DUALSHOCK_AXE.** *(eg: `ig.DUALSHOCK_AXE.RS_X`)*
	* `LS_X`, `LS_Y`,
	* `RS_X`, `RS_Y`,
	* `DPAD_X`, `DPAD_Y`, *DS4 only*
	* `L2`, `R2`. *DS4 only*

### Properties
* **axePrecision**: `Number` *(`4` by default)* The number of digits to appear after the decimal point.
* **axeLimit**: `Number` *(`0.5` by default)* Value of the axe when the button is pressed.
* **index**: `Number` *(`0` by default)* Gamepad index.
* **controller**: `Gamepad` *(`false` by default)* The plugin detects automatically this property.
* **version**: `Number` *(`0` by default)* Dualshock version `3` or `4`. The plugin detects automatically this property.

### Methods
* **bind**: Bind the button of the Dualshock with an action.
	* *padKey*: `Number` See: `ig.DUALSHOCK_KEY.`.
	* *action*: `String` Action name. See: `ig.input.pressed( )`.
* **unbind**: Unbind the button of the Dualshock with an action.
	* *padKey*: `Number` See: `ig.DUALSHOCK_KEY.`.
* **unbindAll**: Remove all bindings.
* **mapping**: Mapping the button of the Dualshock with the keyboard.
	* *padKey*: `Number` See: `ig.DUALSHOCK_KEY.`.
	* *key*: `Number` See: `ig.KEY.`
* **unmapping** Remove the mapping button of the Dualshock with the keyboard.
	* *padKey*: `Number` See: `ig.DUALSHOCK_KEY.`.
* **unmappingAll** Remove all mappings.
* **getAxeValue**: Return the axe value.
	* *axe*: `Number` See: `ig.DUALSHOCK_AXE.`
* **getName**: Return the gamepad name's `id`.


## Changelog

**Version 2.2.1**
* `FIXED`: Optimization.

**Version 2.2**
* `ADDED`: Method: `getAxeValue`.
* `ADDED`: `ig.Game` automatically `update` the gamepads.

**Version 2.1**
* `ADDED`: Methods: `bind`, `unbind`, `unbindAll`.
* `ADDED`: Methods: `unmapping`, `unmappingAll`.

**Version 2.0**
* `ADDED`: Multi-gamepad supported.
* `ADDED`: Playstation Dualshock 4 supported.
* `FIXED`: Opera supported.

**Version 1.0**
* `ADDED`: Mozilla Firefox and Google Chrome supported.
* `ADDED`: Playstation Dualshock 3 supported.



## Ressources
* https://developer.mozilla.org/en-US/docs/Web/Guide/API/Gamepad
* http://luser.github.io/gamepadtest/

Note: As of Firefox 24, the Gamepad API is available behind a preference.
You can enable it by loading **about:config** and setting the **dom.gamepad.enabled** preference to **true**.


