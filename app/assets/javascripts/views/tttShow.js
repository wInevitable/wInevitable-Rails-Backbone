wInevitable.Views.TTT = Backbone.View.extend({
  template: JST['ttt'],

  render: function() {
    var renderedContent = this.template();
    this.$el.html(renderedContent);
    return this;
  }
});