@Grab(group='org.codehaus.groovy.modules.http-builder', module='http-builder', version='0.7.1')
import groovy.json.JsonSlurper
import groovy.transform.Field
import groovy.util.XmlSlurper
import groovyx.net.http.RESTClient
import static groovyx.net.http.ContentType.*

@Field String singleJobUpdateUrl = "http://pawelpeubu.coconet.pl:5000/"
@Field String executionLogPath = "/target/cdinstall/execution-log.xml"
@Field List<String> supportedEnvPropertiesList = [ "JOB_URL", "VERSION", "DATASET", "NODE_NAME", "APPSERVER", "DATABASE_SKIP",
                            "BUILD_URL", "DEFAULT_DATABASE_HANDLING", "CUSTOMER", "ADDITIONAL_PROFILES", "DEBUG_MODE", 
                            "DB_USER", "GIT_BRANCH", "BASE_PROFILES", "DB_HOST" ]

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

def main() {
    File executionLogFile = new File(System.getProperty("user.dir").toString() + executionLogPath)
    def executionLogXML = parseExecutionLog(executionLogFile)
    def processedExecutionLog = processSingleExecutionLog(executionLogXML)
    def restClient = new RESTClient(singleJobUpdateUrl)

    println(processedExecutionLog)

    try {
    	restClient.post (
        	path: 'jenkins/job',
            body: processedExecutionLog,
            contentType: JSON )
    } catch (Exception e) {
      	println("Catched error when sending execution log file. Error is: " + e)
    }
}

main()