Meteor.widgetTypes.push({label:"Countdown", value:"countdown"});

// Parse countdown string to an object
function strfobj(str) {
  var parsed = str.match(parser),
    obj = {};
  labels.forEach(function(label, i) {
    obj[label] = parsed[i]
  });
  return obj;
}
// Return the time components that diffs
function diff(obj1, obj2) {
  var diff = [];
  labels.forEach(function(key) {
    if (obj1[key] !== obj2[key]) {
      diff.push(key);
    }
  });
  return diff;
}
Template.countdown.rendered = function() {
  var labels = ['weeks', 'days', 'hours', 'minutes', 'seconds'],
     nextYear = (new Date().getFullYear() + 1) + '/01/01',
     template = _.template("<div class='time <%= label %>'>"+
         "<span class='count curr top'><%= curr %></span>"+
         "<span class=\"count next top\"><%= next %></span>"+
         "<span class=\"count next bottom\"><%= next %></span>"+
         "<span class=\"count curr bottom\"><%= curr %></span>"+
         "<span class=\"label\"><%= label.length < 6 ? label : label.substr(0, 3)  %></span>"+
       "</div>"),
     currDate = '00:00:00:00:00',
     nextDate = '00:00:00:00:00',
     parser = /([0-9]{2})/gi,
     $example = $(this.find('#main-example'));
  $example.countdown(nextYear, function(event) {
    var newDate = event.strftime('%w:%d:%H:%M:%S'),
      data;
    if (newDate !== nextDate) {
      currDate = nextDate;
      nextDate = newDate;
      // Setup the data
      data = {
        'curr': strfobj(currDate),
        'next': strfobj(nextDate)
      };
      // Apply the new values to each node that changed
      diff(data.curr, data.next).forEach(function(label) {
        var selector = '.%s'.replace(/%s/, label),
            $node = $example.find(selector);
        // Update the node
        $node.removeClass('flip');
        $node.find('.curr').text(data.curr[label]);
        $node.find('.next').text(data.next[label]);
        // Wait for a repaint to then flip
        _.delay(function($node) {
          $node.addClass('flip');
        }, 50, $node);
      });
}
});
};
