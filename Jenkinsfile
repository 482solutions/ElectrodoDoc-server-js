
pipeline {
  agent { label '1' } 
  
  tools { nodejs "nodejs" }

  options { 
    timestamps () 
    ansiColor('xterm') 
  }
  environment {
    VERSION = "${env.BUILD_NUMBER}"
    DOCKER_REGISTRY = "nexus.482.solutions"
    CREDENTIAL_ID_DOCKER = "nexus"
    REPO = "woden_server_js"
    IMAGE_MASTER = "master"
    TAG = "${VERSION}"
    }
 
    stages {
      stage("Run Tests") {
         steps {
           slackSend channel: "#wg-rnd", color: "green", message: "STARTED ${JOB_NAME} BUILD_NUMBER ${VERSION}", tokenCredentialId: "Slack482"
           sh 'npm i'
           sh 'npm run fix:js'
           sh 'npm run lint:js'
           sh 'sudo rm -R -f woden-network && git clone https://github.com/482solutions/woden-network.git && cd woden-network && sudo -S ./deploy.sh'
           sh 'sudo docker-compose up --build -d'
           sh 'cd ./e2e && npm i && npm run cypress:run'
           sh 'sudo rm -R -f woden-network'
         }
      }
      stage("Build and Push BE DockerImage Branch Test") {
          /*  when {
                branch 'feature/SI-340'
            }*/
            steps {
                script {
                    def newImage = docker.build("${REPO}/${IMAGE_MASTER}","--no-cache -f ./Dockerfile . ")
                    docker.withRegistry( "https://${DOCKER_REGISTRY}", "${CREDENTIAL_ID_DOCKER}" ) {
                        newImage.push("${TAG}")
                        newImage.push("latest")
                    }
                }
                slackSend channel: "#wg-rnd", color: "green", message: "BUILD_n_PUSH_DOCKER_FINISHED ${JOB_NAME} BUILD_NUMBER ${VERSION}", tokenCredentialId: "Slack482"
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
    always { 
      sh 'docker stop fabric_orderer fabric_peer fabric_ca fabric_ca_db && docker rm -v fabric_orderer fabric_peer fabric_ca fabric_ca_db'
      cleanWs() 
    }
    success {
           slackSend channel: "#wg-rnd", color: "green", message: "SUCCESS ${JOB_NAME} BUILD_NUMBER ${VERSION}", tokenCredentialId: "Slack482"
    }
    failure {
            slackSend channel: "#wg-rnd", color: "red", message: "FAILURE ${JOB_NAME} BUILD_NUMBER ${VERSION}", tokenCredentialId: "Slack482"
    }
  } 
}
