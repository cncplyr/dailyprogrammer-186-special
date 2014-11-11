function Map(mapSize) {
	this.mapSize = mapSize;
	this.grid = this.makeGrid(mapSize);
	
	this.simulation = null;
}

Map.prototype.makeGrid = function(size) {
	array = [];
	for (var x = 0; x < size; x++) {
		array[x] = [];
		array[x][size-1] = null;
	}
	return array;
}

Map.prototype.put = function(x, y, obj) {
	var grid = this.grid;
	
	var posX = this.getSafeCoord(x);
	var posY = this.getSafeCoord(y);
	
	// No array at location, create one
	if (grid[posX][posY] == null) {
		grid[posX][posY] = [obj];
		
		obj.x = posX;
		obj.y = posY;
	} else {
		// Check if object already exists at that location
		if ($.inArray(obj, grid[posX][posY]) === -1) {
			grid[posX][posY].push(obj);

			obj.x = posX;
			obj.y = posY;
		} else {
			console.log('Error: ' + obj + ' is already at that location!');
		}
	}
}

Map.prototype.remove = function(x, y, obj) {
	var currentLocation = this.grid[this.getSafeCoord(x)][this.getSafeCoord(y)];
	if (currentLocation instanceof Array) {
		var index = $.inArray(obj, currentLocation);
		if (index > -1) {
			currentLocation.splice(index, 1);
		}
	}
}

Map.prototype.get = function(x, y) {
	return this.grid[this.getSafeCoord(x)][this.getSafeCoord(y)];
}

// Returns 3x3 local area as a flat array, elems have x/y coords
Map.prototype.getLocalArea = function(xCoord, yCoord) {
	// TODO: Find a faster way to do this
	var localArea = [];
	for (var x = -1; x < 2; x++) {
		for (var y = -1; y < 2; y++) {
			var posX = this.getSafeCoord(xCoord + x);
			var posY = this.getSafeCoord(yCoord + y);
			
			localArea.push({
				x: posX,
				y: posY,
				agent: this.grid[posX][posY]
			});
		}
	}
	return localArea;
}

// Toroid
Map.prototype.getSafeCoord = function(coord) {
	if (coord > 0) return coord % this.mapSize;
	return this.mapSize - Math.abs(-1 % this.mapSize)
}