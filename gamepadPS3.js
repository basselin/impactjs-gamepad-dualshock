/*

Using Sony Playstation(R)3 in ImpactJS

Description
	Use Sony Playstation(R)3 Wireless Controller in your ImpactJS game on your web browser.
	The plugin maps the buttons of the controller with the keyboard.

Compatibilities
	Google Chrome 21+, Mozilla Firefox 24+

Made by
	Benoit Asselin, contact(at)ab-d.fr



lib/game/main.js
	// ...
	.requires( ... , 'plugins.gamepadPS3' , ... )
	// ...
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
				.mapping( ig.PS3KEY.LEFT	, ig.KEY.LEFT_ARROW )
				.mapping( ig.PS3AXIS.L_LEFT	, ig.KEY.LEFT_ARROW )
				.mapping( ig.PS3KEY.RIGHT	, ig.KEY.RIGHT_ARROW )
				.mapping( ig.PS3AXIS.L_RIGHT	, ig.KEY.RIGHT_ARROW )
				.mapping( ig.PS3KEY.UP		, ig.KEY.UP_ARROW )
				.mapping( ig.PS3KEY.CROSS	, ig.KEY.UP_ARROW )
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



Documentation
	https://developer.mozilla.org/en-US/docs/Web/Guide/API/Gamepad
	http://luser.github.io/gamepadtest/

Note
	As of Firefox 24, the Gamepad API is available behind a preference.
	You can enable it by loading about:config and setting the dom.gamepad.enabled preference to true.

*/

ig.module(
	'plugins.gamepadPS3'
)
.defines(function() { "use strict";

// Gamepad activation
window.addEventListener('gamepadconnected', function(e) {
	ig.log( e.gamepad );
});
window.addEventListener('gamepaddisconnected', function(e) {
  	ig.log( e.gamepad );
});

if( navigator.webkitGetGamepads ) {
	ig.PS3KEY = {
		'UP': 12,
		'RIGHT': 15,
		'DOWN': 13,
		'LEFT': 14,
		'TRIANGLE': 3,
		'CIRCLE': 1,
		'CROSS': 0,
		'SQUARE': 2,
		'L1': 4,
		'L2': 6,
		'R1': 5,
		'R2': 7,
		'L3': 10,
		'R3': 11,
		'SELECT': 8,
		'START': 9,
		'HOME': 16
	};
} else {
	ig.PS3KEY = {
		'UP': 4,
		'RIGHT': 5,
		'DOWN': 6,
		'LEFT': 7,
		'TRIANGLE': 12,
		'CIRCLE': 13,
		'CROSS': 14,
		'SQUARE': 15,
		'L1': 10,
		'L2': 8,
		'R1': 11,
		'R2': 9,
		'L3': 1,
		'R3': 2,
		'SELECT': 0,
		'START': 3,
		'HOME': 16
	};
}

ig.PS3AXIS = {
	'L_LEFT': 101,
	'L_RIGHT': 102,
	'L_UP': 103,
	'L_DOWN': 104,
	'R_LEFT': 201,
	'R_RIGHT': 202,
	'R_UP': 203,
	'R_DOWN': 204
};

ig.GamepadPS3 = ig.Class.extend({
	axisLimit: 0.5,
	support: false,
	mappings: {},
	index: 0, // gamepad.index
	prevButtonsPressed: {},
	
	init: function( gamepadIndex ) {
		if( navigator.getGamepads || navigator.webkitGetGamepads || navigator.mozGetGamepads ) {
			this.support = true;
			if( gamepadIndex > 0 ) { this.index = gamepadIndex; }
		}
	},
	
	mapping: function( padkey, key ) {
		this.mappings[padkey] = key;
		return this;
	},
	
	getController: function() {
		var controllers = false;
		if( navigator.getGamepads ) {
			controllers = navigator.getGamepads();
		} else if( navigator.webkitGetGamepads ) {
			controllers = navigator.webkitGetGamepads();
		} else if( navigator.mozGetGamepads ) {
			controllers = navigator.mozGetGamepads();
		}
//		ig.log( 'controllers', controllers ) ;
		if( controllers && controllers[this.index] ) {
			return controllers[this.index];
		}
		return false;
	},
	
	getName: function() {
		var controller = this.getController();
		if( controller ) {
			return controller.id;
		}
		return '';
	},
	
	getButtonsPressed: function() {
		var controller = this.getController();
		var buttonsPressed = {};
		if( controller ) {
			for( var i = 0; i < controller.buttons.length; i++ ) {
				var val = controller.buttons[i];
				var pressed = 1.0 == val;
				if( 'object' === typeof val ) {
					pressed = val.pressed;
					val = val.value;
				}
				buttonsPressed[i] = pressed;
			}
			
			for( var i = 0; i < controller.axes.length; i++ ) {
				var val = controller.axes[i].toFixed(4);
				var pressed = ( Math.abs(val) > this.axisLimit );
				var positif = ( val > 0 );
				
				// Axis left
				if( 0 == i ) {
					buttonsPressed[ig.PS3AXIS.L_LEFT] = ( pressed && !positif );
					buttonsPressed[ig.PS3AXIS.L_RIGHT] = ( pressed && positif );
				} else if( 1 == i ) {
					buttonsPressed[ig.PS3AXIS.L_UP] = ( pressed && !positif );
					buttonsPressed[ig.PS3AXIS.L_DOWN] = ( pressed && positif );
				}
				// Axis right
				else if( 2 == i ) {
					buttonsPressed[ig.PS3AXIS.R_LEFT] = ( pressed && !positif );
					buttonsPressed[ig.PS3AXIS.R_RIGHT] = ( pressed && positif );
				} else if( 3 == i ) {
					buttonsPressed[ig.PS3AXIS.R_UP] = ( pressed && !positif );
					buttonsPressed[ig.PS3AXIS.R_DOWN] = ( pressed && positif );
				}
			}
		}
		return buttonsPressed;
	},
	
	triggerKeyboard: function( key, down ) {
		if( document.createEvent ) {
			var evObj = document.createEvent('Event');
			evObj.initEvent( (down ? 'keydown' : 'keyup'), true, false );
			evObj.keyCode = key;
			document.dispatchEvent(evObj);
		} else if( document.createEventObject ) { // MsIE
			var evObj = document.createEventObject();
			evObj.keyCode = key;
			document.fireEvent( (down ? 'onkeydown' : 'onkeyup'), evObj );
		}
	},
	
	update: function() {
		if( !this.support ) { return; }
		
		var buttonsPressed = this.getButtonsPressed();
		for( var padKey in this.mappings ) {
			if( buttonsPressed[padKey] != this.prevButtonsPressed[padKey] ) {
				this.triggerKeyboard( this.mappings[padKey] , buttonsPressed[padKey] );
			}
		}
		this.prevButtonsPressed = buttonsPressed;
	}
	
});

});
