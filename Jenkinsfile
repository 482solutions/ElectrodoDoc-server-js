pipeline {
  agent { label '1' } 
  
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
    REPO = "woden_server_js"
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
                    def newImage = docker.build("${REPO}/${IMAGE_DEV}","--build-arg BUILD_KEY=${BUILD_KEY_DEVELOPMENT} --no-cache -f ./Dockerfile . ")
                    docker.withRegistry( "https://${DOCKER_REGISTRY}", "${CREDENTIAL_ID_DOCKER}" ) {
                        newImage.push("${TAG}")
                        newImage.push("latest")
                    }
                }
            }
        }
       stage('Clean Docker Images after Deploy Test') {
           /* when {
                branch 'test'
            } */
            steps {
                sh 'docker rmi ${DOCKER_REGISTRY}/${REPO}/${IMAGE_DEV}:${BUILD_NUMBER}'
                sh 'docker rmi ${DOCKER_REGISTRY}/${REPO}/${IMAGE_DEV}:latest'
                sh 'docker rmi ${REPO}/${IMAGE_DEV}:latest'
     /*           sh 'docker rmi node:carbon' */
            }
       }
    }
  post { 
    always { cleanWs() }
  } 
}
