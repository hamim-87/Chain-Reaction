
def init_file(filename="gamestate.txt"):
    board = [[0 for _ in range(6)] for _ in range(9)]
    with open(filename, "w") as f:
        f.write("AI Move:\n")
        for row in board:
            row_str = " ".join(str(cell) for cell in row)
            f.write(row_str + "\n")



def get_board():
    # Update game state with human move
    with open('gamestate.txt', 'r') as f:
        lines = f.read().splitlines()
    
    # Process human move
    state = []
    for i in range(1, 10):
        cells = lines[i].split()
        row_state = []
        for cell in cells:
            if cell == '0':
                row_state.append({"player": None, "state": 0})
            else:
                count = int(cell[:-1])
                color = cell[-1]
                row_state.append({"player": color, "state": count})
        state.append(row_state)
        
    return state


def write_to_file_human(move,agent):
    
    state = get_board()
        
    row, col = move
    count, color = state[row][col]["state"], state[row][col]["player"]
    if color == "B" or color is None:
        state = agent.make_move(state, "B", (row, col))
    else:
        print("Invalid move! You can only move to an empty cell or your own cell.")
    

        
    # Write updated state to file
    with open('gamestate.txt', 'w') as f:
        f.write("Human Move:\n")
        for i in range(9):
            row = []
            for j in range(6):
                count, color = state[i][j]["state"], state[i][j]["player"]
                if count == 0:
                    row.append('0')
                else:
                    row.append(f"{count}{color}")
            f.write(" ".join(row) + "\n")


def write_to_file_agent(move, agent):
    
    state = get_board()
    
    state = agent.make_move(state, "R", move)
        # Write updated state to file
    with open('gamestate.txt', 'w') as f:
        f.write("Ai Move:\n")
        for i in range(9):
            row = []
            for j in range(6):
                count, color = state[i][j]["state"], state[i][j]["player"]
                if count == 0:
                    row.append('0')
                else:
                    row.append(f"{count}{color}")
            f.write(" ".join(row) + "\n")