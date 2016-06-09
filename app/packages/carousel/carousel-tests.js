// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by carousel.js.
import { name as packageName } from "meteor/carousel";

// Write your tests here!
// Here is an example.
Tinytest.add('carousel - example', function (test) {
  test.equal(packageName, "carousel");
});
