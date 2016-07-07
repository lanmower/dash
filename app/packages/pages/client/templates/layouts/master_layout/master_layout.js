playlist = new ReactiveVar([]);
Template.MasterLayout.rendered = function() {
    $(".spinner").fadeOut(2000);
}
Template.MasterLayout.helpers({
  configured: function () {
    return Accounts.loginServicesConfigured();
  },
  list: function () {
    return playlist;
  },
});
