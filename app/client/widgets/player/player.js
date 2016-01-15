Meteor.widgetTypes.push({label:"Player", value:"playlistplayer"});

Template.playlistplayer.helpers({
  medialist: function() {
    return Template.instance().list;
  }
});

Template.playlistplayer.onCreated(function(){
  if(this.data && this.data.list)
    this.list = this.data.list;
  else this.list = [
      { type: "video/mp4", src: "http://www.example.com/path/to/video.mp4" },
    ];
    console.log('test');
});
Template.playlistplayer.rendered = function() {
  var self = Template.instance();
  var tag = this.find('video');
  this.player = videojs(tag);

};

Template.playlistplayer.events({
    'click li': function(event, instance){
      instance.player.src([
  { type: "video/mp4", src: $content_path+$target+".mp4" },
  { type: "video/webm", src: $content_path+$target+".webm" },
  { type: "video/ogg", src: $content_path+$target+".ogv" }
]);
instance.player.load();
        // code goes here
    }
});
