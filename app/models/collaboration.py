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
    accepted = db.Column(db.Boolean, default=False, nullable=False)

    # define relationships
    requester = db.relationship('User', foreign_keys=[requester_id], back_populates='initiated_collaborations', lazy='joined')
    addressee = db.relationship('User', foreign_keys=[addressee_id], back_populates='received_collaborations', lazy='joined')


    def to_dict(self):
        return {
            'id': self.id,
            'requesterId': self.requester_id,
            'addresseeId': self.addressee_id,
            'accepted': self.accepted,
        }
