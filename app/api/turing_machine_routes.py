# root/app/api/turing_machine_routes.py
from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from sqlalchemy import or_, tuple_
from app.models import Turing_Machine, Machine_Instruction, User, db
from app.forms import TuringMachineForm, MachineInstructionForm
from app.forms.machine_instruction_form import BatchInstructionForm
from .auth_routes import validation_errors_to_error_messages

turing_machine_routes = Blueprint('turing-machines', __name__)

# Edit or delete machine instructions
@turing_machine_routes.route('/<int:machine_id>/machine-instructions/<int:instruction_id>', methods=['PUT', 'DELETE'])
@login_required
def edit_or_delete_instruction(machine_id, instruction_id):
    machine_instruction = Machine_Instruction.query.filter(Machine_Instruction.id == instruction_id).first()
    machine = Turing_Machine.query.filter(Turing_Machine.id == machine_id).first()

    # if the specified machine or instruction are not found
    # or there is a mismatch between the two
    if (not (machine_instruction and machine) or (machine_instruction.machine_id != machine.id)):
        return jsonify({'error': 'Machine instruction not found'}), 404

    # Verify that the associated machine is owned by the current user
    if machine.owner_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    if request.method == 'PUT':
        form = MachineInstructionForm()
        form['csrf_token'].data = request.cookies['csrf_token']

        # check to make sure execution conditions are not duplicated
        if ((machine_instruction.current_state != form.data['currentState'])
            or (machine_instruction.scanned_symbol != form.data['scannedSymbol'])):
            duplicate_execution_conditions = Machine_Instruction.query.filter(
                Machine_Instruction.machine_id == machine_id,
                Machine_Instruction.current_state == form.data['currentState'],
                Machine_Instruction.scanned_symbol == form.data['scannedSymbol']
                ).first()
            if (duplicate_execution_conditions):
                return jsonify({'error': f"You already have an instruction for {machine.name} with the specified execution conditions. Please edit that instruction instead."}), 409


        if form.validate_on_submit():
            machine_instruction.current_state = form.data['currentState']
            machine_instruction.scanned_symbol = form.data['scannedSymbol']
            machine_instruction.next_state = form.data['nextState']
            machine_instruction.print_symbol = form.data['printSymbol']
            machine_instruction.head_move = form.data['headMove']

            db.session.commit()

            return jsonify(machine_instruction.to_dict())

        return jsonify(errors=validation_errors_to_error_messages(form.errors)), 401

    elif request.method == 'DELETE':
        db.session.delete(machine_instruction)
        db.session.commit()

        return jsonify({'message': f'Machine instruction with ID {instruction_id} deleted successfully from {machine.name}.'})

# Batch Add instructions to a machine
@turing_machine_routes.route('/<int:machine_id>/machine-instructions/batch-create/', methods=['POST'])
@login_required
def batch_create_machine_instruction(machine_id):
    machine = Turing_Machine.query.get(machine_id)

    if not machine:
        return jsonify({'error': 'Turing machine not found'}), 404

    if machine.owner_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    form = BatchInstructionForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    # Check to make sure execution conditions are not duplicated in batch data
    new_execution_conditions = set()

    for instruction in form.data["Machine_Instructions"]:
        exe_con = (instruction["currentState"], instruction["scannedSymbol"])
        if exe_con in new_execution_conditions:
            return jsonify({'error': f"Multiple lines of instructions in batch upload for {machine.name} have the same execution conditions: currentState: {exe_con[0]}, scannedSymbol: {exe_con[1]}. Please ensure that instruction execution conditions are not duplicated."}), 409
        new_execution_conditions.add(exe_con)

    # get all existing instructions for machine
    existing_instructions = [
        instruction.to_dict() for instruction in Machine_Instruction.query.filter(
            Machine_Instruction.machine_id == machine_id
        ).all()
    ]

    # make sure no incoming instruction execution conditions duplicate execution conditions of existing instructions
    for instruction in existing_instructions:
        exe_con = (instruction["currentState"], instruction["scannedSymbol"])
        if exe_con in new_execution_conditions:
            return jsonify({'error': f"{machine.name} already has a line of instructions with the following execution conditions: currentState: {exe_con[0]}, scannedSymbol: {exe_con[1]}. Please ensure that instruction execution conditions are not duplicated."}), 409

    added_instructions = []
    if form.validate_on_submit():
        try:
            for instruction in form.data["Machine_Instructions"]:
                machine_instruction = Machine_Instruction(
                    machine_id=machine_id,
                    current_state=instruction["currentState"],
                    scanned_symbol=instruction["scannedSymbol"],
                    next_state=instruction["nextState"],
                    print_symbol=instruction["printSymbol"],
                    head_move=instruction["headMove"]
                )
                db.session.add(machine_instruction)
                added_instructions.append(machine_instruction)
            db.session.commit()

        except Exception as e:
            # If there is an error with any of the insertions,
            # rollback the db to prevent partial batch addition.
            db.session.rollback()
            return jsonify({"error": f"Failed to add instructions due to the following error: {e}."}), 500

        return jsonify({ "machineInstructions": [instruction.to_dict() for instruction in added_instructions] }), 201
    else:
        return jsonify(errors=validation_errors_to_error_messages(form.errors)), 400

