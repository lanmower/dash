Meteor.widgetTypes.push({label:"Player", value:"playlistplayer"});
player = null;
currentId = new ReactiveVar({current:0});
Template.playlistplayer.helpers({
  medialist: function() {
    return Template.currentData().list.get();
  },
  isActive: function(index) {
    return index == currentId.get().current ? 'active':'';
  }

});

Template.playlistplayer.rendered = function() {
  var self = Template.instance();
  var tag = this.find('video');
  this.player = videojs(tag, {"inactivityTimeout": 0 });
  if(Template.currentData().global) {
    player = this.player;
  }
  var data = Template.currentData();

  this.player.on("ended", function(){
    var list = data.list.get();

    current = parseInt(currentId.get().current);
    if(list.length > current+1) {
      currentId.set({current:current+1});
    }
  });

  Tracker.autorun(function () {
    var list = data.list.get();
    if(list.length && list.length-1 < currentId.get().current) {
      currentId.set({current:list.length-1});
    }
    if(self.player.paused() && list.length) {
      item = list[currentId.get().current];
      console.log(item.type, self.player.height());
      if(item.type=="audio/mp3") self.player.height(27);
      else self.player.height(180);
      self.player.src([
          list[currentId.get().current]
      ]);
      self.player.play();
      $('.control-sidebar').show();
    }
  });
};

Template.playlistplayer.events({
    'click .remove': function(event, instance) {
      event.stopPropagation();
      var list = Template.currentData().list;
      var output = list.get()
      var index = event.currentTarget.parentElement.dataset.id;
      var current =currentId.get().current;
      if(index == current) self.player.pause();
      if(index < current) currentId.set({current:current-1})
      output.splice(index, 1);
      list.set(output);
    },
    'click li': function(event, instance){
      self.player.pause();
      currentId.set({current:event.currentTarget.dataset.id});
    }
});
