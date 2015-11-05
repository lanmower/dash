Widgets.schemas.dateRangeInput = {
    title:{
      type: String,
      optional: false,
    }
  };
if(Meteor.isClient) {
  Template.dateRangeInput.cell = function(name, item, schema) {
    var time = item[name];
    var start = moment(time[0]);
    var end = moment(time[1]);
    var now = moment();
    var started;
    var ended;
    var statusText;
    if(start.diff(now) < 0) {
      started = true;
      statusText = ". Currently active, ends on" + end.format('MMMM Do, YYYY');
    } else {
      started = false;
      statusText = ". Starting on " + start.format('MMMM Do, YYYY');
    }
    if(end.diff(now) < 0) {
      ended = true;
      statusText = ". Ended on " + end.format('MMMM Do, YYYY');
    }
    var text = "Duration: "+moment.duration(start - end).humanize()+statusText;
    return text;
  }

}
Fields.schemas.dateRangeInput = function(data) {
      return {
        type: [Date],
        label: data.title,
        autoform: {
              type: "bootstrap-daterangepicker",
              dateRangePickerOptions: {
                      //dateLimit: { days: 6 },
                      //minDate: moment(),
                      //maxDate:moment().add(6, 'months'),
                      //startDate: moment().add(1, 'days'),
                      //endDate: moment().add(3, 'days'),
                      timePicker: true,
                      //format: 'DD/MM/YYYY',
                      timePickerIncrement: 30,
                      timePicker12Hour: false,
                      timePickerSeconds: false
                    }
              }
      }
  };
