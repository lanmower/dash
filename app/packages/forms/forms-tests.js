// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by forms.js.
import { name as packageName } from "meteor/forms";

// Write your tests here!
// Here is an example.
Tinytest.add('forms - example', function (test) {
  test.equal(packageName, "forms");
});
