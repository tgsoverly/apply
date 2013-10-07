exports.Apply = function(databaseUrl) {

  var restify = require('restify');
  var mongojs = require('mongojs');

  var collections = ["jobs", "applications"]

  var db = mongojs.connect(databaseUrl, collections);

  function root(req, res, next) {
    res.send({'/jobs':'list available jobs', '/applications':'current applications for jobs', '/api':'how to apply to a job'})
  }

  function api(req, res, next){
    res.send()
  }

  function listJobs(req, res, next) {
    db.jobs.find(function(err, jobs) {
      if(err){
        console.log(err);
      }else{
        res.send(200, jobs); 
      }
    });
  }

  function createJob(req, res, next){
    var job = req.params.job;
    if(job==undefined){
    }
    db.jobs.insert(job,function(err, job) {
      if(err){
        console.log(err);
      }else{
        res.send(200, job); 
      }
    });
  }

  function getJob(req, res, next) {
    var id = req.params.id;
    console.log("Get Job id: "+id);
    if(id==undefined){
    }else{
      db.jobs.findOne({_id:mongojs.ObjectId(id)},function(err, job) {
        res.send(200, job) 
      });
    }
  }

  function listApplications(req, res, next) {
      res.send(400, {"code":"ResourceNotFound","message":"listing applications not allowed."});
  }

  function getApplication(req, res, next) {
    var id = req.params.id
    if(id==undefined){
    }else{
      res.send({'position':'developer',
        'description':'looking for a person who can problem solve'});
    }
  }

  var server = restify.createServer({
    name: 'Apply'
  });

  server.use(restify.bodyParser());

  server.get('/', root);
  server.get('/api', api);
  server.get('/jobs', listJobs);
  server.get('/jobs/:id', getJob);
  server.post('/jobs', createJob);
  server.get('/applications', listApplications);
  server.get('/applications/:id', getApplication);
  // TODO What is HEAD?

  server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
  });

};