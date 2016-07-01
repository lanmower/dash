playlist = new ReactiveVar([]);
Template.MasterLayout.helpers({
  configured: function () {
    return Accounts.loginServicesConfigured();
  },
  list: function () {
    return playlist;
  },
});
Template.loading.onRendered(function () {
    $(this.find(".loading")).fadeOut({duration:2000});
});
