import Future from 'fibers/future';
/*****************************************************************************/
/*  Server Methods */
/*****************************************************************************/

Meteor.methods({
  'command' : function(line) {
    exec = Npm.require('child_process').exec;
    console.log("In command method", line);
    var Fiber = Meteor.npmRequire('fibers');
    exec(line, function(error, stdout, stderr) {
      console.log('Command Method', error, stdout, stderr);
      Fiber(function() {
        //Replies.remove({});
        //var replyId = Replies.insert({message: stdout ? stdout : stderr});
        //return replyId;
      }).run();
    });
  },
  downloadAvatar: function(userId) {
    console.log("Downloading avatar for:"+userId);
    this.unblock();
    DownloadAvatar(userId);
  }
});
