# root/app/seeds/comments.py
from app.models import db, Comment, environment, SCHEMA
from sqlalchemy.sql import text

def seed_comments():
    c1 = Comment(
    commenter_id = 1,
    machine_id = 1,
    subject = "nice machine",
    content = "I like it",
    )
    c2 = Comment(
        commenter_id = 2,
        machine_id = 1,
        subject = "Hello",
        content = "I also like this machine",
    )

    com_seeds = [c1, c2]

    for com in com_seeds:
        db.session.add(com)
    db.session.commit()





def undo_comments():
  if environment == "production":
    db.session.execute(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
  else:
    db.session.execute(text("DELETE FROM comments"))

  db.session.commit()
