// # Requires AIR.Aliases.js

// Aliases

var ART = {}, AIR = air;

var Application = AIR.NativeApplication.nativeApplication;

// Expose Class mutator, transforms a method in a property.

Class.Mutators.Exposes = function(instance, properties){
	
	$splat(properties).each(function(name){
		var accessor = instance[name];
		delete instance[name];
		instance.__defineGetter__(name, accessor);
		instance.__defineSetter__(name, accessor);
	});
	
};

// ART Menu for AIR

ART.Menu = new Class({
	
	Implements: Options,
	
	options: {
		_menu: null
	},
	
	initialize: function(name, options){
		this.setOptions(options);
		this.menu = this.options._menu || new AIR.NativeMenu();
		this.name = name;
		
		this.items = {};
	},
	
	addItem: function(item){
		this.items[item.name] = item;
		this.menu.addItem(item.item);
		return this;
	},
	
	addItems: function(){
		$A(arguments).flatten().each(this.addItem, this);
		return this;
	},
	
	addMenu: function(menu){
		this.menu.addSubmenu(menu.menu, menu.name);
		return this;
	},
	
	attachTo: function(menu){
		menu.menu.addSubMenu(this.menu, this.name);
		return this;
	},
	
	display: function(pos){
		var activeWindow = Application.activeWindow;
		if (activeWindow) this.menu.display(activeWindow.stage, pos.x, pos.y);
		return this;
	},
	
	clone: function(){
		return new ART.Menu(this.name, $extend(this.options, {_menu: this.menu}));
	}
	
});

// ART Menu Item for AIR

ART.Menu.Item = new Class({
	
	Exposes: ['checked', 'disabled', 'shortcut'],
	
	Implements: [Events, Options],
	
	options: {
		checked: undefined,
		disabled: undefined,
		shortcut: undefined,
		_item: null
	},
	
	initialize: function(name, options){
		
		this.name = name;
		
		this.setOptions(options);
		
		if (this.options._item){
			this.item = this.options._item;
		} else {
			this.item = new AIR.NativeMenuItem(name);

			this.item.addEventListener('select', function(){
				this.fireEvent('onSelect', this);
			}.bind(this));
			
			this.checked = this.options.checked;
			this.disabled = this.options.disabled;
			this.shortcut = this.options.shortcut;
		}
	},
	
	attachTo: function(menu){
		menu.addItem(this);
		return this;
	},
	
	clone: function(){
		return new ART.Menu.Item(this.name, $extend(this.options, {_item: this.item}));
	},
	
	// Exposed class properties
	
	shortcut: function(shortcut){
		if (shortcut === undefined) return this._shortcut;
		var keys = shortcut.split('+');
		this.item.keyEquivalent = keys.pop();
		var modifiers = [];
		keys.each(function(key){
			modifiers.push(AIR.Keyboard[key.toUpperCase()]);
		});
		this.item.keyEquivalentModifiers = modifiers;
		return this._shortcut = shortcut;
	},
	
	checked: function(value){
		return (value !== undefined) ? this.item.checked = value : this.item.checked;
	},
	
	disabled: function(value){
		return (value !== undefined) ? this.item.disabled = value : this.item.disabled;
	}
	
});

ART.HTML = {};

// ART Window for AIR

ART.HTML.Window = new Class({

	Implements: [Events, Options],
	
	initialize: function(){
		
	}

});