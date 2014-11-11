function Simulation(mapSize) {
	this.map = new Map(mapSize);
	this.map.simulation = this;
	
	this.tickCount = 0;
	
	this.zombies = [];
	this.victims = [];
	this.hunters = [];
		
	this.initialise();
}

/**
 * Called to run a single tick on every agent in the simulation
 */
Simulation.prototype.tick = function() {
	var zombies = this.zombies;
	var victims = this.victims;
	var hunters = this.hunters;
	
	// Move all agents
	$.each(zombies, function(k, v) {
		v.move();
	});
	$.each(victims, function(k, v) {
		v.move();
	});
	$.each(hunters, function(k, v) {
		v.move();
	});
	// Attack with all agents
	
	$.each(hunters, function(k, v) {
		v.attack();
	});
	$.each(zombies, function(k, v) {
		v.attack();
	});
	
	this.tickCount++;	
}

/**
 * Initial seed of the agents
 */
Simulation.prototype.initialise = function() {
	// Seed zombies
	this.seed(Zombie, 50);
	this.seed(Victim, 50);
	this.seed(Hunter, 50);
}

/**
 * Goes through the entire map and seeds agentType randomly
 * until the specified amount is reached.
 */
Simulation.prototype.seed = function(agentType, amount) {
	var map = this.map;
	var mapSize = map.mapSize;

	var x = 0;
	var y = 0;
	var location = null;
	
	while (amount > 0) {
		x = Math.floor(Math.random() * mapSize);
		y = Math.floor(Math.random() * mapSize);
		
		location = map.get(x, y);
		if (location == null || location.length == 0) {
			var agent = new agentType();
			agent.simulation = this;
			
			this.spawnAgent(x, y, agent);
			amount--;
		}
	}
}

/** 
 * Spawns a single agent at a specified location on the map
 */
Simulation.prototype.spawnAgent = function(x, y, agent) {
	this.map.put(x, y, agent);
	
	switch(agent.type) {
		case 'zombie':
			this.zombies.push(agent);
			break;
		case 'victim':
			this.victims.push(agent);
			break;
		case 'hunter':
			this.hunters.push(agent);
			break;
	}
}

/**
 * Removes an agent from it's current position on the map, 
 * and places it at a new location
 */
Simulation.prototype.move = function(x, y, agent) {
	this.map.remove(agent.x, agent.y, agent);
	this.map.put(x, y, agent);
}

/**
 * Removes an agent from the simulation and map
 * e.g. if the agent was killed
 */
Simulation.prototype.remove = function(agent) {
	// Remove from the appropriate list in the simulation
	switch (agent.type) {
		case 'victim':
			var victims = this.victims;
			var index = $.inArray(agent, victims);
			if (index > -1) {
				// Create a new zombie!
				var zombie = new Zombie();
				zombie.simulation = this;
				
				this.spawnAgent(agent.x, agent.y, zombie);
				// Remove the victim
				victims.splice(index, 1);
			}
			break;
		case 'hunter':
			var hunters = this.hunters;
			var index = $.inArray(agent, hunters);
			if (index > -1) {
				// Create a new zombie!
				var zombie = new Zombie();
				zombie.simulation = this;
				
				this.spawnAgent(agent.x, agent.y, zombie);
				// Remove the hunter
				hunters.splice(index, 1);
			}
			break;
		case 'zombie':
			var zombies = this.zombies;
			var index = $.inArray(agent, zombie);
			if (index > -1) {
				zombies.splice(index, 1);
			}
			break;
	}
	
	// Remove from the actual map
	this.map.remove(agent.x, agent.y, agent);
}
/**
 * Checks a grid location for a type of agent.
 * Returns an array of all agents found, or an empty array if none found.
 */
Simulation.prototype.checkFor = function(x, y, agentType) {
	var currentLocation = this.map.get(x, y);
		
	var agents = [];
	if (!(currentLocation === undefined || currentLocation === null)) {
		for (var i = 0; i < currentLocation.length; i++) {
			if (currentLocation[i] instanceof agentType) {
				agents.push(currentLocation[i]);
			}
		}
	}
	
	return agents;
}
