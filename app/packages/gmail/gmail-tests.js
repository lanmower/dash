// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by gmail.js.
import { name as packageName } from "meteor/gmail";

// Write your tests here!
// Here is an example.
Tinytest.add('gmail - example', function (test) {
  test.equal(packageName, "gmail");
});
