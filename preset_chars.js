function Entity() {
	this.initmod = 0;
	this.status_effects = new Array;
	this.init = null;
	this.align = "enemy";
	this.icon = "red_skull.gif";
	this.name = "";
	this.displayname = "";
	this.index = 1;
	this.ready = 0;
	this.delay = 0;
	this.tiebreaker = 0;
	this.goneyet = 0;
	this.setinit = 0;
}

Entity.prototype.clone = function(cloneme) {
	this.initmod = cloneme.initmod;
	this.align = cloneme.align;
	this.icon = cloneme.icon;
	this.name = cloneme.name;
	this.index = cloneme.index;
	this.displayname = cloneme.displayname;
	this.tiebreaker = cloneme.initmod;
	this.goneyet = cloneme.goneyet;
}

let presets = {};

presets.Party = {};
presets.Party.icon = "300.gif";

let Party = []
Party[0] = new Entity;
Party[0].name = 'Skar';
Party[0].initmod = 0;
Party[0].align = 'friendly';
Party[0].icon = 'fist.gif';

Party[1] = new Entity;
Party[1].name = 'Gurlak';
Party[1].initmod = 3;
Party[1].align = 'friendly';
Party[1].icon = 'strength.gif';

Party[2] = new Entity;
Party[2].name = 'Squirrel';
Party[2].initmod = 3;
Party[2].align = 'friendly';
Party[2].icon = 'sekolahstooth.gif';

Party[3] = new Entity;
Party[3].name = 'Mote';
Party[3].initmod = 2;
Party[3].align = 'friendly';
Party[3].icon = 'orb.gif';

Party[4] = new Entity;
Party[4].name = 'Belsarin';
Party[4].initmod = 1;
Party[4].align = 'friendly';
Party[4].icon = 'blacksphere.gif';

presets.Party.data = Party;