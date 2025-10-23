pipeline {
    agent any

    tools {
        jdk 'JDK17'           // Name of your installed JDK in Jenkins
        maven 'Maven_Home'    // Name of your installed Maven in Jenkins
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Checking out source code..."
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo "Building project..."
                bat "mvn clean compile"
            }
        }

        stage('Test') {
            steps {
                echo "Running tests..."
                bat "mvn test"
            }
            post {
                always {
                    junit '**/target/surefire-reports/TEST-*.xml'
                }
            }
        }

        stage('Package') {
            steps {
                echo "Packaging project..."
                bat "mvn package"
            }
            post {
                success {
                    archiveArtifacts 'target/*.jar'
                }
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying project..."
                // Add your deployment steps here (copy files, upload to server, etc.)
            }
        }
    }

    post {
        success {
            echo "Build and pipeline completed successfully!"
        }
        failure {
            echo "Build or pipeline failed. Check logs."
        }
    }
}
