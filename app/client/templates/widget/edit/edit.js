Template.EditWidget.helpers({
  schema: function() {
    return  Widgets.doSchema(this.widget.parent, this.widget.type);
  }
});
