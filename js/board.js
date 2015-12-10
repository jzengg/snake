(function() {

  if (typeof window.SnakeGame === "undefined") {
    window.SnakeGame = {};
  }

  var Board = window.SnakeGame.Board = function (multi) {
    this.snake = new window.SnakeGame.Snake();
    if (multi === true) {
      this.multi = true;
      this.snake2 = new window.SnakeGame.Snake(true);
    }
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

  Board.prototype.inSegments = function (head, otherSegments) {
    return otherSegments.some(function (segment) {
      return head.equals(segment);
    });
  };

  Board.prototype.findMultiWinner = function () {
      if (this.snake.isDead(this.snake.segments[0])) {
        this.winner = "orange snake";
      } else if (this.snake2.isDead(this.snake2.segments[0])) {
        this.winner = "grey snake";
      }
  };

  Board.prototype.snakeCollision = function () {
    if (this.multi) {
      head1 = this.snake.segments[0];
      segments1 = this.snake.segments;
      head2 = this.snake2.segments[0];
      segments2 = this.snake2.segments;
      if (this.inSegments(head1, segments2)) {
        this.winner = "Orange snake";
        return true;
      } else if (this.inSegments(head2, segments1)) {
        this.winner = "Grey Snake";
        return true;
      } else {
        return false;
      }

    } else {
      return false;

    }
  };

  Board.prototype.inRange = function (coord) {
    return [coord.row, coord.col].every(function (coord) {
      return coord < 20 && coord >= 0;
    });
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
