# Lab a1 — Your First Prediction Service

| | |
|---|---|
| **Prerequisites** | Chapters 0.0, A.0, A.6 · [setup](../../setup/) done |
| **Dataset** | UCI Adult Income — 48,842 rows, 1994 US Census ([card](../../../datasets/tabular-classification.md)) |
| **You will build** | A trained model, serialized, served behind an HTTP API, load-timed, and broken on purpose |
| **Est. time** | 2–3 hours |
| **Hardware** | Laptop CPU. No GPU. No API key. |

**The story.** You have trained models in notebooks — `model.fit()`, look at accuracy, done. Today your model meets HTTP. You will serve it, measure it, and break it, and by the end you will understand why "the model is 5% of the system" is not a joke (Chapter A.0's whole point). This is the lab that turns a notebook into a *service*.

---

## Part 1 — Train the model (25 min)

Create `labs/track-a/lab-a1/train.py`. The goal: predict whether income exceeds $50K/yr from census attributes.

```python
import pandas as pd
from sklearn.datasets import fetch_openml
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score, classification_report
import joblib

X, y = fetch_openml("adult", version=2, as_frame=True, return_X_y=True)
y = (y == ">50K").astype(int)

# Two columns we throw away, on purpose:
#   fnlwgt       — census sampling weight, not a signal about the person
#   education-num — duplicates `education` in numeric clothing
X = X.drop(columns=["fnlwgt", "education-num"])

X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

cat = X.columns[X.dtypes == "category"]
num = X.columns.difference(cat)

model = Pipeline([
    ("prep", ColumnTransformer([
        ("cat", OneHotEncoder(handle_unknown="ignore"), cat),
        ("num", "passthrough", num),
    ])),
    ("clf", LogisticRegression(max_iter=1000)),
])

model.fit(X_tr, y_tr)
proba = model.predict_proba(X_te)[:, 1]
print("AUC:", round(roc_auc_score(y_te, proba), 3))
print(classification_report(y_te, (proba > 0.5).astype(int)))
joblib.dump(model, "model.joblib")
joblib.dump(list(X.columns), "columns.joblib")
```

**Checkpoint 1 (write it in your journal):** What AUC and recall did you get on the >50K class? Why is recall on the minority class so much worse than accuracy suggests? (If you can't answer, re-read the metrics section of Chapter A.0 — this exact imbalance conversation returns in Lab a3 with fraud.)

> **Serving-skew preview:** notice we save the *pipeline* (prep + classifier), not just the classifier. Whatever transformation happens at training time must happen at prediction time — *by the same code*. This is the training/serving-skew problem of Chapter A.1 in miniature.

---

## Part 2 — Serve it (25 min)

Create `serve.py` in the same directory:

```python
import time
import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI()
model = joblib.load("model.joblib")
COLUMNS = joblib.load("columns.joblib")

class Applicant(BaseModel):
    age: int = Field(ge=16, le=100)
    workclass: str = "Private"
    education: str = "HS-grad"
    marital_status: str = "Never-married"      # note the underscore
    occupation: str = "Sales"
    relationship: str = "Not-in-family"
    race: str = "White"
    sex: str = "Male"
    capital_gain: int = Field(default=0, ge=0)
    capital_loss: int = Field(default=0, ge=0)
    hours_per_week: int = Field(default=40, ge=0, le=168)
    native_country: str = "United-States"

@app.post("/predict")
def predict(a: Applicant):
    row = pd.DataFrame([a.model_dump()])
    # the training data uses hyphens; our API uses underscores (nicer JSON)
    row = row.rename(columns={
        "marital_status": "marital-status",
        "capital_gain": "capital-gain",
        "capital_loss": "capital-loss",
        "hours_per_week": "hours-per-week",
        "native_country": "native-country",
    })[COLUMNS]
    t0 = time.perf_counter()
    p = float(model.predict_proba(row)[0, 1])
    return {"p_income_over_50k": round(p, 4),
            "inference_ms": round((time.perf_counter() - t0) * 1000, 2)}
```

Run it, then call it:

```bash
uvicorn serve:app --port 8000 &

curl -s -X POST localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"age": 40, "education": "Masters", "hours_per_week": 50, "occupation": "Prof-specialty"}'
```

**Checkpoint 2:** Call the API with three applicants you invent: one near-certain >50K, one near-certain <=50K, one borderline. Did the scores move the way you expected? If not, which feature surprised you?

---

## Part 3 — Measure it: p50, p99, and the truth about latency (30 min)

Create `bench.py`:

```python
import time, statistics, httpx

REQ = {"age": 35, "education": "Bachelors", "hours_per_week": 40}

def percentiles(xs):
    xs = sorted(xs)
    k = lambda q: xs[min(int(q * len(xs)), len(xs) - 1)]
    return k(0.50), k(0.95), k(0.99)

with httpx.Client(base_url="http://localhost:8000") as c:
    c.post("/predict", json=REQ)                     # warm-up (JIT, caches)
    seq = []
    for _ in range(200):
        t0 = time.perf_counter()
        c.post("/predict", json=REQ)
        seq.append((time.perf_counter() - t0) * 1000)

print(f"sequential  p50={percentiles(seq)[0]:.1f}ms "
      f"p95={percentiles(seq)[1]:.1f}ms p99={percentiles(seq)[2]:.1f}ms")

# now 20 concurrent clients, 10 requests each
import concurrent.futures as cf
def one(i):
    with httpx.Client(base_url="http://localhost:8000") as c:
        t0 = time.perf_counter()
        c.post("/predict", json=REQ)
        return (time.perf_counter() - t0) * 1000

with cf.ThreadPoolExecutor(20) as ex:
    conc = list(ex.map(one, range(200)))

print(f"concurrent  p50={percentiles(conc)[0]:.1f}ms "
      f"p95={percentiles(conc)[1]:.1f}ms p99={percentiles(conc)[2]:.1f}ms")
```

**Checkpoint 3 (the lab's core observation):** Compare sequential vs concurrent p50 and p99. Expect: under concurrency, p50 barely moves but p99 balloons (or both inflate — depends on your machine's cores). Explain the difference between *your laptop with one worker* and a production fleet. What would you change first if the p99 budget were 100ms: more workers, a smaller model, or a faster feature path?

---

## Part 4 — Break it on purpose (30 min)

Production is what happens when users attack your API with kindness and curiosity. Do three things:

1. **Send garbage.** `curl -X POST localhost:8000/predict -H "Content-Type: application/json" -d '{"age": "forty"}'` — you'll get a `422` (Pydantic rejected it), *not* a 500. Before you wrote the `Applicant` model, a raw `dict` endpoint would have 500'd deep inside sklearn. Which error would you rather return to a customer? (Re-read Chapter X.5's "fail loudly vs. fail gracefully" if unsure.)
2. **Send an unknown category.** `"education": "Wizard"` — the model still answers, because of `handle_unknown="ignore"`. Is silent defaulting to "treat as unseen" the *right* behavior for a census-income model? For a fraud model? Write one sentence each.
3. **Kill and restart the server.** Notice the model reloads from disk — state lives in the artifact, not the process. Now imagine `model.joblib` changes while the server runs: what should the server do? (Chapter A.6's answer: versioned artifacts, health checks, and a story for atomic swap. You'll implement a `/health` endpoint in the extension.)

**Checkpoint 4:** In your journal, answer: where does the latency actually go in this service? (Hint: measure — time the `predict_proba` call alone in a REPL and compare with the end-to-end request time. The gap is FastAPI/HTTP/JSON overhead. That gap is the "tax" of serving over a network, and it's why Chapter A.6 exists.)

---

## Explain it back (do not skip)

Out loud, no notes:

1. Why did we save a *pipeline* instead of a bare classifier?
2. What is the difference between a 422 and a 500, and why does it matter to a caller?
3. Your p99 doubled under load. Name three candidate causes and how you'd confirm each.
4. What did `fnlwgt` teach us about "more features ≠ better"?

## Extensions (optional, time-boxed)

- Add `GET /health` returning `{"model_sha1": ..., "n_features": 12}` — hash the artifact file. You just built the seed of an A.6-style deployment story.
- Retrain with `HistGradientBoostingClassifier` (swap one line). Compare AUC *and* p99. Which model would you ship at a 50ms budget?
- Put a 10-request-per-second cap on yourself with `asyncio.sleep` in middleware. Now re-run the benchmark and watch queues form — a rate limiter, experienced rather than read.

## What you can now claim in an interview

"I trained, serialized, and served a model behind a validated HTTP API, measured p50/p99 under sequential and concurrent load, and can explain where the latency goes and what breaks first." That sentence is worth more than a certificate.
