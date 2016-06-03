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
          return Widgets.find(
            {
              $and:[
                {'parent': page._id},
                {$or:additions  }
              ]
        },
        {sort: {listposition: 1}}
        );
        }
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
  var additions = Widgets.additions(this);
  var pageAdditions = Pages.additions(this);
  var fieldAdditions = Fields.additions(this);
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
