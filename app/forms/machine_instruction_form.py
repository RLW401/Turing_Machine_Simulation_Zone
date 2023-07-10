# root/app/forms/machine_instruction_form.py
from flask_login import current_user
from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, ValidationError
# from app.models import Machine_Instruction

def validate_head_move(form, field):
    head_move = int(field.data)
    if head_move < -1 or head_move > 1:
        raise ValidationError('Head move must be an integer between -1 and 1.')

class MachineInstructionForm(FlaskForm):
    machineId = IntegerField('machineId', validators=[DataRequired()])
    currentState = StringField('currentState', validators=[DataRequired()])
    scannedSymbol = StringField('scannedSymbol', validators=[DataRequired()])
    nextState = StringField('nextState', validators=[DataRequired()])
    printSymbol = StringField('printSymbol', validators=[DataRequired()])
    headMove = IntegerField('headMove', validators=[DataRequired(), validate_head_move])
