from fastapi import FastAPI, Body
from pydantic import BaseModel
from datetime import datetime
import json

app = FastAPI()

class FeedingSchedule(BaseModel):
    time: str
    amount: float

@app.get("/")
def read_root():
    return {"status": "Cat Feeder API is running"}

@app.get("/schedule")
def get_schedule():
    try:
        with open("schedule.json", "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return {"schedule": []}

@app.post("/schedule")
def set_schedule(schedule: list[FeedingSchedule]):
    with open("schedule.json", "w") as f:
        json.dump({"schedule": [s.dict() for s in schedule]}, f)
    return {"status": "success", "schedule": schedule}

@app.get("/feed")
def trigger_feed(amount: float = 0.25):
    # In a real application, this would trigger hardware
    feeding_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    try:
        with open("feeding_log.json", "r") as f:
            log = json.load(f)
    except FileNotFoundError:
        log = {"feedings": []}
    
    log["feedings"].append({"time": feeding_time, "amount": amount})
    
    with open("feeding_log.json", "w") as f:
        json.dump(log, f)
    
    return {"status": "success", "message": f"Fed {amount} cups at {feeding_time}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)