"use strict";

(function(root) {
  var StarTrek = root.StarTrek = (root.StarTrek || {});

  var GameView = StarTrek.GameView = function(game, ctx, images) {
    this.ctx = ctx;
    this.images = images;
    this.game = game;
    this.ship = this.game.addShip(images.ship);
    this.timerId = null;
  };

  GameView.MOVES = {
    'w': [0, -1],
    'a': [-1, 0],
    's': [0, 1],
    'd': [1, 0]
  };

  GameView.prototype.bindKeyHandlers = function() {
    var ship = this.ship;

    Object.keys(GameView.MOVES).forEach(function(k) {
      var move = GameView.MOVES[k];
      key(k, function() { ship.power(move); });
    });

    key("space", function() { ship.fireBullet() });
  };

  GameView.prototype.start = function(){
     var gameView = this;

     this.timerId = setInterval(
       function() {
         gameView.game.step();
         gameView.game.draw(gameView.ctx);
       }, 1000 / StarTrek.Game.FPS
     );

     this.bindKeyHandlers();
  };

  GameView.prototype.stop = function() {
    clearInterval(this.timerId);
  };

})(this);