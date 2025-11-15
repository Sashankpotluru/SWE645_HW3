# SWE 645 – Home Assignment 3: Survey Application (SSSN)

This assignment extends the HW2 survey web application into a **fully containerized, cloud-native deployment** with:

- **Frontend:** Vite/React SPA served by Nginx (`sssn-frontend`)
- **Backend:** FastAPI REST API (`sssn-backend`)
- **Database:** MySQL 8 with persistent storage (`sssn-mysql`)
- **Local Dev:** Docker Compose
- **Production:** RKE2 Kubernetes cluster managed via Rancher (namespace: `sssn`)
- **CI/CD:** Jenkins pipeline → Docker Hub → Kubernetes via `kubectl`

All commands below assume you run them from the repo root in **VS Code’s integrated terminal** (or any shell) on the EC2 / local dev machine.


## 1. Key URLs & Endpoints

### 1.1 Management & CI/CD

- **Rancher UI**  
  `https://52.5.253.108/dashboard/c/c-m-tcbwvflt/explorer#cluster-events`

- **Jenkins – CI/CD Pipeline**  
  `http://52.5.253.108:8081/job/sssn-pipeline/`

- **GitHub Repository**  
  `https://github.com/Sashankpotluru/SWE645_HW3`

- **MySQL Web UI (phpMyAdmin or similar)**  
  `http://52.5.253.108:30082/?server=mysql&username=sssn&db=surveydb&select=survey`

### 1.2 Application

- **Student Survey Page (Frontend)**  
  `http://52.5.253.108:30080/`

- **Backend (NodePort, for debugging/health)**  
  `http://52.5.253.108:3081/health`

- **Internal Backend Service (inside cluster)**  
  `http://survey-backend.sssn.svc.cluster.local:8000`

- **Internal MySQL Service (inside cluster)**  
  Host: `mysql.sssn.svc.cluster.local`  
  Port: `3306`  
  DB: `surveydb`  
  User: `sssn`  



## 2. System Architecture (High Level)

The system follows a **CI/CD-driven, container-based architecture** deployed on an RKE2 Kubernetes cluster managed by Rancher on an AWS EC2 instance.

1. **Source Control – GitHub**
   - React frontend, FastAPI backend, Kubernetes manifests, and Docker files are all version-controlled in a single GitHub repo.
   - Pushes to `main` can trigger the Jenkins pipeline via webhook.

2. **Continuous Integration – Jenkins**
   - Pull latest code from GitHub.
   - Build Docker images for **backend** and **frontend**.
   - Tag images (e.g., `spotluru/sssn-survey-backend:hw3`, `spotluru/sssn-survey-frontend:hw3`).
   - Push images to **Docker Hub**.

3. **Continuous Deployment – kubectl on EC2**
   - Using the RKE2 kubeconfig on EC2, Jenkins (or a human) runs `kubectl apply` to:
     - Deploy/upgrade **MySQL** StatefulSet.
     - Deploy/upgrade **survey-backend** and **survey-frontend** Deployments + Services.
     - Optionally configure Ingress or NodePorts.
   - Rancher provides UI visibility and management for all these resources.

4. **Runtime Architecture**
   - **Frontend Deployment**: React SPA built and served by Nginx. Exposed externally via NodePort `30080`.
   - **Backend Deployment**: FastAPI app exposing REST endpoints for survey CRUD + `/health`. Exposed internally via ClusterIP; optionally external via NodePort `3081`.
   - **MySQL StatefulSet**: MySQL 8 with a PersistentVolumeClaim (5Gi) using local-path storage to persist survey responses.

---

## 3. Repository Structure (Conceptual)

High-level layout (no code shown here):

- `backend/` – FastAPI app (`main.py`, `models.py`, `db.py`, `routers/`, `requirements.txt`)
- `frontend/` – Vite/React app (`src/App.jsx`, components, styles)
- `k8s/` – Kubernetes manifests:
  - `namespace.yaml`
  - `mysql.yaml`
  - `backend-deploy.yaml` / `survey-backend.yaml`
  - `frontend-deploy.yaml` / `survey-frontend.yaml`
  - (optional) `ingress.yaml`
- `docker-compose.yml` – Local dev setup
- `Jenkinsfile` – Jenkins pipeline definition
- `README.md` – (this file)

---

## 4. Prerequisites

On the machine where you build/run:

- **CLI tools**
  - `git`
  - `docker` and `docker compose`
  - `kubectl`
- **Accounts / access**
  - Docker Hub account (e.g., `spotluru`)
  - Access to Rancher / RKE2 cluster (`/etc/rancher/rke2/rke2.yaml`)
  - Access to Jenkins server (for pipeline runs)
- **Optional for local dev**
  - Python & Node.js (if you want to run backend/frontend directly without Docker)

---

## 5. Local Development (Docker Compose)

> All commands run from repo root (`SWE645_HW3`) in VS Code terminal.

### 5.1 Start All Services

```bash
docker compose up --build
