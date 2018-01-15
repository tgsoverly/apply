var apply = require('./lib/apply')
var mongoUrl = process.env.MONGODB_URL ? process.env.MONGODB_URL : "apply";
apply.Apply(mongoUrl)