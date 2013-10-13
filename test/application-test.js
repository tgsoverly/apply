// init the test client
var client = restify.createJsonClient({
    version: '*',
    url: 'http://0.0.0.0:8080'
});
 
var jobId = "NEW"

describe('service: applications', function() {

  beforeEach(function(done){
    var collections = ["jobs", "applications"]
    var db = mongojs.connect("test", collections);
     db.jobs.insert({position:"test position",description:"test description"}, function(err, job) {
        jobId = job[0]._id
        done();
     });
  });

  after(function(done){
    done();
  });

// beforeEach(){
//     db.jobs.insert({position:"test position",description:"test description"}, function(err, job) {
//     });
// }

  describe('get response check', function() {
    it('should not get a 200 response', function(done) {
      client.get('/applications', function(err, req, res, obj) {
          if (res.statusCode == 200) {
              throw new Error('invalid response from /applications');
          }
          done();
      });
    });
  });

  describe('post response check', function() {
    it('should get a 400 response because missing description', function(done) {
      client.post('/applications', { application: { invalid: 'object' } }, function(err, req, res, obj) {
        if (res.statusCode != 400) {
          throw new Error('invalid response from /applications');
        }
        done();
      });
    });

    it('should get a 400 response with missing jobId', function(done) {
      client.post('/applications', { application: { name: 'my name', justification: "I am really nice.", code:"https://github.com/tgsoverly/apply"} }, function(err, req, res, obj) {
        if (res.statusCode != 400) {
          throw new Error('invalid response from /applications');
        }
        done();
      });
    });

    it('should get a 200 response with valid application', function(done) {
      client.post('/applications', { application: { name: 'my name', justification: "I am really nice.", code:"https://github.com/tgsoverly/apply", jobId:jobId } }, function(err, req, res, obj) {
        if (res.statusCode != 200) {
          throw new Error('invalid response from /applications');
        }
        done();
      });
    });
  });
});
