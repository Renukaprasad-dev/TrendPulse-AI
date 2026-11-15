import os
import joblib
import pandas as pd
import numpy as np
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI(
    title="TrendPulse Anomaly Detection API",
    description="Production ML API for Social Media Trend Anomaly Detection using Isolation Forest",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Model & Data once on startup
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "isolation_forest.pkl")
DATA_PATH = os.path.join(BASE_DIR, "processed_trend_data.csv")

_model = None
_df = None

def get_model():
    global _model
    if _model is None:
        if os.path.exists(MODEL_PATH):
            _model = joblib.load(MODEL_PATH)
    return _model

def get_data():
    global _df
    if _df is None:
        if os.path.exists(DATA_PATH):
            _df = pd.read_csv(DATA_PATH)
            _df['date'] = pd.to_datetime(_df['date'])
            _df = _df.sort_values('date')
            model = get_model()
            if model is not None:
                features = _df[['post_count', 'likes', 'shares', 'engagement_rate']]
                _df['anomaly'] = model.predict(features)
                _df['decision_score'] = model.decision_function(features)
                _df['is_anomaly'] = _df['anomaly'] == -1
    return _df

class PredictRequest(BaseModel):
    post_count: int
    likes: int
    shares: int
    engagement_rate: float

class PredictResponse(BaseModel):
    is_anomaly: bool
    prediction: int
    anomaly_status: str
    anomaly_score: float
    decision_score: float
    explanation: str

def generate_explanation(post_count: int, likes: int, shares: int, engagement_rate: float, is_anomaly: bool) -> str:
    if not is_anomaly:
        return "Metrics fall within expected historical distribution."
    reasons = []
    if post_count > 2:
        reasons.append("sudden spike in post volume")
    if engagement_rate > 0.8:
        reasons.append("extreme engagement rate outlier")
    if shares > 2000:
        reasons.append("abnormal viral sharing velocity")
    if likes > 8000:
        reasons.append("unusually high like-to-impression ratio")
    if not reasons:
        reasons.append("multivariate isolation pattern deviation")
    return "Anomaly detected: " + ", ".join(reasons) + "."

@app.get("/api/health")
def health_check():
    model = get_model()
    data = get_data()
    return {
        "status": "healthy",
        "service": "TrendPulse Anomaly Detection API",
        "model_loaded": model is not None,
        "records_loaded": len(data) if data is not None else 0,
        "features": ["post_count", "likes", "shares", "engagement_rate"],
        "algorithm": "IsolationForest"
    }

@app.get("/api/model/info")
def model_info():
    model = get_model()
    data = get_data()
    total = len(data) if data is not None else 0
    anomalies = int(data['is_anomaly'].sum()) if data is not None else 0
    
    return {
        "algorithm": "Isolation Forest (Ensemble Outlier Detection)",
        "framework": "scikit-learn",
        "n_estimators": 100,
        "contamination": 0.05,
        "max_samples": "auto",
        "random_state": 42,
        "features": [
            {"name": "post_count", "type": "int", "description": "Frequency of posts in tracking window"},
            {"name": "likes", "type": "int", "description": "Cumulative like volume"},
            {"name": "shares", "type": "int", "description": "Content redistribution count"},
            {"name": "engagement_rate", "type": "float", "description": "Interactions normalized by audience size"}
        ],
        "training_dataset": "processed_trend_data.csv",
        "total_records": total,
        "anomalies_detected": anomalies,
        "anomaly_rate_pct": round((anomalies / total * 100), 2) if total else 0.0,
        "normal_records": total - anomalies
    }

@app.get("/api/dashboard/summary")
def dashboard_summary(platform: Optional[str] = None, hashtag: Optional[str] = None):
    df = get_data()
    if df is None:
        return {"error": "Dataset not available"}
    
    filtered = df
    if platform and platform != "All":
        filtered = filtered[filtered['platform'] == platform]
    if hashtag and hashtag != "All":
        filtered = filtered[filtered['hashtag'] == hashtag]
    
    total = len(filtered)
    anomalies = int(filtered['is_anomaly'].sum())
    normal = total - anomalies
    rate = round((anomalies / total * 100), 2) if total else 0.0
    avg_eng = round(float(filtered['engagement_rate'].mean()), 3) if total else 0.0
    total_posts = int(filtered['post_count'].sum()) if total else 0
    total_likes = int(filtered['likes'].sum()) if total else 0
    total_shares = int(filtered['shares'].sum()) if total else 0
    total_interactions = total_likes + total_shares + int(filtered['comments'].sum())
    
    return {
        "total_records": total,
        "anomalies_count": anomalies,
        "normal_count": normal,
        "anomaly_rate_pct": rate,
        "avg_engagement_rate": avg_eng,
        "total_posts": total_posts,
        "total_likes": total_likes,
        "total_shares": total_shares,
        "total_interactions": total_interactions,
        "platforms_available": sorted(list(df['platform'].unique())),
        "hashtags_available": sorted(list(df['hashtag'].unique()))
    }

