// function to allocate the space for the two-dimensional grid
createGrid = function(dimension) {
	var grid = new Array(dimension);

	for (var i = 0; i < dimension; i++) {
		grid[i] = new Array(dimension);
	}
	return grid;
}

// function that randomly seeds the grid with live cells to the
// specified fill percentage
randomSeedGrid = function(grid, dimension, fillPercent) {

	for (var i = 0; i < dimension; i++) {
		for (var j = 0; j < dimension; j++) {
			if (Math.random() > 1 - fillPercent) {
				grid[i][j] = 1;
			}
			else {
				grid[i][j] = 0;
			}
		}
	}

}

// function that clears the grid and sets the value of
// each cell to 0
clearGrid = function(grid, dimension) {

	for (var i = 0; i < dimension; i++) {
		for (var j = 0; j < dimension; j++) {
			grid[i][j] = 0;
		}
	}
}

// function that counts the number of neighboring cells that are live
getNumNeighbors = function(grid, row, column) {
	if (row == 0) {
		if (column == 0) {
			return grid[row][column+1] + grid[row+1][column+1] + grid[row+1][column];
		}
		else if (column == grid[0].length - 1) {
			return grid[row][column-1] + grid[row+1][column-1] + grid[row+1][column];
		}
		else {
			return grid[row][column-1] + grid[row+1][column-1] + grid[row+1][column] +
				grid[row+1][column+1] + grid[row][column+1];
		}
	}

	else if (row == grid.length - 1) {
		if (column == 0) {
			return grid[row-1][column] + grid[row-1][column+1] + grid[row][column+1];
		}
		else if (column == grid[0].length - 1) {
			return grid[row-1][column] + grid[row-1][column-1] + grid[row][column-1];
		}
		else {
			return grid[row][column-1] + grid[row][column+1] + grid[row-1][column-1] +
				grid[row-1][column] + grid[row-1][column+1];
		}
	}
	else if (column == 0) {
		return grid[row][column+1] + grid[row+1][column] + grid[row-1][column] +
			grid[row+1][column+1] + grid[row-1][column+1];
	}
	else if (column == grid[0].length - 1) {
		return grid[row][column-1] + grid[row+1][column-1] + grid[row+1][column] +
			grid[row-1][column] + grid[row-1][column-1];
	}
	else { 
		return grid[row][column+1] + grid[row][column-1] + grid[row+1][column] +
			grid[row-1][column] + grid[row-1][column-1] + grid[row-1][column+1] +
			grid[row+1][column+1] + grid[row+1][column-1];
	}

}

// function that generates a new grid based on mapping the rules of
// game of life to the current grid and returns the new grid
mapGOLrule = function(grid, dimension) {
	var result = createGrid(dimension);
	for (var i = 0; i < dimension; i++) {
		for (var j = 0; j < dimension; j++) {
			if (grid[i][j] == 1 && getNumNeighbors(grid, i, j) < 2) {
				result[i][j] = 0;
			}
			else if (grid[i][j] == 1 && getNumNeighbors(grid, i, j) <= 3) {
				result[i][j] = 1;
			}
			else if (grid[i][j] == 1 && getNumNeighbors(grid, i, j) > 3) {
				result[i][j] = 0;
			}
			else if (grid[i][j] == 0 && getNumNeighbors(grid, i, j) == 3) {
				result[i][j] = 1;
			}
			else {
				result[i][j] = 0;
			}
		}
	}
	return result;
}

// funciton that draws the grid lines to another canvas layer
drawGridLines = function(ctx, dimension, width, height) {

	var verticalLineSpacing = width/dimension;
	var horizontalLineSpacing = height/dimension;
	var currVerticalLinePos = 0;
	var currHorizontalLinePos = 0;

	for (var i = 0; i < dimension; i++) {
		ctx.moveTo(0, currHorizontalLinePos);
		ctx.lineTo(width, currHorizontalLinePos);
		ctx.strokeStyle="#DEDEDE";
		ctx.lineWidth=1;
		ctx.stroke();
		currHorizontalLinePos += horizontalLineSpacing;
	}

	for (var i = 0; i < dimension; i++) {
		ctx.moveTo(currVerticalLinePos, 0);
		ctx.lineTo(currVerticalLinePos, height);
		ctx.strokeStyle="#DEDEDE";
		ctx.lineWidth=1;
		ctx.stroke();
		currVerticalLinePos += verticalLineSpacing;
	}
}

