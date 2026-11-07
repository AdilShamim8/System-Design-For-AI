> Every dataset in this catalog is real, public, and used (or usable) somewhere in this course's labs. Sizes and access notes are as of late 2026 — always check the source page before relying on a number. **Check each dataset's license before commercial use**; many research datasets are non-commercial.

# Time Series & Geospatial Datasets

For Chapter A.1 (features over time), Lab a6 (demand forecasting pipeline), and Lab x1 (monitoring). The common thread: **time is a split axis, not a feature** — you always train on the past and test on the future.

### NYC TLC Trip Record Data (ongoing)

**What:** Every yellow/green taxi and FHV (Uber/Lyft) trip in NYC, monthly parquet files: pickup/dropoff time and zone, distance, fare breakdown, passengers. Hundreds of millions of trips total; ~35–40M yellow rows per recent year.

**Size:** Per-month parquet files (~10–100MB each); billions of rows across the full history

**Get it:** https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page

**License:** NYC Open Data terms — usable commercially (with care for privacy).

**Quirks & gotchas:** The gold-standard public 'real ML pipeline' dataset: temporal structure, spatial joins (zones), seasonality (rush hours, holidays, weather). Schema changed over the years (location IDs replaced lat/lon in 2016) — a real 'dataset drift' lesson. Use one year of yellow data for Lab a6.

**Used in:** Lab a6 (forecasting pipeline), Lab x1 (monitoring).

---
### Citi Bike Trip Histories (NYC, ongoing)

**What:** Every Citi Bike trip: start/end station, timestamps, user type, rideable type. Also available for London (Santander Cycles via TfL).

**Size:** ~3–5M rides per year per city

**Get it:** https://citibikenyc.com/system-data (TfL: https://cycling.data.tfl.gov.uk/)

**License:** Open data licenses (NYC & TfL).

**Quirks & gotchas:** Demand is *two-sided* (pickups and returns) and station capacity makes it a rebalancing problem — richer than plain forecasting. Station IDs change over time (name/address drift).

**Used in:** Lab a6 alternative.

---
### M5 Forecasting — Walmart (2020)

**What:** Hierarchical daily sales for 3,049 products across 10 stores in 3 US states: 30,490 store-product series over 1,913 days (2011–2016), plus calendar (holidays, SNAP dates) and price tables.

**Size:** 30,490 series, ~58M data points (~400 MB)

**Get it:** https://www.kaggle.com/c/m5-forecasting-accuracy/

**License:** Kaggle competition terms.

**Quirks & gotchas:** The definitive 'intermittent demand' dataset: most series have zeros, event days (SNAP) drive spikes, prices change mid-series. WRMSSE, the competition metric, teaches weighted multi-scale evaluation.

**Used in:** Lab a6 extension; reading for X.2.

---
### US DOT Flight Delays (ongoing)

**What:** On-time performance for every US domestic flight by reporting carrier: scheduled vs actual times, delays, cancellations, causes (late aircraft, weather, NAS). ~7M+ flights per year.

**Size:** ~7M rows/year (~1 GB/year CSV)

**Get it:** https://www.transtats.bts.gov/ONTIME/

**License:** US Government works (public domain-style terms).

**Quirks & gotchas:** Delay *causes* are self-reported by airlines — a beautiful example of 'labels are politics.' Cancellation ≠ missing data (it's an outcome); airport weather joins are needed for honest features.

**Used in:** Lab a6/x1 alternative.

---
### Inside Airbnb (ongoing)

**What:** Scraped Airbnb listings, calendar availability, and reviews for 100+ cities, maintained by Murray Cox.

**Size:** Per-city: 5K–50K listings + millions of reviews

**Get it:** http://insideairbnb.com/

**License:** Public (CC BY 4.0 for most data; check per-city).

**Quirks & gotchas:** Price is a *censored* target (only accepted-booking prices observed); scraping date matters (fresher ≠ more accurate); great for discussing what a web-scraped corpus can and cannot claim.

**Used in:** Capstone cap2 alternative corpus.

---
