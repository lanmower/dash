Template.mailMessageView.created = function () {
  var template = this;
  template.message = new ReactiveVar();

  //template.autorun(function () {
    Meteor.call('getMailMessage',this.data.id, function(err, data) {
      if (err) console.log(err);
      template.message.set(data);
    });
  //});
};

Template.mailMessageView.helpers({
  message: function() {
    console.log('test');
    return Template.instance().message.get();
  }
});
