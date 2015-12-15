(function() {

  if (typeof window.SnakeGame === "undefined") {
    window.SnakeGame = {};
  }

  var View = window.SnakeGame.View = function($el) {
    this.$el = $el;
    this.board = new window.SnakeGame.Board();
    this.score = 0;
    this.multi = false;
    this.paused = false;

    this.setupHighScore();
    this._addHandlers();
    this.snakes = [this.board.snake];
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

  View.ALL_CLASSES = "snake apple apple-response player2 head-north head-west head-east head-south";
  View.HEADS = "head-north head-west head-east head-south";
  View.PLAYERS = ["snake ", "player2 "];

  View.prototype.setupHighScore = function () {
    if (window.localStorage.getItem("high-score") === null) {
      window.localStorage.setItem("high-score", 0);
    }
    this.$el.find("h4.high-score").attr("data-score", window.localStorage.getItem("high-score"));
  };

  View.prototype._addHandlers = function () {
    this._addModeHandlers();
    this._addMainKeyDown();
    this._addClickHandlers();
  };

  View.prototype._addClickHandlers = function () {
    $("div.play-button").on("click", function (e) {
      this.resetGame();
    }.bind(this));

    $("a.reset-scores").on("click", function (e) {
      window.localStorage.setItem("high-score", 0);
      this.$el.find("h4.high-score").attr("data-score", window.localStorage.getItem("high-score"));
    }.bind(this));
  };

  View.prototype._addMainKeyDown = function () {
    $("html").on("keydown.player1Keys", function(e) {
      var key = e.keyCode;
      if (key == 32) {
        e.preventDefault();
      }
      if ([37,38,39,40].indexOf(key) !== -1) {
        e.preventDefault();
        this.board.snake.turn(View.KEYS[key]);
      }
    }.bind(this));

    $("html").on("keydown.pause", function(e) {
      var key = e.keyCode;
      if (key == 80) {
        if (this.paused === false) {
          this.paused = true;
          this.$el.addClass("paused");
        }
        else {
          this.$el.removeClass("paused");
          this.paused = false;
          setTimeout(this.step.bind(this), 120);
        }
      }
    }.bind(this));
  };

  View.prototype.setupMulti = function () {
    this.multi = true;
    this.board = new window.SnakeGame.Board(true);
    this.snakes = [this.board.snake, this.board.snake2];
    this._addSecondTurnHandler();
  };

  View.prototype.setupSingle = function () {
    this.multi = false;
    this.board = new window.SnakeGame.Board();
    this.snakes = [this.board.snake];
    $("html").find(".board li").removeClass("player2");
    $("html").off(".multi");
  };

  View.prototype._addModeHandlers = function () {
    $("html").find("a.1-player").on("click", function (e) {
      $("a.1-player").addClass("active");
      $("a.2-player").removeClass("active");
      this.setupSingle();
    }.bind(this));

    $("html").find("a.2-player").on("click", function (e) {
      $("a.2-player").addClass("active");
      $("a.1-player").removeClass("active");
      this.setupMulti();
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

  View.prototype.resetGame = function (multi) {
    if (multi) {
      this.setupMulti();
    } else {
      this.setupSingle();
    }
    this.resetDOM();
    this.generateApple();

    setTimeout(this.step.bind(this), 120);
  };

  View.prototype.resetDOM = function () {
    $("html").off(".shortcut");
    this.$el.find(".board").removeClass("game-over");
    this.paused = false;
    this.score = 0;
    $(this.$el.find("h4.score")).attr("data-score", this.score);
    this.$el.find(".board li").removeClass(View.ALL_CLASSES);
    this.$el.find("div.notification").toggle();
    this.$el.find("div.new-high-score").hide();
  };

  View.prototype.handleTimeScore = function () {
    if (this.board.snake.dir != "X") {
      this.incrementScore(true);
    }
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

  View.prototype.handleGameOverNote = function (multiWinner) {
    this.$el.find("div.notification").toggle();
    this.$el.find(".board").addClass("game-over");

    if (this.multi) {
      $("div.winner").html(multiWinner + " wins!");
    } else {
      $("div.winner").html("");
    }
  };

  View.prototype.handleGameOverHighScore = function () {
    var highScore = 0;
    if (window.localStorage.getItem("high-score") != "null") {
      highScore = window.localStorage.getItem("high-score");
    }

    if (this.score > highScore) {
      this.$el.find("div.new-high-score").toggle();
      window.localStorage.setItem("high-score", this.score);
    }

    this.$el.find("div.scores h4.high-score").attr("data-score", window.localStorage.getItem("high-score"));
  };

  View.prototype.handleGameOver = function (multiWinner) {
    this.handleGameOverNote(multiWinner);
    this.handleGameOverHighScore();
    this._addNewGameShortcut(0);
  };

  View.prototype._addNewGameShortcut = function () {
    $("html").on("keydown.shortcut", function (e) {
      if (e.keyCode == 32) {
        this.resetGame(this.multi);
      }
    }.bind(this));
  };

  View.prototype.incrementScore = function (time) {
    if (time) {
      this.score += Math.floor(5*Math.random());
    } else {
        this.score += this.maxSnakeLength() * 13 + Math.floor(5*Math.random());
      }
    $(this.$el.find("h4.score")).attr("data-score", this.score);
  };

  View.prototype.maxSnakeLength = function () {
    var lengths = this.snakes.map (function (snake) {return snake.segments.length;});
    return Math.max.apply(Math, lengths);
  };

  View.prototype.removeOldSegment = function (oldSegment) {
    var n = 20 * oldSegment.row + oldSegment.col + 1;
    this.$el.find(".board li:nth-child(" + n + ")").removeClass(View.ALL_CLASSES);
  };

  View.prototype.clearHead = function (snake) {
    if (snake.segments.length == 1) {return;}
    var prevHead = snake.segments[1];
    var n = 20 * prevHead.row + prevHead.col + 1;
    this.$el.find("li:nth-child(" + n +")").removeClass(View.HEADS);
  };

  View.prototype.step = function () {
    if (this.paused) {
      return;
    }
    this.handleTimeScore();

    var oldSegment;
    var oldSegments = [];

    this.snakes.forEach(function (snake) {
      snake.alreadyTurned = false;
      oldSegment = snake.segments.slice(-1)[0];
      oldSegments.push(oldSegment);
      snake.move();
    }, this);

    this.render(oldSegments);
  };

  View.prototype.render = function (oldSegments) {
    var newSegment, newSquare, head;

    for (var i = 0; i < oldSegments.length; i++) {
      this.removeOldSegment(oldSegments[i]);
      newSegment = this.snakes[i].head();

      if (this.isGameOver()) {
        if (this.board.headon) { this.handleHeadOn(newSegment, i);}

        this.determineGameOver();
        return;
      }

      head = this.handleHeadClass(this.snakes[i]);
      newSquare = this.findNewSquare(newSegment);

      newSquare.addClass(View.PLAYERS[i] + head);
      if (newSquare.hasClass('apple')) { this.handleEatApple(this.snakes[i], newSquare);}

      this.clearHead(this.snakes[i]);
    }

    this.handleSpeedUp(this.maxSnakeLength());
  };

  View.prototype.determineGameOver = function () {
    if (this.multi) {
      this.board.findMultiWinner();
      this.handleGameOver(this.board.winner);
    } else {
      this.handleGameOver();
    }
  };

  View.prototype.handleHeadOn = function (newSegment, snakeIndex) {
    this.findNewSquare(newSegment).addClass(View.PLAYERS[snakeIndex]);
  };

  View.prototype.isGameOver = function () {
    return this.snakes.some(function (snake) {
      return (
        snake.isDead(snake.head()) || this.board.snakeCollision()
      );
    }.bind(this));
  };

  View.prototype.handleHeadClass = function(snake) {
    var head = "";
    switch (snake.dir) {
      case "N":
        head = "head-north";
        break;
      case "E":
        head = "head-east";
        break;
      case "W":
        head = "head-west";
        break;
      case "S":
        head = "head-south";
        break;
    }
    return head;
  };

  View.prototype.findNewSquare = function (newSegment) {
    n = 20 * newSegment.row + newSegment.col + 1;
    return this.$el.find("li:nth-child(" + n + ")");
  };

  View.prototype.handleSpeedUp = function (maxLength) {
    var speed = 120 - maxLength*3 ;
    if (speed <= 70) {
      speed = 70;
    }
    setTimeout(this.step.bind(this), speed);
  };

  View.prototype.handleEatApple = function (snake, oldSquare) {
    oldSquare.removeClass('apple');
    var square = this.findNewSquare(snake.head()).addClass("apple-response");
    snake.grow();
    this.incrementScore();
    setTimeout(this.generateApple.bind(this), 0 );
  };

  View.prototype.generateApple = function () {
    var emptySquares = this.$el.find(".board li").not(".snake, .player2");
    var appleIndex = Math.floor(Math.random() * emptySquares.length);
    $(emptySquares[appleIndex]).addClass("apple");
  };

})();
