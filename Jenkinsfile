pipeline {
  agent { label '1' } 
  /* agent any */
  
  triggers { pollSCM '* * * * *' }
  
  tools { nodejs "nodejs" }

  options { 
    timestamps () 
    ansiColor('xterm') 
  }
 
  stage("Build and Push BE DockerImage Branch Test") {
            when {
                branch 'feature/SI-340'
            }
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
  post { 
    always { cleanWs() }
  } 
}
