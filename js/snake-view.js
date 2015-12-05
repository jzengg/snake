(function() {

  if (typeof window.SnakeGame === "undefined") {
    window.SnakeGame = {};
  }

  var View = window.SnakeGame.View = function($el) {
    this.$el = $el;
    this.board = new window.SnakeGame.Board();

    $("html").on("keydown", function(e) {
      e.preventDefault();
      var key = e.keyCode;
      if (![37,38,39,40].includes(key)) {
        return;
      }
      this.board.snake.turn(View.KEYS[key]);
    }.bind(this));

    this.interval = setInterval(this.step.bind(this), 120);
  };

  View.KEYS = {
    37: "W",
    38: "N",
    39: "E",
    40: "S"
  };

  View.prototype.step = function () {

      var oldSegment = this.board.snake.segments.slice(-1)[0];
      this.board.snake.move();
      this.render(oldSegment);

  };

  View.prototype.setupBoard = function () {
    var $ul = $("<ul></ul>").addClass("board group");
    var appleIndex = Math.floor(Math.random() * 400);
    for (i = 0; i < 400; i++){
      var $li = $("<li></li>").addClass("square").data("index", i);
      if (i === appleIndex) {
        $li.addClass("apple");
      }
      $ul.append($li);
    }
    this.$el.append($ul);
  };

  View.prototype.handleGameOver = function () {
    clearInterval(this.interval);
    this.$el.append("<div class='gameover'> gameover div </div>");
  };

  View.prototype.render = function (oldSegment) {
    var n = 20 * oldSegment.row + oldSegment.col + 1;
    this.$el.find("li:nth-child(" + n + ")").removeClass("snake");

    var newSegment = this.board.snake.segments[0];
    if (this.board.snake.isDead(newSegment)) {
      this.handleGameOver();
      return;
    }
    n = 20 * newSegment.row + newSegment.col + 1;
    var newSquare = this.$el.find("li:nth-child(" + n + ")");

    if (newSquare.hasClass("apple")) {
      newSquare.removeClass("apple");
      this.board.snake.grow();
      this.generateApple();
    }

    newSquare.addClass("snake");
  };

  View.prototype.generateApple = function () {
    var appleIndex = Math.floor(Math.random() * 400);
    var square = this.$el.find("li:nth-child(" + appleIndex + ")");
    if (!square.hasClass("snake")) {
      square.addClass("apple");
    } else {
      this.generateApple();
    }
  };

})();
