playlist = new ReactiveVar([]);
Template.MasterLayout.helpers({
  configured: function () {
    return Accounts.loginServicesConfigured();
  },
  list: function () {
    return playlist;
  },
});
