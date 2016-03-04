Template.callable.events({
    "click .clicker": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
      event.stopPropagation();
      var name = this.name;
      var params = [this.name];

      for (var key in this) {
        if (key != "name" && this.hasOwnProperty(key)) {
          params.push(this[key]);
        }
      }
      Meteor.call.apply(null, params);
    }
  });
