exports.restartAppserver = function(jobUrl) {
   queryJenkins(jobUrl, "buildWithParameters?OPERATIONS_PROFILE=restart-simple&DATABASE_SKIP=true")
}

exports.migrateDatabase = function(jobUrl) {
   queryJenkins(jobUrl, "buildWithParameters?DEFAULT_DATABASE_HANDLING=migrate-database")
}

exports.recreateDatabase = function(jobUrl) {
   queryJenkins(jobUrl, "buildWithParameters")
}

var queryJenkins = function(jobUrl, queryPath) {
   fetch(jobUrl + queryPath, {
      method: 'POST',
      mode: 'no-cors',
      credentials: "include"
   })
   .then(res => {
      console.log(res)
      if (res.ok) {
         alert("Operation performed successfully.")
      } else {
         alert("Cannot perform operation - some errors occurred. please contact SI-Team.")
      }
   })
   .catch(err => {
      console.error("Network errors: " + err)
   })
}

exports.getJobs = function(endpoint) {
   return fetch(endpoint)
      .then(res => res.json())
      .then(res => res)
}

exports.getJobKeys = function() {
   return fetch("/jenkins/jobKeys")
      .then(res => res.json())
}