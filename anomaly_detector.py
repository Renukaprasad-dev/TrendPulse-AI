import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib

def train_model(df):
    features = df[['post_count', 'likes', 'shares', 'engagement_rate']]
    
    model = IsolationForest(contamination=0.01, random_state=42)
    model.fit(features)
    
    joblib.dump(model, 'isolation_forest.pkl')
    print("✅ Model saved!")

def detect_anomalies(df):
    model = joblib.load('isolation_forest.pkl')
    
    features = df[['post_count', 'likes', 'shares', 'engagement_rate']]
    df['anomaly'] = model.predict(features)
    
    # Convert: -1 → anomaly, 1 → normal
    df['anomaly'] = df['anomaly'].map({1: 0, -1: 1})
    
    return df