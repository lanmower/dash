//FS.debug = true
var masterStore = new FS.Store.GridFS("filesStore");
var thumbnailStore = new FS.Store.GridFS("thumbnail", {
    //Create the thumbnail as we save to the store.
    transformWrite: function(fileObj, readStream, writeStream) {
      if(fileObj.original.type.startsWith("image/") || fileObj.original.type == 'application/pdf')
        gm(readStream, fileObj.name()).setImageFormat('JPG').resize(300,300,"^")
        .gravity('Center').crop(300, 300).quality(100).autoOrient().stream().pipe(writeStream);
        //gm(readStream, fileObj.name).resize(300,300,"^").pipe(writeStream);
        //gm(readStream, fileObj.name).resize(300,300,"^")
        //.gravity('Center').crop(300, 300).quality(100).autoOrient().stream().pipe(writeStream);
    }
});
var mediaStore = new FS.Store.GridFS("media", {
    //Create the thumbnail as we save to the store.
    transformWrite: function(fileObj, readStream, writeStream) {
        if(fileObj.original.type == 'audio/mp3')
          ffmpeg(readStream).audioCodec('libmp3lame').withAudioBitrate('128k').format('mp3').pipe(writeStream);
    }
});

Files = new FS.Collection("files", {
  stores: [masterStore,thumbnailStore, mediaStore],
  filter: {
      maxSize: 4294967296, //in bytes
      allow: {
          contentTypes: ['image/*', 'audio/*', 'application/pdf'],
          extensions: ['png', 'jpg', 'jpeg', 'gif','mp3', 'pdf']
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
if(Meteor.isServer){
Meteor.publish('files', function () {
  return Files.find();
});
Meteor.publish('file', function(id) {
  return Files.find();
});
}

  Files.allow({
    insert:function(userId,project){
      return true;
    },
    update:function(userId,project,fields,modifier){
     return true;
    },
    remove:function(userId,project){
      return true;
    },
    download:function(){
      return true;
    }
  });
