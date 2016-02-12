
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
    });
  });
};

Template.mailLabels.helpers({
  labels: function() {
    return Template.instance().labels.get();
  }
});
