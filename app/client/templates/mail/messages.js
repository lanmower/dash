
Template.mailMessages.created = function () {
  var template = this;
  template.messages = new ReactiveVar();

  template.autorun(function () {
    Meteor.call('listMailMessages', function(err, data) {
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
    return Template.instance().messages.get();
  }
});


Template.mailMessage.created = function () {
  var template = this;
  template.message = new ReactiveVar();

  //template.autorun(function () {
    Meteor.call('getMailMessage',this.data.id, function(err, data) {
      if (err) console.log(err);
      template.message.set(data);
    });
  //});
};

Template.mailMessage.helpers({
  message: function() {
    console.log('test');
    return Template.instance().message.get();
  }
});
