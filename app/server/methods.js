notify = function(from, body, to, uri) {
  bpNotifications.send({title:"From: "+ from,message:body, url:uri}, to);
  Push.send({from:from, title:"From: "+ from,text   :body, query:{userId:to}});
}
Meteor.methods({
  // Subscriptions
  notify: function(from, body, to, uri) {
	Push.send({
		from:from,
		title:"From:"+from,
		text:body,
		query:{userId:to}
	});
  }
});	