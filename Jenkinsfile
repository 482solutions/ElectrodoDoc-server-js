
pipeline {
  agent { label '1' }

  tools { nodejs "nodejs" }

  options {
    timestamps ()
    ansiColor('xterm')
  }

    stages {
      stage("Run Tests") {
         steps {
           sh 'npm i'
           sh 'npm run fix:js'
           sh 'npm run lint:js'
          }
       }
    }
  post {
    always {
      cleanWs()
    }
  }

}
