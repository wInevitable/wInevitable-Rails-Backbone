"use strict";

(function (root){
  var StarTrek = root.StarTrek = (root.StarTrek || {});

  var MovingObject = StarTrek.MovingObject =
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
     var centerDist = StarTrek.Utilities.dist(this.pos, otherObject.pos);
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
     this.pos[0] = wrap(this.pos[0], StarTrek.Game.DIM_X);
     this.pos[1] = wrap(this.pos[1], StarTrek.Game.DIM_Y);
   };

   // MovingObject.prototype.toJSON - save game feature

})(this);