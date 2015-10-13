Meteor.publish('types', function () {
  return Types.find();
});

Meteor.publish('forms', function () {
  return Forms.find();
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
  roles = Roles.getRolesForUser(self.userId);
  return [
    {$and:[
      {"public": true},
      {"public": {$exists: true}}
    ]},
    {view: {$in:roles}},
    {$and:[
      {createdBy: self.userId},
      {createdBy: {$exists: true}}
    ]}
  ];
};
Pages.additions = additions;
Menus.additions = additions;
Widgets.additions = additions;

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