# Add instructions to a machine
@turing_machine_routes.route('/<int:machine_id>/machine-instructions/', methods=['POST'])
@login_required
def create_machine_instruction(machine_id):
    machine = Turing_Machine.query.get(machine_id)

    if not machine:
        return jsonify({'error': 'Turing machine not found'}), 404

    if machine.owner_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    form = MachineInstructionForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    # Check to make sure execution conditions are not duplicated
    duplicate_execution_conditions = Machine_Instruction.query.filter(
        Machine_Instruction.machine_id == machine_id,
        Machine_Instruction.current_state == form.data['currentState'],
        Machine_Instruction.scanned_symbol == form.data['scannedSymbol']
    ).first()

    if duplicate_execution_conditions:
        return jsonify({'error': f"You already have an instruction for {machine.name} with the specified execution conditions. Please edit that instruction instead."}), 409

    if form.validate_on_submit():
        machine_instruction = Machine_Instruction(
            machine_id=machine_id,
            current_state=form.data['currentState'],
            scanned_symbol=form.data['scannedSymbol'],
            next_state=form.data['nextState'],
            print_symbol=form.data['printSymbol'],
            head_move=form.data['headMove']
        )

        db.session.add(machine_instruction)
        db.session.commit()

        return jsonify(machine_instruction.to_dict()), 201
    else:
        return jsonify(errors=validation_errors_to_error_messages(form.errors)), 400


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

@turing_machine_routes.route('/<int:machine_id>', methods=['PUT', 'DELETE'])
@login_required
def update_or_delete_turing_machine(machine_id):
    turing_machine = Turing_Machine.query.get(machine_id)

    if not turing_machine:
        return jsonify({'error': 'Turing machine not found'}), 404

    # Check if the current user is the owner of the Turing machine
    if turing_machine.owner_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    if request.method == 'PUT':
        form = TuringMachineForm()
        form['csrf_token'].data = request.cookies['csrf_token']

        new_name = name = form.data['name']
        # If the machine's name is being changed
        if (new_name != turing_machine.name):
            # Check to see if the new name is already taken
            name_taken = Turing_Machine.query.filter(Turing_Machine.name == new_name, Turing_Machine.owner_id == current_user.id).first()
            if (name_taken):
                return jsonify({'error': f"You already have another Turing machine named {new_name}. Please choose another name."}), 409


        if form.validate_on_submit():
            turing_machine.name = form.data['name']
            turing_machine.notes = form.data['notes']
            turing_machine.public = form.data['public']
            turing_machine.init_tape = form.data['initTape']
            # turing_machine.current_tape = form.data['currentTape']
            turing_machine.alphabet = form.data['alphabet']
            turing_machine.blank_symbol = form.data['blankSymbol']
            turing_machine.states = form.data['states']
            turing_machine.init_state = form.data['initState']
            # turing_machine.current_state = form.data['currentState']
            turing_machine.halting_state = form.data['haltingState']
            # turing_machine.head_pos = form.data['headPos']

            db.session.commit()

            return jsonify(turing_machine.to_dict())

        # If the form validation fails, return the validation errors as a JSON response
        return jsonify(errors=validation_errors_to_error_messages(form.errors)), 401

    elif request.method == 'DELETE':
        db.session.delete(turing_machine)
        db.session.commit()

        return jsonify({'message': f'Turing machine with ID {machine_id} deleted successfully.'})


# Create a Turing machine
@turing_machine_routes.route('/', methods=["POST"])
@login_required
def create_turing_machine():
    form = TuringMachineForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    name = form.data['name']
    name_taken = Turing_Machine.query.filter(Turing_Machine.name == name, Turing_Machine.owner_id == current_user.id).first()
    if (name_taken):
        return jsonify({'error': f"You already have a Turing machine named {name}. Please choose another name."}), 409

    if form.validate_on_submit():
        turing_machine = Turing_Machine(
            owner_id=current_user.id,
            name=form.data['name'],
            notes=form.data['notes'],
            public=form.data['public'],
            init_tape=form.data['initTape'],
            # current_tape=form.data['currentTape'],
            alphabet=form.data['alphabet'],
            blank_symbol=form.data['blankSymbol'],
            states=form.data['states'],
            init_state=form.data['initState'],
            # current_state=form.data['currentState'],
            halting_state=form.data['haltingState'],
            # head_pos=form.data['headPos']
        )

        db.session.add(turing_machine)
        db.session.commit()

        return jsonify(turing_machine.to_dict()), 201
    else:
        return jsonify(errors=validation_errors_to_error_messages(form.errors)), 401
