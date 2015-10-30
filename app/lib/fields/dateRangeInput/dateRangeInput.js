Widgets.schemas.dateRangeInput = {
    title:{
      type: String,
      optional: false,
    }
  };
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
