//"fluent-ffmpeg": "https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/archive/05196c7a70df68067c6dfcaf84e8a73194bf9a30.tar.gz"
FS.debug = false;
FS.config.uploadChunkSize = 262144;
var col = null;
var absolutePath;
if(Meteor.isServer) {
  var Transcoder = Meteor.npmRequire("stream-transcoder");
  var ffmpeg = Meteor.npmRequire("fluent-ffmpeg");
  var Fiber = Meteor.npmRequire('fibers');
  queue = new PowerQueue({
     autostart: true
   });

   var path = Npm.require('path');
   var pathname="";
   if (__meteor_bootstrap__ && __meteor_bootstrap__.serverDir) {
       pathname = path.join(__meteor_bootstrap__.serverDir, "../../../cfs/files/files");
     }
   if (pathname.split(path.sep)[0] === '~') {
     var homepath = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
     if (homepath) {
       pathname = pathname.replace('~', homepath);
     } else {
       throw new Error('FS.Store.FileSystem unable to resolve "~" in path');
     }
   }
   absolutePath = path.resolve(pathname);

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
transformedMedia = [];
var mediaStore = new FS.Store.FileSystem("media", {
  //Create the thumbnail as we save to the store.
  transformWrite: function(fileObj, readStream, writeStream) {
    var run = null;
    //ffmpeg.ffprobe(readStream, function(err, metadata) {
    //  console.log(err);
    //  console.log(metadata);
    //});
    if(typeof Files !== 'undefined') {
    } else return false;


    if(_.contains(transformedMedia, fileObj._id)) {
      return false;
    }
    transformedMedia.push(fileObj._id);
      if(!col) return false;
      queue.add(function(done) {
        var url=absolutePath+"/"+masterStore.adapter.fileKey(fileObj);
        var count = 0;
        var run = false;
        ffm = ffmpeg(url);
        if(fileObj.original.type == 'audio/mp3') {
          ffm.audioCodec('libmp3lame')
      	    .audioBitrate(128 * 1000)
      	    .format('mp3');
            run = true;
          }
        if(fileObj.original.type == 'video/mp4' ||
          fileObj.original.type == 'video/ogv' ||
          fileObj.original.type == 'application/x-troff-msvideo' ||
          fileObj.original.type == 'video/mpeg' ||
          fileObj.original.type == 'video/x-msvideo' ||
          fileObj.original.type == 'video/m4v' ||
          fileObj.original.type == 'video/webm') {
                ffm.videoCodec('libx264')
                .videoBitrate(800 * 1000)
                .size('?x100')
                .audioCodec('aac')
                .audioBitrate(128 * 1000)
                .format('flv');
                run = true;
              }

          if(run)ffm.on('error', function(err, stdout, stderr) {
            Fiber(function() {
              col.update({_id:fileObj._id},{$set:{'metadata.conversionError':err.message}});
              if (transformedMedia.indexOf(fileObj._id) > -1) transformedMedia.splice(transformedMedia.indexOf(fileObj._id), 1);
              done();
            }).run();
    	    }).on('progress', function(progress) {
            if(++count > 10) {
              count = 0;
              perc = progress.percent;
              if(perc > 100 )perc = 100;
              Fiber(function() {
                col.update({_id:fileObj._id},{$set:{"metadata.conversionProgress":Math.round(perc)}});
              }).run();
            }
          }).on('end', function() {
            Fiber(function() {
              col.update({_id:fileObj._id},{$set:{'metadata.converted':true}});
              if (transformedMedia.indexOf(fileObj._id) > -1) transformedMedia.splice(transformedMedia.indexOf(fileObj._id), 1);
              done();
            }).run();
    	    }).stream().pipe(writeStream, {end:true});
      });

    return true;
  }
});

metaStore = new FS.Store.FileSystem("meta", {
  transformWrite: function(fileObj, readStream, writeStream) {
    if(!col) return false;
    if(fileObj.original.type == 'video/mp4' ||
    fileObj.original.type == 'video/ogv' ||
    fileObj.original.type == 'application/x-troff-msvideo' ||
    fileObj.original.type == 'video/mpeg' ||
    fileObj.original.type == 'video/x-msvideo' ||
    fileObj.original.type == 'video/m4v' ||
    fileObj.original.type == 'video/webm') {
      col.update({_id:fileObj._id},{$set:{'metadata.type':'video'}});
    }
    if(fileObj.original.type.startsWith("image/")) col.update({_id:fileObj._id},{$set:{'metadata.type':'image'}});
    if(fileObj.original.type == 'application/pdf') col.update({_id:fileObj._id},{$set:{'metadata.type':'document'}});
    //return false;
    if(fileObj.original.type == 'audio/mp3') {
       col.update({_id:fileObj._id},{$set:{'metadata.type':'audio'}});
    }
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
  stores: [masterStore,thumbnailStore, metaStore, mediaStore],
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
