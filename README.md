<p align="center">
  <h1 align="center">TrendPulse AI</h1>
  <p align="center">
    <strong>Enterprise Social Media Anomaly Detection & Intelligence Platform</strong>
  </p>
  <p align="center">
    Unsupervised machine learning platform for detecting statistical outliers across multi-platform social media engagement data using Isolation Forest ensemble methods.
  </p>
</p>

<p align="center">
  <a href="https://trendpulse-anomaly-analytics.vercel.app">
    <img src="https://img.shields.io/badge/Live_Application-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Application" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python 3.11" />
  <img src="https://img.shields.io/badge/scikit--learn-1.9-F7931E?style=flat-square&logo=scikitlearn&logoColor=white" alt="scikit-learn" />
  <img src="https://img.shields.io/badge/Streamlit-1.67-FF4B4B?style=flat-square&logo=streamlit&logoColor=white" alt="Streamlit" />
  <img src="https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
</p>

---

## Table of Contents

- [Project Overview](#project-overview)
- [Live Application](#live-application)
- [Key Features](#key-features)
- [Dashboard Screenshots](#dashboard-screenshots)
- [System Architecture](#system-architecture)
- [Machine Learning Methodology](#machine-learning-methodology)
- [Dataset Documentation](#dataset-documentation)
- [Mathematical Formulas](#mathematical-formulas)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Local Setup](#installation--local-setup)
- [API Documentation](#api-documentation)
- [Model Training](#model-training)
- [Deployment](#deployment)
- [Model Evaluation & Limitations](#model-evaluation--limitations)
- [Future Roadmap](#future-roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Project Overview

TrendPulse AI is a full-stack analytics platform that applies unsupervised anomaly detection to social media engagement metrics. The platform evaluates historical trend data across five major social media networks, identifies statistically anomalous engagement patterns using Isolation Forest ensemble methodology, and surfaces findings through an interactive enterprise dashboard.

### Why Social Media Anomaly Detection Matters

Social media engagement metrics — likes, shares, comments, and post frequency — naturally vary over time. Beyond routine variance, significant statistical outliers can represent high-impact real-world events: organic viral cascades, coordinated bot amplification campaigns, sudden PR crises, or drastic shifts in topic resonance. Identifying these outliers allows:

- **Brand & PR teams** to catch unexpected viral spread or emerging brand risks early.
- **Social media strategists** to evaluate whether engagement surges reflect authentic resonance or artificial volume.
- **Data analysts** to audit engagement patterns that statistically diverge from historical baseline distributions.
- **Trust & safety teams** to flag coordinated burst posting patterns across topics and accounts.

### What This Project Implements

1. **Preprocessed dataset artifact** (`processed_trend_data.csv`, 10,698 records) containing historical social media engagement features.
2. **Python Isolation Forest model** (`isolation_forest.pkl`) trained on four numerical features using scikit-learn.
3. **Local Python applications**: An interactive Streamlit dashboard (`dashboard.py`), Python execution CLI (`app.py`), and a local FastAPI backend (`backend/index.py`).
4. **Next.js web application** featuring a dark-themed analytics dashboard with eight modular views.
5. **Next.js serverless API routes** serving anomaly telemetry, dataset queries, and client-side simulation.
6. **Production deployment** on Vercel's global edge network.

> **Data Scope Note**: TrendPulse AI operates on a historical dataset spanning May 2024 to April 2025. It does not ingest live social media data from external platform APIs.

---

## Live Application

> **Production URL**: [https://trendpulse-anomaly-analytics.vercel.app](https://trendpulse-anomaly-analytics.vercel.app)

The application is deployed on Vercel and serves the complete Next.js dashboard along with serverless API routes.

---

## Key Features

| Module | Description |
| --- | --- |
| **Executive Overview** | Summary KPI cards (total records, anomaly count, anomaly rate, average engagement, total interactions), real-time alert banner, daily trend charts, anomaly/normal distribution breakdown, and top anomalous hashtags. |
| **Anomaly Detection** | Dedicated audit log displaying **strictly records classified as anomalies** (`is_anomaly === true`, 535 total). Multi-filter bar for platform, hashtag, date range (May 2024 – Apr 2025), and minimum severity score. Default sort by severity descending. Paginated with dedicated anomaly-only CSV export. |
| **Trend Analysis** | Multi-metric daily time-series line charts (post count, likes, shares, engagement rate). Platform distribution bar chart and anomaly proportion breakdown. |
| **Insights & Intelligence** | Five structured insight cards with empirical evidence: finding, affected platform, number of affected records, relevant metric, quantitative calculation, and recommended operational action. |
| **Data Explorer** | Complete access to all 10,698 dataset records. In-table search, platform filter, classification filter (Normal vs Anomaly), date range filter, multi-column sorting, and configurable pagination (up to 100 rows per page). Filtered CSV export. |
| **Model Performance** | Isolation Forest architecture specifications, hyperparameter grid, exact 9-bracket decision function score histogram, empirical normal-vs-anomaly comparison table, 4-dimensional feature vector documentation, and an explicit unsupervised evaluation transparency statement. |
| **ML Simulator** | Interactive prediction testing interface with dual slider and direct numeric inputs for all four features. Four presets (Normal Baseline, Viral Spike, Post Burst, Extreme Outlier). Displays prediction class (+1 / -1), raw decision score, documented severity formula, and empirical percentile explanation. Pre-evaluates on mount. |
| **Settings** | Critical severity alert threshold (persisted in `localStorage`), engagement rate display format preference (percentage vs ratio), live API health probe with round-trip latency measurement, model artifact documentation, and local cache reset controls. |

---

## Dashboard Screenshots

Screenshots can be added to the `docs/images/` directory. See [`docs/images/README.md`](docs/images/README.md) for expected filenames and capture guidelines.

| Section | Expected Screenshot Path |
| --- | --- |
| Executive Overview | `docs/images/overview.png` |
| Anomaly Detection | `docs/images/anomaly-detection.png` |
| Trend Analysis | `docs/images/trend-analysis.png` |
| Insights & Intelligence | `docs/images/insights.png` |
| Data Explorer | `docs/images/data-explorer.png` |
| Model Performance | `docs/images/model-performance.png` |
| ML Simulator | `docs/images/ml-simulator.png` |
| Settings | `docs/images/settings.png` |

---

## System Architecture

```mermaid
flowchart TD
    subgraph Data Layer
        A["raw_trend_data.csv.csv\n(Source Dataset)"] -.->|"Exploratory Analysis"| B["EDA_.ipynb\n(Jupyter Notebook)"]
        C["processed_trend_data.csv\n(Existing Dataset Artifact: 10,698 rows)"]
    end

    subgraph Python Environment (Local)
        C --> D["train_model.py\n(scikit-learn fit)"]
        D --> E["isolation_forest.pkl\n(Joblib Model Binary)"]
        E --> F["Streamlit Dashboard\n(dashboard.py / app.py)"]
        E --> G["FastAPI Backend\n(backend/index.py)"]
    end

    subgraph Production Environment (Vercel)
        C --> H["src/data/dataset.json\n(Embedded JSON: 10,698 rows)"]
        H --> I["Next.js Edge API Routes\n(/api/predict, /api/anomalies,\n/api/health, /api/insights)"]
        H --> J["Next.js Dashboard Frontend\n(React 18 + TypeScript + Tailwind)"]
        I --> J
        J --> K["Vercel Edge Production\n(trendpulse-anomaly-analytics.vercel.app)"]
    end

    style C fill:#1e293b,stroke:#6366f1,color:#e2e8f0
    style D fill:#1e293b,stroke:#f43f5e,color:#e2e8f0
    style E fill:#1e293b,stroke:#f43f5e,color:#e2e8f0
    style J fill:#1e293b,stroke:#6366f1,color:#e2e8f0
    style K fill:#1e293b,stroke:#10b981,color:#e2e8f0
```

### Architectural Distinction: Local Python vs. Production Vercel

It is important to clearly distinguish the two environments:

1. **Local Python ML Runtime**:
   - `train_model.py` loads `processed_trend_data.csv`, fits `sklearn.ensemble.IsolationForest`, and serializes the binary `isolation_forest.pkl`.
   - `dashboard.py` (Streamlit) and `backend/index.py` (FastAPI) directly load `isolation_forest.pkl` via joblib and call `model.predict()` and `model.decision_function()` in memory.
2. **Production Vercel Runtime**:
   - Vercel serverless functions do **not** run Python or load the `.pkl` binary directly (avoiding large C-extension dependencies like NumPy and SciPy in edge bundles).
   - Instead, the pre-scored dataset (`src/data/dataset.json`) is served by TypeScript API routes.
   - The production simulator endpoint (`/api/predict`) evaluates custom inputs using an empirical decision-boundary calculator calibrated directly against the 95th-percentile feature distributions and decision function statistics from the training dataset.

---

## Machine Learning Methodology

### Algorithm: Isolation Forest

Isolation Forest is an unsupervised tree ensemble algorithm based on the principle that **anomalous observations are few and different**, and therefore require fewer recursive random binary splits to isolate than clustered inliers.

At each step, an isolation tree randomly selects a feature and a split value between that feature's observed minimum and maximum. Data points with extreme values or unusual feature combinations isolate close to the root, resulting in shorter average path lengths through the ensemble.

**Why Isolation Forest was selected:**
- **No Ground-Truth Dependency**: The dataset contains real-world social media metrics without synthetic or verified human-annotated labels, making supervised classification infeasible.
- **Computational Efficiency**: Isolation Forest operates with linear time complexity $O(n \cdot t \cdot \psi)$ and does not require costly distance-matrix or density computations.
- **Multivariate Sensitivity**: It isolates anomalies across multi-dimensional feature interactions (e.g., normal like volume paired with extreme share volume).

### Model Hyperparameters

| Parameter | Value | Technical Role |
| --- | --- | --- |
| `n_estimators` | 100 | Number of isolation trees built in the ensemble forest |
| `contamination` | 0.05 | **Configuration parameter** defining the expected proportion of outliers (5.0%). Sets the decision threshold boundary (yielding 535 anomalies out of 10,698 records). It is a tuning parameter, not a measurement of model accuracy. |
| `random_state` | 42 | Deterministic seed for reproducible tree partitions |
| `max_samples` | 'auto' | Subsample size per tree (min(256, $n$)) |

### Input Feature Vector (4 Dimensions)

| Feature Name | Data Type | 95th Percentile ($p_{95}$) | Role in Anomaly Isolation |
| --- | --- | --- | --- |
| `post_count` | Integer | 2 posts / window | Hourly post frequency per entity. Identifies coordinated publication blitzes. |
| `likes` | Integer | 5,452 likes | Direct appreciation metric. Isolates extreme positive resonance or artificial upvoting. |
| `shares` | Integer | 2,222 shares | Redistribution velocity. Strongest indicator of viral contagion cascades. |
| `engagement_rate` | Float | 0.82 (82.0%) | Normalized interaction density: $(\text{likes} + \text{shares} + \text{comments}) / \text{impressions}$. |

### Prediction Convention & Boundary

| Model Output | Classification | Decision Function Score Range |
| --- | --- | --- |
| **+1** | Normal Baseline (Inlier) | $\text{score} \ge 0.0000$ (Observed: $0.0000$ to $+0.2185$, Mean: $+0.1615$) |
| **-1** | Anomaly (Outlier) | $\text{score} < 0.0000$ (Observed: $-0.1843$ to $-0.0001$, Mean: $-0.0516$) |

The decision boundary is calibrated by scikit-learn at exactly $0.0000$. Scores below zero correspond to shorter average path lengths through the tree ensemble.

---

## Dataset Documentation

### Summary Statistics

| Metric | Verified Value |
| --- | --- |
| Total records | 10,698 rows |
| Detected anomalies | 535 rows (5.00%) |
| Normal records | 10,163 rows (95.00%) |
| Contamination setting | 0.05 (5.0%) |
| Temporal coverage | May 1, 2024 – April 30, 2025 |
| Platforms covered | 5 platforms |

### Anomaly Breakdown by Platform

| Platform | Total Anomalies | Anomaly Share (%) |
| --- | --- | --- |
| **Twitter** | 115 | 21.5% |
| **Reddit** | 108 | 20.2% |
| **YouTube** | 107 | 20.0% |
| **Instagram** | 103 | 19.3% |
| **Facebook** | 102 | 19.1% |
| **Total** | **535** | **100.0%** |

### Dataset Files in Repository

| File | Status | Description |
| --- | --- | --- |
| `processed_trend_data.csv` | **Primary Input Artifact** | Preprocessed tabular dataset (10,698 rows &times; 11 columns) used for training `isolation_forest.pkl` and generating `dataset.json`. |
| `raw_trend_data.csv.csv` | **Historical Source Data** | Original raw dataset (5.16 MB) containing initial observation logs before feature engineering. |
| `anomaly_output.csv` | **Pipeline Output Artifact** | Output generated by `app.py` / `anomaly_detector.py` containing model classifications appended to the processed data. |
| `src/data/dataset.json` | **Frontend Data Artifact** | Complete JSON serialization of the pre-scored dataset bundled with the Next.js application. |
| `EDA_.ipynb` | **Exploratory Notebook** | Jupyter notebook documenting exploratory data analysis, visualizations, and preprocessing experiments. |

> **Important Preprocessing Note**: `processed_trend_data.csv` is an existing input artifact in the repository. There is no automated preprocessing script that executes `raw_trend_data.csv.csv` &rarr; `processed_trend_data.csv` at build time; the data was prepared during the exploratory phase documented in `EDA_.ipynb`.

---

## Mathematical Formulas

### Engagement Rate Formula

$$\text{Engagement Rate} = \frac{\text{Likes} + \text{Shares} + \text{Comments}}{\text{Impressions}}$$

**Why Engagement Rate Exceeds 100%:**
The formula computes an **interaction-to-impression ratio**, where the numerator represents the cumulative count of discrete interactions, while the denominator represents total impressions (views). Because a single viewer can perform multiple independent actions on a post (liking, sharing, and commenting), the sum of interactions can legitimately exceed total impressions.

In this dataset, 438 processed records feature engagement rates exceeding 1.0 (100%), with a peak viral outlier at 32.21 (3,221%). These values represent authentic viral engagement dynamics and are deliberately **not** artificially capped at 100%.

### Severity Score Index (0 – 100)

To provide an interpretable severity scale for operations teams, raw decision scores are mapped to a continuous 0–100 index:

$$\text{Severity} = \text{clamp}\left(0,\; 100,\; \text{round}\left(\frac{0.20 - \text{decision\_score}}{0.38} \times 100\right)\right)$$

- Modal inliers ($\text{score} = +0.20$) map to **Severity 0**.
- Decision boundary ($\text{score} = 0.00$) maps to **Severity 52.6**.
- Extreme outliers ($\text{score} = -0.18$) map to **Severity 100**.

### Empirical Score Distribution

Across the 10,698 records, the raw `decision_function` scores fall into nine distinct bins:

| Score Bracket | Count | Classification | Category |
| :--- | :--- | :--- | :--- |
| `[-0.20, -0.15)` | 12 | Anomaly (-1) | Extreme Outlier |
| `[-0.15, -0.10)` | 67 | Anomaly (-1) | Severe Outlier |
| `[-0.10, -0.05)` | 157 | Anomaly (-1) | Moderate Outlier |
| `[-0.05, 0.00)` | 299 | Anomaly (-1) | Marginal Outlier |
| `[0.00, 0.05)` | 630 | Normal (+1) | Marginal Inlier |
| `[0.05, 0.10)` | 643 | Normal (+1) | Low Inlier |
| `[0.10, 0.15)` | 1,550 | Normal (+1) | Typical Inlier |
| `[0.15, 0.20)` | 5,122 | Normal (+1) | Modal Inlier |
| `[0.20, 0.25)` | 2,218 | Normal (+1) | Dense Inlier Cluster |

---

## Technology Stack

| Domain | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | Next.js | 14.2.24 | App Router, static generation, serverless routing |
| **UI Library** | React | 18.3.1 | Component-based dashboard architecture |
| **Language** | TypeScript | 5.7.3 | Type-safe application development |
| **Styling** | Tailwind CSS | 3.4.17 | Utility-first responsive dark theme design system |
| **Charts** | Recharts | 2.15.1 | Composable SVG time-series and distribution charts |
| **Icons** | Lucide React | 1.16.0 | Professional icon set |
| **ML Framework** | scikit-learn | 1.9.1 | Isolation Forest algorithm implementation |
| **Data Analysis** | pandas | 3.1.1 | Tabular dataset manipulation and inspection |
| **Numerical Computing** | NumPy | 2.4.6 | Multi-dimensional array operations |
| **Scientific Computing** | SciPy | 1.17.1 | Statistical calculations |
| **Model Serialization** | joblib | 1.6.0 | Efficient binary serialization (`.pkl`) |
| **Python Dashboard** | Streamlit | 1.67.0 | Local Python dashboard application |
| **Python Charts** | Plotly | 7.1.0 | Interactive visualizations in Streamlit |
| **Local API** | FastAPI | 0.115+ | Local Python model-serving endpoints |
| **Cloud Hosting** | Vercel | Production | Serverless edge deployment and global CDN |

---

## Project Structure

```
TrendPulse-AI/
├── src/                            # Next.js frontend application source
│   ├── app/
│   │   ├── page.tsx                # Main dashboard page (client component)
│   │   ├── layout.tsx              # Root HTML/body layout and metadata
│   │   ├── globals.css             # Tailwind base styles and CSS variables
│   │   └── api/
│   │       ├── health/route.ts     # GET  /api/health (service status)
│   │       ├── predict/route.ts    # POST /api/predict (real-time prediction)
│   │       ├── anomalies/route.ts  # GET  /api/anomalies (paginated anomaly log)
│   │       ├── insights/route.ts   # GET  /api/insights (structured insight cards)
│   │       ├── model/info/route.ts # GET  /api/model/info (model metadata)
│   │       └── dashboard/
│   │           ├── summary/route.ts # GET /api/dashboard/summary (KPI metrics)
│   │           └── trends/route.ts  # GET /api/dashboard/trends (time-series)
│   ├── components/
│   │   ├── Sidebar.tsx             # Collapsible left navigation sidebar
│   │   ├── TopNav.tsx              # Search, platform, hashtag, date filter bar
│   │   ├── KpiCards.tsx            # KPI metric cards with formula tooltip
│   │   ├── TrendCharts.tsx         # Time-series line and bar charts
│   │   ├── AnomalyTable.tsx        # Anomaly audit log with advanced filters
│   │   ├── InsightsView.tsx        # Actionable intelligence cards
│   │   ├── DataExplorer.tsx        # Full dataset table browser with pagination
│   │   ├── ModelPerformanceView.tsx # Model architecture & score distribution
│   │   ├── PredictSimulator.tsx    # Dual-input real-time ML simulator
│   │   ├── SettingsView.tsx        # Settings, health probe, and preferences
│   │   └── LoginModal.tsx          # Client-side authentication modal gate
│   └── data/
│       └── dataset.json            # Preprocessed dataset (10,698 records)
├── public/
│   └── data/
│       └── dataset.json            # Public asset copy of dataset
├── backend/
│   └── index.py                    # Local FastAPI REST API application
├── docs/
│   └── images/
│       └── README.md               # Screenshot guidelines and placeholder specs
├── app.py                          # Python entry point (CLI pipeline / Streamlit launcher)
├── dashboard.py                    # Streamlit interactive dashboard application
├── train_model.py                  # Standalone Isolation Forest model training script
├── anomaly_detector.py             # Reusable Python training & detection functions
├── isolation_forest.pkl            # Trained scikit-learn Isolation Forest model binary
├── processed_trend_data.csv        # Primary input dataset artifact (10,698 rows)
├── raw_trend_data.csv.csv          # Original source dataset (5.16 MB)
├── anomaly_output.csv              # Model predictions output generated by pipeline
├── EDA_.ipynb                      # Exploratory Data Analysis Jupyter notebook
├── requirements.txt                # Python dependencies
├── package.json                    # Node.js dependencies and build scripts
├── next.config.mjs                 # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript compiler configuration
├── postcss.config.mjs              # PostCSS configuration
├── .vercelignore                   # Vercel deployment exclusions
└── .gitignore                      # Git version control exclusions
```

---

## Installation & Local Setup

### Prerequisites

| Tool | Recommended Version |
| :--- | :--- |
| **Python** | 3.11.x (tested on 3.11.9) |
| **Node.js** | 18.x or later (tested on 20.x / 24.x) |
| **npm** | 9.x or later |
| **Git** | 2.x or later |

### 1. Clone the Repository

```powershell
git clone <repository-url>
cd Anamaly-Detecttion-main
```

### 2. Python Virtual Environment & Dependencies

```powershell
# Create a dedicated virtual environment
python -m venv .venv

# Activate the virtual environment (Windows PowerShell)
.\.venv\Scripts\Activate.ps1

# Upgrade pip
python -m pip install --upgrade pip

# Install required Python dependencies
python -m pip install -r requirements.txt
```

If network timeouts occur during installation, specify an official PyPI mirror:

```powershell
python -m pip install -r requirements.txt -i https://pypi.org/simple/ --timeout 120
```

### 3. Run the Next.js Web Application

```powershell
# Install Node.js dependencies
npm install

# Start the local Next.js development server
npm run dev
```

The Next.js application will be available at `http://localhost:3000`.

To create an optimized production build locally:

```powershell
npm run build
npm run start
```

### 4. Run the Streamlit Dashboard (Local Fallback)

```powershell
# Ensure the virtual environment is activated
.\.venv\Scripts\Activate.ps1

# Launch the Streamlit dashboard
streamlit run app.py
```

The Streamlit dashboard opens automatically at `http://localhost:8501`.

### 5. Run the Python CLI Pipeline

```powershell
python app.py
```

This trains the model, performs inference across all rows in `processed_trend_data.csv`, outputs progress to the terminal, and writes `anomaly_output.csv`.

---

## API Documentation

All API endpoints are available locally at `http://localhost:3000/api/...` and in production at `https://trendpulse-anomaly-analytics.vercel.app/api/...`.

### 1. `GET /api/health`

Returns API operational status, loaded record count, and model feature metadata.

**Response (`200 OK`):**
```json
{
  "status": "healthy",
  "service": "TrendPulse AI Analytics API",
  "model_loaded": true,
  "records_loaded": 10698,
  "features": ["post_count", "likes", "shares", "engagement_rate"],
  "algorithm": "IsolationForest",
  "timestamp": "2026-11-15T17:15:38.673Z"
}
```

### 2. `POST /api/predict`

Evaluates a 4-dimensional engagement feature vector and returns an anomaly classification, severity score, and empirical explanation.

**Request Body (`application/json`):**
```json
{
  "post_count": 3,
  "likes": 14500,
  "shares": 5100,
  "engagement_rate": 1.85
}
```

**Response (`200 OK`):**
```json
{
  "is_anomaly": true,
  "prediction": -1,
  "prediction_class": "Outlier Class (-1)",
  "anomaly_status": "Anomaly Detected",
  "anomaly_score": 100,
  "decision_score": -0.1843,
  "severity_formula": "Severity = clamp(0, 100, ((0.20 - decision_score) / 0.38) * 100)",
  "explanation": "Outlier classified: Post count (3) exceeds 95th percentile baseline (p95 = 2); Likes volume (14,500) exceeds 95th percentile baseline (p95 = 5,452); Shares velocity (5,100) exceeds 95th percentile baseline (p95 = 2,222); Engagement rate (185.0%) exceeds 95th percentile baseline (p95 = 82.0%); Multivariate confluence: high shares, elevated likes, and high engagement co-occur.",
  "features_evaluated": {
    "post_count": 3,
    "likes": 14500,
    "shares": 5100,
    "engagement_rate": 1.85
  },
  "thresholds": {
    "p95_post_count": 2,
    "p95_likes": 5452,
    "p95_shares": 2222,
    "p95_engagement_rate": 0.82,
    "decision_boundary": 0
  },
  "model": {
    "algorithm": "Isolation Forest",
    "contamination": 0.05,
    "n_estimators": 100,
    "trained_samples": 10698
  }
}
```

### 3. `GET /api/anomalies`

Returns paginated anomaly records with optional multi-attribute filtering.

**Query Parameters:**
- `platform` (string, optional): Filter by platform (`Twitter`, `Reddit`, `YouTube`, `Instagram`, `Facebook`).
- `hashtag` (string, optional): Filter by hashtag name.
- `status` (string, optional): `anomalies_only` (default), `normal_only`.
- `search` (string, optional): Case-insensitive keyword filter across platform, hashtag, date, and reason.
- `page` (integer, default: `1`): Pagination page index.
- `limit` (integer, default: `100`): Records returned per page.

**Response (`200 OK`):**
```json
{
  "total": 535,
  "page": 1,
  "limit": 100,
  "totalPages": 6,
  "records": [
    {
      "id": 1,
      "date": "2024-05-01",
      "platform": "Facebook",
      "hashtag": "#Affordable",
      "post_count": 1,
      "likes": 2692,
      "shares": 1099,
      "comments": 384,
      "engagement_rate": 0.0617,
      "z_score": -0.013,
      "is_anomaly": true,
      "anomaly_score": 53.2,
      "reason": "Isolation Forest decision function indicates outlier boundary divergence"
    }
  ]
}
```

### 4. `GET /api/insights`

Returns structured actionable intelligence cards backed by empirical quantitative evidence.

**Response (`200 OK`):** Array of insight objects, each containing `finding`, `affectedPlatform`, `affectedRecords`, `relevantMetric`, `evidence`, `recommendedAction`, `priority`, and `category`.

### 5. `GET /api/model/info`

Returns model hyperparameters, feature definitions, training sample size, and evaluation methodology notes.

### 6. `GET /api/dashboard/summary`

Returns aggregated KPI counts (total records, anomalies, normal count, anomaly rate, average engagement, total interactions).

### 7. `GET /api/dashboard/trends`

Returns daily aggregated time-series records for trending line charts.

---

## Model Training

### Training Workflow

To retrain the Isolation Forest model using the Python environment:

```powershell
# 1. Activate the Python virtual environment
.\.venv\Scripts\Activate.ps1

# 2. Execute the model training script
python train_model.py
```

The script:
1. Reads `processed_trend_data.csv`.
2. Selects the 4-dimensional feature matrix: `['post_count', 'likes', 'shares', 'engagement_rate']`.
3. Fits `sklearn.ensemble.IsolationForest(n_estimators=100, contamination=0.05, random_state=42)`.
4. Serializes the trained model to `isolation_forest.pkl` using joblib.

### Training Scripts Overview

| Script | Responsibility |
| :--- | :--- |
| `train_model.py` | Minimal training script: loads processed data, trains Isolation Forest, dumps `isolation_forest.pkl`. |
| `anomaly_detector.py` | Module providing `train_model(df)` and `detect_anomalies(df)` utility functions. |
| `app.py` | Full pipeline: trains model, runs predictions, prints summaries, saves `anomaly_output.csv`, or launches Streamlit if called via `streamlit run`. |
| `backend/index.py` | FastAPI server that loads `isolation_forest.pkl` dynamically and serves REST endpoints. |

---

## Deployment

### Vercel Production Deployment

The production web application is hosted on Vercel:

- **Live URL**: [https://trendpulse-anomaly-analytics.vercel.app](https://trendpulse-anomaly-analytics.vercel.app)
- **Framework Preset**: Next.js
- **Node.js Version**: 20.x

To deploy changes to production:

```powershell
# 1. Verify that the Next.js build succeeds cleanly
npm run build

# 2. Deploy to production via Vercel CLI
npx vercel --prod --yes
```

### Deployment Configuration (`.vercelignore`)

To keep serverless function bundles lightweight and avoid the 500 MB Lambda limit, Python libraries and raw datasets are excluded from Vercel deployment:

```
.venv/
venv/
__pycache__/
*.pyc
*.bak
*.ipynb
raw_trend_data.csv.csv
backend/
.git/
.vscode/
```

The Next.js production application serves all data from `src/data/dataset.json` via TypeScript edge functions.

---

## Model Evaluation & Limitations

### Scientific Evaluation Standard for Unsupervised Learning

In machine learning evaluation, supervised metrics such as **Accuracy, Precision, Recall, and F1 Score require verified ground-truth labels** (i.e. external human verification confirming whether each event was truly an anomaly).

Because this dataset consists of observational social media trend metrics without human-annotated anomaly labels:
- **Supervised metrics (Precision, Recall, F1) are not calculated or reported.** Inventing or fabricating precision/recall percentages would violate rigorous ML evaluation standards.
- Model performance is instead evaluated through **decision function score distributions**, **empirical population divergence** (comparing normal vs anomalous means and variances), and **feature percentile thresholds**.

### Population Comparison: Normal Inliers vs. Anomaly Outliers

| Dimension | Normal Baseline ($n = 10,163$) | Anomaly Outliers ($n = 535$) | Observed Divergence |
| :--- | :--- | :--- | :--- |
| **Mean Decision Score** | $+0.1615 \pm 0.047$ | $-0.0516 \pm 0.038$ | $\Delta = 0.2131$ (Strict boundary separation at $0.0$) |
| **Mean Severity Index** | $10.5 / 100$ | $66.2 / 100$ | $6.3\times$ higher severity rating |
| **Mean Likes Volume** | $2,649 \pm 1,575$ | $5,538 \pm 2,899$ | $2.09\times$ normal volume |
| **Mean Shares Volume** | $1,082 \pm 638$ | $2,029 \pm 1,155$ | $1.88\times$ normal velocity |
| **Mean Engagement Rate** | $16.6\% \pm 28.0\%$ | $241.9\% \pm 437.0\%$ | $14.6\times$ higher engagement density |

### Known Limitations

1. **Static Historical Data**: The platform analyzes a static historical snapshot (May 2024 – April 2025) and does not ingest live data from active social media APIs.
2. **Contamination Assumption**: The 5.0% contamination parameter sets the threshold quantile. It is an operational parameter, not a mathematically proven ground-truth anomaly rate.
3. **Four-Feature Representation**: The model evaluates numerical engagement signals only. It does not analyze natural language sentiment, image/video content, user network graphs, or account age.
4. **Statistical Outlier &ne; Causal Explanation**: The model identifies observations that diverge statistically from normal distributions. Distinguishing organic viral resonance from bot astroturfing requires qualitative investigation.

---

## Future Roadmap

The following capabilities represent planned future enhancements:

- [ ] **Live Social Media Streaming**: Webhook-based integration with official platform APIs (X/Twitter, Reddit, YouTube) for real-time trend ingestion.
- [ ] **Streaming Anomaly Detection**: Incremental tree updates (e.g., Half-Space Trees or Extended Isolation Forests) for continuous data streams.
- [ ] **Temporal Time-Series Modeling**: Integrating Prophet or LSTM autoencoders to account for day-of-week and seasonal baseline periodicity.
- [ ] **Explainable AI (XAI)**: SHAP (SHapley Additive exPlanations) values to quantify the contribution of each feature to individual anomaly classifications.
- [ ] **Automated Retraining Pipeline**: Scheduled GitHub Actions or cloud cron jobs to retrain models when new data snapshots are committed.
- [ ] **Webhook & Email Alerts**: Real-time Slack/Discord webhooks and email notifications when critical severity anomalies ($\ge 85$) occur.
- [ ] **Cross-Platform Benchmarking**: Normalizing engagement metrics to enable direct virality comparisons across different platforms.

---

## Contributing

Contributions to TrendPulse AI are welcome. To contribute:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Verify your changes locally:
   - Frontend: `npm run build`
   - Python ML: `python train_model.py`
4. Commit your changes: `git commit -m "feat: concise description of change"`
5. Push to your branch: `git push origin feature/your-feature-name`
6. Open a Pull Request detailing the changes and verification steps performed.

---

## License

No license is currently provided for this repository. All rights are reserved by the author. A license granting reuse, modification, or distribution may be selected and added in a future release.

---

## Author

**Renuka Prasad HS**

- **Project**: TrendPulse AI — Enterprise Social Media Anomaly Detection & Intelligence Platform
- **Live Application**: [https://trendpulse-anomaly-analytics.vercel.app](https://trendpulse-anomaly-analytics.vercel.app)
- **GitHub**: [Renukaprasad-dev](https://github.com/Renukaprasad-dev)

---

<p align="center">
  Built with scikit-learn, Next.js, and a commitment to honest machine learning evaluation.
</p>
