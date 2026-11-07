# Lab Setup — One Time, Twenty Minutes

Everything in the labs runs from one virtual environment. Set it up once; every lab README assumes it works.

## 1. Python

You need **Python 3.10 or newer** (3.11 recommended for speed). Check:

```bash
python3 --version
```

If you don't have it, install via your package manager, `brew`, or [uv](https://github.com/astral-sh/uv) (`uv python install 3.12`) — any route works.

## 2. The environment

From the repo root:

```bash
cd labs
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
```

`requirements.txt` pins the *core* stack: pandas, numpy, scikit-learn, lightgbm, fastapi, uvicorn, httpx, joblib, pyarrow, matplotlib, rank-bm25, sentence-transformers, faiss-cpu, datasets (Hugging Face), tiktoken, and pytest. Track B labs additionally need an LLM API key (below). If an install fails on your platform, check the lab's `DATA.md` — notes live there.

## 3. Verify it (60 seconds)

```bash
python - <<'EOF'
import sklearn, pandas, fastapi, lightgbm, sentence_transformers, faiss
from sklearn.datasets import fetch_openml
X, y = fetch_openml("adult", version=2, as_frame=True, return_X_y=True)
print("pandas", pandas.__version__, "| sklearn", sklearn.__version__)
print("adult rows:", len(X))
EOF
```

You should see the version numbers and `adult rows: 48842`. If the download is slow, that's the UCI mirror warming up — it's a one-time fetch.

## 4. LLM API key (Track B and C labs only)

Labs b1–b8, c1–c5 call an LLM API. Options, cheapest first:

- **Any OpenAI-compatible provider** — labs use the `openai` client shape (`base_url` swappable), so a local [Ollama](https://ollama.com) (`base_url="http://localhost:11434/v1"`, model like `llama3.2` or `qwen2.5`) works for every lab except b1's pricing table (which uses real published prices).
- **A paid API** — any major provider; Lab b1 measures *your* latency and cost with *their* published prices.

**Never hardcode the key.** Create `labs/.env` (it's gitignored):

```
LLM_API_KEY=sk-...
LLM_BASE_URL=https://api.example.com/v1
LLM_MODEL=whatever-model-you-chose
```

And load it in your scripts with:

```python
import os
from dotenv import load_dotenv
load_dotenv()                                  # reads labs/.env
KEY  = os.environ["LLM_API_KEY"]
URL  = os.environ.get("LLM_BASE_URL", "https://api.openai.com/v1")
MODEL = os.environ.get("LLM_MODEL", "gpt-4o-mini")
```

Spending expectation for the whole Track B + C: **under $5** with a small model. Every lab tells you which parts need the API and which are local-only.

## 5. The datasets directory

Labs download data into `labs/data/` (gitignored — we don't commit datasets, we commit *instructions*). Each lab's `DATA.md` says exactly what to download and from where; the catalog with licenses lives in [`datasets/`](../../datasets/).

## 6. Your lab journal

Create `labs/JOURNAL.md` (also gitignored — it's yours):

```markdown
# Lab journal — <your name>

## a1 — first prediction service (date)
- What it does:
- Where it breaks first:
- What I'd do next:
```

Three sentences per lab. By capstone time this file is your interview prep: real numbers, real breakages, real decisions — the things interviewers actually probe.

## Common setup problems

| Symptom | Fix |
|---|---|
| `faiss-cpu` wheel missing for your platform | `pip install faiss-cpu --only-binary :all:` or use the numpy fallback in Lab b2 (explained there) |
| `fetch_openml` blocked by firewall | Download `adult.data` from the UCI page (see `datasets/tabular-classification.md`) and read with pandas |
| sentence-transformers model download slow | Set `HF_HOME=labs/data/hf` so it caches once |
| Ollama connection refused | Is the app running? `ollama serve` + `ollama pull llama3.2` |

When you can run the verification script and see the row count, you're done. Go to [Lab a1](../track-a/lab-a1/).
