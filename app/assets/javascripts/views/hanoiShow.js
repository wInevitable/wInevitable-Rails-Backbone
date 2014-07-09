wInevitable.Views.Hanoi = Backbone.View.extend({
  template: JST['hanoi'],

  render: function() {
    var renderedContent = this.template();
    this.$el.html(renderedContent);
    return this;
  }
});