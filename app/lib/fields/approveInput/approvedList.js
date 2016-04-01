if(Meteor.isClient) {
  Template.approveInput={};
    Template.approveInput.cell = function(name, item, schema) {
      var router = Router.current();
      var value = item[name];
      var output = "";
      var subscription = router.subscribe('approvals-form', router.params._id);

      var approvals = Approvals.find({form:router.params._id, doc:item._id, field:name, value:true}).fetch();
      var toutput = [];
      for(var x in approvals) {
        var approval = approvals[x];
        toutput.push(Meteor.users.findOne({_id:approval.user}).profile.name);
      }
      if(toutput.length) output += "Accepted by: "+toutput.join();
      toutput = [];
      var rejections = Approvals.find({form:router.params._id, doc:item._id, field:name, value:false}).fetch();
      for(var x in rejections) {
        var rejection = rejections[x];
        toutput.push(Meteor.users.findOne({_id:rejection.user}).profile.name);
      }
      if(output.length) output += " ";
      if(toutput.length) output += "Rejected by: "+toutput.join();
      return output;
    }
}
