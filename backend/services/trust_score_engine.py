from typing import Dict, Any

def calculate_trust_score(features: Dict[str, Any]) -> Dict[str, Any]:
    """
    Calculates a trust score from 0-100 based on Kaggle CSV engagement metrics.
    Higher score = More Trustworthy.
    """
    
    # 1. Engagement Score (0-25)
    # Use relative ER quality (1.0 = average for category)
    er_quality = features.get("er_quality", 1.0)
    # 1.5x average gives full 25 points
    engagement_score = min(er_quality * 16.67, 25)
    
    # 2. Growth Score (0-20)
    growth = features.get("followers_gained", 0)
    # Target 500+ followers gained per post for full score
    growth_score = min((growth / 500) * 20, 20)
    
    # 3. Bio Risk Score (0-15)
    bio_risk = features.get("bio_risk_score", 0)
    bio_score = (1 - bio_risk) * 15
    
    # 4. Reach Quality Score (0-20)
    # reach_like_ratio = likes / reach
    rlr = features.get("reach_like_ratio", 0)
    if rlr > 0.8:
        reach_score = 0
    elif rlr > 0.5:
        reach_score = 5
    elif rlr > 0.2:
        reach_score = 15
    else:
        reach_score = 20
    
    # 5. Content Presentation Score (0-20)
    hashtags = features.get("hashtag_count", 0)
    caption_len = features.get("caption_length", 0)
    
    hashtag_score = max(0, 10 - (hashtags / 3)) # 0-10
    caption_score = min((caption_len / 500) * 10, 10) # 0-10
    content_score = hashtag_score + caption_score
    
    total_score = engagement_score + growth_score + bio_score + reach_score + content_score
    total_score = round(max(0, min(total_score, 100)), 0)
    
    if total_score <= 40:
        risk_level = "HIGH"
    elif total_score <= 70:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"
        
    return {
        "trust_score": total_score,
        "risk_level": risk_level,
        "breakdown": {
            "engagement": round(engagement_score, 1),
            "follower_growth": round(growth_score, 1),
            "bio_authenticity": round(bio_score, 1),
            "reach_quality": round(reach_score, 1),
            "content_quality": round(content_score, 1)
        }
    }
