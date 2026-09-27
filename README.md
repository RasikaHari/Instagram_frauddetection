##  Key Features

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

##  Tech Stack

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

##  Machine Learning Architecture

InstaTrust uses a robust data pipeline to evaluate profiles based on a massive Kaggle dataset of ~30,000 Instagram records.

### The 5 Algorithms
The backend scripts automatically train the following models to classify accounts as `Fraud` (1) or `Legitimate` (0):
1. **Random Forest** (Default)
2. **Support Vector Machine (SVM)**
3. **Logistic Regression**
4. **K-Nearest Neighbors (KNN)**
5. **Naive Bayes**

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
