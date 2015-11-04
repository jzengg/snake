(function() {

  if (typeof window.SnakeGame === "undefined") {
    window.SnakeGame = {};
  }

  var View = window.SnakeGame.View = function($el) {
    this.$el = $el;
    this.board = new window.SnakeGame.Board();

    $("html").on("keydown", function(e) {
      var key = e.keyCode;
      this.board.snake.dir = View.KEYS[key];
    }.bind(this));

    setInterval(this.step.bind(this), 500);
  };

  View.KEYS = {
    37: "W",
    38: "N",
    39: "E",
    40: "S"
  };

  View.prototype.step = function () {
    this.board.snake.move();
    this.drawBoard();
  };

  View.prototype.drawBoard = function () {
    this.$el.html("<pre>" + this.board.render() + "</pre>");
  };

})();
