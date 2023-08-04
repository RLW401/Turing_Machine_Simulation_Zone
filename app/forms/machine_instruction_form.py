# root/app/forms/machine_instruction_form.py
from flask_login import current_user
from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, ValidationError

def validate_head_move(form, field):
    head_move = int(field.data)
    if head_move < -1 or head_move > 1:
        raise ValidationError('Head move must be an integer between -1 and 1.')

def validate_symbol(form, field):
        symbol = field.data
        if len(symbol) != 1:
            raise ValidationError('Symbol must be exactly one character.')


class MachineInstructionForm(FlaskForm):
    machineId = IntegerField('machineId', validators=[DataRequired()])
    currentState = StringField('currentState', validators=[DataRequired()])
    scannedSymbol = StringField('scannedSymbol', validators=[DataRequired(), validate_symbol])
    nextState = StringField('nextState', validators=[DataRequired()])
    printSymbol = StringField('printSymbol', validators=[DataRequired(), validate_symbol])
    headMove = IntegerField('headMove', validators=[DataRequired(), validate_head_move])
