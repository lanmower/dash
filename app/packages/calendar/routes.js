import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';

Router.route('form/calendar/:form', {
  title: 'Calendar',
  name: 'submissionsCalendar',
  fastRender: true,
  where: 'client',
  waitOn: function() {
    return [
      Meteor.subscribe("form", this.params.form),
			Meteor.subscribe("users")
    ];
  },
  data: function () {
    var form = Forms.findOne({_id:this.params.form});
    var collection;
    var fields;
    if(form) {
      collection = getCollection(form._id);
      fields = Fields.find({parent:form._id},{sort: { listposition: 1 }});
    }
    return {
      form: form,
      formId: this.params.form,
      collection: collection,
      fields: fields
    };
  }
});
