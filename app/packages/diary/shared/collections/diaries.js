Diaries = new Mongo.Collection('diaries');
Diaries.allow({
  insert: function (userId, widget) {
      return true;
  },
  update: function (userId, widget, fields, modifier) {
    return true;
  },
  remove: function (userId, widget) {
      return true;
  }
});
