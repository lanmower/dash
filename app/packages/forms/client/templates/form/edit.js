Template.fieldList.helpers({
  fieldSchema: function() {
    schema = core.createDisplaySchema(Router.current().params.form, null, Forms, Meteor.fieldTypes);
    /*const options = {};
    for(type in Router.current().data().form.types) {
      options[type] = type;
    }*/
    schema.public.autoform = {
      type: 'hidden'
    };
    schema.type.autoform.label = false;
    return new SimpleSchema(schema);
  },
  getFieldCol: function() {
    return Fields;
  },
  fields: function() {
    const fields = this.Fields.fetch();
    const self = this;
    return _.map(fields, function(field) {
      return _.extend(field, {
        editing: self.editing,
        highlight: self.highlight,
      });
    });
  },
});

Template.fieldListItem.helpers({
  isEditing: function() {
    return this.editing.get(this._id) ? 'editing' : '';
  }
});

Template.EditForm.helpers({
  getFieldCol: function() {
    return Fields;
  },
  onSuccess: function() {
    return function() {
      Router.go('formsList');
    };
  },
  formId: function() {
    return Router.current().params.form;
  },
  getCol: function() {
    return Forms;
  },
  isEditing: function() {
    let self = Template.instance();
    return self.editing.get(this._id) ? 'editing' : '';
  },
  isHighlighted: function() {
    let self = Template.instance();
    return self.highlight.get(this._id) ? 'highlight' : '';
  },
  editings: function() {
    let self = Template.instance();
    return self.editing;
  },
  highlights: function() {
    let self = Template.instance();
    return self.highlight;
  }

});

Template.fieldListItem.events({
  'click tr': function(evt) {
    var aTag = $("section[name='" + this._id + "']");
    $('.content').scrollTo(aTag, 300);
  },
  "mouseenter tr": (event, template) => {
    template.data.highlight.set(template.data._id, true);
  },
  "mouseleave tr": (event, template) => {
    template.data.highlight.set(template.data._id, false);
  },
  'click .editButton': function(evt) {
    let output = true;
    const aTag = $("section[name='" + this._id + "']");
    if (this.editing.get(this._id)) output = false;
    this.editing.set(this._id, output);
    $('.content').scrollTo(aTag, 1000);
  },
});

Template.EditForm.onCreated(function() {
  this.editing = new ReactiveDict();
  this.highlight = new ReactiveDict();
});

Template.EditForm.destroyed = function() {
  $(".fieldList").dialog("destroy");
};

Template.EditForm.rendered = function() {
  $(this.find(".fieldList")).dialog({
    title: "Form Fields",
    position: {
      my: "right top+75",
      at: "right-125 top"
    }
  }).find("table#items tbody").sortable({
    revert: 100,
    update: function(event, ui) {
      // build a new array items in the right order, and push them
      var rows = $(event.target).children('tr');
      _.each(rows, function(element, index, list) {
        var id = $(element).data('id');
        Fields.update({
          _id: id
        }, {
          $set: {
            listposition: index
          }
        });
      });
    }
  });
};

Template.fieldForm.helpers({
  getCollection: (self) => {
    return getCollection(Router.current().data().form._id);
  },
  getSchema: (self) => {
    const si = schemaItem(self);
    const schema = [si];
    try {
      return new SimpleSchema(schema);
    } catch(e) {
      return new SimpleSchema();
    }
  },
  getId: (self) => {
    return 'fieldEditor-' + self._id;
  }

});

formSchema = function(form) {

  var fields = Fields.find({
    parent: form._id,
    name:{$exists:true}
  }, {
    sort: {
      listposition: 1
    }
  });

  var schema = Meteor.schema();
  fields.forEach(function(field) {
    //if(field.name) {
    si = schemaItem(field);
    _.each(si, function(value, key, obj) {
      schema[key] = value;
    });
    //}
  });
  return schema;
};
