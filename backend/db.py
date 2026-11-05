"""
app/db.py — SQLAlchemy connection to PostgreSQL with pg_trgm similarity queries
"""
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/nidaan")

engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_size=5, max_overflow=10)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def search_brands_trgm(query: str, limit: int = 5) -> list[dict]:
    """
    Uses PostgreSQL pg_trgm similarity() for fast fuzzy brand name search.
    Returns list of {brandName, genericName, manufacturer, unitPrice, similarity}
    """
    sql = text("""
        SELECT
            bm.id,
            bm."brandName",
            bm.strength,
            bm.form,
            bm.manufacturer,
            bm."unitPrice",
            bm."packSize",
            gd."genericName",
            gd.category,
            similarity(bm."brandName", :query) AS sim
        FROM "BrandMedicine" bm
        JOIN "GenericDrug" gd ON bm."genericId" = gd.id
        WHERE similarity(bm."brandName", :query) > 0.15
        ORDER BY sim DESC
        LIMIT :limit
    """)
    with engine.connect() as conn:
        rows = conn.execute(sql, {"query": query, "limit": limit}).fetchall()
    return [
        {
            "id": r.id,
            "brandName": r.brandName,
            "strength": r.strength,
            "form": r.form,
            "manufacturer": r.manufacturer,
            "unitPrice": r.unitPrice,
            "packSize": r.packSize,
            "genericName": r.genericName,
            "category": r.category,
            "similarity": round(float(r.sim), 3),
        }
        for r in rows
    ]
