UI.registerHelper('isCordova', function(){
  if (Meteor.isCordova){
    return true;
  }
});

notify = function(from, body, to, uri) {
  bpNotifications.send({title:"From: "+ from, message:doc.body, uri:uri}, doc.to);
  Push.send({title:"From: "+ from,text:doc.body,query:{userId:doc.to}})
}
