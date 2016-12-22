Meteor.widgetTypes.push({
	label: "Countdown",
	value: "countdown"
});
Widgets.schemas.countdown = function() {
	return {
		date: {
			type: Date,
			optional: false,
		}
	}
};

// Parse countdown string to an object
Template.countdown.rendered = function() {
	// Grab the current date
	var currentDate = new Date();

	// Set some date in the future. In this case, it's always Jan 1
	var futureDate = this.data.date;

	// Calculate the difference in seconds between the future and current date
	var diff = futureDate.getTime() / 1000 - currentDate.getTime() / 1000;

	// Instantiate a coutdown FlipClock
	clock = $(this.find('.clock')).FlipClock(diff, {
		clockFace: 'DailyCounter',
		countdown: true
	});
};
