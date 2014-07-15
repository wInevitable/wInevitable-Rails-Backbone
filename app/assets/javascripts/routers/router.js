wInevitable.Routers.Router = Backbone.Router.extend({
  initialize: function(options) {
    this.$rootEl = options.$rootEl;
  },

  routes: {
    '': 'home',
    'summary': 'summary',
    'collision': 'collision',
    'tic': 'tic',
    'hanoi': 'hanoi',
    'contact': 'contact'
  },

  home: function() {
    var homeView = new wInevitable.Views.Home();
    this._swapView(homeView);
  },

  summary: function() {
    var summaryView = new wInevitable.Views.Summary();
    this._swapView(summaryView);
  },

  collision: function() {
    var collisionView = new wInevitable.Views.CollisionView();
    this._swapView(collisionView);
  },

  tic: function() {
    var tttView = new wInevitable.Views.TTT();
    this._swapView(tttView);
  },

  hanoi: function() {
    var hanoiView = new wInevitable.Views.Hanoi();
    this._swapView(hanoiView);
  },

  contact: function() {
    var contactView = new wInevitable.Views.Contact();
    this._swapView(contactView);
  },

  _swapView: function(view) {
     this._currentView && this._currentView.remove();
     this._currentView = view;
     this.$rootEl.html(view.render().$el);
   }
});