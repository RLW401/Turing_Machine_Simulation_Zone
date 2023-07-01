# root/app/models/machine_instruction.py
from .db import db, environment, SCHEMA, add_prefix_for_prod
from flask_login import UserMixin

class Machine_Instruction(db.Model, UserMixin):
    __tablename__ = "machine_instructions"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    machine_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("turing_machines.id"), ondelete="CASCADE"), nullable=False)
    current_state = db.Column(db.String(31), nullable=False)
    scanned_symbol = db.Column(db.String(1), nullable=False)
    next_state = db.Column(db.String(31), nullable=False)
    print_symbol = db.Column(db.String(1), nullable=False)
    head_move = db.Column(db.Integer, nullable=False)

    # define relationships
    machine = db.relationship('Turing_Machine', backref='instructions')

    def to_dict(self):
        return {
            'id': self.id,
            'machineId': self.machine_id,
            'currentState': self.current_state,
            'scannedSymbol': self.scanned_symbol,
            'nextState': self.next_state,
            'printSymbol': self.print_symbol,
            'headMove': self.head_move,
        }
