from typing import List
from fastapi import APIRouter, HTTPException
from sqlmodel import select
from ..db import get_session
from ..models import Survey, SurveyCreate, SurveyRead, SurveyUpdate

router = APIRouter()

@router.post("/surveys", response_model=SurveyRead)
def create_survey(payload: SurveyCreate):
    with get_session() as session:
        survey = Survey(**payload.dict())
        session.add(survey)
        session.commit()
        session.refresh(survey)
        return survey

@router.get("/surveys", response_model=List[SurveyRead])
def list_surveys():
    with get_session() as session:
        return session.exec(select(Survey)).all()

@router.get("/surveys/{sid}", response_model=SurveyRead)
def get_survey(sid: int):
    with get_session() as session:
        s = session.get(Survey, sid)
        if not s:
            raise HTTPException(404, "Survey not found")
        return s

@router.put("/surveys/{sid}", response_model=SurveyRead)
def update_survey(sid: int, patch: SurveyUpdate):
    with get_session() as session:
        s = session.get(Survey, sid)
        if not s:
            raise HTTPException(404, "Survey not found")
        data = patch.dict(exclude_unset=True)
        for k, v in data.items():
            setattr(s, k, v)
        session.add(s)
        session.commit()
        session.refresh(s)
        return s

@router.delete("/surveys/{sid}")
def delete_survey(sid: int):
    with get_session() as session:
        s = session.get(Survey, sid)
        if not s:
            raise HTTPException(404, "Survey not found")
        session.delete(s)
        session.commit()
        return {"deleted": sid}
