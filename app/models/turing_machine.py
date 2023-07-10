# root/app/models/turing_machine.py
from .db import db, environment, SCHEMA, add_prefix_for_prod
from flask_login import UserMixin

class Turing_Machine(db.Model, UserMixin):
    __tablename__ = "turing_machines"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id"), ondelete="CASCADE"), nullable=True)
    collaborator_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    name = db.Column(db.String(255), nullable=False)
    notes = db.Column(db.Text)
    public = db.Column(db.Boolean, default=False)
    init_tape = db.Column(db.Text)
    current_tape = db.Column(db.Text)
    alphabet = db.Column(db.String(255), nullable=False)
    blank_symbol = db.Column(db.String(1), default='#', nullable=False)
    states = db.Column(db.Text)
    init_state = db.Column(db.String(31))
    current_state = db.Column(db.String(31))
    halting_state = db.Column(db.String(31))
    head_pos = db.Column(db.Integer)

    # define relationships
    comments_received = db.relationship('Comment', back_populates='machine')

    owner = db.relationship('User', foreign_keys=[owner_id], back_populates='machines_owned')
    collaborator = db.relationship('User', foreign_keys=[collaborator_id], back_populates='machines_collaborating_on')

    instructions = db.relationship('Machine_Instruction', back_populates='machine', lazy='joined')

    def to_dict(self):
        return {
            'id': self.id,
            'ownerId': self.owner_id,
            'collaboratorId': self.collaborator_id,
            'name': self.name,
            'notes': self.notes,
            'public': self.public,
            'initTape': self.init_tape,
            'currentTape': self.current_tape,
            'alphabet': self.alphabet,
            'blankSymbol': self.blank_symbol,
            'states': self.states,
            'initState': self.init_state,
            'currentState': self.current_state,
            'haltingState': self.halting_state,
            'headPos': self.head_pos,
            'instructions': [instruction.to_dict() for instruction in self.instructions],
        }
