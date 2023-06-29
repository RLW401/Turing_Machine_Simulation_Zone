# root/app/models/collaboration.py
from .db import db, environment, SCHEMA, add_prefix_for_prod
from flask_login import UserMixin

class Collaboration(db.Model, UserMixin):
    __tablename__ = "collaborations"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    requester_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id"), ondelete="CASCADE"), nullable=False)
    addressee_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id"), ondelete="CASCADE"), nullable=False)
    status = db.Column(db.String(31), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'requesterId': self.requester_id,
            'addresseeId': self.addressee_id,
            'status': self.status,
        }
