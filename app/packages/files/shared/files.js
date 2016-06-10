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

          if(run)ffm.on('error', function(err, stdout, stderr) {
            Fiber(function() {
              Files.update({_id:fileObj._id},{$set:{'metadata.conversionError':err.message}});
              if (transformedMedia.indexOf(fileObj._id) > -1) transformedMedia.splice(transformedMedia.indexOf(fileObj._id), 1);
              done();
            }).run();
    	    }).on('progress', function(progress) {
            if(++count > 10) {
              count = 0;
              perc = progress.percent;
              if(perc > 100 )perc = 100;
              Fiber(function() {
                Files.update({_id:fileObj._id},{$set:{"metadata.conversionProgress":Math.round(perc)}});
              }).run();
            }
          }).on('end', function() {
            Fiber(function() {
              Files.update({_id:fileObj._id},{$set:{'metadata.converted':true}});
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
