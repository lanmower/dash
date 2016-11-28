UI.registerHelper('isCordova', function(){
  if (Meteor.isCordova){
    return true;
  }
});

notify = function(from, body, to, uri) {
  bpNotifications.send({title:"From: "+ from, message:body, url:uri}, to);
  Push.send({title:"From: "+ from,text:body,query:{userId:to}})
}
