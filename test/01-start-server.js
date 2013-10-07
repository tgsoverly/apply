restify = require('restify');
assert = require('assert');

console.log("FYI: You need a mongodb server running for these tests to work.")

before(function(done) {
    require('../lib/apply').Apply("test");
    done();
});