from utils.text_analysis import calculate_bio_risk
from typing import Dict, Any

def extract_features(raw_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Converts raw profile data (from dataset or mock) into a numeric feature dictionary.
    """
    metrics = raw_data.get("metrics", {})
    
    # We use the direct metrics from the Kaggle dataset
    likes = metrics.get("likes", 0)
    comments = metrics.get("comments", 0)
    reach = metrics.get("reach", 1)
    engagement_rate = metrics.get("engagement_rate", 0.0)
    followers_gained = metrics.get("followers_gained", 0)
    
    # Heuristic features for fraud detection using CSV metrics
    # 1. Reach-to-Like Ratio (Bots often have high likes but low reach, or vice-versa)
    # Correcting ratio: likes divided by reach. 
    # Normal is ~0.1 to 0.2. High is > 0.5 (suspicious).
    reach_like_ratio = likes / max(reach, 1)
    
    # 2. Viral potential (Relative to Category)
    benchmarks = raw_data.get("benchmarks", {})
    avg_er = benchmarks.get("avg_engagement", 5.0)
    er_quality = engagement_rate / max(avg_er, 0.1)
    
    # 3. Viral Signal (Complex)
    shares = metrics.get("shares", 0)
    saves = metrics.get("saves", 0)
    is_viral = 1 if (shares > 2000 and saves > 5000) or (engagement_rate > avg_er * 2) else 0

    features = {
        "likes": likes,
        "comments": comments,
        "shares": shares,
        "saves": saves,
        "reach": reach,
        "impressions": metrics.get("impressions", 0),
        "profile_visits": metrics.get("profile_visits", 0),
        "engagement_rate": engagement_rate,
        "er_quality": round(er_quality, 2),
        "followers_gained": followers_gained,
        "reach_like_ratio": round(reach_like_ratio, 4),
        "hashtag_count": metrics.get("hashtags_count", 0),
        "caption_length": metrics.get("caption_length", 0),
        "bio_risk_score": calculate_bio_risk(raw_data.get("biography", "")),
        "is_viral": is_viral,
        "category_avg_er": avg_er
    }
    
    return features
