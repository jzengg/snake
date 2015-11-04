(function() {

  if (typeof window.SnakeGame === "undefined") {
    window.SnakeGame = {};
  }

  var Board = window.SnakeGame.Board = function () {
    this.snake = new window.SnakeGame.Snake();
    this.grid = this.makeGrid(20);
  };

  Board.prototype.makeGrid = function (size) {
    var grid = [];
    for (var i = 0; i < size; i++) {
      grid.push([]);
      for (var j = 0; j < size; j++) {
        grid[i].push(null);
      }
    }

    return grid;
  };

  Board.prototype.render = function () {
    var res = [];
    for (var i = 0; i < this.grid.length; i++) {
      var row = "";
      for (var j = 0; j < this.grid[0].length; j++) {
        var coord = new window.SnakeGame.Coord([i,j]);
        var isSnake = this.snake.segments.some(function (pos) {
          return pos.equals(coord);
        });
        row += isSnake ? "s" : ".";
      }
      res.push(row);
    }
    return res.join("\n");
  };


})();
