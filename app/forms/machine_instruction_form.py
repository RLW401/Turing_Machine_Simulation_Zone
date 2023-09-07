# root/app/forms/machine_instruction_form.py
from flask_login import current_user
from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, FieldList, FormField
from wtforms.validators import DataRequired, ValidationError, Length

def validate_head_move(form, field):
    head_move = field.data
    if (not isinstance(head_move, int) or (abs(head_move) > 1)):
        raise ValidationError('Head move must be an integer between -1 and 1.')

def validate_symbol(form, field):
        symbol = field.data
        if len(symbol) != 1:
            raise ValidationError('Symbol must be exactly one character.')


class MachineInstructionForm(FlaskForm):
    machineId = IntegerField('machineId', validators=[DataRequired()])
    currentState = StringField('currentState', validators=[DataRequired(), Length(min = 2)])
    scannedSymbol = StringField('scannedSymbol', validators=[validate_symbol])
    nextState = StringField('nextState', validators=[DataRequired(), Length(min = 2)])
    printSymbol = StringField('printSymbol', validators=[validate_symbol])
    headMove = IntegerField('headMove', validators=[validate_head_move])

class BatchInstructionForm(FlaskForm):
     Machine_Instructions = FieldList(FormField(MachineInstructionForm), min_entries=1)
