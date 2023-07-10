# root/app/api/turing_machine_routes.py
from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import Turing_Machine, db
from app.forms import TuringMachineForm
from .auth_routes import validation_errors_to_error_messages
