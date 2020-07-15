pipeline {
  agent { label '1' } 
  /* agent any */
  
  triggers { pollSCM '* * * * *' }
  
  tools { nodejs "nodejs" }

  options { 
    timestamps () 
    ansiColor('xterm') 
  }
  environment {
    VERSION = "${env.BUILD_NUMBER}"
    BRANCH = "${env.GIT_BRANCH}"
    BUILD_KEY_DEVELOPMENT = "-d"
    BUILD_KEY_QA = "-q"
    BUILD_KEY_MASTER = "-p"
    DOCKER_REGISTRY = "nexus.482.solutions"
    CREDENTIAL_ID_DOCKER = "nexus"
    REPO = "PROJECT_NAME_HERE_MUST_BE"
    IMAGE_DEV = "dev"
    IMAGE_QA = "qa"
    IMAGE_MASTER = "master"
    TAG = "${VERSION}"
    }
 
    stages {
      stage("Build and Push BE DockerImage Branch Test") {
          /*  when {
                branch 'feature/SI-340'
            }*/
            steps {
                script {
                    def newImage = docker.build("${REPO}/${IMAGE_DEV}","--build-arg BUILD_KEY=${BUILD_KEY_DEVELOPMENT} -f ./Dockerfile .")
                    docker.withRegistry( "https://${DOCKER_REGISTRY}", "${CREDENTIAL_ID_DOCKER}" ) {
                        newImage.push("${TAG}")
                        newImage.push("latest")
                    }
                }
            }
        }
    }
  post { 
    always { cleanWs() }
  } 
}
