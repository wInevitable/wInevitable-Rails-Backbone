(function(root) {
  var Preloader = root.Preloader = (root.Preloader || {});

  var ImagePreloader = Preloader.ImagePreloader = function(imageFiles, onFinish) {
    this.onFinish = onFinish;
    this.imageFiles = imageFiles;
    this.images = {};
    this.loaded = 0;

    for (var key in this.imageFiles) {
      this.preload(key);
    }
  };

  ImagePreloader.prototype.onComplete = function() {
    this.loaded += 1;

    if (this.loaded === Object.keys(this.imageFiles).length) {
      this.onFinish(this.images);
    }
  };

  ImagePreloader.prototype.preload = function(imageKey) {
    var that = this;
    var image = new Image();

    image.onload = function() {
      that.onComplete();
    };

    image.src = this.imageFiles[imageKey];

    this.images[imageKey] = image;
  };
})(this);

var Preloader = this.Preloader;