# root/app/models/comment.py
from .db import db, environment, SCHEMA, add_prefix_for_prod
from flask_login import UserMixin

class Comment(db.Model, UserMixin):
    __tablename__ = "comments"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    commenter_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id"), ondelete="CASCADE"), nullable=False)
    machine_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("turing_machines.id"), ondelete="CASCADE"), nullable=False)
    subject = db.Column(db.String(127), nullable=False)
    content = db.Column(db.Text, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'commenterId': self.commenter_id,
            'machineId': self.machine_id,
            'subject': self.subject,
            'content': self.content,
        }
