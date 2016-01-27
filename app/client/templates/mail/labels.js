
Template.mailLabels.created = function () {
  var template = this;
  template.labels = new ReactiveVar();

  template.autorun(function () {
    Meteor.call('getMailLabels', function(err, data) {
      if (err) console.log(err);
      var output = [];
      for(var x in data) {
        output.push(data[x]);
      }
      template.labels.set(output[0]);
      console.log(template.labels.get());
    });
  });
};

Template.mailLabels.helpers({
  labels: function() {
    console.log('test');
    return Template.instance().labels.get();
  }
});
