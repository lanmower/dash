Meteor.publish("pages", function (path, options) {
  var additions = Pages.additions(this);
  if (path == null)  path = '';
  return Pages.find({
    'path' : { '$regex' : '.*' + path || '' + '.*', '$options' : 'i' },
    $or:additions}, options);
  }
);

Meteor.publishComposite('pageByPath', function(path) {
  var additions = Pages.additions(this);

  return {
    find: function() {
      return Pages.find({path:{$regex : "(/)?"+path}},
      {$or:additions});
    },
    children: [
      {
        find: function(page) {
          return Widgets.find({$and:[
            {'parent': page._id},
            {$or:additions}
          ]});
        },
        children: [
          {
            find: function(widget) {
              return Fields.find({$and:[
                {'parent': widget._id},
                {$or:additions}
              ]});
            },
          },
          {
            find: function(widget) {
              return Widgets.find({$and:[
                {'_id': widget.form},
                {$or:additions}
              ]});
            },
            children: [
              {
                find: function(widget) {
                  return Fields.find({$and:[
                    {'parent': widget._id},
                    {$or:additions}
                  ]});
                },
              }
            ],
          }

        ],
      }
    ]
  };
}
);

Meteor.publishComposite('page', function(id) {
  var additions = Pages.additions(this);

  return {
    find: function() {
      return Pages.find({_id:id},
        {$or:additions});
      },
      children: [
        {
          find: function(page) {
            return Widgets.find({$and:[
              {'parent': page._id},
              {$or:additions}
            ]});
          },
          children: [
            {
              find: function(widget) {
                return Fields.find({$and:[
                  {'parent': widget._id},
                  {$or:additions}
                ]});
              },
            }
          ]
        },
      ]
  };
}
);
