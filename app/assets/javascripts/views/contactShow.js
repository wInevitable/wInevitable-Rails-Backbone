wInevitable.Views.Contact = Backbone.View.extend({
  template: JST['contact'],

  render: function() {
    var renderedContent = this.template();
    this.$el.html(renderedContent);
    return this;
  }
});