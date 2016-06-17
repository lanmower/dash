// Import and rename a variable exported by pages.js.
Meteor.publish("pages", function (path, options) {
  var additions = gong.additions(this);
  if (path == null)  path = '';
  return Pages.find({
    'path' : { '$regex' : '.*' + path || '' + '.*', '$options' : 'i' },
    $or:additions}, options);
  }
);

Meteor.publishComposite('pageByPath', function(path) {
  var additions = gong.additions(this);

  return {
    find: function() {
      return Pages.find({path:{$regex : "(/)?"+path}},
      {$or:additions});
    },
    children: [
      {
        find: function(page) {
          return Widgets.find({$and:[{'parent': page._id},{$or:additions}]},{sort: {listposition: 1}});
        }
      }
    ]
  };
}
);

Meteor.publishComposite('page', function(id) {
  var additions = gong.additions(this);

  return {
    find: function() {
      return Pages.find({_id:id},
        {$or:additions});
      },
      children: [
        {
          find: function(page) {
            return Widgets.find(
              {
                $and:[
                  {'parent': page._id},
                  {$or:additions}
                ]
              }
, {sort: {listposition: 1}}            );
        }
        }
      ]
  };
}
);

Meteor.publishComposite('widget', function(id) {
  var additions = gong.additions(this);
  var pageAdditions = gong.additions(this);
  var fieldAdditions = gong.additions(this);
  return {
    find: function() {
      return Widgets.find({_id:id},
        {$or:additions});
      },
      children: [
        {
          find: function(widget) {
            return Pages.find({$and:[
              {'_id': widget.parent},
              {$or:pageAdditions}
            ]});
          },
        }
      ]
    };
  }
);
