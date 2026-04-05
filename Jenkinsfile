pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from repository...'
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'
                sh 'npm install'
            }
        }
        
        stage('Run Tests') {
            steps {
                echo 'Running Jest tests...'
                sh 'npm test'
            }
        }
        
        stage('Archive Artifact') {
            steps {
                echo 'Archiving build artifacts...'
                sh 'zip -r build-artifact.zip src/'
                archiveArtifacts artifacts: 'build-artifact.zip', fingerprint: true
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline completed'
        }
        success {
            echo 'Build and tests passed successfully!'
        }
        failure {
            echo 'Build or tests failed. Check the logs.'
        }
    }
}
