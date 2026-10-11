from fastapi import FastAPI, Depends, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import backend.models as models
from backend.database import engine, get_db
import backend.database_model as database_model
database_model.Base.metadata.create_all(bind=engine)
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware


app=FastAPI()

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"detail": exc.errors()})

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# POST /api/opportunities
@app.post("/api/opportunities", status_code=status.HTTP_201_CREATED)
def create_opportunity(opportunity: models.ResearchOpportunity, db: Session = Depends(get_db)):
    db_opportunity = database_model.ResearchOpportunity(
        research_title=opportunity.research_title,
        research_description=opportunity.research_description,
        research_area=opportunity.research_area,
        faculty_name=opportunity.faculty_name,
        department=opportunity.department,
        required_skills=opportunity.required_skills,
        available_positions=opportunity.available_positions,
        application_deadline=opportunity.application_deadline,
        status=opportunity.status.value
    )
    db.add(db_opportunity)
    db.commit()
    db.refresh(db_opportunity)
    return db_opportunity

# GET /api/opportunities
@app.get("/api/opportunities")
def get_opportunities(db: Session = Depends(get_db)):
    opportunities = db.query(database_model.ResearchOpportunity).all()
    return opportunities


# GET /api/opportunities/:id
@app.get("/api/opportunities/{id}")
def get_opportunity(id: int, db: Session = Depends(get_db)):
    opportunity = db.query(database_model.ResearchOpportunity).filter(database_model.ResearchOpportunity.id == id).first()
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return opportunity

# PUT /api/opportunities/:id
@app.put("/api/opportunities/{id}")
def update_opportunity(id: int, updated_opportunity: models.ResearchOpportunity, db: Session = Depends(get_db)):
    opportunity = db.query(database_model.ResearchOpportunity).filter(database_model.ResearchOpportunity.id == id).first()
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    for key, value in updated_opportunity.dict().items():
        if key == "status":
            value = value.value
        setattr(opportunity, key, value)
    db.commit()
    db.refresh(opportunity)
    return opportunity


# Delete /api/opportunities/:id
@app.delete("/api/opportunities/{id}")
def delete_opportunity(id: int, db: Session =Depends(get_db)):
    opportunity = db.query(database_model.ResearchOpportunity).filter(database_model.ResearchOpportunity.id == id).first();
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    db.delete(opportunity)
    db.commit()
    return {"message": "Opportunity deleted successfully"}

app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
 







