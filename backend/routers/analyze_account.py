from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.dataset_service import dataset_service
from services.mock_service import mock_service
from services.feature_engineering import extract_features
from services.fraud_model import model_service
from services.trust_score_engine import calculate_trust_score
from services.llm_explainer import explainer
import re

router = APIRouter()

class AnalysisRequest(BaseModel):
    url: str
    model_name: str | None = None

def extract_id(input_str: str) -> str:
    """
    Extracts post_id or username from input string.
    If it's an IG URL, it extracts the last part.
    If it's just 'IG0001', it returns that.
    """
    # Handle URLs
    if "instagram.com" in input_str:
        pattern = r'(?:https?://)?(?:www\.)?instagram\.com/([^/?#&]+)'
        match = re.search(pattern, input_str)
        if match:
            return match.group(1)
        return input_str.strip('/').split('/')[-1]
    
    # Handle direct IDs
    return input_str.strip()

@router.post("/analyze")
async def analyze_account(request: AnalysisRequest):
    post_id = extract_id(request.url)
    if not post_id:
        raise HTTPException(status_code=400, detail="Invalid ID or URL")

    try:
        # 1. Fetch Data (Dataset First)
        raw_data = dataset_service.search(post_id)
        
        if not raw_data:
            # 2. Fallback to Mock
            raw_data = mock_service.generate(post_id)
        
        # 3. Features
        features = extract_features(raw_data)
        
        # 4. Predict
        prediction = model_service.predict(features, request.model_name)
        
        # 5. Trust Score
        trust_data = calculate_trust_score(features)
        
        # 6. Explanation
        explanation = explainer.explain(
            features, 
            prediction['fraud_probability'], 
            trust_data['trust_score']
        )
        
        return {
            "username": raw_data.get("username"),
            "post_id": raw_data.get("post_id"),
            "full_name": raw_data.get("username").replace("_", " ").title(),
            "profile_pic": f"https://api.dicebear.com/7.x/avataaars/svg?seed={post_id}",
            "trust_score": trust_data['trust_score'],
            "risk_level": trust_data['risk_level'],
            "fraud_probability": prediction['fraud_probability'],
            "signals": features,
            "benchmarks": raw_data.get("benchmarks", {}),
            "score_breakdown": trust_data['breakdown'],
            "ai_explanation": explanation,
            "is_from_dataset": raw_data.get("is_from_dataset", False),
            "model_used": prediction.get("model_used", "Unknown")
        }
        
    except Exception as e:
        print(f"Analysis failed: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="An error occurred during account analysis")
