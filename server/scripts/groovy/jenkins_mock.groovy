@Grab(group='org.codehaus.groovy.modules.http-builder', module='http-builder', version='0.7')
import groovy.json.JsonSlurper
import groovy.transform.Field
import groovy.util.XmlSlurper
import groovyx.net.http.RESTClient
import static groovyx.net.http.ContentType.*

@Field String singleJobUpdateUrl = "http://localhost:5000/"
@Field def supportedExecutionLogPropertiesList = ["context.os", "context.installDirectory", "context.buildDirectory"]
@Field def supportedEnvPropertiesList = [ "JOB_URL", "VERSION", "DATASET", "NODE_NAME", "APPSERVER", "DATABASE_SKIP",
    "BUILD_URL", "DEFAULT_DATABASE_HANDLING", "CUSTOMER", "ADDITIONAL_PROFILES", "DEBUG_MODE", 
    "DB_USER", "GIT_BRANCH", "BASE_PROFILES", "DB_HOST" ]

main()

def processMultipleExecutionLogs(executionLogs) {
    executionLogs.collect { executionLog -> processSingleExecutionLog(executionLog) }
}

def processSingleExecutionLog(executionLogXML) {
    def propertiesMap = [:]
    executionLogXML.context.env.entry.findAll { entry ->
        supportedEnvPropertiesList.any { property ->
            entry.toString().startsWith(property)
        }
    }.each { entry ->
        def property = supportedEnvPropertiesList.find{property -> entry.toString().startsWith(property)}
        def value = entry.toString().split(property)[1]
        propertiesMap.put(property, value)
    }
    return propertiesMap
}

def parseExecutionLog(executionLogFile) {
    new XmlSlurper().parseText(executionLogFile.text)
}

def parseExecutionLogs(executionLogFiles) {
    executionLogFiles.collect { executionLogFile -> parseExecutionLog(executionLogFile) }
}

def main() {
    String currentDir = System.getProperty("user.dir").toString()
    def executionLogs = [new File("$currentDir/resources/execution-log.xml"), new File("$currentDir/resources/execution-log1.xml"), new File("$currentDir/resources/execution-log2.xml")]
    def executionLogsXML = parseExecutionLogs(executionLogs)
    def processedExecutionLogs = processMultipleExecutionLogs(executionLogsXML)
    def restClient = new RESTClient(singleJobUpdateUrl)
    def jsonSlurper = new JsonSlurper()

    processedExecutionLogs.each { executionLog -> 
        println(executionLog)
        try {
            restClient.post (
                path: 'jenkins/job',
                body: executionLog,
                contentType: JSON
            )
        } catch (Exception e) {
            //println "Exception $e catched"
        }
    }
}
