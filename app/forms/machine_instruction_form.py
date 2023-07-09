# root/app/forms/machine_instruction_form.py
from flask_login import current_user
from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, ValidationError
from app.models import Machine_Instruction

class MachineInstructionForm(FlaskForm):
    pass
