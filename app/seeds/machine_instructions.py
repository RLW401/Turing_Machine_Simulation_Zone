# root/app/seeds/machine_instructions.py
from app.models import db, Machine_Instruction, environment, SCHEMA
from sqlalchemy.sql import text

def seed_machine_instructions():
    mi_sets = []

    zfi1 = Machine_Instruction(
        machine_id = 1,
        current_state = "erase",
        scanned_symbol = "0",
        next_state = "erase",
        print_symbol = "#",
        head_move = 1,
        )

    zfi2 = Machine_Instruction(
        machine_id = 1,
        current_state = "erase",
        scanned_symbol = "1",
        next_state = "erase",
        print_symbol = "#",
        head_move = 1,
        )

    zfi3 = Machine_Instruction(
        machine_id = 1,
        current_state = "erase",
        scanned_symbol = "#",
        next_state = "print",
        print_symbol = "#",
        head_move = -1,
        )

    zfi4 = Machine_Instruction(
        machine_id = 1,
        current_state = "print",
        scanned_symbol = "#",
        next_state = "qh",
        print_symbol = "0",
        head_move = 0,
        )

    zf_set = [zfi1, zfi2, zfi3, zfi4]
    mi_sets.append(zf_set)

    mod2i1 = Machine_Instruction(
        machine_id = 5,
        current_state = "LastDig0",
        scanned_symbol = "0",
        next_state = "LastDig0",
        print_symbol = "#",
        head_move = 1,
        )
    mod2i2 = Machine_Instruction(
        machine_id = 5,
        current_state = "LastDig0",
        scanned_symbol = "1",
        next_state = "LastDig1",
        print_symbol = "#",
        head_move = 1,
        )
    mod2i3 = Machine_Instruction(
        machine_id = 5,
        current_state = "LastDig1",
        scanned_symbol = "0",
        next_state = "LastDig0",
        print_symbol = "#",
        head_move = 1,
        )
    mod2i4 = Machine_Instruction(
        machine_id = 5,
        current_state = "LastDig1",
        scanned_symbol = "1",
        next_state = "LastDig1",
        print_symbol = "#",
        head_move = 1,
        )
    mod2i5 = Machine_Instruction(
        machine_id = 5,
        current_state = "LastDig0",
        scanned_symbol = "#",
        next_state = "qh",
        print_symbol = "0",
        head_move = 0,
        )
    mod2i6 = Machine_Instruction(
        machine_id = 5,
        current_state = "LastDig1",
        scanned_symbol = "#",
        next_state = "qh",
        print_symbol = "1",
        head_move = 0,
        )
    mod2_set = [mod2i1, mod2i2, mod2i3, mod2i4, mod2i5, mod2i6]
    mi_sets.append(mod2_set)

    sf1 = Machine_Instruction(
        machine_id = 2,
        current_state = "scan right",
        scanned_symbol = "0",
        next_state = "scan right",
        print_symbol = "0",
        head_move = 1,
        )
    sf2 = Machine_Instruction(
        machine_id = 2,
        current_state = "scan right",
        scanned_symbol = "1",
        next_state = "scan right",
        print_symbol = "1",
        head_move = 1,
        )
    sf3 = Machine_Instruction(
        machine_id = 2,
        current_state = "scan right",
        scanned_symbol = "#",
        next_state = "add one",
        print_symbol = "#",
        head_move = -1,
        )
    sf4 = Machine_Instruction(
        machine_id = 2,
        current_state = "add one",
        scanned_symbol = "0",
        next_state = "scan left",
        print_symbol = "1",
        head_move = -1,
        )
    sf5 = Machine_Instruction(
        machine_id = 2,
        current_state = "add one",
        scanned_symbol = "1",
        next_state = "add one",
        print_symbol = "0",
        head_move = -1,
        )
    sf6 = Machine_Instruction(
        machine_id = 2,
        current_state = "add one",
        scanned_symbol = "#",
        next_state = "qh",
        print_symbol = "1",
        head_move = 0,
        )
    sf7 = Machine_Instruction(
        machine_id = 2,
        current_state = "scan left",
        scanned_symbol = "0",
        next_state = "scan left",
        print_symbol = "0",
        head_move = -1,
        )
    sf8 = Machine_Instruction(
        machine_id = 2,
        current_state = "scan left",
        scanned_symbol = "1",
        next_state = "scan left",
        print_symbol = "1",
        head_move = -1,
        )
    sf9 = Machine_Instruction(
        machine_id = 2,
        current_state = "scan left",
        scanned_symbol = "#",
        next_state = "qh",
        print_symbol = "#",
        head_move = 1,
        )

    sf_set = [sf1, sf2, sf3, sf4, sf5, sf6, sf7, sf8, sf9]
    mi_sets.append(sf_set)

    bi_1 = Machine_Instruction(
        machine_id = 3,
        current_state = "flip",
        scanned_symbol = "#",
        next_state = "rewind",
        print_symbol = "#",
        head_move = -1,
        )

    bi_2 = Machine_Instruction(
        machine_id = 3,
        current_state = "flip",
        scanned_symbol = "0",
        next_state = "flip",
        print_symbol = "1",
        head_move = 1,
        )

    bi_3 = Machine_Instruction(
        machine_id = 3,
        current_state = "flip",
        scanned_symbol = "1",
        next_state = "flip",
        print_symbol = "0",
        head_move = 1,
        )

    bi_4 = Machine_Instruction(
        machine_id = 3,
        current_state = "rewind",
        scanned_symbol = "#",
        next_state = "qh",
        print_symbol = "#",
        head_move = 1,
        )

    bi_5 = Machine_Instruction(
        machine_id = 3,
        current_state = "rewind",
        scanned_symbol = "0",
        next_state = "rewind",
        print_symbol = "0",
        head_move = -1,
        )

    bi_6 = Machine_Instruction(
        machine_id = 3,
        current_state = "rewind",
        scanned_symbol = "1",
        next_state = "rewind",
        print_symbol = "1",
        head_move = -1,
        )


    bi_set = [bi_1, bi_2, bi_3, bi_4, bi_5, bi_6]
    mi_sets.append(bi_set)

    ba_set = [
        Machine_Instruction(
            machine_id = 4,
            current_state = "Scan Right",
            scanned_symbol = "1",
            next_state = "Scan Right",
            print_symbol = "1",
            head_move = 1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Scan Right",
            scanned_symbol = "0",
            next_state = "Scan Right",
            print_symbol = "0",
            head_move = 1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Scan Right",
            scanned_symbol = "+",
            next_state = "Scan Right",
            print_symbol = "+",
            head_move = 1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Scan Right",
            scanned_symbol = "A",
            next_state = "Scan Right",
            print_symbol = "A",
            head_move = 1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Scan Right",
            scanned_symbol = "B",
            next_state = "Scan Right",
            print_symbol = "B",
            head_move = 1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Scan Right",
            scanned_symbol = "#",
            next_state = "Find Digit",
            print_symbol = "#",
            head_move = -1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Find Digit",
            scanned_symbol = "0",
            next_state = "Found Zero",
            print_symbol = "#",
            head_move = -1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Find Digit",
            scanned_symbol = "1",
            next_state = "Found One",
            print_symbol = "#",
            head_move = -1,
            ),
        Machine_Instruction(
            machine_id = 4,
            current_state = "Find Digit",
            scanned_symbol = "+",
            next_state = "Format Result",
            print_symbol = "#",
            head_move = -1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Found Zero",
            scanned_symbol = "0",
            next_state = "Found Zero",
            print_symbol = "0",
            head_move = -1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Found Zero",
            scanned_symbol = "1",
            next_state = "Found Zero",
            print_symbol = "1",
            head_move = -1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Found Zero",
            scanned_symbol = "+",
            next_state = "Add Zero",
            print_symbol = "+",
            head_move = -1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Found One",
            scanned_symbol = "0",
            next_state = "Found One",
            print_symbol = "0",
            head_move = -1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Found One",
            scanned_symbol = "1",
            next_state = "Found One",
            print_symbol = "1",
            head_move = -1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Found One",
            scanned_symbol = "+",
            next_state = "Add One",
            print_symbol = "+",
            head_move = -1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Add Zero",
            scanned_symbol = "0",
            next_state = "Scan Right",
            print_symbol = "A",
            head_move = 1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Add Zero",
            scanned_symbol = "1",
            next_state = "Scan Right",
            print_symbol = "B",
            head_move = 1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Add Zero",
            scanned_symbol = "A",
            next_state = "Add Zero",
            print_symbol = "A",
            head_move = -1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Add Zero",
            scanned_symbol = "B",
            next_state = "Add Zero",
            print_symbol = "B",
            head_move = -1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Add Zero",
            scanned_symbol = "#",
            next_state = "Scan Right",
            print_symbol = "A",
            head_move = 1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Add One",
            scanned_symbol = "0",
            next_state = "Scan Right",
            print_symbol = "B",
            head_move = 1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Add One",
            scanned_symbol = "1",
            next_state = "Carry One",
            print_symbol = "A",
            head_move = -1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Add One",
            scanned_symbol = "#",
            next_state = "Scan Right",
            print_symbol = "B",
            head_move = 1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Add One",
            scanned_symbol = "A",
            next_state = "Add One",
            print_symbol = "A",
            head_move = -1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Add One",
            scanned_symbol = "B",
            next_state = "Add One",
            print_symbol = "B",
            head_move = -1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Carry One",
            scanned_symbol = "0",
            next_state = "Scan Right",
            print_symbol = "1",
            head_move = 1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Carry One",
            scanned_symbol = "1",
            next_state = "Carry One",
            print_symbol = "0",
            head_move = -1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Carry One",
            scanned_symbol = "#",
            next_state = "Scan Right",
            print_symbol = "1",
            head_move = 1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Format Result",
            scanned_symbol = "A",
            next_state = "Format Result",
            print_symbol = "0",
            head_move = -1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Format Result",
            scanned_symbol = "B",
            next_state = "Format Result",
            print_symbol = "1",
            head_move = -1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Format Result",
            scanned_symbol = "0",
            next_state = "Format Result",
            print_symbol = "0",
            head_move = -1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Format Result",
            scanned_symbol = "1",
            next_state = "Format Result",
            print_symbol = "1",
            head_move = -1,
            ),

        Machine_Instruction(
            machine_id = 4,
            current_state = "Format Result",
            scanned_symbol = "#",
            next_state = "Qh",
            print_symbol = "#",
            head_move = 1,
            ),
    ]

    # ba_set = []
    mi_sets.append(ba_set)

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
