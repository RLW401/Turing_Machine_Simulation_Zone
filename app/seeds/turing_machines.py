# root/app/seeds/turing_machines.py
from app.models import db, Turing_Machine, environment, SCHEMA
from sqlalchemy.sql import text

def seed_turing_machines():
    tm_seeds = []
    zero_function = Turing_Machine(
        owner_id = None,
        collaborator_id = None,
        name = "Zero Function",
        notes = "erases the tape and prints 0. This implementation uses two operational states: erase and print, plus the halting state, Qh. Can you see how to implement the same function using only one operational state?",
        public = True,
        init_tape = "10001100101001",
        alphabet = "01",
        blank_symbol = '#',
        states = "erase|print|Qh",
        init_state = "erase",
        halting_state = "Qh",
    )
    tm_seeds.append(zero_function)

    successor_function = Turing_Machine(
        name = "Successor Function",
        notes = "Starts scanning the most significant digit of a natural number in binary and ends scanning the most significant digit of the subsequent natural number. In other words adds one to the input. Blank tape taken to be zero.",
        public = True,
        init_tape = "10001100101001",
        alphabet = "01",
        blank_symbol = '#',
        states = "scan right|add one|scan left|Qh",
        init_state = "scan right",
        halting_state = "Qh",
    )
    tm_seeds.append(successor_function)

    binary_inverter = Turing_Machine(
        owner_id = 1,
        name = "Binary Inverter",
        notes = "flip all the bits in a binary input string from 0 to 1 and vice versa",
        public = False,
        init_tape = "10001100101001",
        alphabet = "01",
        blank_symbol = '#',
        states = "flip|rewind|Qh",
        init_state = "flip",
        halting_state = "Qh",
    )
    tm_seeds.append(binary_inverter)

    binary_adder = Turing_Machine(
        name = "Binary Adder",
        notes = "Begins scanning the leftmost digit of a pair of binary numbers separated by a ‘+’ symbol. Ends scanning the leftmost digit of their binary sum on an otherwise empty tape.",
        public = True,
        init_tape = "10001100101001+10001100101001",
        alphabet = "+01AB",
        blank_symbol = '#',
        states = "Scan Right|Find Digit|Found Zero|Found One|Add Zero|Add One|Carry One|Format Result|Qh",
        init_state = "Scan Right",
        halting_state = "Qh",
    )
    tm_seeds.append(binary_adder)

    mod2 = Turing_Machine(
        owner_id = 1,
        collaborator_id = 2,
        name = "mod2",
        notes = "Scans a binary number from left to right. Halts scanning either a zero or a one on an otherwise blank tape depending on whether the number is even or odd, respectively. If the tape is initially blank the machine will print a zero and halt.",
        public = False,
        init_tape = "10001100101001",
        alphabet = "01",
        blank_symbol = '#',
        states = "LastDig0|LastDig1|Qh",
        init_state = "LastDig0",
        halting_state = "Qh",
    )
    tm_seeds.append(mod2)



    for tm in tm_seeds:
        db.session.add(tm)
    db.session.commit()

def undo_turing_machines():
  if environment == "production":
    db.session.execute(f"TRUNCATE table {SCHEMA}.turing_machines RESTART IDENTITY CASCADE;")
  else:
    db.session.execute(text("DELETE FROM turing_machines"))

  db.session.commit()
