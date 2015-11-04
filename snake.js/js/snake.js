(function() {

  if (typeof window.SnakeGame === "undefined") {
    window.SnakeGame = {};
  }

  var Coord = window.SnakeGame.Coord = function (arr) {
    this.xPos = arr[0];
    this.yPos = arr[1];
  };

  Coord.prototype.plus = function (otherCord) {
    this.xPos += otherCord.xPos;
    this.yPos += otherCord.yPos;
  };

  Coord.prototype.equals = function (otherCoord) {
    return (this.xPos === otherCoord.xPos) && (this.yPos === otherCoord.yPos);
  };

  Coord.prototype.isOpposite = function (otherCoord) {
  };

  var Snake = window.SnakeGame.Snake = function () {
    this.segments = [new Coord([10, 10])];
    this.dir = "X";
  };

  Snake.DIRECTIONS = {
    "X": [0, 0],
    "N": [-1, 0],
    "S": [1, 0],
    "E": [0, 1],
    "W": [0, -1],
  };

  Snake.prototype.move = function () {
    var changeCoord = new Coord(Snake.DIRECTIONS[this.dir]);
    this.segments.forEach(function (segment) {
      segment.plus(changeCoord);
    });
  };

  Snake.prototype.turn = function (newDir) {
    this.dir = newDir;
  };

}) ();
