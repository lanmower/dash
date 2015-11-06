Template.updateForm.helpers({
  getFileTypes: function() {
    var schema = Template.currentData.schema;
    var files = [];
    for(var i in schema) {
      if(schema[i].autoform && schema[i].autoform.type == 'cfs-file') {
        files.push[i];
      }
    }
    return files;
  },
  getFile: function(parent) {
    return File.find(parent.item[this]);
  }
});

Template.updateForm.created = function () {
  var template = this;
  console.log(Template.currentData());
};
