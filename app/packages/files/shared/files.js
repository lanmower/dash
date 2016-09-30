var thumbTransform;
var mediaTransform;
var metaTransform;
var mm,stream,ffmpeg,Fiber,path;
if(Meteor.isServer) {
  mm = require('musicmetadata');
  stream = require('stream');
  ffmpeg = require('fluent-ffmpeg');
  Fiber = require('fibers');
  path = require('path');

  Meteor.publish('files', function (field) {
    return Files.find({"metadata.field":field});
  });
  Meteor.publish('file', function(id) {
    return Files.find({_id:id});
  });
  Meteor.publish('uploads', function() {
    return Files.find({uploadedAt:{$exists:false}});
  });

  var getPath = function() {
    var pathname="../../../cfs/files/files";
    if (pathname.split(path.sep)[0] === '~') {
      var homepath = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
      if (homepath) {
        pathname = pathname.replace('~', homepath);
      } else {
        throw new Error('FS.Store.FileSystem unable to resolve "~" in path');
      }
    }
    return path.resolve(pathname);
  }
  var absolutePath = getPath();

  thumbTransform = (fileObj, readStream, writeStream) => {
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

  mediaTransform = (fileObj, readStream, writeStream) => {
    var run = null;
    //ffmpeg.ffprobe(readStream, function(err, metadata) {
    //  console.log(err);
    //  console.log(metadata);
    //});
    if(typeof Files === 'undefined') {
      return false;
    }
    writeStream.on('finish', () => {
      if(_.contains(transformedMedia, fileObj._id)) {
        return false;
      }
      console.log(fileObj);
      transformedMedia.push(fileObj._id);
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
          fileObj.original.type == 'video/avi' ||
          fileObj.original.type == 'application/x-troff-msvideo' ||
          fileObj.original.type == 'video/msvideo' ||
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

          if(run)ffm.on('error', (err, stdout, stderr) => {
            console.log(stdout, stderr);
            Fiber(() => {
              Files.update({_id:fileObj._id},{$set:{'metadata.conversionError':err.message, 'metadata.err':err, 'metadata.stderr':stderr}});
              done();
            }).run();
          }).on('progress', (progress) => {
            if(++count > 10) {
              count = 0;
              perc = progress.percent;
              if(perc > 100 )perc = 100;
              Fiber(() => {
                Files.update({_id:fileObj._id},{$set:{"metadata.conversionProgress":Math.round(perc)}});
              }).run();
            }
          }).on('end', () => {
            Fiber(() => {
              Files.update({_id:fileObj._id},{$set:{'metadata.converted':true}});
              if (transformedMedia.indexOf(fileObj._id) > -1) transformedMedia.splice(transformedMedia.indexOf(fileObj._id), 1);
              done();
            }).run();
          }).stream().pipe(writeStream, {end:true});
      });

    });

    return true;
  };

  metaTransform = (fileObj, readStream, writeStream) => {
    if(!Files) return false;
    if(fileObj.original.type == 'video/mp4' ||
      fileObj.original.type == 'video/ogv' ||
      fileObj.original.type == 'application/x-troff-msvideo' ||
      fileObj.original.type == 'video/mpeg' ||
      fileObj.original.type == 'video/x-msvideo' ||
      fileObj.original.type == 'video/m4v' ||
      fileObj.original.type == 'video/avi' ||
      fileObj.original.type == 'application/x-troff-msvideo' ||
      fileObj.original.type == 'video/msvideo' ||
      fileObj.original.type == 'video/x-msvideo' ||
      fileObj.original.type == 'video/m4v' ||
      fileObj.original.type == 'video/webm') {

      Files.update({_id:fileObj._id},{$set:{'metadata.type':'video'}});
    }
    if(fileObj.original.type.startsWith("image/")) Files.update({_id:fileObj._id},{$set:{'metadata.type':'image'}});
    if(fileObj.original.type == 'application/pdf') Files.update({_id:fileObj._id},{$set:{'metadata.type':'document'}});
    //return false;
    if(fileObj.original.type == 'audio/mp3') {
       Files.update({_id:fileObj._id},{$set:{'metadata.type':'audio'}});
    }
    if(fileObj.original.type == 'audio/mp3') {
      if(!Files) return false;
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
          Files.update({_id:fileObj._id},{$set:{'metadata.id3':metadata}});
        }).run();
      });
    }
  }
}

FS.config.uploadChunkSize = 262144;

queue = new PowerQueue({
   autostart: true
});



var masterStore = new FS.Store.FileSystem("files");
var thumbnailStore = new FS.Store.FileSystem("thumbs", {
  transformWrite: thumbTransform
});
transformedMedia = [];
var mediaStore = new FS.Store.FileSystem("media", {
  //Create the thumbnail as we save to the store.
  transformWrite: mediaTransform
});

metaStore = new FS.Store.FileSystem("meta", {
  transformWrite: metaTransform
});
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
Files.on('uploaded', function (file) {
  var readStream = file.createReadStream();
  console.log(file.metadata);
  var field = null;
  if(file.metadata) field = file.metadata.field;
  if(!field) return false;
  form = Forms.findOne({_id:file.metadata.formId});
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

Files.allow({
insert:function(userId,doc){
  if(!doc.metadata.formId || !doc.metadata.field || !doc.metadata.parentId) {
    console.log("missing fields rejection");
    console.log("formId", doc.metadata.formId);
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
