# Turing Machine Simulation Zone features

## Turing Machines
### A user can create a Turing machine by specifying the following properties
- name: A descriptive name for the machine (e.g. "binary adder"). A user cannot own more than one machine with the same name.
- blank_symbol: The symbol used to represent a blank square on the machine's tape. Users will select from a dropdown including '#', ' ', and '0'. The default value will be '#'.
- alphabet: The set of non-blank symbols the machine can read and write. Must contain at least one character and cannot contain the symbol chosen as the blank.
- init_tape: the string of symbols initially on the tape of the machine, from the leftmost non-blank symbol to the rightmost non-blank symbol. The symbols may be interspaced with blanks and the string may be empty, in which case the tape is blank. The read/write head of a newly initialized machine with a non-blank tape will always start scanning the leftmost non-blank symbol.
### A user can edit a Turing machine by
- changing any of the above properties
- adding various internal states to the machine.
 - The states can be given short codenames (e.g. q0, q1, q2, etc.) or descriptive names (for example, a binary adder might have an internal state called "carry"). Users can also edit the machine by specifying the initial state (required before machine instructions can be created) and the halting state (not required, but if specified it must not be the initial state).
### Users can also delete any Turing machines they have created.

## Machine Instructions
### Once a user has created a Turing machine and specified its initial state, machine instructions can be created by specifying the following five properties:
- current_state: the state of the machine in which the instruction will be triggered if the appropriate symbol is scanned
- scanned_symbol: the symbol that will trigger the instruction if the machine's state is the one specified in current_state
-- together current_state and scanned_symbol specify a unique state-symbol pair which determines the machine instruction to be executed at any given step.

- next_state: the state into which the machine will transition on the next step of its computation
- print_symbol: the symbol to be printed on the scanned square. Must be either an element of the machine alphabet or the blank symbol.
- head_move: an integer -1 <= head_move <= 1. determines whether the head will end up scanning the square immediately to its left (-1), immediately to its right (1), or remain on the current square (0) in the next step of the computation. The value 0 is permitted only when next_state is the halting state.

### Users can update machine instructions by editing any of the above properties
### Users can delete any machine instruction associated with a machine they own

## Collaborations
### A user can invite another user to become a collaborator by way of their user_id or email.
- Once a request is made, the collaboration will have a status of "pending"
- A user who has been invited to collaborate can accept the invitation, in which case the status is changed to "accepted", or they can reject the invitation, in which case the collaboration will be deleted.
- Once two users are collaborators, either can give the other edit privileges on one or more of their Turing machines.
- either party to a collaboration can dissolve it at any time.

## Comments
### A user that is collaborating on a Turing machine (whether as an owner or not) can add comments to the machine
- Comments can be edited by the user that posted them.
- Comments can be deleted by either the user that posted them or the machine owner.
