Meteor.publish(null, function (){
  return Meteor.roles.find({})
})
Meteor.publish('types', function () {
  return Types.find();
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

Meteor.publishComposite('form', function(_id) {
  var additions = Widgets.additions(this);
  return {
    find: function() {
      return Forms.find({_id:_id,$or:additions});
    },
    children: [
      {
        find: function(form) {
          return Fields.find({parent:form._id, $or:additions})
        }
      }
    ]
  }
});

//Meteor.publish('form', function (_id) {
//  var additions = Widgets.additions(this);
//  return Forms.find({_id:_id,$or:additions});
//});

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
        },
        {
          find: function(widget){
            return Fields.find({$and:[
              {'parent': widget.form},
              {$or:fieldAdditions}
            ]});
          }
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
