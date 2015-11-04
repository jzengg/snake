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

  var Snake = window.SnakeGame.Snake = function () {
    this.segments = [new Coord([10, 10])];
    this.dir = "X";
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
    if (this.dir !== "X") {
        var oldSegment = this.segments.pop();
        var changeCoord = new Coord(Snake.DIRECTIONS[this.dir]);

      if (this.segments.length === 0) {
        var newSegment = oldSegment.plus(changeCoord);
      }
      else {
        var newSegment = this.segments[0].plus(changeCoord);
      }
      this.segments.unshift(newSegment);
    }
  };

  Snake.prototype.turn = function (newDir) {
    this.dir = newDir;
  };

  Snake.prototype.grow = function () {
    var lastSegment = this.segments.slice(-1)[0];
    var newDir = Snake.DIRECTIONS[Snake.OPPOSITES[this.dir]];
    var newCoord = new Coord(newDir);
    var newSegment = lastSegment.plus(newCoord);
    this.segments.push(newSegment);
  };

}) ();
