var express = require('express')
var router = express.Router()
var xmldoc = require('xmldoc')
const fetch = require('cross-fetch')

var JENKINS_URL = ""
var JOBS_VIEW = "/view/All/api/json"
var DEPLOYMENT_URL_REGEX = /mv-((master)|((\d+\.){3,}\w+))_c\d{5}.*/
var EXECUTION_LOG_PATH = "ws/cdimage/execution-log.xml"

var supportedEnvPropertiesList = [ "JOB_URL", "VERSION", "DATASET", "NODE_NAME", "APPSERVER", "DATABASE_SKIP",
                  "BUILD_URL", "DEFAULT_DATABASE_HANDLING", "CUSTOMER", "ADDITIONAL_PROFILES", "DEBUG_MODE", 
                  "DB_USER", "GIT_BRANCH", "BASE_PROFILES", "DB_HOST" ]

router.get('/jobs', function(req, res, next) {
  
  (async () => {
    try {
      let jobList = await getJobsList()
      
      if (res.status >= 400) {
        throw new Error("Bad response from server");
      }

      let supportedJobs = getSupportedDeployments(jobList)
      
      supportedJobs.forEach(job => {
        console.log(job)
      })

    } catch (err) {
      console.error(err);
    }
  })()
  res.send(
    JSON.stringify("jobs")
  )
})

getJobsList = function() {
  return fetch(JENKINS_URL + JOBS_VIEW)
    .then(res => {
      if (res.status >= 400) {
        throw new Error("Bad response from server");
      }
      return res.json()
    })
    // .then(res => {
    //   let supportedJobs = getSupportedDeployments(res)
    //   supportedJobs.forEach(job => {
    //     getJobInfo(job.url + EXECUTION_LOG_PATH)
    //       .then(res => {
    //         return res
    //       })
    //   })
    //   return jobs
    // })
    .catch(err => {
      console.error(err)
    })
}

getSupportedDeployments = function(allJobs) {
  return allJobs.jobs.filter(job => DEPLOYMENT_URL_REGEX.test(job.name))
}

getJobInfo = function(jobUrl) {
  return fetch(jobUrl)
    .then(res => {
      if (res.status >= 400) {
        throw new Error("Bad response from server");
      }
      return res.text()
    })
    .then(res => {
      return parseExecutionLog(res)
    })
    .catch(err => {
      console.error(err);
    })
}

parseExecutionLog = function(executionLog) {
  var deployment = {}
  try {
    new xmldoc.XmlDocument(executionLog).childNamed("context").childNamed("env").eachChild(entry => {
        let propertyName = entry.children[1].firstChild.toString({trimmed:true})
        if (supportedEnvPropertiesList.includes(propertyName)) {
          deployment[propertyName] = entry.children[3].firstChild.toString({trimmed:true})
        }
    })
  } catch(err) {
    console.log("[ERROR] " + err)
  }
  return deployment
}

module.exports = router;