# root/app/seeds/machine_instructions.py
from app.models import db, Machine_Instruction, environment, SCHEMA
from sqlalchemy.sql import text

def seed_machine_instructions():
    mi_sets = []

    mod2i1 = Machine_Instruction(
        machine_id = 5,
        current_state = "LastDig0",
        scanned_symbol = "0",
        nextState = "LastDig0",
        print_symbol = "#",
        headMove = 1,
        )
    mod2i2 = Machine_Instruction(
        machine_id = 5,
        current_state = "LastDig0",
        scanned_symbol = "1",
        nextState = "LastDig1",
        print_symbol = "#",
        headMove = 1,
        )
    mod2i3 = Machine_Instruction(
        machine_id = 5,
        current_state = "LastDig1",
        scanned_symbol = "0",
        nextState = "LastDig0",
        print_symbol = "#",
        headMove = 1,
        )
    mod2i4 = Machine_Instruction(
        machine_id = 5,
        current_state = "LastDig1",
        scanned_symbol = "1",
        nextState = "LastDig1",
        print_symbol = "#",
        headMove = 1,
        )
    mod2i5 = Machine_Instruction(
        machine_id = 5,
        current_state = "LastDig0",
        scanned_symbol = "#",
        nextState = "qh",
        print_symbol = "0",
        headMove = 0,
        )
    mod2i6 = Machine_Instruction(
        machine_id = 5,
        current_state = "LastDig1",
        scanned_symbol = "#",
        nextState = "qh",
        print_symbol = "1",
        headMove = 0,
        )
    mod2_set = [mod2i1, mod2i2, mod2i3, mod2i4, mod2i5, mod2i6]
    mi_sets.append(mod2_set)

    sf1 = Machine_Instruction(
        machine_id = 2,
        current_state = "scan right",
        scanned_symbol = "0",
        nextState = "scan right",
        print_symbol = "0",
        headMove = 1,
        )
    sf2 = Machine_Instruction(
        machine_id = 2,
        current_state = "scan right",
        scanned_symbol = "1",
        nextState = "scan right",
        print_symbol = "1",
        headMove = 1,
        )
    sf3 = Machine_Instruction(
        machine_id = 2,
        current_state = "scan right",
        scanned_symbol = "#",
        nextState = "add one",
        print_symbol = "#",
        headMove = -1,
        )
    sf4 = Machine_Instruction(
        machine_id = 2,
        current_state = "add one",
        scanned_symbol = "0",
        nextState = "scan left",
        print_symbol = "1",
        headMove = -1,
        )
    sf5 = Machine_Instruction(
        machine_id = 2,
        current_state = "add one",
        scanned_symbol = "1",
        nextState = "add one",
        print_symbol = "0",
        headMove = -1,
        )
    sf6 = Machine_Instruction(
        machine_id = 2,
        current_state = "add one",
        scanned_symbol = "#",
        nextState = "qh",
        print_symbol = "1",
        headMove = 0,
        )
    sf7 = Machine_Instruction(
        machine_id = 2,
        current_state = "scan left",
        scanned_symbol = "0",
        nextState = "scan left",
        print_symbol = "0",
        headMove = -1,
        )
    sf8 = Machine_Instruction(
        machine_id = 2,
        current_state = "scan left",
        scanned_symbol = "1",
        nextState = "scan left",
        print_symbol = "1",
        headMove = -1,
        )
    sf9 = Machine_Instruction(
        machine_id = 2,
        current_state = "scan left",
        scanned_symbol = "#",
        nextState = "qh",
        print_symbol = "#",
        headMove = 1,
        )

    sf_set = [sf1, sf2, sf3, sf4, sf5, sf6, sf7, sf8, sf9]
    mi_sets.append(sf_set)

    for m_set in mi_sets:
        for m_inst in m_set:
            db.session.add(m_inst)
    db.session.commit()


def undo_machine_instructions():
  if environment == "production":
    db.session.execute(f"TRUNCATE table {SCHEMA}.machine_instructions RESTART IDENTITY CASCADE;")
  else:
    db.session.execute(text("DELETE FROM machine_instructions"))

  db.session.commit()
