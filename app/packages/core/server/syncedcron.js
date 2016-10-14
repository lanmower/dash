SyncedCron.start();

ScheduledJobs = new Mongo.Collection("scheduled");
SyncedCron.add({
  name: 'Scheduled methods',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 1 hour');
  },
  job: function() {
  	var job = ScheduledJobs.findOne();
  	if(job) {
  		if(moment().diff(job.date, 'days') > 0) {
  			console.log('running a job');
  			Meteor.call(job.method);
  		  	ScheduledJobs.remove(job._id);
  		}
  	}
  }
});

ScheduledJobs.allow({
insert:function(userId,doc){
  return true;
},
update:function(userId,doc,fields,modifier){
  return true;
},
remove:function(userId,doc){
  return true;
}
});
