restify = require('restify');
assert = require('assert');
mongojs = require('mongojs');

console.log("FYI: You need a mongodb server running for these tests to work.")

before(function(done) {
    require('../lib/apply').Apply("test");
    var collections = ["jobs", "applications"]

    var db = mongojs.connect("test", collections);
    
    db.jobs.insert({position:"test position",description:"test description"}, function(err, job) {
    });
    done();
});