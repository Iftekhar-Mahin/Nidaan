"""
app/matcher.py — RapidFuzz weighted drug name matching + pg_trgm fallback
"""
from rapidfuzz import fuzz, process
from app.db import search_brands_trgm

# In-memory brand cache populated at startup from PostgreSQL
_brand_cache: list[dict] = []


def load_brand_cache(brands: list[dict]) -> None:
    """Call at app startup after DB loads."""
    global _brand_cache
    _brand_cache = brands


def match_drug(query: str, top_k: int = 5) -> dict:
    """
    Two-stage matching:
      Stage 1: RapidFuzz WRatio against in-memory brand cache (fast, ~0ms)
      Stage 2: pg_trgm similarity query against PostgreSQL (fallback for short/partial names)

    Returns:
        {
          bestMatch: {...} | None,
          confidence: float,
          topSuggestions: [{brandName, genericName, manufacturer, unitPrice, score}, ...]
        }
    """
    if not query or len(query.strip()) < 2:
        return {"bestMatch": None, "confidence": 0.0, "topSuggestions": []}

    q = query.strip()

    # ── Stage 1: RapidFuzz in-memory (primary) ──────────────────────────
    rapidfuzz_results = []
    if _brand_cache:
        choices = {b["brandName"]: b for b in _brand_cache}
        matches = process.extract(
            q,
            choices.keys(),
            scorer=fuzz.WRatio,
            limit=top_k,
            score_cutoff=40,
        )
        rapidfuzz_results = [
            {**choices[name], "score": round(score / 100, 3), "source": "rapidfuzz"}
            for name, score, _ in matches
        ]

    # ── Stage 2: pg_trgm fallback for very short queries or low RF scores ──
    top_rf_score = rapidfuzz_results[0]["score"] if rapidfuzz_results else 0.0
    trgm_results = []
    if top_rf_score < 0.65 or len(q) <= 4:
        trgm_rows = search_brands_trgm(q, limit=top_k)
        trgm_results = [
            {**r, "score": r.pop("similarity"), "source": "pg_trgm"}
            for r in trgm_rows
        ]

    # ── Merge & deduplicate by brandName ─────────────────────────────────
    seen = set()
    merged = []
    for r in rapidfuzz_results + trgm_results:
        key = r["brandName"]
        if key not in seen:
            seen.add(key)
            merged.append(r)

    # Sort by score descending
    merged.sort(key=lambda x: x["score"], reverse=True)
    merged = merged[:top_k]

    best = merged[0] if merged and merged[0]["score"] >= 0.45 else None
    confidence = merged[0]["score"] if merged else 0.0

    return {
        "bestMatch": best,
        "confidence": round(confidence, 3),
        "topSuggestions": merged,
    }
