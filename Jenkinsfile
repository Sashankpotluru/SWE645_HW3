// SSSN — single pipeline building FE & BE and rolling both out
pipeline {
  agent any
  environment {
    DOCKERHUB_USER = 'spotluru'
    FE_IMAGE = "${DOCKERHUB_USER}/sssn-survey-frontend"
    BE_IMAGE = "${DOCKERHUB_USER}/sssn-survey-backend"
    TAG = "${env.BUILD_NUMBER}"

    KCFG = "/var/jenkins_home/.kube/config"
    NAMESPACE = "sssn"
    NODE_IP = "172.31.81.65"   // for smoke curl; can swap to Elastic IP
  }
  stages {
    stage('Checkout') { steps { checkout scm } }

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
          kubectl --kubeconfig=$KCFG -n $NAMESPACE set image deployment/survey-backend  api=$BE_IMAGE:$TAG
          kubectl --kubeconfig=$KCFG -n $NAMESPACE set image deployment/survey-frontend web=$FE_IMAGE:$TAG

          kubectl --kubeconfig=$KCFG -n $NAMESPACE rollout status deploy/survey-backend  --timeout=180s
          kubectl --kubeconfig=$KCFG -n $NAMESPACE rollout status deploy/survey-frontend --timeout=180s

          echo "---- current ----"
          kubectl --kubeconfig=$KCFG -n $NAMESPACE get deploy,svc -o wide
        '''
      }
    }

    stage('Smoke Check') {
      steps {
        sh '''
          # Backend health via NodePort 30081
          curl -fsS http://$NODE_IP:30081/health | tee /tmp/health.txt
          # Frontend (HTML) via NodePort 30080
          curl -fsS http://$NODE_IP:30080/ | head -n 5 | tee /tmp/index_head.txt

          echo "---- BACKEND HEALTH ----"
          cat /tmp/health.txt
          echo "---- FRONTEND HEAD ----"
          cat /tmp/index_head.txt
        '''
      }
    }
  }
  post {
    failure {
      sh '''
        kubectl --kubeconfig=$KCFG -n $NAMESPACE rollout undo deployment/survey-backend  || true
        kubectl --kubeconfig=$KCFG -n $NAMESPACE rollout undo deployment/survey-frontend || true
      '''
    }
  }
}
