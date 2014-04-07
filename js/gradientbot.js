function Ai() {
	//AI lookahead functionality is based on the Monotonic Bot which is currently hosted on Google Drive.
	
    this.init = function() {
        // This method is called when AI is first initialized.
    }

    this.restart = function() {
        // This method is called when the game is reset.
    }
	
	var depth3mod;
	var depth4mod;
	var modnum;
	
	function lookahead(grid, depth) {
		modnum++;
		if (depth > 1 + (modnum % depth3mod == 0 || modnum % depth4mod < 2?1:0) + (modnum % depth4mod < 2?1:0)) {
			var val = 0;
			var empty = 0;
			for (var i = 0; i < 4; i++) {
				for (var j = 0; j < 4; j++) {
					if (grid.cells[i][j] != null) val += (2 * i + j) * grid.cells[i][j].value;
					else val += 60;
				}
			}
			return val;
		}
		var sum = 0;
		var moves = 0;
		var cells = grid.availableCells();
		for (var i = 0; i < cells.length; i++) {
			//console.log('a');
			var tile = new Tile(cells[i], 2);
			grid.insertTile(tile);
			var best = 0;
			for (var j = 0; j < 4; j++) {
				var next = grid.copy();
				if (next.move(j)) {
					var value = lookahead(next, depth + 1);
					if (value > best) best = value;
				}
			}
			sum += 9 * best;
			moves += 9;
			//console.log('b');
			grid.cells[tile.x][tile.y].value = 4;
			//grid.removeTile(tile);
			//var tile2 = new Tile(cells[i], 4);
			//grid.insertTile(tile2);
			//console.log('c');
			best = 0;
			for (var j = 0; j < 4; j++) {
				var next = grid.copy();
				if (next.move(j)) {
					var value = lookahead(next, depth + 1);
					if (value > best) best = value;
				}
			}
			sum += best;
			moves++;
			grid.removeTile(tile);
			//console.log('d');
		}
		return 1.0 * sum / moves;
	}

    this.step = function(grid) {
        // This method is called on every update.
        // Return one of these integers to move tiles on the grid:
        // 0: up, 1: right, 2: down, 3: left

        // Parameter grid contains current state of the game as Tile objects stored in grid.cells.
        // Top left corner is at grid.cells[0][0], top right: grid.cells[3][0], bottom left: grid.cells[0][3], bottom right: grid.cells[3][3].
        // Tile objects have .value property which contains the value of the tile. If top left corner has tile with 2, grid.cells[0][0].value == 2.
        // Array will contain null if there is no tile in the slot (e.g. grid.cells[0][3] == null if bottom left corner doesn't have a tile).

        // Grid has 2 useful helper methods:
        // .copy()    - creates a copy of the grid and returns it.
        // .move(dir) - can be used to determine what is the next state of the grid going to be if moved to that direction.
        //              This changes the state of the grid object, so you should probably copy() the grid before using this.
        //              Naturally the modified state doesn't contain information about new tiles.
        //              Method returns true if you can move to that direction, false otherwise.

        // sample AI:
		var empty_squares = grid.availableCells().length;
		modnum = 0;
		depth3mod = 3 * empty_squares / 2 + 1;
		depth4mod = 3 * (empty_squares) * (empty_squares);
		var best = -1;
		var move = 0;
		for (var i = 0; i < 4; i++)	{
			var grid2 = grid.copy();
			if (!grid2.move(i)) continue;
			var val = lookahead(grid2, 1);
			if (val > best) {
				best = val;
				move = i;
			}
		}		
		//console.log(move);
        return move;
    }
}