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

  Board.prototype.emptySquares = function () {
    var segments = this.snake.segments;
    if (this.multi) {
      segments.concat(this.snake2.segments);
    }
    var empty = [];
    for (i = 0; i < 20; i++) {
      for (j = 0; j < 20; j++) {
        var square = [i, j];
          if (!this.snake.isSegmentsOnSquare(square, segments)) {
            empty.push([i, j]);
          }
        }
      }
      return empty;
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
        this.winner = "Orange snake";
      } else if (this.snake2.isDead(this.snake2.segments[0])) {
        this.winner = "Grey snake";
      }
  };

  Board.OPPOSITES = {
    "N": "S",
    "S": "N",
    "E": "W",
    "W" : "E"
  };

  Board.prototype.headOnCollision = function () {
    return Board.OPPOSITES[this.snake.dir] == this.snake2.dir;
  };

  Board.prototype.snakeCollision = function () {
    if (this.multi) {
      head1 = this.snake.segments[0];
      segments1 = this.snake.segments;
      head2 = this.snake2.segments[0];
      segments2 = this.snake2.segments;

      if (this.inSegments(head1, segments2)) {
        if (this.headOnCollision()) {
          this.headon = true;
          this.winner = "Head-on collision <br/> No one";
        } else {
          this.winner = "Orange snake";

        }
        return true;
      } else if (this.inSegments(head2, segments1)) {
        if (this.headOnCollision()) {
          this.headon = true;
          this.winner = "Head-on collision. No one";
        } else {
          this.winner = "Grey Snake";

        }
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

})();
