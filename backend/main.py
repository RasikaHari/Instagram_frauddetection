from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import analyze_account
from routers import model_metrics
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="InstaTrust API", description="AI-powered Instagram Fraud Account Analyzer")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(analyze_account.router, tags=["Analysis"])
app.include_router(model_metrics.router, tags=["Model Metrics"])

@app.get("/")
async def root():
    return {"message": "Welcome to InstaTrust API", "status": "active"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
