FS.debug = true
var masterStore = new FS.Store.GridFS("filesStore");
var thumbnailStore = new FS.Store.GridFS("thumbnail", {
    //Create the thumbnail as we save to the store.
    transformWrite: function(fileObj, readStream, writeStream) {

        gm(readStream, fileObj.name()).resize(300,300,"^")
        .gravity('Center').crop(300, 300).quality(100).autoOrient().stream().pipe(writeStream);
        //gm(readStream, fileObj.name).resize(300,300,"^").pipe(writeStream);
        //gm(readStream, fileObj.name).resize(300,300,"^")
        //.gravity('Center').crop(300, 300).quality(100).autoOrient().stream().pipe(writeStream);
    }
});

Files = new FS.Collection("files", {
  stores: [thumbnailStore,masterStore],
  filter: {
      maxSize: 10485760, //in bytes
      allow: {
          contentTypes: ['image/*'],
          extensions: ['png', 'jpg', 'jpeg', 'gif']
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