@app.get("/api/dashboard/trends")
def dashboard_trends(platform: Optional[str] = None, hashtag: Optional[str] = None, limit: int = 100):
    df = get_data()
    if df is None:
        return []
    
    filtered = df
    if platform and platform != "All":
        filtered = filtered[filtered['platform'] == platform]
    if hashtag and hashtag != "All":
        filtered = filtered[filtered['hashtag'] == hashtag]
    
    # Aggregate daily
    daily = filtered.groupby(filtered['date'].dt.strftime('%Y-%m-%d')).agg({
        'post_count': 'sum',
        'likes': 'sum',
        'shares': 'sum',
        'engagement_rate': 'mean',
        'is_anomaly': 'sum'
    }).reset_index()
    
    return daily.tail(limit).to_dict(orient="records")

@app.get("/api/anomalies")
def get_anomalies(platform: Optional[str] = None, hashtag: Optional[str] = None, limit: int = 50):
    df = get_data()
    if df is None:
        return []
    
    filtered = df[df['is_anomaly'] == True]
    if platform and platform != "All":
        filtered = filtered[filtered['platform'] == platform]
    if hashtag and hashtag != "All":
        filtered = filtered[filtered['hashtag'] == hashtag]
    
    results = []
    for _, row in filtered.head(limit).iterrows():
        raw_score = float(row['decision_score'])
        severity = round(max(0.0, min(100.0, (0.20 - raw_score) / 0.38 * 100)), 1)
        results.append({
            "date": str(row['date'].strftime('%Y-%m-%d')),
            "platform": str(row['platform']),
            "hashtag": str(row['hashtag']),
            "post_count": int(row['post_count']),
            "likes": int(row['likes']),
            "shares": int(row['shares']),
            "comments": int(row['comments']),
            "engagement_rate": round(float(row['engagement_rate']), 4),
            "anomaly_score": severity,
            "explanation": generate_explanation(int(row['post_count']), int(row['likes']), int(row['shares']), float(row['engagement_rate']), True)
        })
    return results

@app.get("/api/insights")
def get_insights(platform: Optional[str] = None):
    df = get_data()
    if df is None:
        return []
    
    filtered = df
    if platform and platform != "All":
        filtered = filtered[filtered['platform'] == platform]
    
    anomalies = filtered[filtered['is_anomaly'] == True]
    insights = []
    
    # 1. Platform spike
    platform_counts = anomalies['platform'].value_counts()
    if len(platform_counts) > 0:
        top_platform = platform_counts.index[0]
        insights.append({
            "type": "platform_concentration",
            "title": f"Concentration Spike on {top_platform}",
            "description": f"{top_platform} accounts for {platform_counts.iloc[0]} anomalies ({round(platform_counts.iloc[0]/len(anomalies)*100, 1)}% of detected outliers).",
            "severity": "high"
        })
    
    # 2. Viral engagement anomalies
    high_eng = anomalies[anomalies['engagement_rate'] > 0.8]
    if len(high_eng) > 0:
        insights.append({
            "type": "viral_engagement",
            "title": "Severe Engagement Surges",
            "description": f"{len(high_eng)} records exhibited engagement rates above 80%, exceeding normal distributions by over 3 standard deviations.",
            "severity": "warning"
        })
    
    # 3. Post volume bursts
    bursts = anomalies[anomalies['post_count'] > 2]
    if len(bursts) > 0:
        insights.append({
            "type": "post_burst",
            "title": "Coordinated Volume Surges",
            "description": f"{len(bursts)} instances had post count spikes indicative of orchestrated campaigns or breaking trend events.",
            "severity": "info"
        })
    
    return insights

@app.post("/api/predict", response_model=PredictResponse)
def predict_anomaly(req: PredictRequest):
    model = get_model()
    if model is None:
        raise ValueError("Model is not loaded")
    
    features = pd.DataFrame([{
        'post_count': req.post_count,
        'likes': req.likes,
        'shares': req.shares,
        'engagement_rate': req.engagement_rate
    }])
    
    pred = int(model.predict(features)[0])
    raw_score = float(model.decision_function(features)[0])
    is_anomaly = bool(pred == -1)
    severity = round(max(0.0, min(100.0, (0.20 - raw_score) / 0.38 * 100)), 1)
    
    return PredictResponse(
        is_anomaly=is_anomaly,
        prediction=pred,
        anomaly_status="Anomaly" if is_anomaly else "Normal",
        anomaly_score=severity,
        decision_score=round(raw_score, 4),
        explanation=generate_explanation(req.post_count, req.likes, req.shares, req.engagement_rate, is_anomaly)
    )
