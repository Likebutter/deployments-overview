var express = require('express')
var router = express.Router()
var deploymentService = require('../services/deploymentService')
var jobs = []

router.get('/jobs', function(req, res, next) {
  if (jobs === undefined) {
    jobs = deploymentService.getJobs()
  }
  res.send(
    JSON.stringify(jobs)
  );
});

router.post('/job', function(req, res, next) {
  jobs.push(req.body)
  //deploymentService.saveJob(req.body)
  console.log("Adding new job: " + JSON.stringify(req.body, null, 2))
  res.send("Jobs updated")
});

module.exports = router;