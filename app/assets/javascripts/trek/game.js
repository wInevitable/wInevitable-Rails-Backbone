"use strict";

(function(root) {

  var StarTrek = root.StarTrek = (root.StarTrek || {});

  var Game = StarTrek.Game = function(images) {
    this.images = images;
    this.asteroids = [];
    this.bullets = [];
    this.ships = [];
    this.lastTickTime = null;
  };

  Game.NUM_ASTEROIDS = 10;
  Game.DIM_X = 800;
  Game.DIM_Y = 600;
  Game.FPS = 32;
  Game.COLOR = '#000';

  // Game.fromJSON = function - implement save game feature

  Game.new = function(images) {
    var game = new this(images);
    game.addAsteroids(this.NUM_ASTEROIDS, images.asteroid);

    return game;
  }

  Game.prototype.add = function(object) {
    if (object.constructor == StarTrek.Asteroid) {
      this.asteroids.push(object);
    }
    else if (object.constructor == StarTrek.Bullet) {
      this.bullets.push(object);
    }
    else if (object.constructor == StarTrek.Ship) {
      this.ships.push(object);
    }
    else {
      throw "omg!";
    }
  };

  Game.prototype.addAsteroids = function (numAsteroids, image) {
    for (var i = 0; i < numAsteroids; i++) {
      this.add(StarTrek.Asteroid.randomAsteroid(this, image));
    }
  };

  Game.prototype.addShip = function(image) {
    var ship = new StarTrek.Ship({
      pos: this.randomPosition(),
      game: this,
      image: image
    });

    this.add(ship);

    return ship;
  };

  Game.prototype.allObjects = function() {
    return []
      .concat(this.ships)
      .concat(this.asteroids)
      .concat(this.bullets);
  };

  Game.prototype.checkCollisions = function(){
    var game = this;

    this.allObjects().forEach(function(obj1) {
      game.allObjects().forEach(function(obj2) {
        if (obj1.isCollidedWith(obj2)) {
          obj1.collideWith(obj2);
        }
      });
    });
  };

  Game.prototype.draw = function(ctx) {
    var background = this.images.background
    var width = background.width;
    var height = background.height;
    var tileX = Game.DIM_X / width;
    var tileY = Game.DIM_Y / height;

    for (var i = 0; i < tileX; i++) {
      for (var j = 0; j < tileY; j++) {
        ctx.drawImage(background, i * width, j * height);
      }
    }


    this.allObjects().forEach(function(object) {
      object.draw(ctx);
    });
  };

  Game.prototype.isOutOfBounds = function(pos) {
    return (pos[0] < 0) || (pos[1] < 0)
      || (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
  };

  Game.prototype.moveObjects = function() {
    if (!this.lastTickTime) {
      this.lastTickTime = (new Date()).getTime();
    }

    var timeNow = (new Date()).getTime();
    var numTicks = Game.FPS * ((timeNow - this.lastTickTime) / 1000);
    this.lastTickTime = timeNow;
    this.allObjects().forEach(function(object) {
      object.move(numTicks);
    });
  };

  Game.prototype.randomPosition = function() {
    return [
      Game.DIM_X * StarTrek.Utilities.random(),
      Game.DIM_Y * StarTrek.Utilities.random()
    ];
  };

  Game.prototype.remove = function(object) {
    if (object.constructor == StarTrek.Bullet) {
      this.bullets.splice(this.bullets.indexOf(object), 1);
    }
    else if (object.constructor == StarTrek.Asteroid) {
      var index = this.asteroids.indexOf(object);
      this.asteroids[index] = StarTrek.Asteroid.randomAsteroid(this, this.images.asteroid);
    }
    else if (object.constructor == StarTrek.Ship) {
      this.shis.splice(this.ships.indexOf(object), 1);
    }
    else {
      throw "omg!";
    }
  };

  Game.prototype.step = function() {
    this.moveObjects();
    this.checkCollisions();
  };

})(this);