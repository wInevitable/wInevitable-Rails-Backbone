wInevitable.Views.CollisionView = Backbone.View.extend({
  template: JST['collision'],

  render: function() {
    var renderedContent = this.template();
    this.$el.html(renderedContent);
    return this;
  }
});