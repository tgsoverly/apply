exports.Apply = function(databaseUrl) {

  var restify = require('restify');
  var mongojs = require('mongojs');
  var fs = require("fs");
  var ZSchema = require("z-schema");
  var nodemailer = require("nodemailer");

  var validator = new ZSchema();
  var applicationSchema
  var jobSchema
  var apiString = fs.readFileSync(__dirname+'/api.json', 'utf8');
  var jobString = fs.readFileSync(__dirname+'/schema/job.schema', 'utf8');
  var applicationString = fs.readFileSync(__dirname+'/schema/application.schema', 'utf8');

  var emailConfig = JSON.parse(fs.readFileSync(__dirname+'/email/config.json', 'utf8'));

  var smtpTransport = nodemailer.createTransport("SMTP", emailConfig.smtp );

   // setup e-mail data with unicode symbols
  var mailOptions = {
    from: emailConfig.smtp.auth.user, // sender address
    to: emailConfig.toArray, // list of receivers
    subject: "Someone has applied", // Subject line
    text:""
  } 

  var schema = JSON.parse(applicationString);
  validator.compileSchema(schema, function (err, compiledSchema) {
    applicationSchema = compiledSchema
  });

  schema = JSON.parse(jobString);
  validator.compileSchema(schema, function (err, compiledSchema) {
    jobSchema = compiledSchema
  });

  var collections = ["jobs", "applications"]

  var db = mongojs.connect(databaseUrl, collections);

  function root(req, res, next) {
    res.send({'/api':'how to apply for a job'})
  }

  function api(req, res, next){
    var api = JSON.parse(apiString)
    api.jobs.schema = JSON.parse(jobString)
    api.applications.schema = JSON.parse(applicationString)
    res.send(api)
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
      job = req.params
    }
    validator.validate(job, jobSchema).then(function(report){
      db.jobs.insert(job,function(err, job) {
        if(err){
          res.send(400, {"code":"BadRequest","message":err});
        }else{
          res.send(200, job[0]); 
        }
      });
    }).fail(function(err){
      res.send(400, {"code":"BadRequest","message":err});
    })
  }

  function deleteJob(req, res, next){
    var id = req.params.id
    if(id==undefined){
      res.send(400, {"code":"BadRequest","message":"id not provided."});
    }else{
      db.jobs.remove({_id:mongojs.ObjectId(id)}, true ,function(err, job) {
        res.send(204, job) 
      });
    }
  }

  function getJob(req, res, next) {
    var id = req.params.id;
    if(id==undefined){
      res.send(400, {"code":"BadRequest","message":"id not provided."});
    }else{
      db.jobs.findOne({_id:mongojs.ObjectId(id)},function(err, job) {
        res.send(200, job) 
      });
    }
  }

  function getApplication(req, res, next) {
    var id = req.params.id
    if(id==undefined){
      res.send(400, {"code":"BadRequest","message":"id not provided."});
    }else{
      db.applications.findOne({_id:mongojs.ObjectId(id)},function(err, application) {
        res.send(200, application) 
      });
    }
  }

  function deleteApplication(req, res, next) {
    var id = req.params.id
    if(id==undefined){
      res.send(400, {"code":"BadRequest","message":"id not provided."});
    }else{
      db.applications.remove({_id:mongojs.ObjectId(id)}, true ,function(err, application) {
        res.send(204, application) 
      });
    }
  }

  function updateApplication(req, res, next){
    var id = req.params.id
    var application = req.params.application
    if(id==undefined){
      res.send(400, {"code":"BadRequest","message":"id not provided."});
    }else if(application==undefined){
      application = req.params
    }
    validator.validate(application, applicationSchema)
    .then(function(report){
      db.applications.findOne({_id:mongojs.ObjectId(id)}, application ,function(err, application) {
        res.send(200, application[0]) 
      });
    })
    .fail(function(err){
      res.send(400, {"code":"BadRequest","message":err});
    }) 
  }

  function createApplication(req, res, next){
    var application = req.params.application;
    if(application==undefined){
      application = req.params
    }
    validator.validate(application, applicationSchema).then(function(report){
      db.jobs.findOne({_id:mongojs.ObjectId(application.jobId)},function(err, job) {
        db.applications.insert(application,function(err, application) {
          if(err){
            res.send(400, {"code":"BadRequest","message":err});
          }else{
            console.log("Setting applicationId: "+application[0])
            mailOptions.text="Application: "+JSON.stringify(application[0])
            smtpTransport.sendMail(mailOptions, function(error, response){
              if(error){
                console.log("Error sending mail"+error);
              }else{
                console.log("Message sent: " + response.message);
              }
            });
            res.send(200, application[0]); 
          }
        });
      });
    }).fail(function(error){
      res.send(400, {"code":"BadRequest","messages":error});
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
  server.del('/jobs/:id', deleteJob);

  server.get('/applications/:id', getApplication);
  server.post('/applications', createApplication);
  server.put('/applications/:id', updateApplication);
  server.del('/applications/:id', deleteApplication);

  server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
  });

};