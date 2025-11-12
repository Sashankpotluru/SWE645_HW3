// SSSN — single pipeline building FE & BE and rolling both out
pipeline {
  agent any
  environment {
    DOCKERHUB_USER = 'spotluru'        // <— change if needed
    FE_IMAGE = "${DOCKERHUB_USER}/sssn-survey-frontend"
    BE_IMAGE = "${DOCKERHUB_USER}/sssn-survey-backend"
    TAG = "${env.BUILD_NUMBER}"
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Docker Build & Push - Backend') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
          sh '''
            echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
            cd backend
            docker build -t $BE_IMAGE:$TAG -t $BE_IMAGE:latest .
            docker push $BE_IMAGE:$TAG
            docker push $BE_IMAGE:latest
            docker logout || true
          '''
        }
      }
    }
    stage('Docker Build & Push - Frontend') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
          sh '''
            echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin
            cd frontend
            docker build -t $FE_IMAGE:$TAG -t $FE_IMAGE:latest .
            docker push $FE_IMAGE:$TAG
            docker push $FE_IMAGE:latest
            docker logout || true
          '''
        }
      }
    }
    stage('Deploy to Kubernetes') {
      steps {
        sh '''
          # update images on running deployments
          kubectl set image deployment/survey-backend api=$BE_IMAGE:$TAG
          kubectl set image deployment/survey-frontend web=$FE_IMAGE:$TAG

          kubectl rollout status deploy/survey-backend --timeout=180s
          kubectl rollout status deploy/survey-frontend --timeout=180s

          echo "---- current ----"
          kubectl get deploy,svc -o wide
        '''
      }
    }
  }
  post {
    failure {
      sh '''
        kubectl rollout undo deployment/survey-backend || true
        kubectl rollout undo deployment/survey-frontend || true
      '''
    }
  }
}
