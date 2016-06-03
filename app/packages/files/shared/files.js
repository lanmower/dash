if(Meteor.isClient) {
  var masterStore = new FS.Store.FileSystem("files");
  var thumbnailStore = new FS.Store.FileSystem("thumbs");
  var mediaStore = new FS.Store.FileSystem("media");
  var metaStore = new FS.Store.FileSystem("meta");
  Files = new FS.Collection("files", {
    stores: [masterStore,thumbnailStore, metaStore, mediaStore],
    filter: {
      maxSize: 4294967296, //in bytes
      allow: {
        contentTypes: ['image/*', 'audio/*', 'video/*', 'application/pdf'],
        extensions: ['png', 'jpg', 'jpeg', 'gif','mp3', 'pdf', 'mp4', 'avi']
      },
      onInvalid: function (message) {
        if(Meteor.isClient){
          alert(message);
        }else{
          console.warn(message);
        }
      }
    }
  });
}
