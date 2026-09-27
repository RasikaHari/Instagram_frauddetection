import os
from groq import Groq
from typing import Dict, Any
from dotenv import load_dotenv

load_dotenv()

class LLMExplainer:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        self.client = Groq(api_key=self.api_key) if self.api_key else None
        self.model = "llama-3.1-8b-instant"

    def explain(self, features: Dict[str, Any], fraud_prob: float, trust_score: float) -> str:
        """
        Generates a professional fraud risk explanation report using Groq.
        """
        if not self.client:
            return self.generate_fallback_explanation(features, fraud_prob, trust_score)

        prompt = f"""
        Analyze the following Instagram account metrics and provide a professional, data-driven "Fraud Risk Explanation Report".
        
        Metrics:
        - Likes: {features.get('likes')}
        - Reach: {features.get('reach')}
        - Engagement Rate: {features.get('engagement_rate'):.2f}%
        - Impressions: {features.get('impressions')}
        - Shares: {features.get('shares')}
        - Saves: {features.get('saves')}
        - Bio Risk Score: {features.get('bio_risk_score'):.2f} (0=safe, 1=high risk)
        - Trust Score: {trust_score}/100
        - Fraud Probability (ML Model): {fraud_prob:.2%}
        
        Requirements for the report:
        1. Professional and objective tone.
        2. Divided into: "Key Indicators", "Potential Risks", and "Final Security Recommendation".
        3. Do not use markdown headers (#), use bold text instead.
        4. Keep it under 200 words. Refine the analysis based on relative engagement (Reach vs Likes) and viral potential.
        """

        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a professional social media security analyst and fraud detector."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
            return completion.choices[0].message.content
        except Exception as e:
            print(f"Groq API call failed: {str(e)}")
            return self.generate_fallback_explanation(features, fraud_prob, trust_score)

    def generate_fallback_explanation(self, features: Dict[str, Any], fraud_prob: float, trust_score: float) -> str:
        """
        Heuristic-based explanation if LLM fails or API key is missing.
        """
        risk = "high" if trust_score < 40 else "moderate" if trust_score < 70 else "low"
        explanation = f"**Fraud Risk Explanation Report**\n\n"
        explanation += f"Our analysis indicates a **{risk}** risk level for this account. "
        
        if features.get('reach_like_ratio', 0) > 0.8:
            explanation += "The high like-to-reach ratio is suspicious, indicating potential artificial inflation of engagement. "
            
        if features.get('engagement_rate', 0) < 1.0:
            explanation += "The engagement rate is below the 1% industry standard for this reach, suggesting low content resonance. "
            
        if features.get('bio_risk_score', 0) > 0.5:
            explanation += "Bio analysis revealed high-risk patterns or deceptive metadata structures. "
            
        explanation += "\n\n**Recommendation**: Verify the account's historical organic reach before proceeding with any transactions. Higher risk detected in reach quality."
        
        return explanation

explainer = LLMExplainer()
