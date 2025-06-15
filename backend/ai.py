from collections import deque
import random
import time
import os
import copy


class ChainreactionAgent:
    def __init__(self, n, m,ai_color,opponent_color):
        self.row = n
        self.col = m
        self.critical_mass = self.calculate_critical_mass(n, m)
        self.ai_color = ai_color
        self.opponent_color = opponent_color
    
    def calculate_critical_mass(self, n, m):
        
        critical_mass = [ [ 0 for j in range(m)] for i in range(n)]
        
        for i in range(n):
            for j in range(m):
                neighbors = 0
                if i > 0:
                    neighbors += 1
                if i < n-1:
                    neighbors += 1
                if j > 0:
                    neighbors += 1
                if j < m-1:
                    neighbors += 1
                critical_mass[i][j] = neighbors
        
        return critical_mass
    
    def get_max_state(self, i , j):
        
        state = self.critical_mass[i][j]
                  
        return state -1
    
    def get_available_moves(self,board, player):
        moves = []
        
        for i in range(self.row):
            for j in range(self.col):
                max_state = self.get_max_state(i, j)
                
                if board[i][j]["player"] == None or (board[i][j]["state"] <= max_state and board[i][j]["player"] == player):
                    moves.append((i, j))
                    
        return moves
    
    
    
    def make_move(self, board, player, move):
        
        queue = deque()
        queue.append(move)
        
        while queue:
            next_queue = deque()
            
            while queue:
                i, j = queue.popleft()
                
                if(self.chain_reaction(i, j, board, player)):
                    board[i][j]["state"] = 0
                    board[i][j]["player"] = None
                    
                    if i > 0:
                        next_queue.append((i-1, j))
                    if i < self.row - 1:
                        next_queue.append((i+1, j))
                    if j > 0:
                        next_queue.append((i, j-1))
                    if j < self.col - 1:
                        next_queue.append((i, j+1))
            
            queue = next_queue
            
        return board
    
    def chain_reaction(self, i, j, board, player):
        state = self.get_max_state(i, j)
        
        if board[i][j]["state"] < state:
            board[i][j]["player"] = player
            board[i][j]["state"] += 1
        else:
            #if win
            if self.game_ended(board) != 0:
                return False
            
            return True
        
        return False
    
    
    def minmax(self,board,depth,alpha, beta ,heuristic,is_max):
        if depth == 0:
            return heuristic(board), None
        
        
        if is_max:
            available_moves = self.get_available_moves(board,self.ai_color)
            
            maxval = float('-inf')
            best_move = None
            
            for move in available_moves:
                
                newboard = copy.deepcopy(board)
                newboard = self.make_move(newboard,self.ai_color,move)
                
                val,_  = self.minmax(newboard,depth-1,alpha,beta,heuristic,False)
                if maxval < val:
                    maxval = val
                    best_move = move
                alpha = max(alpha,val)
                if beta <= alpha:
                    break
                
            return maxval,best_move
        else:
            available_moves = self.get_available_moves(board,self.opponent_color)
            
            min_val = float('inf')
            best_move = None
            for move in available_moves:
                
                newboard = copy.deepcopy(board)
                newboard = self.make_move(newboard,self.opponent_color,move)
                
                val,_ = self.minmax(newboard,depth-1,alpha,beta,heuristic,True)
                if val < min_val:
                    min_val = val
                    best_move = move
                    
                beta = min(beta,val)
                
                if beta <= alpha:
                    break
            
            return min_val,best_move
    
    #will return 2 if ai win, 1 if ai lost , 0 if still not decided
    def game_ended(self,board):
        ai_win = True
        ai_lose = True
        score = 0
        
        for i in range(self.row):
            for j in range(self.col):
                if board[i][j]["player"] == self.ai_color:
                    ai_lose = False
                    score += board[i][j]["state"]
                elif board[i][j]["player"] == self.opponent_color:
                    ai_win = False
                    score += board[i][j]["state"]
        
        if ai_win and score > 1:
            return 2
        elif ai_lose and score > 1:
            return 1
        else:
            return 0
        
    def heuristic1(self, board):
        ai_score = 0
        op_score = 0
        
        for i in range(self.row):
            for j in range(self.col):
                if board[i][j]["player"] == self.ai_color:
                    ai_score += board[i][j]["state"]
                elif board[i][j]["player"] == self.opponent_color:
                    op_score += board[i][j]["state"]
        
        return (ai_score - op_score)
    
    def get_next_move(self,board,level):
        
        available_moves = self.get_available_moves(board,self.ai_color)
        
        best_moves = []
        for move in available_moves:
            
            newboard = copy.deepcopy(board)
            newboard = self.make_move(newboard,self.ai_color,move)
            end_game = self.game_ended(newboard)
            
            if end_game != 0:
                return move
            
            _,bestmove = self.minmax(newboard,level,float('-inf'),float('inf'),self.heuristic1,True)
            
            best_moves.append(bestmove)
        
        applied_move = None  
        if len(best_moves) > 0:
            index = random.randint(0, len(best_moves) - 1)
            print("random index:", index)
            applied_move = best_moves[index]
        
        return applied_move if applied_move is not None else random.choice(available_moves)
        
        



       
        
        

