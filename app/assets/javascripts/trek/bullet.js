"use strict";

(function(root) {
   var StarTrek = root.StarTrek = (root.StarTrek || {});

   var Bullet = StarTrek.Bullet = function(options) {
     options.radius = Bullet.RADIUS;
     options.color = Bullet.COLOR;

     StarTrek.MovingObject.call(this, options);
   };

   Bullet.COLOR = '#fff';
   Bullet.RADIUS = 2;
   Bullet.SPEED = 15;

   StarTrek.Utilities.inherits(Bullet, StarTrek.MovingObject);

   Bullet.prototype.collideWith = function(otherObject) {
     if (otherObject.constructor !== StarTrek.Asteroid) {
       return;
     }

     this.remove();
     otherObject.remove();
   };

   Bullet.prototype.isWrappable = false;
})(this);