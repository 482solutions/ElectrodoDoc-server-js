
pipeline {
  agent { label '1' } 
  
  /*triggers { pollSCM '* * * * *' }*/
  triggers:
    - githubPullRequest:
        github-hooks: true
  
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
      stage("Run Tests") {
         steps {
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
    always { 
      sh 'docker stop fabric_orderer fabric_peer fabric_ca fabric_ca_db && docker rm -v fabric_orderer fabric_peer fabric_ca fabric_ca_db'
      cleanWs() 
    }
  } 
}
