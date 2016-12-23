// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by tasks.js.
import { name as packageName } from "meteor/tasks";

// Write your tests here!
// Here is an example.
Tinytest.add('tasks - example', function (test) {
  test.equal(packageName, "tasks");
});
