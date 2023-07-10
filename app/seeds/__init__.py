# root/app/seeds/__init__.py
from flask.cli import AppGroup
from .users import seed_users, undo_users
from .turing_machines import seed_turing_machines, undo_turing_machines
from .machine_instructions import seed_machine_instructions, undo_machine_instructions
from .collaborations import seed_collaborations, undo_collaborations
from .comments import seed_comments, undo_comments

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_comments()
        undo_collaborations()
        undo_machine_instructions()
        undo_turing_machines()
        undo_users()
    seed_users()
    seed_turing_machines()
    seed_machine_instructions()
    seed_collaborations()
    seed_comments()


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_comments()
    undo_collaborations()
    undo_machine_instructions()
    undo_turing_machines()
    undo_users()
