
exports.getJobs = function() {
   return fetch("/jenkins/jobs")
      .then(res => res.json())
}

exports.getJobKeys = function() {
   return fetch("/jenkins/jobKeys")
      .then(res => res.json())
}