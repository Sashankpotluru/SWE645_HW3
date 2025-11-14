from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import init_db
from .routers import surveys

app = FastAPI(title="SSSN Student Survey API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()  # create tables if not exist

app.include_router(survey.router, prefix="/api", tags=["surveys"])

@app.get("/health")
def health():
    return {"status": "ok", "service": "SSSN-backend"}
