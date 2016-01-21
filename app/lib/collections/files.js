//"fluent-ffmpeg": "https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/archive/05196c7a70df68067c6dfcaf84e8a73194bf9a30.tar.gz"
//FS.debug = true
var col = null;
if(Meteor.isServer) {
  var Transcoder = Meteor.npmRequire("stream-transcoder");
  var Fiber = Meteor.npmRequire('fibers');
  var queue = new PowerQueue({
     autostart: true
   });

}

//FS.TempStore.Storage = new FS.Store.FileSystem("_tempstore", {
//  internal :  true,
//  path : '/tmp',
//});

var masterStore = new FS.Store.FileSystem("files");
var thumbnailStore = new FS.Store.FileSystem("thumbs", {
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
var mediaStore = new FS.Store.FileSystem("media", {
  //Create the thumbnail as we save to the store.
  transformWrite: function(fileObj, readStream, writeStream) {
    var run = null;
    //ffmpeg.ffprobe(readStream, function(err, metadata) {
    //  console.log(err);
    //  console.log(metadata);
    //});

    if(fileObj.original.type == 'audio/mp3') {
      if(!col) return false;
      col.update({_id:fileObj._id},{$set:{'metadata.type':'audio'}});
      queue.add(function(done) {
        new Transcoder(readStream)
      	    .audioCodec('libmp3lame')
      	    .audioBitrate(128 * 1000)
      	    .format('mp3')
            .on('error', function(error ) {
              Fiber(function() {
                col.update({_id:fileObj._id},{$set:{'metadata.conversionError':error}});
                done();
              }).run();
      	    }).on('finish', function() {
              Fiber(function() {
                col.update({_id:fileObj._id},{$set:{'metadata.converted':true}});
                done();
              }).run();
      	    }).stream().pipe(writeStream);
      });
    }
    if(fileObj.original.type == 'video/mp4' ||
    fileObj.original.type == 'video/ogv' ||
    fileObj.original.type == 'application/x-troff-msvideo' ||
    fileObj.original.type == 'video/mpeg' ||
    fileObj.original.type == 'video/x-msvideo' ||
    fileObj.original.type == 'video/m4v' ||
    fileObj.original.type == 'video/webm') {
      if(!col) return false;
      col.update({_id:fileObj._id},{$set:{'metadata.type':'video'}});
      queue.add(function(done) {
        new Transcoder(readStream)
        	    .maxSize(320, 240)
        	    .videoCodec('h264')
        	    .videoBitrate(800 * 1000)
        	    .fps(25)
        	    .audioCodec('libfaac')
        	    .sampleRate(44100)
        	    .channels(2)
        	    .audioBitrate(128 * 1000)
        	    .format('mp4')
        	    .on('finish', function() {
                Fiber(function() {
                  col.update({_id:fileObj._id},{$set:{'metadata.converted':true}});
                  done();
                }).run();
        	    }).stream().pipe(writeStream);
      });
    }
  }
});

metaStore = new FS.Store.FileSystem("meta", {
  transformWrite: function(fileObj, readStream, writeStream) {
    //return false;
    if(fileObj.original.type == 'audio/mp3') {
      if(!col) return false;
      var mm = Meteor.npmRequire('musicmetadata');
      var stream = Meteor.npmRequire("stream");
      var s = new stream.Readable();
      s._read = function noop() {}; // redundant? see update below
      var parser = mm(readStream, function (err, metadata) {
        if (err) {
          console.log(err);
          throw err;
        }
        s.push("Processed");
        s.push(null);
        s.pipe(writeStream);
        Fiber(function() {
          col.update({_id:fileObj._id},{$set:{'metadata.id3':metadata}});
        }).run();
      });
    }
  }
});

Files = new FS.Collection("files", {
  stores: [masterStore,thumbnailStore, mediaStore, metaStore],
  filter: {
    maxSize: 4294967296, //in bytes
    allow: {
      contentTypes: ['image/*', 'audio/*', 'video/*', 'application/pdf'],
      extensions: ['png', 'jpg', 'jpeg', 'gif','mp3', 'pdf', 'mp4']
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

col = Files;

if(Meteor.isServer){
  Meteor.publish('files', function (id, col, field) {
    return Files.find({"metadata.parentId":id,"metadata.collectionName":col,"metadata.field":field});
  });
  Meteor.publish('file', function(id) {
    return Files.find({_id:id});
  });
  Meteor.publish('uploads', function() {
    return Files.find({uploadedAt:{$exists:false}});
  });
  Files.on('uploaded', function (file) {
    var readStream = file.createReadStream();
    var field = null;
    if(file.metadata) field = file.metadata.field;
    if(!field) return false;
    form = Forms.findOne({collectionName:file.metadata.collectionName});
    if(!Meteor.forms[form._id]) return false;
    collection = Meteor.forms[form._id].collection;
    if(!collection) return false;
    doc = collection.findOne({_id:file.metadata.parentId});
    if(!doc) return false;
    console.log("Meteor.forms['"+form._id+"'].collection.update({_id: '"+doc._id+"'}, {$push: {"+field+":'"+file._id+"'}});")
    var push = {};
    push[field] = file._id;
    collection.update({_id: doc._id}, {$push: push})
    return file;
  });
}

col = Files;

Files.allow({
  insert:function(userId,doc){
    if(!doc.metadata.collectionName || !doc.metadata.field || !doc.metadata.parentId) {
      console.log("missing fields rejection");
      console.log("collectionName", doc.metadata.collectionName);
      console.log("field",doc.metadata.field);
      console.log("parentId",doc.metadata.parentId);
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
