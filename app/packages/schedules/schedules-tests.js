// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by menus.js.
import { name as packageName } from "meteor/menus";

// Write your tests here!
// Here is an example.
Tinytest.add('menus - example', function (test) {
  test.equal(packageName, "menus");
});
