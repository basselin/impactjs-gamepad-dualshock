Using Sony Playstation(R)3 in ImpactJS
====================================== 

Use Sony Playstation(R)3 Wireless Controller in your ImpactJS game on your web browser. The plugin maps the buttons of the controller with the keyboard.

*Compatibilities: Google Chrome 21+, Mozilla Firefox 24+*

Usage
-----
Copy **gamepadPS3.js** to your **lib/plugins/** directory.

Edit **lib/game/main.js** :
```
ig.module( 
	'game.main'
)
.requires(
	//... ,
	'plugins.gamepadPS3',
	// ...
)
.defines(function(){

	MyGame = ig.Game.extend({
		// ...
		gamepad: new ig.GamepadPS3(),
		// ...
		init: function() {
			// ...
			ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
			ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
			ig.input.bind( ig.KEY.UP_ARROW, 'jump' );
		
			this.gamepad
				.mapping( ig.PS3KEY.LEFT		, ig.KEY.LEFT_ARROW )
				.mapping( ig.PS3AXIS.L_LEFT		, ig.KEY.LEFT_ARROW )
				.mapping( ig.PS3KEY.RIGHT		, ig.KEY.RIGHT_ARROW )
				.mapping( ig.PS3AXIS.L_RIGHT	, ig.KEY.RIGHT_ARROW )
				.mapping( ig.PS3KEY.UP			, ig.KEY.UP_ARROW )
				.mapping( ig.PS3KEY.CROSS		, ig.KEY.UP_ARROW )
				;
			// ...
		},
		update: function() {
			this.gamepad.update();
		
			// ...
			this.parent();
		},
		// ...
	});
});
```

Documentation
-------------
* https://developer.mozilla.org/en-US/docs/Web/Guide/API/Gamepad
* http://luser.github.io/gamepadtest/

Note: As of Firefox 24, the Gamepad API is available behind a preference. You can enable it by loading **about:config** and setting the **dom.gamepad.enabled** preference to **true**.

