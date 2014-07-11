"use strict";

(function (root){
  var StarTrek = root.StarTrek = (root.StarTrek || {});

  var Asteroid = StarTrek.Asteroid = function(options) {
    options.radius = Asteroid.RADIUS;
    options.color = Asteroid.COLOR;
    StarTrek.MovingObject.call(this, options);
  };

  Asteroid.COLOR = 'red';
  Asteroid.RADIUS = 25;
  Asteroid.SPEED = 4;

  Asteroid.randomAsteroid = function(game, image){
    return new Asteroid({
      pos: game.randomPosition(),
      vel: StarTrek.Utilities.randomVec(Asteroid.SPEED),
      game: game,
      image: image
    });
  };

  StarTrek.Utilities.inherits(Asteroid, StarTrek.MovingObject);

  Asteroid.prototype.collideWith = function(otherObject) {
    if (otherObject.constructor !== StarTrek.Ship) {
      return;
    }

    otherObject.relocate();
  };

})(this);