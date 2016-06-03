// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by countdown.js.
import { name as packageName } from "meteor/countdown";

// Write your tests here!
// Here is an example.
Tinytest.add('countdown - example', function (test) {
  test.equal(packageName, "countdown");
});
