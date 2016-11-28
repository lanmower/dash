Meteor.methods({
  // Subscriptions
  notify: function(from, body, to, uri) {
  	if(Array.isArray(to)) {
	    _.forEach(doc.to, function(to) {
	      notify(from, body, to, uri);
	    });
    } else {
      notify(from, body, to, uri);
    }
  }
});	

notify = function(from, body, to, uri) {
	Push.send({
		from:from,
		title:"From:"+from,
		text:body,
		query:{userId:to}
	});
	bpNotifications.send({title:"From: "+ from,message:body, url:uri}, to);
}

Push.addListener('message', function (notification) {
  console.log(JSON.stringify(notification));
  Dialogs.alert(notification.message, function(){}, notification.payload.title, 'OK');
});