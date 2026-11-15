import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib

# Load processed data
df = pd.read_csv("processed_trend_data.csv")

# Features for anomaly detection
features = df[['post_count', 'likes', 'shares', 'engagement_rate']]

# Train model
model = IsolationForest(
    n_estimators=100,
    contamination=0.05,
    random_state=42
)

model.fit(features)

# Save model
joblib.dump(model, "isolation_forest.pkl")

print("✅ Model trained and saved!")