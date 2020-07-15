pipeline {
  agent { label '1' } 
  /* agent any */
  
  triggers { pollSCM '* * * * *' }
  
  tools { nodejs "nodejs" }

  options { 
    timestamps () 
    ansiColor() 
  }
 
  
  stages {    
    stage('Cloning Git') {
      steps { 
        sh 'pwd && echo "$USER" && echo "$HOME" && echo "$PATH"'
        sh 'npm i' 
      }
    }        
  }
  post { 
    always { cleanWs() }
  } 
}
