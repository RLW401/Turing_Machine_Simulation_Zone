# root/app/api/turing_machine_routes.py
from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from sqlalchemy import or_
from app.models import Turing_Machine, Machine_Instruction, User, db
from app.forms import TuringMachineForm, MachineInstructionForm
from .auth_routes import validation_errors_to_error_messages

turing_machine_routes = Blueprint('turing-machines', __name__)

@turing_machine_routes.route('/<int:machine_id>/machine-instructions/<int:instruction_id>', methods=['PUT', 'Delete'])
@login_required
def edit_or_delete_instruction(machine_id, instruction_id):
    machine_instruction = Machine_Instruction.query.filter(Machine_Instruction.id == instruction_id).first()
    machine = Turing_Machine.query.filter(Turing_Machine.id == machine_id).first()

    if request.method == 'PUT':
        form = MachineInstructionForm()
        form['csrf_token'].data = request.cookies['csrf_token']
        ## also verify that the associated machine is owned by the current user

## returns all Turing machines with a public property of True
# @turing_machine_routes.route('/public')
# @login_required

# To Do: ensure all Turing machines are returned with machine instructions

# returns all Turing machines that are either public, owned by the current user,
# or that the current user is a collaborator on.
@turing_machine_routes.route('/authorized')
def get_authorized_turing_machines():
    turing_machines = []

    if current_user.is_authenticated:
        # User is logged in, return public, owned, and collaborator machines
        turing_machines = Turing_Machine.query.filter(
            or_(Turing_Machine.public == True,
                Turing_Machine.owner_id == current_user.id,
                Turing_Machine.collaborator_id == current_user.id)
        ).all()
    else:
        # User is not logged in, return only public machines
        turing_machines = Turing_Machine.query.filter(Turing_Machine.public == True).all()

    return jsonify({'turingMachines': [machine.to_dict() for machine in turing_machines]})

# returns a Turing machine specified by its id
@turing_machine_routes.route('/<int:machine_id>')
@login_required
def get_turing_machine(machine_id):
    turing_machine = Turing_Machine.query.get(machine_id)

    if not turing_machine:
        return jsonify({'error': 'Turing machine not found'}), 404

    # Check if current user is authorized to view machine
    if ((turing_machine.owner_id != current_user.id) and (turing_machine.collaborator_id != current_user.id)):
        return jsonify({'error': 'Unauthorized'}), 403

    return jsonify(turing_machine.to_dict())
