wInevitable.Views.StarTrek = Backbone.View.extend({
  template: JST['star_trek'],

  render: function() {
    var renderedContent = this.template();
    this.$el.html(renderedContent);
    return this;
  }
});