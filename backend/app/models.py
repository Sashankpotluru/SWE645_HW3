from datetime import date
from typing import Optional
from sqlmodel import SQLModel, Field

class SurveyBase(SQLModel):
    first_name: str
    last_name: str
    street: str
    city: str
    state: str
    zip: str
    telephone: str
    email: str
    date_of_survey: date
    # simple strings (comma-separated when multiple)
    liked_most: Optional[str] = ""        # e.g. "students,campus"
    interested_via: Optional[str] = ""    # e.g. "Internet"
    likelihood: Optional[str] = ""        # "Very Likely" | "Likely" | "Unlikely"

class Survey(SurveyBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class SurveyCreate(SurveyBase):
    pass

class SurveyRead(SurveyBase):
    id: int

class SurveyUpdate(SQLModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip: Optional[str] = None
    telephone: Optional[str] = None
    email: Optional[str] = None
    date_of_survey: Optional[date] = None
    liked_most: Optional[str] = None
    interested_via: Optional[str] = None
    likelihood: Optional[str] = None
