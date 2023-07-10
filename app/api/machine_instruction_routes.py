# root/app/api/machine_instruction_routes.py
from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import Machine_Instruction, db
from app.forms import MachineInstructionForm
from .auth_routes import validation_errors_to_error_messages

machine_instruction_routes = Blueprint('machine-instructions', __name__)

@machine_instruction_routes.route('/<int:machine_instruction_id>', methods=['PUT', 'DELETE'])
@login_required
def edit_or_delete_instruction(machine_instruction_id):
    if request.method == 'PUT':
        form = MachineInstructionForm()
        form['csrf_token'].data = request.cookies['csrf_token']
        machine_instruction = Machine_Instruction.query.filter(Machine_Instruction.id == machine_instruction_id).first()
        ## also verify that the associated machine is owned by the current user
