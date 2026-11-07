# Lab a6 — Dataset: NYC TLC Yellow Taxi (one month)

Full card in [`datasets/time-series-geo.md`](../../../datasets/time-series-geo.md). Lab-specific notes:

**Getting it:** direct parquet URLs, no account:

```bash
cd labs/data
wget https://d37ci6vzurychx.cloudfront.net/trip-data/yellow_tripdata_2023-01.parquet
```

Any month 2022+ works (older files are CSV with different columns; 2022+ are parquet — nicer). ~25–50 MB per month.

**Columns you'll use:** `tpep_pickup_datetime` (pickup time), `PULocationID` (pickup taxi zone, 1–263). Everything else (fare, distance, passengers) is extension territory — the core lab is a two-column dataset, which is itself a lesson: pipelines don't need wide data to be hard.

**Shape:** ~3.07M trips in 2023-01 → ~260 active zones × 744 hours ≈ 190K (zone, hour) rows after aggregation.

**Known quirks you will hit:**

- **New Year's Eve is a data holiday.** Jan 1 demand collapses and Jan 31 late-night spikes; holidays break naive seasonality — handle by feature or by exclusion, never by surprise.
- **DST doesn't apply in January** but does if you pick a March/April month — a missing/zero hour will appear in your series. If you use a DST month, that hour is a *pipeline* event, not a model event.
- **Borough-boundary zone IDs are stable but sparse:** some zones barely have rides (airport-adjacent parking, industrial areas). Your model will be great on Manhattan and weak on quiet zones — a fairness/coverage conversation identical to Lab a2's.
- **Outlier timestamps:** a few trips have pickup datetimes in 2008 or 2032 (vendor glitches). Filter to the month's own date range *before* anything else — a one-line filter that saves an hour of confusion.
- **2024+ vendor-data coverage:** yellow-taxi volume declined while FHV (Uber/Lyft) grew — if your question is "total for-hire demand," FHV files matter; for learning the pipeline, yellow alone is cleaner and still real.

**License:** NYC Open Data terms — usable commercially (mind passenger privacy if you ever widen the column set).
