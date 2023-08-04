# root/app/forms/turing_machine_form.py
from flask_login import current_user
from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField, TextAreaField, IntegerField
from wtforms.validators import DataRequired, ValidationError, AnyOf

class TuringMachineForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    notes = TextAreaField('notes')
    public = BooleanField('public')
    initTape = StringField('initTape', validators=[DataRequired()])
    currentTape = StringField('currentTape')
    alphabet = StringField('alphabet', validators=[DataRequired()])
    blankSymbol = StringField('blankSymbol', validators=[AnyOf(values=['#', ' ', '0'], message="Invalid blank symbol. Allowed symbols are '#', ' ', '0'.")])
    states = StringField('states', validators=[DataRequired()])
    initState = StringField('initState', validators=[DataRequired()])
    currentState = StringField('currentState')
    haltingState = StringField('haltingState', validators=[DataRequired()])
    headPos = IntegerField('headPos')
