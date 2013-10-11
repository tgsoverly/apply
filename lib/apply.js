exports.Apply = function(databaseUrl) {

  var restify = require('restify');
  var mongojs = require('mongojs');
  var fs = require("fs");
  var ZSchema = require("z-schema");

  var validator = new ZSchema();
  var applicationSchema
  var jobSchema
  var apiString = fs.readFileSync('lib/api.json', 'utf8')
  var schema = JSON.parse(apiString).urls[1].schema;
  validator.compileSchema(schema, function (err, compiledSchema) {
    applicationSchema = compiledSchema
  });
  schema = JSON.parse(apiString).urls[0].schema;
  validator.compileSchema(schema, function (err, compiledSchema) {
    jobSchema = compiledSchema
  });

  var collections = ["jobs", "applications"]

  var db = mongojs.connect(databaseUrl, collections);

  function root(req, res, next) {
    res.send({'/api':'how to apply to a job'})
  }

  function api(req, res, next){
    res.send(JSON.parse(apiString))
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
      res.send(400, {"code":"BadRequest","message":"job not provided."});
    }else{
      validator.validate(job, jobSchema).then(function(report){
        db.jobs.insert(job,function(err, job) {
          if(err){
            console.log(err);
          }else{
            res.send(200, job); 
          }
        });
      })
      .fail(function(err){
          res.send(400, {"code":"BadRequest","message":"validation failed: "+err});
      })
    }
  }

  function getJob(req, res, next) {
    var id = req.params.id;
    console.log("Get Job id: "+id);
    if(id==undefined){
      res.send(400, {"code":"BadRequest","message":"id not provided."});
    }else{
      db.jobs.findOne({_id:mongojs.ObjectId(id)},function(err, job) {
        res.send(200, job) 
      });
    }
  }

  function listApplications(req, res, next) {
      res.send(403, {"code":"Forbidden","message":"listing applications not allowed."});
  }

  function getApplication(req, res, next) {
    var id = req.params.id
    if(id==undefined){
      res.send(400, {"code":"BadRequest","message":"id not provided."});
    }else{
    }
  }

  function createApplication(req, res, next){
    var application = req.params.application;
    if(application==undefined){
      res.send(400, {"code":"BadRequest","message":"application not provided."});
    }
    var schema = JSON.parse(fs.readFileSync('api.json', 'utf8')).urls[0].schema;
    ZSchema.validate(application, schema).then(function(report){
      db.jobs.insert(job,function(err, application) {
        if(err){
          res.send(500, {"code":"InternalError","message":err});
        }else{
          res.send(200, job); 
        }
      });
    }).fail(function(err){
      res.send(400, {"code":"BadRequest","message":"id not provided."});
    })
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
  server.post('/applications', createApplication);

  server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
  });

};