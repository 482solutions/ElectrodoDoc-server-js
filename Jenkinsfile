pipeline {
  agent { label '1' } 
  /* agent any */
  
  triggers { pollSCM '* * * * *' }
  
  tools { nodejs "nodejs" }

  options { 
    timestamps () 
 /*   ansiColor('xterm') */
  }
 
  
  stages {    
    stage('Cloning Git') {
      steps { 
        sh 'pwd && echo "$USER" && echo "$HOME" && echo "$PATH"'
        sh 'git clone https://github.com/482solutions/woden-server-js.git -b feature/SI-340 --single-branch && cd woden-server-js && npm i' 
      }
    }        
  }
  post { 
    always { cleanWs() }
  } 
}
