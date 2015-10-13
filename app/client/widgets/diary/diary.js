Template.diary.onCreated(function(){
  this.subscribe("me");
});
Template.diary.viewmodel(function (data) {
  return {
    src:'',
    progress:'',
    link: function() {
      var self = this;
      if(!self.src()) {
        //diaries folder
        this.progress('Loading diary');
        Meteor.call("getDiary", {}, function(error, result){
          if(error){
            console.log(error.reason);
            return;
          }
          self.progress('Embedding diary');
          self.src("https://docs.google.com/a/l-inc.co.za/document/d/"+result+"/edit?usp=sharing");
        });
      }
      return self.src();
    },
    body: function() {
    }
  }
});
