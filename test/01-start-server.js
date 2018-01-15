restify = require('restify');
assert = require('assert');
mongojs = require('mongojs');

console.log("FYI: You need a mongodb server running for these tests to work.")

before(function(done) {
    require('../lib/apply').Apply("test");
    var collections = ["jobs", "applications"]
    var db = mongojs("test", collections);
    db.jobs.runCommand('drop', function(err, res) {
      // console.log(res);
    });    
    db.applications.runCommand('drop', function(err, res) {
      // console.log(res);
    });
    done();
});