Router.map(function() {
  this.route('bpNotifications', {
    where: 'server',
    path: '/bp_notifications/:subscription_id',
    action: function() {
      // Prepare the response
      this.response.writeHead(200, {'Content-Type': 'application/json'});

      var cookies = new Cookies( this.request );
      var token = cookies.get("meteor_login_token") || "";
      var subscription_id = decodeURIComponent(this.params.subscription_id);
      var subscription = bpSubscriptions.findOne({'subscription_id': subscription_id});

      var user = Meteor.users.findOne({
        'services.resume.loginTokens.hashedToken' : Accounts._hashLoginToken(token),
        _id: subscription.owner,
      });

      if(!user) {
        this.response.statusCode = 401;
        this.response.end(JSON.stringify({error: "Not allowed"}));
      }

      var notifications = bpNotifications.getNotifications({subscription_id:subscription_id, callbackAt:{$exists:false}});
      this.response.end(
        JSON.stringify({notifications: notifications})
      );
      notifications.forEach(function(notification) {
        bpNotifications.update(notification._id, {$set:{callbackAt:new Date()}});
      });
    }
  });
});
