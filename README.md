# 🛡️ InstaTrust: AI-Powered Instagram Fraud Analyzer

![InstaTrust Banner](https://img.shields.io/badge/InstaTrust-Fraud_Detection-6366f1?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js)
![Machine Learning](https://img.shields.io/badge/Scikit_Learn-F7931E?style=for-the-badge&logo=scikit-learn)

**InstaTrust** is a cutting-edge social media security and analytics platform designed to detect fraudulent Instagram profiles and artificial engagement patterns. By leveraging an ensemble of **7 Machine Learning Algorithms**, **Large Language Models (Llama 3)**, and real-world **Kaggle Analytics Data**, InstaTrust provides users with a deep, data-driven "Trust Score" and risk analysis for any analyzed account.

---

## 🚀 Key Features

* **Multi-Algorithm ML Pipeline**: Trains, evaluates, and dynamically loads 7 different classification models (Random Forest, SVM, Logistic Regression, Decision Tree, KNN, Gradient Boosting, Naive Bayes) to detect fraud with extreme accuracy.
* **Dynamic Model Metrics Dashboard**: A dedicated `/metrics` page providing a visual comparison of all 7 algorithms (Accuracy, Precision, Recall, F1-Score, ROC-AUC) using Recharts radar and bar charts. Includes a live "Retrain All Models" trigger.
* **AI Verdict Engine**: Uses **Groq Cloud (Llama 3.1)** to generate professional, context-aware fraud risk explanation reports in natural language.
* **Interactive Bento-Style Dashboard**: 
    * **Risk Meter**: Visualized safety gauge through animated SVGs.
    * **Interaction Mix & Conversion Funnel**: Breakdown of social interaction types (Likes vs Shares vs Saves) and post flow from reach to profile visits.
    * **Radar Profile**: 5-dimensional signal map (Engagement, Reach Quality, Bio Safety, etc.).
    * **Network Audit Trail**: Live, time-synced logs of security signals and anomalies.
* **Relative Benchmarking**: Compares every account against its specific content category (e.g., Technology vs Beauty) for more accurate performance verdicts.
* **Reporting & Sharing**: Integrated Web Share API and PDF Report download (via Browser Print).

---

## 🛠️ Tech Stack

### Frontend (User Interface)
- **Framework**: [Next.js 15](https://nextjs.org/) (React 19)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend (API & Machine Learning)
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Data Processing**: [Pandas](https://pandas.pydata.org/), [NumPy](https://numpy.org/)
- **Machine Learning**: [Scikit-Learn](https://scikit-learn.org/)
- **Model Serialization**: [Joblib](https://joblib.readthedocs.io/)
- **LLM Integration**: [Groq API](https://console.groq.com/) (Llama 3.1)

---

## 🧠 Machine Learning Architecture

InstaTrust uses a robust data pipeline to evaluate profiles based on a massive Kaggle dataset of ~30,000 Instagram records.

### The 7 Algorithms
The backend scripts automatically train the following models to classify accounts as `Fraud` (1) or `Legitimate` (0):
1. **Random Forest** (Default)
2. **Support Vector Machine (SVM)**
3. **Logistic Regression**
4. **Decision Tree**
5. **K-Nearest Neighbors (KNN)**
6. **Gradient Boosting**
7. **Naive Bayes**

### Feature Engineering
The models do not just look at raw numbers; they analyze relationships:
- `reach_like_ratio`: Checks if likes exceed organic reach (a strong indicator of bot likes).
- `er_quality`: Compares the account's engagement rate against the global category average.
- `save_share_ratio`: Identifies high-value organic content vs shallow engagement pods.

### Retraining the Models
If the dataset is updated, the models can be retrained directly from the UI by visiting the **Metrics Dashboard** and clicking `Retrain All Models`, or via the command line:
```bash
cd backend
python ml/train_model.py
```
This generates individual `.pkl` files and a unified `training_results.json` which the FastAPI backend instantly reads to serve predictions.

---

## 📂 Project Structure

```bash
📦 instatrust
 ┣ 📂 backend
 ┃ ┣ 📂 data           # Source datasets (Kaggle CSVs)
 ┃ ┣ 📂 ml             # ML Models (.pkl), JSON results, and training scripts
 ┃ ┣ 📂 routers        # FastAPI endpoint definitions (analyze, metrics)
 ┃ ┣ 📂 services       # Business logic (FraudModel, LLMExplainer, etc.)
 ┃ ┣ 📜 main.py        # Application entry point
 ┃ ┣ 📜 requirements.txt # Python dependencies
 ┃ ┗ 📜 .env.example   # Template for environment variables
 ┣ 📂 frontend
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 app          # Next.js App Router (Pages: /, /dashboard, /metrics)
 ┃ ┃ ┣ 📂 components   # Reusable UI Blocks (Bento Grid, Charts, Navbar)
 ┃ ┃ ┗ 📜 globals.css  # Global CSS and Design System
 ┃ ┣ 📜 package.json   # Node.js dependencies
 ┃ ┗ 📜 tailwind.config.ts # Tailwind styling configuration
 ┗ 📜 .gitignore       # Global Git ignore rules
```

---

## ⚙️ Complete Setup Guide (From Scratch)

Follow these instructions to get the project running on your local machine.

### 1. Prerequisites
- **Python 3.10+** (Required for FastAPI and Scikit-Learn)
- **Node.js 18+** (Required for Next.js frontend)
- **Git** (To clone the repository)
- **Groq API Key**: Get one for free at the [Groq Console](https://console.groq.com/).

### 2. Clone the Repository
Open your terminal and clone the repository:
```bash
git clone <your-github-repo-url>
cd instatrust
```

### 3. Backend Setup
1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```
2. **Create a Virtual Environment:**
   ```bash
   python -m venv venv
   ```
3. **Activate the Virtual Environment:**
   - **Windows:** `.\venv\Scripts\activate`
   - **Mac/Linux:** `source venv/bin/activate`
4. **Install Python Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
5. **Configure Environment Variables:**
   - Copy the provided `.env.example` file and rename it to `.env`:
     - **Windows (Command Prompt):** `copy .env.example .env`
     - **Mac/Linux:** `cp .env.example .env`
   - Open `.env` and paste your actual Groq API Key:
     ```env
     GROQ_API_KEY=gsk_your_actual_api_key_here
     PORT=8000
     ```
6. **Start the Backend Server:**
   ```bash
   python main.py
   ```
   *The API will now be live at `http://localhost:8000`.*

### 4. Frontend Setup
Leave your backend terminal running and open a **new** terminal window.
1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```
2. **Install Node Packages:**
   ```bash
   npm install
   ```
3. **Start the Frontend Development Server:**
   ```bash
   npm run dev
   ```
   *The UI will now be available at `http://localhost:3000`.*

---

## 🔍 Usage Guide

1. **Analyze an Account**:
   - Go to `http://localhost:3000`.
   - Enter a valid **Post ID** from the dataset (e.g., `IG0000001`, `IG0000009`) into the search bar.
   - Click "Analyze Account" to see the Bento Dashboard and LLM explanation.
2. **View Model Metrics**:
   - Click "Model Metrics" in the top navigation bar (or visit `http://localhost:3000/metrics`).
   - Compare the accuracy, confusion matrix, and training times of all 7 algorithms.
3. **Switch Active Model**:
   - In the metrics dashboard, click the "Select This Model" button under any algorithm (e.g., SVM) to instantly switch the backend prediction engine to use that model for all future searches.
4. **Retrain Models**:
   - Click the blue "Retrain All Models" button in the navigation bar to trigger a live training run on the backend.

---

## 📡 API Endpoints

The backend exposes the following REST APIs:
- `POST /analyze`: Analyzes an Instagram account and returns fraud probability, LLM explanation, and signals. (Accepts optional `model_name` body parameter).
- `GET /model-metrics`: Returns full performance metrics, dataset information, and confusion matrices for all 7 trained algorithms.
- `POST /retrain`: Forces the server to re-read the CSV dataset and retrain all 7 ML models dynamically.
- `POST /set-active-model`: Updates the default prediction model (e.g., switching from Random Forest to Decision Tree).

---

## 🛡️ License
Distributed under the MIT License.
