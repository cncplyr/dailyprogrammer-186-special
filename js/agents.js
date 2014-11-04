function Agent() {
	this.type = 'agent';
	this.x = -1;
	this.y = -1;
	this.simulation = null;
}
Agent.prototype.tick = function() { }
Agent.prototype.move = function() { }
Agent.prototype.attack = function() { }

function Zombie() {
	Agent.call(this)
	
	this.type = 'zombie';
}
Zombie.prototype = new Agent();
Zombie.prototype.constructor = Zombie;
Zombie.prototype.move = function() {
	var map = this.simulation.map;
	
	// Choose a random direction to walk in
	var direction = Math.floor(Math.random() * 5) - 1;
	var x = this.x;
	var y = this.y;
	
	switch (direction) {
		case 0:
			y = map.getSafeCoord(y-1);
			break;
		case 1:
			x = map.getSafeCoord(x+1);
			break;
		case 2:
			y = map.getSafeCoord(y+1);
			break;
		case 3:
			x = map.getSafeCoord(x-1);
			break;
		default:
			break;
	}
	
	// Check if there is something at our destination
	var agents = this.simulation.checkFor(x, y, Agent);
	
	// Nothing there, let's move there
	if (agents.length == 0) {
		this.simulation.move(x, y, this);
	}
	
}
Zombie.prototype.attack = function() {
	var simulation = this.simulation;
	var map = this.simulation.map;

	var x = this.x;
	var y = this.y;
	
	var directions = [
		{x: map.getSafeCoord(x-1), y: y},	// North
		{x: x, y: map.getSafeCoord(y+1)},	// East
		{x: map.getSafeCoord(x+1), y: y},	// South
		{x: x, y: map.getSafeCoord(y-1)}	// West
	];
	
	$.each(directions, function(k, direction) {
		var agents = simulation.checkFor(direction.x, direction.y, Agent);
		if (agents.length > 0) {
			if (agents[0].type !== 'zombie') {
				simulation.remove(agents[0]);
				return false; // break out of jquery each loop
			}
		}	
	});
}

function Victim() {
	Agent.call(this);
	
	this.type = 'victim';
}
Victim.prototype = new Agent();
Victim.prototype.constructor = Victim;
Victim.prototype.move = function() {

}
Victim.prototype.attack = function() { }

function Hunter() {
	Agent.call(this);
	
	this.type = 'hunter';
}
Hunter.prototype = new Agent();
Hunter.prototype.constructur = Hunter;
Hunter.prototype.move = function() {

}
Hunter.prototype.attack = function() {

}