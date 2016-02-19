Template.mailMessages.events({
  'keyup #mailSearch': _.debounce(function(e, template) {
    e.preventDefault();
    Router.go ('mailList',{q: e.target.value, user: Router.current().params.user});
  }, 300)
});
Template.mailMessage.helpers({
  message: function() {
    return gmail.findOne({_id:Template.currentData().id});
  }
});
Template.mailMessages.rendered = function () {
  var lastSearch = null;
  var lastUid = null;
  this.autorun(function () {
    if(Router.current().params.q != lastSearch ||
      Router.current().params.user != lastUid)
      console.log('calling', Router.current().data().user,Router.current().params.q);
      lastSearch = Router.current().params.q;
      lastUid = Router.current().params.user;
      Meteor.call("gmailSearch",
        Router.current().params.user,
        Router.current().params.q,
        function(err,data){
          console.log(data)
        }
      );
  });
  if(Router.current().params.q) this.find('#mailSearch').value = Router.current().params.q;
};
