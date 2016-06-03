// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See core-tests.js for an example of importing.
addit = function(self) {
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
  if(self.userId) {
    roles.push(Meteor.users.findOne(self.userId)._id);
  }
  var rules = [
    {$or:[
      {"view": {$size: 0}},
      {"view": {$exists: false}}
    ]},
    {view: {$in:roles}},
    {update: {$in:roles}},
    {remove: {$in:roles}},
    {$or: [
      {$and:[
        {createdBy: self.userId},
        {createdBy: {$exists: true}}
      ]},
      {$and:[
        {"public": true},
        {"public": {$exists: true}}
      ]}
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

export const name = 'core';
export const additions = addit;
