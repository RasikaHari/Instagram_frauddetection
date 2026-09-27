import joblib
import os
import json
import numpy as np
import pandas as pd
from typing import Dict, Any, Optional

class FraudModel:
    def __init__(self):
        self.base_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'ml')
        self.feature_names_path = os.path.join(self.base_dir, 'feature_names.joblib')
        self.results_path = os.path.join(self.base_dir, 'training_results.json')
        self.loaded_models: Dict[str, Any] = {}
        self.features_order = None
        self.active_model_name = None
        self._load_config()

    def _load_config(self):
        """Load feature names and determine active model."""
        if os.path.exists(self.feature_names_path):
            self.features_order = joblib.load(self.feature_names_path)
        else:
            self.features_order = [
                "likes", "comments", "reach", "engagement_rate",
                "followers_gained", "reach_like_ratio", "hashtag_count",
                "caption_length", "bio_risk_score", "is_viral"
            ]

        # Determine active model from training results
        if os.path.exists(self.results_path):
            with open(self.results_path, 'r') as f:
                results = json.load(f)
            self.active_model_name = results.get("active_model", "Random Forest")
        else:
            self.active_model_name = "Random Forest"

    def _get_model_file(self, model_name: str) -> str:
        """Convert model name to filename."""
        return model_name.lower().replace(" ", "_") + ".pkl"

    def load_model(self, model_name: Optional[str] = None):
        """Load a specific model by name. Uses active model if none specified."""
        if model_name is None:
            model_name = self.active_model_name

        if model_name in self.loaded_models:
            return self.loaded_models[model_name]

        model_file = self._get_model_file(model_name)
        model_path = os.path.join(self.base_dir, model_file)

        # Fallback to legacy fraud_classifier.pkl
        if not os.path.exists(model_path):
            legacy_path = os.path.join(self.base_dir, 'fraud_classifier.pkl')
            if os.path.exists(legacy_path):
                model_path = legacy_path
            else:
                print(f"Model file not found: {model_path}")
                return None

        model = joblib.load(model_path)
        self.loaded_models[model_name] = model
        return model

    def get_available_models(self) -> list:
        """Returns list of available trained models."""
        if os.path.exists(self.results_path):
            with open(self.results_path, 'r') as f:
                results = json.load(f)
            return list(results.get("models", {}).keys())
        return ["Random Forest"]

    def set_active_model(self, model_name: str) -> bool:
        """Sets the active model for prediction."""
        available = self.get_available_models()
        if model_name in available:
            self.active_model_name = model_name

            # Update training_results.json
            if os.path.exists(self.results_path):
                with open(self.results_path, 'r') as f:
                    results = json.load(f)
                results["active_model"] = model_name
                with open(self.results_path, 'w') as f:
                    json.dump(results, f, indent=2)

            return True
        return False

    def predict(self, features: Dict[str, Any], model_name: Optional[str] = None) -> Dict[str, Any]:
        """
        Predicts fraud probability using the specified or active model.
        """
        if model_name is None:
            model_name = self.active_model_name

        model = self.load_model(model_name)
        if model is None:
            return {
                "fraud_probability": 0.5,
                "is_fraud": False,
                "model_used": "none",
                "error": "Model not loaded"
            }

        # Reload feature names in case they were updated by retraining
        if os.path.exists(self.feature_names_path):
            self.features_order = joblib.load(self.feature_names_path)

        # Prepare input data in correct order
        input_data = [features.get(f, 0) for f in self.features_order]
        X = pd.DataFrame([input_data], columns=self.features_order)

        # Get probability
        if hasattr(model, 'predict_proba'):
            prob = model.predict_proba(X)[0][1]
        else:
            prob = float(model.predict(X)[0])

        is_fraud = bool(model.predict(X)[0])

        return {
            "fraud_probability": round(float(prob), 4),
            "is_fraud": is_fraud,
            "model_used": model_name
        }

    def reload(self):
        """Clears cached models so they are reloaded fresh after retraining."""
        self.loaded_models.clear()
        self._load_config()

model_service = FraudModel()
