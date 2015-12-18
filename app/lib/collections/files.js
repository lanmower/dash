//FS.debug = true
var masterStore = new FS.Store.GridFS("filesStore");
var thumbnailStore = new FS.Store.GridFS("thumbnail", {
    //Create the thumbnail as we save to the store.
    transformWrite: function(fileObj, readStream, writeStream) {
      if(fileObj.original.type.startsWith("image/") || fileObj.original.type == 'application/pdf')
      try{
        gm(readStream, fileObj.name()).setFormat('JPG').resize(300,300,"^")
        .gravity('Center').crop(300, 300).quality(100).autoOrient().stream().pipe(writeStream);
      } catch (e) {

      }
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
    return Files.find({_id:id});
  });
  Meteor.publish('uploads', function() {
    return Files.find({uploadedAt:{$exists:false}});
  });
  Files.on('uploaded', function (file) {
    field = file.metadata.field;
    if(!field) return false;
    form = Forms.findOne({collectionName:file.metadata.collectionName});
    if(!Meteor.forms[form._id]) return false;
    collection = Meteor.forms[form._id].collection;
    if(!collection) return false;
    doc = collection.findOne({_id:file.metadata.parentId});
    if(!doc) return false;
    console.log(form._id);
    console.log(doc._id);
    console.log(field);
    console.log(file._id);
    console.log("Meteor.forms['"+form._id+"'].collection.update({_id: '"+doc._id+"'}, {$push: {"+field+":'"+file._id+"'}});")
    var push = {};
    push[field] = file._id;
    collection.update({_id: doc._id}, {$push: push})
    return file;
  });
}

  Files.allow({
    insert:function(userId,doc){
      if(!doc.metadata.collectionName || !doc.metadata.field || !doc.metadata.parentId) {
        console.log("missing fields rejection");
        return false;
      }
      return true;
    },
    update:function(userId,doc,fields,modifier){
     return true;
    },
    remove:function(userId,doc){
      return true;
    },
    download:function(){
      return true;
    }
  });
