apply
=====

[![Build Status](https://travis-ci.org/tgsoverly/apply.png)](https://travis-ci.org/tgsoverly/apply)

Simple nodejs server to advertise and accept job applications for developers.  I have always stuggled to find a good way to "test" some developers on how quickly they can come up to speed on a new API.  Saw an idea that parse.com use to allow applications from an API.  I thought that was a great idea.

Usage
-----

npm start
npm test

Dependencies
----------

Need a default mongodb running on the deployment machine.

Setup 
------

create a job 

    curl -X POST -H "Content-Type: application/json" -d '{"job" :{"position":"developer","description":"we need someone who can write elegant, well tested code."}}' http://0.0.0.0:8080/jobs

Then all you need to do is point your applicants to the URL endpoint and see what happens.

Customizing
----------

You can set up your own custom application/job schema by changing the api.json file.

