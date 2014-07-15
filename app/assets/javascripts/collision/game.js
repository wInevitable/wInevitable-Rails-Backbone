"use strict";

(function(root) {

  var Collision = root.Collision = (root.Collision || {});

  var Game = Collision.Game = function(images) {
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
    if (object.constructor == Collision.Asteroid) {
      this.asteroids.push(object);
    }
    else if (object.constructor == Collision.Bullet) {
      this.bullets.push(object);
    }
    else if (object.constructor == Collision.Ship) {
      this.ships.push(object);
    }
    else {
      throw "omg!";
    }
  };

  Game.prototype.addAsteroids = function (numAsteroids, image) {
    for (var i = 0; i < numAsteroids; i++) {
      this.add(Collision.Asteroid.randomAsteroid(this, image));
    }
  };

  Game.prototype.addShip = function(image) {
    var ship = new Collision.Ship({
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
      Game.DIM_X * Collision.Utilities.random(),
      Game.DIM_Y * Collision.Utilities.random()
    ];
  };

  Game.prototype.remove = function(object) {
    if (object.constructor == Collision.Bullet) {
      this.bullets.splice(this.bullets.indexOf(object), 1);
    }
    else if (object.constructor == Collision.Asteroid) {
      var index = this.asteroids.indexOf(object);
      this.asteroids[index] = Collision.Asteroid.randomAsteroid(this, this.images.asteroid);
    }
    else if (object.constructor == Collision.Ship) {
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

"use strict";

(function (root){
  var Collision = root.Collision = (root.Collision || {});

  var MovingObject = Collision.MovingObject =
    function(options) {
      this._id = options._id || Math.random();
      this.pos = options.pos;
      this.vel = options.vel;
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
     var centerDist = Collision.Utilities.dist(this.pos, otherObject.pos);
     return centerDist < (this.radius + otherObject.radius);
   };

   MovingObject.prototype.isWrappable = true;

   MovingObject.prototype.move = function(numTicks) {
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
     this.pos[0] = wrap(this.pos[0], Collision.Game.DIM_X);
     this.pos[1] = wrap(this.pos[1], Collision.Game.DIM_Y);
   };

   // MovingObject.prototype.toJSON - save game feature to implement

})(this);

(function (root){
  var Collision = root.Collision = (root.Collision || {});

  var Asteroid = Collision.Asteroid = function(options) {
    options.radius = Asteroid.RADIUS;
    options.color = Asteroid.COLOR;
    Collision.MovingObject.call(this, options);
  };

  Asteroid.COLOR = 'red';
  Asteroid.RADIUS = 25;
  Asteroid.SPEED = 4;

  Asteroid.randomAsteroid = function(game, image){
    return new Asteroid({
      pos: game.randomPosition(),
      vel: Collision.Utilities.randomVec(Asteroid.SPEED),
      game: game,
      image: image
    });
  };


  Collision.inherits = function (ChildClass, BaseClass) {
    function Surrogate () { this.constructor = ChildClass };
    Surrogate.prototype = BaseClass.prototype;
    ChildClass.prototype = new Surrogate();
  };

  Collision.inherits(Asteroid, Collision.MovingObject);

  Asteroid.prototype.collideWith = function(otherObject) {
    if (otherObject.constructor !== Collision.Ship) {
      return;
    }

    otherObject.relocate();
  };

})(this);

(function(root) {
   var Collision = root.Collision = (root.Collision || {});

   function randomColor() {
     //generate a random hex code
     return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
   }

   var Ship = Collision.Ship = function(options) {
     options.radius = Collision.Ship.RADIUS;
     options.vel = options.vel || [0, 0];
     options.color = options.color || randomColor();

     Collision.MovingObject.call(this, options);
   };


   Collision.inherits = function (ChildClass, BaseClass) {
     function Surrogate () { this.constructor = ChildClass };
     Surrogate.prototype = BaseClass.prototype;
     ChildClass.prototype = new Surrogate();
   };

   Collision.inherits(Ship, Collision.MovingObject);

   Ship.COLOR = 'Black';
   Ship.RADIUS = 15;

   Ship.prototype.power = function(impulse){
     this.vel[0] += impulse[0];
     this.vel[1] += impulse[1];
   };

   Ship.prototype.relocate = function() {
     this.pos = this.game.randomPosition();
     this.vel = [0, 0];
   };

   Ship.prototype.fireBullet = function() {
     var norm = Collision.Utilities.norm(this.vel);

     if (norm == 0) {
       return
     }
     else {
       var relVel = Collision.Utilities.scale(
         Collision.Utilities.dir(this.vel),
         Collision.Bullet.SPEED
       );

       var bulletVel = [
         relVel[0] + this.vel[0], relVel[1] + this.vel[1]
       ];

       var bullet = new Collision.Bullet({
         pos: this.pos,
         vel: bulletVel,
         color: this.color,
         game: this.game,
         image: this.game.images.bullet
       });

       this.game.add(bullet);
     }
   };

})(this);

(function(root) {
   var Collision = root.Collision = (root.Collision || {});

   var Bullet = Collision.Bullet = function(options) {
     options.radius = Bullet.RADIUS;
     options.color = Bullet.COLOR;

     Collision.MovingObject.call(this, options);
   };

   Bullet.COLOR = '#fff';
   Bullet.RADIUS = 2;
   Bullet.SPEED = 15;

   Collision.inherits = function (ChildClass, BaseClass) {
     function Surrogate () { this.constructor = ChildClass };
     Surrogate.prototype = BaseClass.prototype;
     ChildClass.prototype = new Surrogate();
   };

   Collision.inherits(Bullet, Collision.MovingObject);

   Bullet.prototype.collideWith = function(otherObject) {
     if (otherObject.constructor !== Collision.Asteroid) {
       return;
     }

     this.remove();
     otherObject.remove();
   };

   Bullet.prototype.isWrappable = false;
})(this);

(function(root) {
  var Collision = root.Collision = (root.Collision || {});

  var Utilities = Collision.Utilities = {};

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
  var Collision = root.Collision = (root.Collision || {});

  var GameView = Collision.GameView = function(game, ctx, images) {
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
       }, 1000 / Collision.Game.FPS
     );

     this.bindKeyHandlers();
  };

  GameView.prototype.stop = function() {
    clearInterval(this.timerId);
  };

})(this);