# root/app/seeds/collaborations.py
from app.models import db, Collaboration, environment, SCHEMA
from sqlalchemy.sql import text

def seed_collaborations():
    c_1_and_2 = Collaboration(
        requester_id = 1,
        addressee_id = 2,
        accepted = True,
    )
    c_3_and_1 = Collaboration(
        requester_id = 3,
        addressee_id = 1,
        accepted = False,
    )
    collab_seeds = [c_1_and_2, c_3_and_1]

    for collab in collab_seeds:
        db.session.add(collab)
    db.session.commit()

def undo_collaborations():
  if environment == "production":
    db.session.execute(f"TRUNCATE table {SCHEMA}.collaborations RESTART IDENTITY CASCADE;")
  else:
    db.session.execute(text("DELETE FROM collaborations"))

  db.session.commit()
