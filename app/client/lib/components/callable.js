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
      params.push(function(error, result){
        if(error){
          console.log(error);
          return;
        }
        console.log(result);
        $(this.find(".content btn-info")).animate({backgroundColor: "#00ff00"});
      });
      Meteor.call.apply(null, params);
    }
  });
