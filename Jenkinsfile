pipeline {
  agent { label '1' } 
  
  triggers { pollSCM '* * * * *' }
  
  tools { nodejs "nodejs" }

  options { 
    timestamps () 
 /*   ansiColor('xterm') */
  }
 
  
  stages {    
    stage('Cloning Git') {
      steps { 
        sh 'git clone https://github.com/andrii482/githooks_jenkins_test && cd githooks_jenkins_test && npm i' 
      }
    }        
  }
 /* post { 
    always { cleanWs() }
  } */
}