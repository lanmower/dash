
Template.mailMessages.created = function () {
  var template = this;
  template.messages = new ReactiveVar();

  template.autorun(function () {
    Meteor.call('getMailMessages', function(err, data) {
      if (err) console.log(err);
      var output = [];
      for(var x in data) {
        output.push(data[x]);
      }
      template.messages.set(output[0]);
      console.log(template.messages.get());
    });
  });
};

Template.mailMessages.helpers({
  messages: function() {
    console.log('test');
    return Template.instance().messages.get();
  }
});
