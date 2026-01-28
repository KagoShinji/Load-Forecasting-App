from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model import forecast_system
import uvicorn

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev, allow all. In prod, lock this down.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ForecastRequest(BaseModel):
    days: int = 0
    months: int = 0
    years: int = 0
    target_year: int = None
    place: str = None

@app.post("/forecast")
def get_forecast(req: ForecastRequest):
    try:
        return forecast_system.predict(
            target_year=req.target_year,
            days=req.days, 
            months=req.months, 
            years=req.years, 
            place=req.place
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
