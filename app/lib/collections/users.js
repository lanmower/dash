if(Meteor.isClient) {
    Meteor.users.after.find(function (userId, selector, options, cursor) {
      var items = cursor.fetch();
      cursor.forEach(function(item){
        Meteor.subscribe("file", item.profile.picture);
      });
    });
}
