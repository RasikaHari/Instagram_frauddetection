import random
import time
from typing import Dict, Any

class MockService:
    def generate(self, post_id: str) -> Dict[str, Any]:
        """
        Generates realistic "simulated" data if the post_id isn't in the dataset.
        """
        is_fraud = "fake" in post_id.lower() or random.random() > 0.7
        
        categories = ["Technology", "Fashion", "Food", "Travel", "Fitness", "Beauty"]
        category = random.choice(categories)
        
        if is_fraud:
            likes = random.randint(100, 500)
            shares = random.randint(5, 50)
            reach = random.randint(500, 2000)
            er = random.uniform(0.1, 1.5)
        else:
            likes = random.randint(5000, 50000)
            shares = random.randint(500, 5000)
            reach = random.randint(10000, 500000)
            er = random.uniform(3.0, 12.0)

        data = {
            "username": f"simulated_{post_id}",
            "post_id": post_id,
            "metrics": {
                "likes": likes,
                "comments": random.randint(10, 1000),
                "shares": random.randint(10, 5000),
                "saves": random.randint(10, 10000),
                "reach": reach,
                "impressions": reach * random.uniform(1.2, 2.0),
                "profile_visits": reach * random.uniform(0.01, 0.1),
                "engagement_rate": random.uniform(1.0, 15.0),
                "followers_gained": random.randint(0, 1000),
                "caption_length": random.randint(10, 2000),
                "hashtags_count": random.randint(0, 30)
            },
            "benchmarks": {
                "category": category,
                "avg_likes": 15000 if not is_fraud else 500,
                "avg_engagement": 5.5 if not is_fraud else 0.8
            },
            "metadata": {
                "media_type": random.choice(["Reel", "Photo", "Carousel"]),
                "content_category": category,
                "traffic_source": "Explore"
            },
            "biography": f"Influencer in {category}. Content creator and brand ambassador.",
            "is_verified": not is_fraud and random.random() > 0.8,
            "is_from_dataset": False
        }
        
        return data

mock_service = MockService()
