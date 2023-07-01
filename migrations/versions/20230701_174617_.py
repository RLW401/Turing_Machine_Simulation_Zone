"""empty message

Revision ID: 70e46222745e
Revises:
Create Date: 2023-07-01 17:46:17.016573

"""
from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")


# revision identifiers, used by Alembic.
revision = '70e46222745e'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.String(length=31), nullable=False),
    sa.Column('last_name', sa.String(length=31), nullable=False),
    sa.Column('username', sa.String(length=40), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('hashed_password', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('collaborations',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('requester_id', sa.Integer(), nullable=False),
    sa.Column('addressee_id', sa.Integer(), nullable=False),
    sa.Column('accepted', sa.Boolean(), nullable=False),
    sa.ForeignKeyConstraint(['addressee_id'], ['users.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['requester_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('turing_machines',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('owner_id', sa.Integer(), nullable=True),
    sa.Column('collaborator_id', sa.Integer(), nullable=True),
    sa.Column('name', sa.String(length=255), nullable=False),
    sa.Column('notes', sa.Text(), nullable=True),
    sa.Column('public', sa.Boolean(), nullable=True),
    sa.Column('init_tape', sa.Text(), nullable=True),
    sa.Column('current_tape', sa.Text(), nullable=True),
    sa.Column('alphabet', sa.String(length=255), nullable=False),
    sa.Column('blank_symbol', sa.String(length=1), nullable=False),
    sa.Column('states', sa.Text(), nullable=True),
    sa.Column('init_state', sa.String(length=31), nullable=True),
    sa.Column('current_state', sa.String(length=31), nullable=True),
    sa.Column('halting_state', sa.String(length=31), nullable=True),
    sa.Column('head_pos', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['collaborator_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('comments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('commenter_id', sa.Integer(), nullable=False),
    sa.Column('machine_id', sa.Integer(), nullable=False),
    sa.Column('subject', sa.String(length=127), nullable=False),
    sa.Column('content', sa.Text(), nullable=False),
    sa.ForeignKeyConstraint(['commenter_id'], ['users.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['machine_id'], ['turing_machines.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('machine_instructions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('machine_id', sa.Integer(), nullable=False),
    sa.Column('current_state', sa.String(length=31), nullable=False),
    sa.Column('scanned_symbol', sa.String(length=1), nullable=False),
    sa.Column('next_state', sa.String(length=31), nullable=False),
    sa.Column('print_symbol', sa.String(length=1), nullable=False),
    sa.Column('head_move', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['machine_id'], ['turing_machines.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    if environment == "production":
        op.execute(f"ALTER TABLE users SET SCHEMA {SCHEMA};")
    # ### end Alembic commands ###



def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('machine_instructions')
    op.drop_table('comments')
    op.drop_table('turing_machines')
    op.drop_table('collaborations')
    op.drop_table('users')
    # ### end Alembic commands ###
