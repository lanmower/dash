Schedules = new Mongo.Collection('schedules');

Schedules.attachSchema(new SimpleSchema({
  'date':{
    type: Date,
    label: "Date",
    max: 200
  },
  'method' :{
      type: String,
      label: "Method",
      max: 200
  },
  'done' : {
    type:"boolean"
  }
}));

if (Meteor.isServer) {
  Schedules.allow({
  insert:function(userId,doc){
    if (!userId || !Roles.userIsInRole(userId, ['admin'])){
      return false;
    }
    return true;
  },
  update:function(userId,doc,fields,modifier){
    if (!userId || !Roles.userIsInRole(userId, ['admin'])){
      return false;
    }
    return true;
  },
  remove:function(userId,doc){
    if (!userId || !Roles.userIsInRole(userId, ['admin'])){
      return false;
    }
    return true;
  }
  });
  Meteor.setInterval(function() {
      var job = Schedules.findOne({ done: { $exists: false } });
      if(job) {
        if(moment().diff(job.date, 'days') > 0) {
          console.log('running a job');
          var retVal = Meteor.call(job.method);
          Schedules.update(job._id, {$set:{done:true, return:retVal}});
        }
      }
    }, 10000);
}

