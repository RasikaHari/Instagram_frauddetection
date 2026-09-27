import pandas as pd
import os
import random
from typing import Dict, Any, Optional

class DatasetService:
    def __init__(self):
        self.dataset_path = os.path.join(os.path.dirname(__file__), "..", "data", "dataset", "instagram analytics_26.csv")
        self.df = None
        self._load_dataset()

    def _load_dataset(self):
        try:
            if os.path.exists(self.dataset_path):
                self.df = pd.read_csv(self.dataset_path)
                print(f"Dataset loaded successfully: {len(self.df)} rows")
                # Pre-calculate category benchmarks
                self.category_benchmarks = self.df.groupby('content_category')[['likes', 'comments', 'shares', 'saves', 'engagement_rate']].mean().to_dict('index')
            else:
                print(f"Dataset not found at {self.dataset_path}")
                self.category_benchmarks = {}
        except Exception as e:
            print(f"Error loading dataset: {str(e)}")
            self.category_benchmarks = {}

    def get_benchmarks(self, category: str) -> Dict[str, Any]:
        """
        Returns average benchmarks for a content category.
        """
        benchmark = self.category_benchmarks.get(category, {})
        return {
            "category": category,
            "avg_likes": round(float(benchmark.get('likes', 0)), 1),
            "avg_engagement": round(float(benchmark.get('engagement_rate', 0)), 1)
        }

    def search(self, post_id: str) -> Optional[Dict[str, Any]]:
        """
        Searches for a post by ID in the dataset.
        """
        if self.df is None:
            return None
        
        post_id = post_id.strip()
        result = self.df[self.df['post_id'] == post_id]
        
        if result.empty:
            return None
            
        row = result.iloc[0].to_dict()
        category = row['content_category']
        
        # Dynamic Calculation for Profile Visits (not in CSV, but needed for UI Funnel)
        # Heuristic: If traffic source is 'Profile', visits are higher.
        reach = int(row['reach'])
        traffic_source = str(row['traffic_source']).lower()
        
        visit_rate = 0.05 # default 5%
        if 'profile' in traffic_source:
            visit_rate = random.uniform(0.15, 0.25) # 15-25% if they came from profile
        elif 'explore' in traffic_source:
            visit_rate = random.uniform(0.02, 0.08)
        
        profile_visits = int(reach * visit_rate)

        data = {
            "username": row['post_id'], # Use post_id as username since it's missing
            "post_id": row['post_id'],
            "is_from_dataset": True,
            "metrics": {
                "likes": int(row['likes']),
                "comments": int(row['comments']),
                "shares": int(row['shares']),
                "saves": int(row['saves']),
                "reach": reach,
                "impressions": int(row['impressions']),
                "profile_visits": profile_visits,
                "engagement_rate": float(row['engagement_rate']),
                "followers_gained": int(row['followers_gained']),
                "caption_length": int(row['caption_length']),
                "hashtags_count": int(row['hashtags_count']),
                "traffic_source": row['traffic_source'],
                "content_category": row['content_category']
            },
            "benchmarks": self.get_benchmarks(row['content_category']),
            "metadata": {
                "media_type": row['media_type'],
                "content_category": category,
                "traffic_source": row['traffic_source']
            },
            "biography": f"Creator focusing on {category}. High engagement {row['media_type']} content.",
            "is_verified": row['engagement_rate'] > 15.0,
            "is_from_dataset": True
        }
        
        return data

dataset_service = DatasetService()
