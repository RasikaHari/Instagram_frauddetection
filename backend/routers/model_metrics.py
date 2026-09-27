from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import json
import os
import sys

router = APIRouter()

ML_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'ml')
RESULTS_PATH = os.path.join(ML_DIR, 'training_results.json')


@router.get("/model-metrics")
async def get_model_metrics():
    """Returns all training metrics for all models."""
    if not os.path.exists(RESULTS_PATH):
        raise HTTPException(
            status_code=404,
            detail="No training results found. Please train the models first."
        )

    with open(RESULTS_PATH, 'r') as f:
        results = json.load(f)

    return results


class SetModelRequest(BaseModel):
    model_name: str


@router.post("/set-active-model")
async def set_active_model(request: SetModelRequest):
    """Sets the active model used for fraud prediction."""
    from services.fraud_model import model_service

    success = model_service.set_active_model(request.model_name)
    if not success:
        available = model_service.get_available_models()
        raise HTTPException(
            status_code=400,
            detail=f"Model '{request.model_name}' not found. Available: {available}"
        )

    return {
        "message": f"Active model set to '{request.model_name}'",
        "active_model": request.model_name
    }


@router.post("/retrain")
async def retrain_models():
    """Re-trains all models and returns updated metrics."""
    try:
        # Add backend root to path for imports
        backend_dir = os.path.dirname(os.path.dirname(__file__))
        if backend_dir not in sys.path:
            sys.path.insert(0, backend_dir)

        from ml.train_model import train_all_models
        from services.fraud_model import model_service

        # Run training
        results = train_all_models()

        if results is None:
            raise HTTPException(
                status_code=500,
                detail="Training failed. Dataset not found."
            )

        # Reload model service to pick up new models
        model_service.reload()

        return results

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Training failed: {str(e)}"
        )


@router.get("/available-models")
async def get_available_models():
    """Returns list of available models and which one is active."""
    from services.fraud_model import model_service

    available = model_service.get_available_models()
    active = model_service.active_model_name

    return {
        "available_models": available,
        "active_model": active
    }
