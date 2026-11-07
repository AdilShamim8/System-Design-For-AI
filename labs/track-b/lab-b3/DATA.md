# Lab b3 — Dataset: SEC 10-K filings (EDGAR)

Full context in [`datasets/qa-knowledge.md`](../../../datasets/qa-knowledge.md). Lab-specific notes:

**Getting it:** the SEC's `data.sec.gov` JSON API (in the lab code) is the robust route — no key, no scraping, stable schema. Filings URLs resolve to `www.sec.gov/Archives/...`. **The SEC requires a User-Agent header with a contact identifier** (their robots/rate policy: ~10 req/s max, be kinder). Apple (CIK 0000320193) and Microsoft (CIK 0000789019) both work; pick any company whose business you know well enough to write 12 questions.

**Shape:** a 10-K is 100–200 pages: ~400–700K characters of HTML → 300–500K characters of text. Structurally: Item 1 (business), 1A (risk factors, often 30+ pages of legal prose), 7 (MD&A), 8 (financial statements — mostly tables). ~100K–150K tokens.

**Known quirks you will hit:**

- **XBRL wrappers:** the HTML includes hidden XBRL tags; `get_text()` handles them but may leave numeric fragments out of place — skim your extracted text before chunking and note where tables went.
- **Tables don't survive text extraction.** "Total net sales $383,285" becomes cells scattered across lines. This is *realistic* — every enterprise RAG team fights it — and why the tables extension exists.
- **Boilerplate repeats**: risk-factor legalese repeats across years and companies; embedding models love it (high similarity to everything). Your distractor-twin misses will cluster here.
- **The document is *annual*:** questions about "this year" need the right filing — a freshness problem (which is why production systems track filing dates as metadata and filter, not hope).

**License:** SEC filings are public records (US federal government; free use). Attribution norms: cite accession number when you quote.

**SQuAD alternative if EDGAR is blocked:** run the same harness on Lab b2's SQuAD paragraphs *concatenated into pseudo-documents* (join 20 paragraphs with headers). Less realistic structure, same measurements — the harness, not the corpus, is the deliverable.
