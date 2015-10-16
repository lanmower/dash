/*****************************************************************************/
/*  Server Methods */
/*****************************************************************************/

Meteor.methods({
  getFiles: function(params) {
    var result = GoogleApi.get('drive/v2/files', {params:params});
    return result;
  },
  getDiary: function(params) {
    var result = GoogleApi.get('drive/v2/files', {params:params});

    var list = GoogleApi.get('drive/v2/files', {params:{'q':'"0B4GAIeqJCOSTfmRMZDdCdV9QUFZCV3VkbU4zZFR4LVJ1dUNlZmNRTXYxTG9wYjRKc3BjRk0" in parents AND title contains "admin@coas.co.za"'}});
    var todayPath = GoogleApi.get('drive/v2/files', {params:{'q':'"'+list.items[0].id+'" in parents AND title contains "today"'}});
    var today = GoogleApi.get('drive/v2/files', {params:{'q':'"'+todayPath.items[0].id+'" in parents AND title contains "today"'}});
    return today.items[0].id;
  },
  setDiary: function(diary) {
  },
  /**
   * update a user's permissions
   *
   * @param {Object} targetUserId Id of user to update
   * @param {Array} roles User's new permissions
   * @param {String} group Company to update permissions for
   */
  updateRoles: function (targetUserId, roles, group) {
    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['manage-users'])) {
      throw new Meteor.Error(403, "Access denied")
    }

    Roles.setUserRoles(targetUserId, roles, group);
    return "Done";
  },
  'server\method_name': function () {
    // server method logic
  }
});
