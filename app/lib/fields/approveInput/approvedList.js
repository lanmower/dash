if(Meteor.isClient) {
  Template.approveInput={};
    Template.approveInput.cell = function(name, item, schema, field) {
      var router = Router.current();
      var output = "";
      var field = Fields.findOne({parent:Router.current().params._id, name:name});
      var subscription = router.subscribe('approvals', field._id, item._id);
      var approvals = Approvals.find({doc:item._id, field:field._id, value:true}).fetch();
      var toutput = [];
      for(var x in approvals) {
        var approval = approvals[x];
        toutput.push(Meteor.users.findOne({_id:approval.user}).profile.name);
      }
      if(toutput.length) output += "Accepted by: "+toutput.join();
      toutput = [];
      var rejections = Approvals.find({doc:item._id, field:field._id, value:false}).fetch();
      for(var x in rejections) {
        var rejection = rejections[x];
        toutput.push(Meteor.users.findOne({_id:rejection.user}).profile.name);
      }
      if(output.length) output += " ";
      if(toutput.length) output += "Rejected by: "+toutput.join();
      return output;
    }
}
