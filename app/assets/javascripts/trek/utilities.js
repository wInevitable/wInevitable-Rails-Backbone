"use strict";

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
    ChildClass.fromJSON = BaseClass.fromJSON;

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