# def main():
#     ai_color = "R"
#     human_color = "B"
#     game = ChainreactionAgent(9,6,ai_color,human_color)
    
#     if not os.path.exists('gamestate.txt'):
#         initial_state = [[(0, None) for _ in range(6)] for _ in range(9)]
#         with open('gamestate.txt', 'w') as f:
#             f.write("Human Move:\n")
#             for row in initial_state:
#                 f.write(" ".join('0' if count == 0 else f"{count}{color}" 
#                                 for count, color in row) + "\n")
    

#     while True:
#         # Human player's turn (via console input)
#         print("Current Board State:")
#         with open('gamestate.txt', 'r') as f:
#             print(f.read())
        
#         while True:
#             try:
#                 move_input = input("Your move (row col, e.g., '0 0'): ")
#                 row, col = map(int, move_input.split())
#                 if not (0 <= row < 9 and 0 <= col < 6):
#                     print("Invalid position! Row 0-8, Col 0-5")
#                     continue
#                 break
#             except ValueError:
#                 print("Invalid input! Use format: row col")
        
#         # Update game state with human move
#         with open('gamestate.txt', 'r') as f:
#             lines = f.read().splitlines()
        
#         # Process human move
#         state = []
#         for i in range(1, 10):
#             cells = lines[i].split()
#             row_state = []
#             for cell in cells:
#                 if cell == '0':
#                     row_state.append({"player": None, "state": 0})
#                 else:
#                     count = int(cell[:-1])
#                     color = cell[-1]
#                     row_state.append({"player": color, "state": count})
#             state.append(row_state)
        
#         # Apply human move
#         count, color = state[row][col]["state"], state[row][col]["player"]
#         if color == human_color or color is None:
#             state = game.make_move(state, human_color, (row, col))
#         else:
#             print("Invalid move! You can only move to an empty cell or your own cell.")
        

#         # Write updated state to file
#         with open('gamestate.txt', 'w') as f:
#             f.write("Human Move:\n")
#             for i in range(9):
#                 row = []
#                 for j in range(6):
#                     count, color = state[i][j]["state"], state[i][j]["player"]
#                     if count == 0:
#                         row.append('0')
#                     else:
#                         row.append(f"{count}{color}")
#                 f.write(" ".join(row) + "\n")
                
#         print("Your move applied. Current Board State:")
#         with open('gamestate.txt', 'r') as f:
#             print(f.read())
        
#         # AI's turn
            
        
        
#         move = game.get_next_move(state, 3)
        
#         print(f"AI's move: {move}")
#         if move is None:
#             print("No valid moves available for AI.")
#             return
        
#         state = game.make_move(state, ai_color, move)
#         # Write updated state to file
#         with open('gamestate.txt', 'w') as f:
#             f.write("Ai Move:\n")
#             for i in range(9):
#                 row = []
#                 for j in range(6):
#                     count, color = state[i][j]["state"], state[i][j]["player"]
#                     if count == 0:
#                         row.append('0')
#                     else:
#                         row.append(f"{count}{color}")
#                 f.write(" ".join(row) + "\n")
            
#         if game.game_ended(state) != 0:
#             print("Game Over!")
#             if game.game_ended(state) == 2:
#                 print("AI wins!")
#             else:
#                 print("You win!")
#             return
    
        
        
        
            
# if __name__ == "__main__":
#     main()      
        
                

                
            
            
        
         