var express = require('express')
var router = express.Router()
var xmldoc = require('xmldoc')
const fetch = require('cross-fetch')

var JENKINS_URL = "https://tcd.coconet.de"
var JOBS_VIEW = "/view/All/api/json"
var IBS_VIEW = "/view/IBS/api/json"
var DEPLOYMENT_URL_REGEX = /mv-((master)|((\d+\.){3,}\w+))_c\d{5}.*/
var EXECUTION_LOG_PATH = "ws/cdimage/execution-log.xml"
//var LAST_BUILD_PATH = "lastBuild/api/json"
//var cachedJobs = []

var supportedEnvPropertiesList = [ "JOB_URL", "VERSION", "DATASET", "NODE_NAME", "APPSERVER", "DATABASE_SKIP",
                  "BUILD_URL", "DEFAULT_DATABASE_HANDLING", "CUSTOMER", "ADDITIONAL_PROFILES", "DEBUG_MODE", 
                  "DB_USER", "GIT_BRANCH", "BASE_PROFILES", "DB_HOST" ]

router.get('/jobs', function(req, res, next) {
  (async () => {
    try {
      let jobList = await getJobsList(JENKINS_URL + JOBS_VIEW)
      
      if (res.status >= 400) {
        throw new Error("Bad response from server");
      }

      let supportedJobs = getSupportedDeployments(jobList)

      // if (cachedJobs.length === 0) {
      //   cachedJobs = supportedJobs
      // } 

      //updateCachedJobs
      //let temp = await Promise.all(cachedJobs.map(job => getLastBuildNumber(job.url)))

      let deploymentsInfoList = await Promise.all(supportedJobs.map(job => getJobInfo(job)))

      console.log(deploymentsInfoList)
      
      res.send(
        JSON.stringify(deploymentsInfoList)
      )
    } catch (err) {
      console.error(err)
    }
  })()
})

router.get('/jobs/ibs', function(req, res, next) {
  (async () => {
    try {
      let jobList = await getJobsList(JENKINS_URL + IBS_VIEW)
      
      if (res.status >= 400) {
        throw new Error("Bad response from server");
      }
      
      res.send(
        JSON.stringify(jobList)
      )
    } catch (err) {
      console.error(err)
    }
  })()
})

function getJobsList(url) {
  return fetch(url)
    .then(res => {
      if (res.status >= 400) {
        throw new Error("Bad response from server");
      }
      return res.json()
    })
    .catch(err => {
      console.error(err)
    })
}

function getSupportedDeployments(allJobs) {
  return allJobs.jobs.filter(job => DEPLOYMENT_URL_REGEX.test(job.name))
}

// function updateCachedJobs() {

// }

// function getLastBuildNumber(jobUrl) {
//   return fetch(jobUrl + LAST_BUILD_PATH)
//     .then(res => {
//       if (res.status >= 400) {
//         throw new Error("Bad response from server");
//       }
//       return res.json()
//     })
//     .then(res => {
//       return res.number
//     })
//     .catch(err => {
//       console.error(err)
//     })
// }

function getJobInfo(job) {
  return fetch(job.url + EXECUTION_LOG_PATH)
    .then(res => {
      if (res.status >= 400) {
        throw new Error("Bad response from server");
      }
      return res.text()
    })
    .then(res => {
      return {...parseExecutionLog(res), ...job}
    })
    .catch(err => {
      console.error(err)
    })
}

function parseExecutionLog(executionLog) {
  var deployment = {}
  try {
    new xmldoc.XmlDocument(executionLog).childNamed("context").childNamed("env").eachChild(entry => {
        let propertyName = entry.children[1].firstChild.toString()
        if (supportedEnvPropertiesList.includes(propertyName)) {
          deployment[propertyName] = entry.children[3].firstChild.toString()
        }
    })
  } catch(err) {
    console.log("[ERROR] " + err)
  }
  return deployment
}

module.exports = router;