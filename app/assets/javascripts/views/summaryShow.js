wInevitable.Views.Summary = Backbone.View.extend({
  template: JST['summary'],

  render: function() {
    var renderedContent = this.template();
    this.$el.html(renderedContent);
    return this;
  }
});