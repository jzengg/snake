(function() {

  if (typeof window.SnakeGame === "undefined") {
    window.SnakeGame = {};
  }

  var View = window.SnakeGame.View = function($el) {
    this.$el = $el;
    this.board = new window.SnakeGame.Board();
    this.score = 0;
    $("html").on("keydown", function(e) {
      // e.preventDefault();
      var key = e.keyCode;
      if ([37,38,39,40].indexOf(key) !== -1) {
        this.board.snake.turn(View.KEYS[key]);
      }
    }.bind(this));

    $("div.play-button").on("click", function (e) {
      this.resetGame();
    }.bind(this));

    $("button.reset-scores").on("click", function (e) {
      window.localStorage.setItem("high-score", 0);
      this.$el.find("h4.high-score").attr("data-score", window.localStorage.getItem("high-score") || 0);
    }.bind(this));
    this.$el.find("h4.high-score").attr("data-score", window.localStorage.getItem("high-score") || 0);

    setTimeout(this.step.bind(this), 120);
  };

  View.prototype.resetGame = function () {
    $("html").off(".shortcut");
    this.board = new window.SnakeGame.Board();
    this.score = 0;
    $(this.$el.find("h4.score")).attr("data-score", this.score);
    this.$el.find("li").removeClass("snake apple");
    this.$el.find("div.notification").toggle();
    this.$el.find("div.new-high-score").hide();
    this.generateApple();

    setTimeout(this.step.bind(this), 120);
  };

  View.KEYS = {
    37: "W",
    38: "N",
    39: "E",
    40: "S"
  };

  View.prototype.step = function () {
      this.board.snake.alreadyTurned = false;
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
    this.$el.find("div.notification").toggle();
    $("html").on("keydown.shortcut", function (e) {
      if (e.keyCode == 32 || e.keyCode == 13) {
        this.resetGame();
      }
    }.bind(this));
    var highScore = window.localStorage.getItem("high-score") || 0;
    if (this.score > highScore) {
      this.$el.find("div.new-high-score").toggle();
      window.localStorage.setItem("high-score", this.score);
    }
      this.$el.find("div.scores h4.high-score").attr("data-score", window.localStorage.getItem("high-score"));
  };

  View.prototype.incrementScore = function () {
    this.score = this.score + Math.floor(this.board.snake.segments.length * 13 + Math.random());
    $(this.$el.find("h4.score")).attr("data-score", this.score);
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
    var newSquare = this.$el.find(".board li:nth-child(" + n + ")");

    if (newSquare.hasClass("apple")) {
      newSquare.removeClass("apple");
      this.board.snake.grow();
      this.incrementScore();
      setTimeout(this.generateApple.bind(this), 0 );
    }

    newSquare.addClass("snake");
    var length = this.board.snake.segments.length;
    var speed = 150 - length*2 ;
    if (speed <= 70) {
      speed = 70;
    }
    setTimeout(this.step.bind(this), speed);
  };

  View.prototype.generateApple = function () {
    var emptySquares = this.$el.find(".board li").not(".snake");
    var appleIndex = Math.floor(Math.random() * emptySquares.length);
    $(emptySquares[appleIndex]).addClass("apple");
  };

})();
