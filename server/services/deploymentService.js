var mongo = require('./mongoService')

mapKeys = function(object, keyList) {
  for (let key in object) {
    keyList.push(key)
  }
}

exports.getAllColumns = function(jobs) {
    var columns = []
    mapKeys(jobs[0], columns)
    return columns
}

exports.getJobs = function(object) {
    return mongo.getActiveJobs()
}

exports.saveJob = function(job) {
    mongo.insert(job)
}