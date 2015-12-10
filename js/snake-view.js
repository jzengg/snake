(function() {

  if (typeof window.SnakeGame === "undefined") {
    window.SnakeGame = {};
  }

  var View = window.SnakeGame.View = function($el) {
    this.$el = $el;
    this.board = new window.SnakeGame.Board();
    this.score = 0;
    this.multi = false;
    this._addModeHandlers();

    $("html").on("keydown", function(e) {
      var key = e.keyCode;
      if ([37,38,39,40].indexOf(key) !== -1) {
        e.preventDefault();
        this.board.snake.turn(View.KEYS[key]);
      }
    }.bind(this));

    $("div.play-button").on("click", function (e) {
      this.resetGame();
    }.bind(this));

    $("a.reset-scores").on("click", function (e) {
      window.localStorage.setItem("high-score", 0);
      this.$el.find("h4.high-score").attr("data-score", window.localStorage.getItem("high-score"));
    }.bind(this));

    this.$el.find("h4.high-score").attr("data-score", window.localStorage.getItem("high-score"));
    setTimeout(this.step.bind(this), 120);
  };

  View.prototype._addModeHandlers = function () {
    $("html").find("a.1-player").on("click", function (e) {
      this.multi = false;
      this.board = new window.SnakeGame.Board();
      $("html").off(".multi");
    }.bind(this));

    $("html").find("a.2-player").on("click", function (e) {
      this.multi = true;
      this.board = new window.SnakeGame.Board(true);
      this._addSecondTurnHandler();
    }.bind(this));

  };

  View.prototype._addSecondTurnHandler = function () {
    $("html").on("keydown.multi", function (e) {
      var key = e.keyCode;
      if ([87, 83, 65, 68].indexOf(key) !== -1) {
        e.preventDefault();
        this.board.snake2.turn(View.KEYS[key]);
      }
    }.bind(this));
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
    40: "S",
    87: "N",
    83: "S",
    65: "W",
    68: "E"
  };

  View.prototype.step = function () {
    if (this.board.snake2)
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
    var highScore = 0;
    if (window.localStorage.getItem("high-score") != "null") {
      highScore = window.localStorage.getItem("high-score");
    }
    if (this.score > highScore) {
      this.$el.find("div.new-high-score").toggle();
      window.localStorage.setItem("high-score", this.score);
    }
      this.$el.find("div.scores h4.high-score").attr("data-score", window.localStorage.getItem("high-score"));

    $("html").on("keydown.shortcut", function (e) {
      if (e.keyCode == 32) {
        this.resetGame();
      }
    }.bind(this));
  };

  View.prototype.incrementScore = function () {
    this.score = this.score + this.board.snake.segments.length * 13 + Math.floor(5*Math.random());
    $(this.$el.find("h4.score")).attr("data-score", this.score);
  };

  View.prototype.render = function (oldSegment, oldSegment2) {
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
