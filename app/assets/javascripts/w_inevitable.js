window.wInevitable = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function(options) {
    var data = options.data;

    new this.Routers.Router({
      $rootEl: options.$rootEl
    });

    Backbone.history.start()
  }
};