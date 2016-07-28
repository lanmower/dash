// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by currency.js.
import { name as packageName } from "meteor/currency";

// Write your tests here!
// Here is an example.
Tinytest.add('currency - example', function (test) {
  test.equal(packageName, "currency");
});
