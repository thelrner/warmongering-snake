(function() {
//need IIFE to create scope, private variables/functions, but still have the server run

  window.MySnake = window.MySnake || {};

  var View = MySnake.View = function(el) {
    this.$el = $(el);
    this.setupPage();
    this.board = new MySnake.Board();
    this.demoMode = true;
    this.start();
    this.bindEvents();
    this.paused = false;
    this.gameOver = false;
  };

  View.SPEED = 75;
  View.KEYMAPS = {
    38: "N",
    39: "E",
    40: "S",
    37: "W",
  };

  View.prototype.bindEvents = function() {
    this.$el.focus();       //focuses on the figure element
    this.$el.on("keydown", this.handleKeyDown.bind(this));
    this.$el.on("click", "strong.new-game", this.startNewGame.bind(this));
  };

  View.prototype.startNewGame = function() {
    if (this.demoMode) {
      this.halt();
      this.demoMode = false;
    };
    this.demoMode = false;
    $("strong.game-over").addClass("hidden");
    $("strong.new-game").addClass("hidden");
    this.board.clearBoard();
    this.board = new MySnake.Board();
    this.gameOver = false;
    this.start();
  };

  View.prototype.handleGameOver = function() {
    this.halt();
    this.gameOver = true;
    $("strong.game-over").removeClass("hidden");
    $("strong.new-game").removeClass("hidden");
  };

  View.prototype.start = function() {
    this.intervalId = setInterval(this.step.bind(this), View.SPEED);
    this.paused = false;
  };

  View.prototype.halt = function() {
    clearInterval(this.intervalId);
    this.paused = true;
  };

  View.prototype.setupPage = function() {
    for (var i = 0; i < MySnake.Board.SIZE; i++) {
      for (var j = 0; j < MySnake.Board.SIZE; j++) {
        var $newCell = $("<div></div>");
        $newCell.data("position", [i, j]);
        this.$el.append($newCell);
      };
    };
  };

  View.prototype.handleKeyDown = function(e) {
    e.preventDefault();
    // console.log(e.keyCode);
    if (e.keyCode === 32) {
      this.togglePause();
    }
    this.board.turnSnake( View.KEYMAPS[e.keyCode] );
  };

  View.prototype.togglePause = function() {
    if (this.gameOver) {
      return;
    }

    if (this.paused) {
      this.start();
    } else {
      this.halt();
    }
  };

  View.prototype.step = function() {
    this.board.growApples();
    this.board.handleCells();
    try {
      if (!this.demoMode) {
        this.board.moveSnake();
      }
    } catch(e) {
      this.handleGameOver();
    };
    this.board.render();
  };

})();
