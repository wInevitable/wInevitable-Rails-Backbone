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
  Game.DIM_X = 1000;
  Game.DIM_Y = 800;
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

(function (root){
  var StarTrek = root.StarTrek = (root.StarTrek || {});

  var MovingObject = StarTrek.MovingObject =
    function(options) {
      this._id = options._id || Math.random();
      this.pos = options.pos;
      this.angle = options.angle;
      this.vel = options.vel;
      this.speed = options.speed;
      this.radius = options.radius;
      this.color = options.color;
      this.game = options.game;
      this.image = options.image;
  };

  MovingObject.prototype.collideWith = function (otherObject) {
  };

  MovingObject.prototype.draw = function(ctx) {
    ctx.save();
    ctx.translate(this.pos[0], this.pos[1]);
    ctx.rotate(this.angle);
    ctx.drawImage(this.image, 0 - this.image.width / 2, 0 - this.image.height / 2);

    ctx.restore();

    // ctx.fillStyle = this.color;
    //
    // ctx.beginPath();
    // ctx.arc(
    //   this.pos[0],
    //   this.pos[1],
    //   this.radius,
    //   0,
    //   2 * Math.PI,
    //   true
    // );
    //
    // ctx.fill();
  };

  MovingObject.prototype.isCollidedWith = function(otherObject) {
    var centerDist = StarTrek.Utilities.dist(this.pos, otherObject.pos);
    return centerDist < (this.radius + otherObject.radius);
  };

  MovingObject.prototype.isWrappable = true;

  MovingObject.prototype.move = function(numTicks) {
    var speed = this.speed;

    this.vel[0] = speed * Math.cos(this.angle);
    this.vel[1] = speed * Math.sin(this.angle);

    this.pos = [
      (this.pos[0] + numTicks * this.vel[0]),
      (this.pos[1] + numTicks * this.vel[1])
    ];

    if (this.game.isOutOfBounds(this.pos)) {
      if (this.isWrappable) {
        this.wrap();
      }
      else {
        this.remove();
      }
    }
  };

  MovingObject.prototype.remove = function() {
    this.game.remove(this)
  };

  function wrap (coord, max) {
    if (coord < 0) {
      return max - (coord % max);
    }
    else if (coord > max) {
      return coord % max;
    }
    else {
      return coord;
    }
  };

  MovingObject.prototype.wrap = function() {
    this.pos[0] = wrap(this.pos[0], StarTrek.Game.DIM_X);
    this.pos[1] = wrap(this.pos[1], StarTrek.Game.DIM_Y);
  };

  // MovingObject.prototype.toJSON - save game feature

})(this);

(function (root){
  var StarTrek = root.StarTrek = (root.StarTrek || {});

  var Asteroid = StarTrek.Asteroid = function(options) {
    options.radius = Asteroid.RADIUS;
    options.color = Asteroid.COLOR;
    options.speed = Asteroid.SPEED;
    options.angle = Asteroid.ANGLE;

    StarTrek.MovingObject.call(this, options);
  };

  Asteroid.COLOR = 'red';
  Asteroid.RADIUS = 25;
  Asteroid.SPEED = 4;
  Asteroid.ANGLE = 0;

  Asteroid.randomAsteroid = function(game, image){
    return new Asteroid({
      pos: game.randomPosition(),
      vel: StarTrek.Utilities.randomVec(Asteroid.SPEED),
      game: game,
      image: image
    });
  };

  StarTrek.inherits = function (ChildClass, BaseClass) {
    function Surrogate () { this.constructor = ChildClass };
    Surrogate.prototype = BaseClass.prototype;
    ChildClass.prototype = new Surrogate();
  };

  StarTrek.inherits(Asteroid, StarTrek.MovingObject);

  Asteroid.prototype.collideWith = function(otherObject) {
    if (otherObject.constructor !== StarTrek.Ship) {
      return;
    }

    otherObject.relocate();
  };

})(this);

