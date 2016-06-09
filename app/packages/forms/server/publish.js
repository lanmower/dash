Meteor.publish('forms', function () {
  console.log("Subscribing all forms");
  var additions = gong.additions(this);
  return Forms.find({$or:additions});
});

Meteor.publish('approvals', function (field, doc) {
  return Approvals.find({field:field, doc:doc});
});
Meteor.publish('approvals-form', function (form) {
  var fields = Fields.find({parent:form}).fetch();
  fieldIds = [];
  _.each(fields, function(item) {
    console.log(item);
    fieldIds.push(item._id);
  });
  return Approvals.find({field:{$in:fieldIds}});
});

Meteor.publishComposite('form', function(_id) {
  var additions = gong.additions(this);
  console.log("Subscribing form",_id);
  return {
    find: function() {
      return Forms.find({_id:_id,$or:additions});
    },
    children: [
      {
        find: function(form) {
          return Fields.find({parent:form._id, $or:additions}, {sort: {listposition: 1}})
        }
      }
    ],
  }
});

Meteor.publishComposite('field', function(id) {
  var additions = gong.additions(this);
  var widgetAdditions = gong.additions(this);

  return {
    find: function() {
      return Fields.find({_id:id},
        {$or:additions});
      },
      children: [
        {
          find: function(field) {
            return Forms.find({$and:[
              {'_id': field.parent},
              {$or:widgetAdditions}
            ]});
          }
        }
      ]
    };
  }
);
