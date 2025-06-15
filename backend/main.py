from typing import Union
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
from ai import ChainreactionAgent
from helper import write_to_file_human, get_board , write_to_file_agent, init_file

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

agent_red = ChainreactionAgent(9,6,"R","B")
agent_blue = ChainreactionAgent(9,6,"B","R")
agent_blue.set_huristic(2)

class Cell(BaseModel):
    player: str | None
    state: int
    
boardType = list[list[Cell]]

class Response(BaseModel):
    current_player: int
    level: int
    
init_file()


@app.post("/get_next_move", response_model=dict)
async def get_next_move(response: Response):
    board = get_board()
    move = agent_red.get_next_move(board,response.level)
    
    write_to_file_agent(move, agent_red)
    
    return {"move": move}
    


@app.post("/make_move")
async def make_move(move: tuple[int, int]):
    
    write_to_file_human(move, agent_red)
    
    return {"message": "Move made successfully"}

@app.post("/ai_vs_ai", response_model=dict)
async def get_next_move(response: Response):
    board = get_board()
    if response.current_player == 0:
        agent = agent_blue
        move = agent_blue.get_next_move(board,response.level)
    else:
        agent = agent_red
        move = agent_red.get_next_move(board,response.level)
    
    write_to_file_agent(move, agent)
    
    return {"move": move}
    
