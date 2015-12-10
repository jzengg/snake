(function() {

  if (typeof window.SnakeGame === "undefined") {
    window.SnakeGame = {};
  }

  var Coord = window.SnakeGame.Coord = function (arr) {
    this.row = arr[0];
    this.col = arr[1];
  };

  Coord.prototype.plus = function (otherCord) {
    var newRow = this.row + otherCord.row;
    var newCol = this.col + otherCord.col;
    return new Coord([newRow, newCol]);
  };

  Coord.prototype.equals = function (otherCoord) {
    return (this.row === otherCoord.row) && (this.col === otherCoord.col);
  };

  Coord.prototype.isOpposite = function (otherCoord) {
  };

  var Snake = window.SnakeGame.Snake = function (multi) {
    if (multi === true) {
      this.segments = [new Coord([5, 5])];
    } else {
      this.segments = [new Coord([15, 15])];
    }
    this.dir = "X";
    this.alreadyTurned = false;
  };

  Snake.DIRECTIONS = {
    "N": [-1, 0],
    "S": [1, 0],
    "E": [0, 1],
    "W": [0, -1],
  };

  Snake.OPPOSITES = {
    "N": "S",
    "S": "N",
    "E": "W",
    "W" : "E"
  };

  Snake.prototype.move = function () {
    var oldSegment, newSegment, changeCoord;
    if (this.dir !== "X") {
        oldSegment = this.segments.pop();
        changeCoord = new Coord(Snake.DIRECTIONS[this.dir]);

      if (this.segments.length === 0) {
        newSegment = oldSegment.plus(changeCoord);
      }
      else {
       newSegment = this.segments[0].plus(changeCoord);
      }
      this.segments.unshift(newSegment);
    }
  };

  Snake.prototype.snakeCollision = function () {
    if (this.segments.length === 1) {
      return false;
    } else {
      return this.segments.slice(1).some(function (segment) {
        return this.segments[0].equals(segment);
      }.bind(this));

    }
  };


  Snake.prototype.isDead = function (head) {
    return (
      !window.SnakeGame.Board.prototype.inRange(head) ||
      this.snakeCollision()
    );
  };

  Snake.prototype.turn = function (newDir) {
    if (!this.isDead(this.segments[0]) && !this.alreadyTurned && Snake.OPPOSITES[this.dir] !== newDir) {
      this.dir = newDir;
      this.alreadyTurned = true;

    }
  };

  Snake.prototype.grow = function () {
    var lastSegment = this.segments.slice(-1)[0];
    var newDir = Snake.DIRECTIONS[Snake.OPPOSITES[this.dir]];
    var newCoord = new Coord(newDir);
    var newSegment = lastSegment.plus(newCoord);
    this.segments.push(newSegment);
  };

}) ();