(function(root) {
   var StarTrek = root.StarTrek = (root.StarTrek || {});

   function randomColor() {
     //generate a random hex code
     return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
   }

   var Ship = StarTrek.Ship = function(options) {
     options.radius = StarTrek.Ship.RADIUS;
     options.speed = 0;
     options.angle = 0;
     options.vel = options.vel || [0, 0];
     options.color = options.color || randomColor();

     StarTrek.MovingObject.call(this, options);
   };


   StarTrek.inherits = function (ChildClass, BaseClass) {
     function Surrogate () { this.constructor = ChildClass };
     Surrogate.prototype = BaseClass.prototype;
     ChildClass.prototype = new Surrogate();
   };

   StarTrek.inherits(Ship, StarTrek.MovingObject);

   Ship.COLOR = 'Black';
   Ship.RADIUS = 15;
   Ship.MAX_SPEED = 10;

   Ship.prototype.power = function(impulse){
    if (Math.abs(this.speed + impulse) <= Ship.MAX_SPEED) {
      this.speed += impulse;
    }
   };

   Ship.prototype.turn = function(rads) {
    this.angle += rads;
    this.angle %= 2 * Math.PI;
   };

   Ship.prototype.relocate = function() {
     this.pos = this.game.randomPosition();
     this.speed = 0;
   };

   Ship.prototype.fireBullet = function() {
     var norm = StarTrek.Utilities.norm(this.vel);

     if (norm == 0) {
       return
     }
     else {
       var relVel = StarTrek.Utilities.scale(
         StarTrek.Utilities.dir(this.vel),
         StarTrek.Bullet.SPEED
       );

       var bulletVel = [
         relVel[0] + this.vel[0], relVel[1] + this.vel[1]
       ];

       var bullet = new StarTrek.Bullet({
         pos: this.pos,
         angle: this.angle,
         vel: bulletVel,
         game: this.game,
         image: this.game.images.bullet
       });

       this.game.add(bullet);
     }
   };

})(this);

(function(root) {
   var StarTrek = root.StarTrek = (root.StarTrek || {});

   var Bullet = StarTrek.Bullet = function(options) {
     options.radius = Bullet.RADIUS;
     options.color = Bullet.COLOR;
     options.speed = Bullet.SPEED;

     StarTrek.MovingObject.call(this, options);
   };

   Bullet.COLOR = '#fff';
   Bullet.RADIUS = 2;
   Bullet.SPEED = 45;

   StarTrek.inherits = function (ChildClass, BaseClass) {
     function Surrogate () { this.constructor = ChildClass };
     Surrogate.prototype = BaseClass.prototype;
     ChildClass.prototype = new Surrogate();
   };

   StarTrek.inherits(Bullet, StarTrek.MovingObject);

   Bullet.prototype.collideWith = function(otherObject) {
     if (otherObject.constructor !== StarTrek.Asteroid) {
       return;
     }

     this.remove();
     otherObject.remove();
   };

   Bullet.prototype.isWrappable = false;
})(this);

(function(root) {
  var StarTrek = root.StarTrek = (root.StarTrek || {});

  var Utilities = StarTrek.Utilities = {};

  var dir = Utilities.dir = function (vec) {
    var norm = Utilities.norm(vec);
    return Utilities.scale(vec, 1 / norm);
  };

  var dist = Utilities.dist = function (pos1, pos2) {
    return Math.sqrt(
      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
    );
  };

  var norm = Utilities.norm = function (vec) {
    return Utilities.dist([0, 0], vec);
  };

  var randomVec = Utilities.randomVec = function (length) {
    var x = random() - 0.5;
    var y = random() - 0.5;

    var vec = [x, y];
    return Utilities.scale(vec, length / Utilities.norm(vec));
  };

  var scale = Utilities.scale = function (vec, m) {
    return [vec[0] * m, vec[1] * m];
  };

  var inherits = Utilities.inherits = function (ChildClass, BaseClass) {
    function Surrogate () { this.constructor = ChildClass };
    Surrogate.prototype = BaseClass.prototype;
    ChildClass.prototype = new Surrogate();
  };

  Utilities._seed = 0;

  var random = Utilities.random = function(max, min) {
    max = max || 1;
    min = min || 0;

    Utilities._seed = (Utilities._seed * 9301 + 49297) % 233280;
    var rnd = Utilities._seed / 233280;

    return min + rnd * (max - min);
  };

})(this);

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

    // Object.keys(GameView.MOVES).forEach(function(k) {
    //   var move = GameView.MOVES[k];

    //   key(k, function() { ship.power(move); });
    // });

    key('w', function() { ship.power(1) });
    key('s', function() { ship.power(-1) });
    key('a', function() { ship.turn(-0.5) });
    key('d', function() { ship.turn(0.5) });
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