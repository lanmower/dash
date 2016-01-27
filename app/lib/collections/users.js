if(Meteor.isClient) {
    Meteor.users.after.find(function (userId, selector, options, cursor) {
      var items = cursor.fetch();
      cursor.forEach(function(item){
        if(item.profile) Meteor.subscribe("file", item.profile.picture);
      });
    });
}

Meteor.users.allow({
	  //insert: function () { return true; },
	  //remove: function () { return true; },
    update: function (userId, user) {
      if(Roles.userIsInRole(userId, ["admin", "user-admin"])) return true;
      return user.id == userId;
    }
});