// Constructor for Cell objects to hold data for all drawn cells
function Cell(x, y, w, h, fill) {

	this.x = x || 0;
	this.y = y || 0;
	this.w = w || 1;
	this.h = h || 1;
	this.fill = fill || "#000000";

}

// Draws the cell to a given context
Cell.prototype.draw = function(ctx) {
	ctx.fillStyle = this.fill;
	ctx.fillRect(this.x, this.y, this.w, this.h);
}

// function that draws rectangles to the canvas based on the current
// state of the grid (binary matrix)
// saves each rectangle in a 2D array of Cells so that the Cell objects
// can be manipulated later
updateRectangles = function(ctx, dimension, width, height, grid, cells) {
	
	var rectX = 0;
	var rectY = 0;
	var rectWidth = width/dimension;
	var rectHeight = height/dimension;
	for (var i = 0; i < dimension; i++) {
		for (var j = 0; j < dimension; j++) {
			if (grid[i][j] == 1) {
				cells[i][j] = new Cell(rectX, rectY, rectWidth, rectHeight, "#0000FF");
				cells[i][j].draw(ctx);
			}
			else {
				cells[i][j] = new Cell(rectX, rectY, rectWidth, rectHeight, "#FFFFFF");
				cells[i][j].draw(ctx);
			}
			rectX += rectWidth;
		}
		rectX = 0;
		rectY += rectHeight;
	}

}

window.onload = function() {
	
	var c = document.getElementById("GameGrid");
	var gl = document.getElementById("GridLines");
	var ctx = c.getContext("2d");
	var glctx = gl.getContext("2d");
	
	var width = c.width;
	var height = c.height;
	var dimension = 50;

	document.onclick = function(e) {
		var mouseX = e.clientX;
		var mouseY = e.clientY;
		alert(mouseX + " " + mouseY);
	};

	var grid = createGrid(dimension);
	var cells = createGrid(dimension);

	randomSeedGrid(grid, dimension, 0.50);
	drawGridLines(glctx, dimension, gl.width, gl.height);
	updateRectangles(ctx, dimension, width, height, grid, cells);
	
	// function to read keypresses from the user
	// if the user presses the right arrow key proceed to the next generation
	// if the user presses the 'c' key, clear the grid
	document.onkeydown = function(e) {

		switch (e.keyCode) {
			case 39:
				grid = mapGOLrule(grid, dimension);
				updateRectangles(ctx, dimension, width, height, grid, cells);
				break;
			case 67:
				clearGrid(grid, dimension);
				updateRectangles(ctx, dimension, width, height, grid, cells);
				break;
		}
	};
	
	var dragging = false;	

	// read mouseclicks
	// if the user clicks a cell, flip its bit value (switch on/off)
	document.onclick = function(e) {
		var mouseX = e.clientX;
		var mouseY = e.clientY;
		for (var i = 0; i < cells.length; i++) {
			for (var j = 0; j < cells[i].length; j++) {
				var leftEdge = cells[i][j].x;
				var rightEdge = cells[i][j].x + cells[i][j].w;
				var topEdge = cells[i][j].y;
				var bottomEdge = cells[i][j].y + cells[i][j].h;

				if (mouseX > leftEdge && mouseX < rightEdge 
						&& mouseY > topEdge && mouseY < bottomEdge) {
					grid[i][j] = grid[i][j] == 1 ? 0 : 1; 
					updateRectangles(ctx, dimension, width, height, grid, cells)
				}	
			}
		}
	};
	
}
