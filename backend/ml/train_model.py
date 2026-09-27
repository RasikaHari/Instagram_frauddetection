import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    classification_report, accuracy_score, confusion_matrix,
    roc_auc_score, precision_score, recall_score, f1_score
)
import joblib
import os
import sys
import json
import time

# Add parent directory to path to import services
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from services.feature_engineering import extract_features


def get_all_classifiers():
    """Returns a dictionary of all classifiers to train."""
    return {
        "Random Forest": RandomForestClassifier(
            n_estimators=200, random_state=42, class_weight='balanced'
        ),
        "SVM": SVC(
            kernel='rbf', probability=True, random_state=42, class_weight='balanced'
        ),
        "Logistic Regression": LogisticRegression(
            max_iter=1000, random_state=42, class_weight='balanced'
        ),
        "Decision Tree": DecisionTreeClassifier(
            random_state=42, class_weight='balanced'
        ),
        "KNN": KNeighborsClassifier(
            n_neighbors=5
        ),
        "Gradient Boosting": GradientBoostingClassifier(
            n_estimators=200, random_state=42
        ),
        "Naive Bayes": GaussianNB()
    }


def train_all_models():
    """Trains all classifiers and saves models + metrics."""
    dataset_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "data", "dataset", "instagram analytics_26.csv"
    )

    if not os.path.exists(dataset_path):
        print(f"Dataset not found at {dataset_path}")
        return None

    print(f"Loading dataset: {dataset_path}")
    df = pd.read_csv(dataset_path)

    # Process features
    print("Extracting features from dataset records...")
    feature_list = []
    labels = []

    for _, row in df.iterrows():
        raw_data = {
            "metrics": row.to_dict(),
            "biography": "",
            "benchmarks": {"avg_engagement": 5.0}
        }

        features = extract_features(raw_data)
        feature_list.append(features)

        # Heuristic label for training (Fraud vs Non-Fraud)
        is_suspicious = 0
        if features.get('reach_like_ratio', 0) > 0.7 or features.get('er_quality', 1.0) < 0.2:
            is_suspicious = 1
        labels.append(is_suspicious)

    X = pd.DataFrame(feature_list)
    y = np.array(labels)

    # Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Save feature names
    ml_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)))
    os.makedirs(ml_dir, exist_ok=True)
    feature_names_path = os.path.join(ml_dir, "feature_names.joblib")
    joblib.dump(list(X.columns), feature_names_path)
    print(f"Feature names saved to {feature_names_path}")

    classifiers = get_all_classifiers()
    all_results = {}

    print(f"\n{'='*60}")
    print(f"Training {len(classifiers)} classifiers on {len(X)} records...")
    print(f"Train: {len(X_train)} | Test: {len(X_test)}")
    print(f"Fraud samples: {sum(y)} | Non-Fraud: {len(y) - sum(y)}")
    print(f"{'='*60}\n")

    for name, clf in classifiers.items():
        print(f"\n--- Training: {name} ---")
        start_time = time.time()

        # Train
        clf.fit(X_train, y_train)
        train_time = round(time.time() - start_time, 3)

        # Predict
        y_pred = clf.predict(X_test)

        # Probabilities (for ROC-AUC)
        if hasattr(clf, 'predict_proba'):
            y_prob = clf.predict_proba(X_test)[:, 1]
        else:
            y_prob = y_pred.astype(float)

        # Confusion Matrix
        tn, fp, fn, tp = confusion_matrix(y_test, y_pred).ravel()

        # Metrics
        acc = round(accuracy_score(y_test, y_pred) * 100, 2)
        prec = round(precision_score(y_test, y_pred, zero_division=0) * 100, 2)
        rec = round(recall_score(y_test, y_pred, zero_division=0) * 100, 2)
        f1 = round(f1_score(y_test, y_pred, zero_division=0) * 100, 2)

        try:
            roc_auc = round(roc_auc_score(y_test, y_prob) * 100, 2)
        except ValueError:
            roc_auc = 0.0

        # Classification report (detailed, per-class)
        report = classification_report(y_test, y_pred, output_dict=True, zero_division=0)

        # Save model
        model_filename = name.lower().replace(" ", "_") + ".pkl"
        model_path = os.path.join(ml_dir, model_filename)
        joblib.dump(clf, model_path)

        result = {
            "model_name": name,
            "model_file": model_filename,
            "accuracy": acc,
            "precision": prec,
            "recall": rec,
            "f1_score": f1,
            "roc_auc": roc_auc,
            "training_time_seconds": train_time,
            "confusion_matrix": {
                "true_negative": int(tn),
                "false_positive": int(fp),
                "false_negative": int(fn),
                "true_positive": int(tp)
            },
            "classification_report": {
                "non_fraud": {
                    "precision": round(report["0"]["precision"] * 100, 2),
                    "recall": round(report["0"]["recall"] * 100, 2),
                    "f1_score": round(report["0"]["f1-score"] * 100, 2),
                    "support": int(report["0"]["support"])
                },
                "fraud": {
                    "precision": round(report["1"]["precision"] * 100, 2),
                    "recall": round(report["1"]["recall"] * 100, 2),
                    "f1_score": round(report["1"]["f1-score"] * 100, 2),
                    "support": int(report["1"]["support"])
                }
            },
            "dataset_info": {
                "total_samples": len(X),
                "train_samples": len(X_train),
                "test_samples": len(X_test),
                "fraud_count": int(sum(y)),
                "non_fraud_count": int(len(y) - sum(y))
            }
        }

        all_results[name] = result

        print(f"  Accuracy:  {acc}%")
        print(f"  Precision: {prec}%")
        print(f"  Recall:    {rec}%")
        print(f"  F1-Score:  {f1}%")
        print(f"  ROC-AUC:   {roc_auc}%")
        print(f"  Time:      {train_time}s")
        print(f"  Saved:     {model_path}")

    # Find best model
    best_model_name = max(all_results, key=lambda k: all_results[k]["accuracy"])
    best_accuracy = all_results[best_model_name]["accuracy"]

    # Save results JSON
    output = {
        "trained_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "best_model": best_model_name,
        "best_accuracy": best_accuracy,
        "active_model": best_model_name,
        "models": all_results
    }

    results_path = os.path.join(ml_dir, "training_results.json")
    with open(results_path, "w") as f:
        json.dump(output, f, indent=2)

    print(f"\n{'='*60}")
    print(f"All models trained and saved!")
    print(f"Best Model: {best_model_name} ({best_accuracy}%)")
    print(f"Results: {results_path}")
    print(f"{'='*60}")

    return output


if __name__ == "__main__":
    train_all_models()
