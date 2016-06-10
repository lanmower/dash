import mm from 'musicmetadata';
import stream from "stream";
import ffmpeg from 'fluent-ffmpeg';
import Fiber from 'fibers'

//"fluent-ffmpeg": "https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/archive/05196c7a70df68067c6dfcaf84e8a73194bf9a30.tar.gz"
FS.config.uploadChunkSize = 262144;

var getPath = function() {
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
  return path.resolve(pathname);
}
var absolutePath = getPath();

queue = new PowerQueue({
   autostart: true
 });


//FS.TempStore.Storage = new FS.Store.FileSystem("_tempstore", {
//  internal :  true,
//  path : '/tmp',
//});





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
