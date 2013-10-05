var restify = require('restify');

var MongoClient = require('mongodb').MongoClient

function root(req, res, next) {
  res.send({'/jobs':'list available jobs', '/applications':'current applications for jobs', 'api':'how to apply to a job'})
}

function jobs(req, res, next) {
  res.send({'position':'developer',
    'description':'looking for a person who can problem solve'});
}

function applications(req, res, next) {
  var id = req.params.id
  if(id==undefined){
    res.send({"code":"ResourceNotFound","message":"listing applications not allowed."});
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
server.get('/jobs', jobs);
server.get('/applications', applications);
server.get('/applications/:id', applications);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});