# Utiliser les manettes Playstation DualShock 3 et/ou DualShock 4 avec ImpactJS

GamepadDualshock permet d'utiliser les manettes Sony Playstation DualShock 3 et/ou DualShock 4 dans les jeux ImpactJS avec les derniers navigateurs web (à l'exception de Microsoft Internet Explorer).
Le plugin permet de lier les boutons de la manette DS3 ou DS4 à une action.
Le plugin permet également de mapper les boutons de la Dualshock avec les touches du clavier.

*Testé avec ImpactJS version 1.23*

*Compatibilités: Mozilla Firefox 24+, Google Chrome 21+, Opera 15+*

## Utilisation

### Premier exemple
Copier **gamepad-dualshock.js** dans le dossier **lib/plugins/** de ImpactJS.

Editer **lib/game/main.js** :
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
			
			// METHOD #1: Lier les boutons de la Dualshock à une action
			this.gamepad
				.bind( ig.DUALSHOCK_KEY.LEFT		, 'left' )
				.bind( ig.DUALSHOCK_KEY.LS_LEFT		, 'left' )
				.bind( ig.DUALSHOCK_KEY.RIGHT		, 'right' )
				.bind( ig.DUALSHOCK_KEY.LS_RIGHT	, 'right' )
				.bind( ig.DUALSHOCK_KEY.CROSS		, 'jump' )
				;
			
			// OR
			// METHOD #2: Mapper les boutons de la Dualshock aux touches du clavier
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


### Utiliser les axes lorsqu'une entité ig.EntityWeapon est créée
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
* **ig.DUALSHOCK_KEY.** *(ex: `ig.DUALSHOCK_KEY.CROSS`)*
	* `UP`, `RIGHT`, `DOWN`, `LEFT`,
	* `TRIANGLE`, `CIRCLE`, `CROSS`, `SQUARE`,
	* `L1`, `L2`, `R1`, `R2`,
	* `SELECT` ou `SHARE`, `START` ou `OPTIONS`, *DS3* ou *DS4*
	* `PS`,
	* `TOUCHPAD`, *DS4 uniquement*
	* `L3`, `LS_LEFT`, `LS_RIGHT`, `LS_UP`, `LS_DOWN`, *Left stick*
	* `R3`, `RS_LEFT`, `RS_RIGHT`, `RS_UP`, `RS_DOWN`. *Right stick*
* **ig.DUALSHOCK_AXE.** *(ex: `ig.DUALSHOCK_AXE.RS_X`)*
	* `LS_X`, `LS_Y`,
	* `RS_X`, `RS_Y`,
	* `DPAD_X`, `DPAD_Y`, *DS4 uniquement*
	* `L2`, `R2`. *DS4 uniquement*

### Propriétés
* **axePrecision**: `Number` *(`4` par défaut)* Nombre de chiffres après la virgule lors de l'utilisation des axes.
* **axeLimit**: `Number` *(`0.5` par défaut)* Seuil limite minimum indiquant que le bouton est pressé (selon un axe).
* **index**: `Number` *(`0` par défaut)* Index du gamepad.
* **controller**: `Gamepad` *(`false` par défaut)* Le plugin détecte automatiquement cette propriété.
* **version**: `Number` *(`0` par défaut)* Version de la manette Dualshock `3` ou `4`. Le plugin détecte automatiquement cette propriété.

### Méthodes
* **bind**: Lier un bouton de la manette Dualshock à une action.
	* *padKey*: `Number` Voir: `ig.DUALSHOCK_KEY.`.
	* *action*: `String` Nom de l'action. Voir: `ig.input.pressed( )`.
* **unbind**: Délier un bouton de la manette Dualshock à une action.
	* *padKey*: `Number` Voir: `ig.DUALSHOCK_KEY.`.
* **unbindAll**: Supprimer toutes les liaisons entre les boutons et les actions.
* **mapping**: Mapper un bouton de la manette Dualshock avec une touche du clavier.
	* *padKey*: `Number` Voir: `ig.DUALSHOCK_KEY.`.
	* *key*: `Number` Voir: `ig.KEY.`
* **unmapping** Supprimer le mapping entre un bouton de la manette Dualshock avec une touche du clavier.
	* *padKey*: `Number` Voir: `ig.DUALSHOCK_KEY.`.
* **unmappingAll** Supprimer tout le mappage entre les boutons de la manette Dualshock et les touches du clavier.
* **getAxeValue**: `Number` Retourner la valeur d'un axe.
	* *axe*: `Number` Voir: `ig.DUALSHOCK_AXE.`
* **getName**: Retourner le nom `id` du gamepad.


## Changelog

**Version 2.2.1**
* `FIXED`: Optimisation du code source.

**Version 2.2.0**
* `ADDED`: Méthode: `getAxeValue`.
* `ADDED`: `ig.Game` `update` automatiquement les gamepads.

**Version 2.1.0**
* `ADDED`: Méthodes: `bind`, `unbind`, `unbindAll`.
* `ADDED`: Méthodes: `unmapping`, `unmappingAll`.

**Version 2.0.0**
* `ADDED`: Multi-gamepad supportée.
* `ADDED`: Support de la manette Playstation Dualshock 4.
* `FIXED`: Support du navigateur Opera.

**Version 1.0.0**
* `ADDED`: Support des navigateurs Mozilla Firefox et Google Chrome.
* `ADDED`: Support de la manette Playstation Dualshock 3.



## Ressources
* https://developer.mozilla.org/en-US/docs/Web/Guide/API/Gamepad
* http://luser.github.io/gamepadtest/

Remarque: Depuis Mozilla Firefox 24, l'API Gamepad est disponible à partir des préférences.
Pour l'activer, vous devez vous rendre sur la page **about:config** puis passer le paramètre **dom.gamepad.enabled** à **true**.


