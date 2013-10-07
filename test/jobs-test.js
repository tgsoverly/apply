// init the test client
var client = restify.createJsonClient({
    version: '*',
    url: 'http://0.0.0.0:8080'
});
 
describe('service: jobs', function() {
     describe('get response check', function() {
        it('should get a 200 response', function(done) {
            client.get('/jobs', function(err, req, res, obj) {
                if (res.statusCode != 200) {
                    throw new Error('invalid response from /jobs');
                }
                done();
            });
        });
    });
    describe('post response check', function() {
        it('should get a 200 response', function(done) {
            client.post('/jobs', function(err, req, res, obj) {
                if (res.statusCode != 200) {
                    throw new Error('invalid response from /jobs');
                }
                done();
            });
        });
    });
});