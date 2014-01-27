/*!
 * gamepad-dualshock.js v2.0.0 beta
 * (c) 2014, Benoit Asselin contact(at)ab-d.fr
 * MIT Licence
 */

ig.module(
	'plugins.gamepad-dualshock'
)
.defines(function() { "use strict";

ig.DUALSHOCK_KEY = {
	'UP': 10,
	'RIGHT': 11,
	'DOWN': 12,
	'LEFT': 13,
	'TRIANGLE': 20,
	'CIRCLE': 21,
	'CROSS': 22,
	'SQUARE': 23,
	'L1': 30,
	'L2': 31,
	'R1': 32,
	'R2': 33,
	'SELECT': 40, // DS3
	'START': 41, // DS3
	'SHARE': 40, // DS4
	'OPTIONS': 41, // DS4
	'PS': 42,
	'TOUCHPAD': 43, // DS4
	// Left stick
	'L3': 50,
	'LS_LEFT': 51,
	'LS_RIGHT': 52,
	'LS_UP': 53,
	'LS_DOWN': 54,
	// Right stick
	'R3': 60,
	'RS_LEFT': 61,
	'RS_RIGHT': 62,
	'RS_UP': 63,
	'RS_DOWN': 64
};



// Test: http://luser.github.io/gamepadtest/
ig._DUALSHOCK_BUTTONS_IDX = {
	//	buttons.index : number.key
	'DS3': {
		 '4':10,  '5':11,  '6':12,  '7':13,
		'12':20, '13':21, '14':22, '15':23,
		'10':30,  '8':31, '11':32,  '9':33,
		 '0':40,  '3':41, '16':42,
		 '1':50/*, '51':51, '52':52, '53':53, '54':54*/,
		 '2':60/*, '61':61, '62':62, '63':63, '64':64*/
	},
	'wkDS3': { // webkit
		'12':10, '15':11, '13':12, '14':13,
		 '3':20,  '1':21,  '0':22,  '2':23,
		 '4':30,  '6':31,  '5':32,  '7':33,
		 '8':40,  '9':41, '16':42,
		'10':50/*, '51':51, '52':52, '53':53, '54':54*/,
		'11':60/*, '61':61, '62':62, '63':63, '64':64*/
	},
	'DS3mj': {
		/*'':10,   '':11,   '':12,   '':13,*/
		 '0':20,  '1':21,  '2':22,  '3':23,
		 '4':30,  '6':31,  '5':32,  '7':33,
		 '8':40,  '9':41, '12':42,
		'10':50/*, '51':51, '52':52, '53':53, '54':54*/,
		'11':60/*, '61':61, '62':62, '63':63, '64':64*/
	},
	'DS4': {
		/*'':10,   '':11,   '':12,   '':13,*/
		 '3':20,  '2':21,  '1':22,  '0':23,
		 '4':30,  '6':31,  '5':32,  '7':33,
		 '8':40,  '9':41, '12':42, '13':43,
		'10':50/*, '51':51, '52':52, '53':53, '54':54*/,
		'11':60/*, '61':61, '62':62, '63':63, '64':64*/
	},
	'wkDS4': { // webkit === DS4
		 '3':20,  '2':21,  '1':22,  '0':23,
		 '4':30,  '6':31,  '5':32,  '7':33,
		 '8':40,  '9':41, '12':42, '13':43,
		'10':50/*, '51':51, '52':52, '53':53, '54':54*/,
		'11':60/*, '61':61, '62':62, '63':63, '64':64*/
	}
};
ig._DUALSHOCK_AXES_IDX = {
	/*'base': {
		'0':0, '1':1,
		'2':2, '3':3,
		'4':4, '5':5 // DS4 D-Pad
	},*/
	'DS3': { },
	'wkDS3': { }, // webkit
	'DS3mj': { },
	'DS4': {
		/*'0':0,  '1':1,*/
		/*'2':2,*/'5':3,
		  '6':4,  '7':5
	},
	'wkDS4': { // webkit === DS4
		/*'0':0,  '1':1,*/
		/*'2':2,*/'5':3,
		  '6':4,  '7':5
	}
};

// Gamepad activation
window.addEventListener('gamepadconnected', function(e) {
	ig.log( e.gamepad );
});
window.addEventListener('gamepaddisconnected', function(e) {
	ig.log( e.gamepad );
});

ig.GamepadDualshock = ig.Class.extend({
	axisLimit: 0.5,
	support: false,
	mappings: {},
	index: 0, // gamepad.index
	controller: false, // The gamepad
	version: 0, // DualShock 3 or 4
	prefix: 'DS3', // ig._DUALSHOCK_BUTTONS_IDX
	suffix: '',
	keyDSx: '', // prefix + version + suffix
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
	
	setController: function() {
		this.controller = false;
		this.prefix = 'DS';
		
		var controllers = false;
		if( navigator.getGamepads ) {
			controllers = navigator.getGamepads();
		} else if( navigator.webkitGetGamepads ) {
			controllers = navigator.webkitGetGamepads();
			this.prefix = 'wk' + this.prefix;
		} else if( navigator.mozGetGamepads ) {
			controllers = navigator.mozGetGamepads();
		}
		// ig.log( 'controllers', controllers ) ;
		if( controllers && controllers[this.index] ) {
			this.controller = controllers[this.index];
			if( !this.version ) {
				this.findVersion();
			}
			this.keyDSx = this.prefix + ( this.version ? this.version : '3' ) + this.suffix;
		}
		return this.controller;
	},
	
	findVersion: function() {
		var id = this.controller.id;
		// DS3
		if( -1 !== id.indexOf('PLAYSTATION(3) Controller') ) {
			this.version = 3;
			this.suffix = '';
		}
		else if( -1 !== id.indexOf('MotioninJoy Virtual Game Controller') ) {
			// http://www.ps3news.com/PlayStation-3/ps3-dualshock-3sixaxis-x64-windows-7-drivers-now-available/
			this.version = 3;
			this.suffix = 'mj';
		}
		// DS4
		else if( -1 !== id.indexOf('Wireless Controller') ) {
			this.version = 4;
			this.suffix = '';
		}
		ig.log( this.prefix, this.version, this.suffix, id );
	},
	
	getName: function() {
		if( !this.controller ) {
			this.setController();
		}
		if( this.controller ) {
			return this.controller.id;
		}
		return '';
	},
	
	getButtonsPressed: function() {
		this.setController();
		var buttonsPressed = {};
		if( this.controller ) {
			for( var i = 0; i < this.controller.buttons.length; i++ ) {
				var i2 = ig._DUALSHOCK_BUTTONS_IDX[this.keyDSx][i];
				if( 'undefined' === typeof i2 ) { continue; }
				var val = this.controller.buttons[i];
				var pressed = ( 1.0 == val );
				if( 'object' === typeof val ) {
					pressed = val.pressed;
					val = val.value;
				}
				buttonsPressed[i2] = pressed;
			}
			for( var i = 0; i < this.controller.axes.length; i++ ) {
				var i2 = ig._DUALSHOCK_AXES_IDX[this.keyDSx][i];
				if( 'undefined' === typeof i2 ) { i2 = i; }
				var val = this.controller.axes[i].toFixed(4);
				var pressed = ( Math.abs(val) > this.axisLimit );
				var positif = ( val > 0 );
				
				// Left stick
				if( 0 == i2 ) {
					buttonsPressed[ig.DUALSHOCK_KEY.LS_LEFT] = ( pressed && !positif );
					buttonsPressed[ig.DUALSHOCK_KEY.LS_RIGHT] = ( pressed && positif );
					
				} else if( 1 == i2 ) {
					
					buttonsPressed[ig.DUALSHOCK_KEY.LS_UP] = ( pressed && !positif );
					buttonsPressed[ig.DUALSHOCK_KEY.LS_DOWN] = ( pressed && positif );
				}
				// Right stick
				else if( 2 == i2 ) {
					buttonsPressed[ig.DUALSHOCK_KEY.RS_LEFT] = ( pressed && !positif );
					buttonsPressed[ig.DUALSHOCK_KEY.RS_RIGHT] = ( pressed && positif );
				} else if( 3 == i2 ) {
					buttonsPressed[ig.DUALSHOCK_KEY.RS_UP] = ( pressed && !positif );
					buttonsPressed[ig.DUALSHOCK_KEY.RS_DOWN] = ( pressed && positif );
				}
				
				// D-Pad like stick
				if( 4 == this.version ) {
					if( 4 == i2 ) {
						buttonsPressed[ig.DUALSHOCK_KEY.LEFT] = ( pressed && !positif );
						buttonsPressed[ig.DUALSHOCK_KEY.RIGHT] = ( pressed && positif );
					} else if( 5 == i2 ) {
						buttonsPressed[ig.DUALSHOCK_KEY.UP] = ( pressed && !positif );
						buttonsPressed[ig.DUALSHOCK_KEY.DOWN] = ( pressed && positif );
					}
				}
			}
		}
		return buttonsPressed;
	},
	
	triggerKeyboard: function( key, down ) {
		var ev;
		if( document.createEvent ) {
			ev = document.createEvent('Event');
			ev.initEvent( (down ? 'keydown' : 'keyup'), true, false );
			ev.keyCode = key;
			document.dispatchEvent(ev);
		} else if( document.createEventObject ) { // MsIE
			ev = document.createEventObject();
			ev.keyCode = key;
			document.fireEvent( (down ? 'onkeydown' : 'onkeyup'), ev );
		}
		return ev;
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
