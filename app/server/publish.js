Meteor.publish(null, function (){
  return Meteor.roles.find({})
});
Meteor.publish(null, function (){
});



Meteor.publish('times', function () {
  return Times.find();
});
Meteor.publish('diaries', function () {
  return Diaries.find({user:this.userId});
});
Meteor.publish('diaries-admin', function () {
  if(Roles.userIsInRole(this.userId, "admin") ||
     Roles.userIsInRole(this.userId, "diaries-admin")) return Meteor.roles.find();
  return Diaries.find();
});

Meteor.publish('roles', function () {
  if(Roles.userIsInRole(this.userId, "admin")) return Meteor.roles.find();
});


Meteor.publish('messages', function () {
  roles = Roles.getRolesForUser(this.userId);
  var tos = [this.userId, 'all'];
  for(var x in roles) {
    tos.push(roles[x]);
  }
  return Messages.find({to: {$in:tos}}, {sort: {createdAt: 1}, limit: 50});
});

var additions = function(self) {
  //no user? only public
  if(!self.userId) {
    return [
      {$and:[
        {"public": true},
        {"public": {$exists: true}}
      ]}
    ];
  }

  //if user test against user roles, can see viewable updatable and removable items
  roles = Roles.getRolesForUser(self.userId);
  var rules = [
    {$or:[
      {"view": {$size: 0}},
      {"view": {$exists: false}}
    ]},
    {view: {$in:roles}},
    {update: {$in:roles}},
    {remove: {$in:roles}},
    {$and:[
      {createdBy: self.userId},
      {createdBy: {$exists: true}}
    ]}
  ];

  if(self.userId) {
    roles.push(Meteor.users.findOne(self.userId)._id);
    rules.push(
      {$or:[
        {"view": "@"}
      ]}
    );
  }

  if(Roles.userIsInRole(self.userId, "admin"))
    rules.push({_id: {$exists: true}});

  return rules;
};

Pages.additions = additions;
Menus.additions = additions;
Widgets.additions = additions;
Fields.additions = additions;

Meteor.publish('forms', function () {
  var additions = Widgets.additions(this);
  return Forms.find({$or:additions});
});
Meteor.publish('approvals', function (field, doc) {
  return Approvals.find({field:field, doc:doc});
});
Meteor.publish('approvals-form', function (form) {
  var fields = Fields.find({parent:form});
  fieldIds = [];
  _.each(fields, function(item) {
    fieldIds.push(item._id);
  });
  return Approvals.find({field:{$in:fieldIds}});
});

Meteor.publish('gmailMsg', function(id) {
  return gmail.find({_id:id});
});

Meteor.publish('gmailSearch', function(uid, q) {
  return [gmailSearch.find({user:uid, query:q}), gmail.find({user:uid, query:q})];
});

Meteor.publishComposite('form', function(_id) {
  var additions = Widgets.additions(this);
  return {
    find: function() {
      return Forms.find({_id:_id,$or:additions});
    },
    children: [
      {
        find: function(form) {
          return Fields.find({parent:form._id, $or:additions}, {sort: {listposition: 1}})
        }
      },
      /*{
        find: function(form) {
          return Meteor.forms[form._id].collection.find({$or: [
            {createdBy: this.userId},
            {$and:[
              {"public": true},
              {"public": {$exists: true}}
            ]}
          ]});
        },
        children: [
          {
          find: function(item, parent) {
            form = Meteor.forms[parent._id];
            var fields = [];
            console.log({parent: parent._id,type:"fileUpload"});
            Fields.find({parent: parent._id,type:"fileUpload"}).forEach(function (field) {
              console.log('test');
              fields.push(field.name);
            });
            console.log({"metadata.parentId":item._id, "metadata.collectionName":form.collectionName,"metadata.field":{$in:fields}});
            return Files.find({"metadata.parentId":item._id, "metadata.collectionName":form.collectionName,"metadata.field":{:fields}});
          }
          }
        ]
      }*/
    ],
  }
});


Meteor.publish('menus', function () {
  var additions = Menus.additions(this);
  return Menus.find({$or:additions});
});
Meteor.publish('menu', function (id) {
  var additions = Menus.additions(this);
  return Menus.find({_id: id,$or:additions});
});

Meteor.publishComposite('widget', function(id) {
  var additions = Widgets.additions(this);
  var pageAdditions = Pages.additions(this);
  var fieldAdditions = Fields.additions(this);
  return {
    find: function() {
      return Widgets.find({_id:id},
        {$or:additions});
      },
      children: [
        {
          find: function(widget) {
            return Pages.find({$and:[
              {'_id': widget.parent},
              {$or:pageAdditions}
            ]});
          },
        }
      ]
    };
  }
);
Meteor.publishComposite('field', function(id) {
  var additions = Fields.additions(this);
  var widgetAdditions = Widgets.additions(this);

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
