import { useState } from 'react'
import './App.css'
import Cell from './components/Cell'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"


import CategoryIcon from '@mui/icons-material/Category';

type CellType = {
  player: "B" | "R" | null;
  state: number;
}



function App() {
  //board
  const [board_x, setBoardX] = useState(9);
  const [board_y, setBoardY] = useState(6);
  const array : CellType[][] = Array.from({ length: board_x }, () =>
    Array.from({ length: board_y }, () => ({ player: null, state: 0 }))
  );
  const [board, setBoard] = useState<CellType[][]>(array);

  //game helper
  const [canClick, setCanClick] = useState(true);
  const [isLive , setIsLive] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(-1);

  //player
  const [mainPlayerIndex, setMainPlayerIndex] = useState(0);

  const player_color = [
      '#038fad',
      '#e80747',

  ];
  const index_to_color_map = [
    "B",
    "R",
  ]

  const check_gameover = () => {
        let one_win = true
        let two_lose = true
        let score = 0

        for(let i =0;i<board_x;i++) {
          for(let j = 0; j<board_y;j++) {
            if(board[i][j].player !== null && board[i][j].player === "B") {
              one_win = false;
              score += 1;
            }else if (board[i][j].player !== null && board[i][j].player === "R"){
              two_lose = false;
              score+=1;
            }
          }
        }
        
        if (one_win && score > 1) {
          setGameOver(true);
          setWinner(1);
          return true;

        } else if (two_lose && score > 1) {
          setGameOver(true);
          setWinner(0);
          return true;

        }else{
          return false;
        }
  }

  const chain_reaction = async (i: number, j:number) => {
    let max = (i === 0 || i === (board_x - 1) || j === 0 || j === (board_y - 1)) ?
      ((
      (i === 0 && j === 0) || 
      (i === 0 && j === (board_y-1) ) ||
      ( j === 0 && i === board_x -1) ||
      (j === board_y -1 && i === board_x -1) ) ? 1 : 2 )
    :3;
      
    let newboard = board.map((row,indI) => 
        row.map((val,indJ) => 
            val
        )
    )

    let current_player_color = index_to_color_map[mainPlayerIndex];

    if(newboard[i][j].player === null || newboard[i][j].state < max) {
      newboard[i][j].player = current_player_color as "B" | "R";
      newboard[i][j].state += 1;

    }else {
      return true;
    }

    setBoard(newboard);
    return false;
  }

  const make_move = async (i: number, j: number ) => {
    if(gameOver) return;

    if(await chain_reaction(i,j)) {
      let newboard = board.map((row,_) => 
          row.map((val,_) => 
              val
          )
      )

      newboard[i][j].player = null;
      newboard[i][j].state = 0;

      setBoard(newboard);

      if(i > 0) make_move(i-1,j);
      if(i < board_x-1) make_move(i+1,j);
      if(j > 0) make_move(i,j-1);
      if(j < board_y-1) make_move(i,j+1);
    }



    if(!gameOver) check_gameover();
  }

  const onClickCell = async (i: number, j: number) => {
    setCanClick(false);
    console.log(`Click canccel at position: (${i}, ${j})`);

    const player_color = index_to_color_map[mainPlayerIndex];

    if (board[i][j].player === null || player_color === board[i][j].player ) {
          make_move(i,j);
        setMainPlayerIndex((mainPlayerIndex+1)%2);
    }

    setCanClick(true);

  }



  const render_cell = ({i, j , id, canClick}
    :
     {
      i: number,
      j: number,
      id: string,
      canClick: boolean,
     }
    ) => {
      return (
        <Cell
          key={id}
          id={id}
          board_cell={board[i][j]}
          max = {(i === 0 || i === (board_x - 1) || j === 0 || j === (board_y - 1)) ?
            ((
            (i === 0 && j === 0) || 
            (i === 0 && j === (board_y-1) ) ||
            ( j === 0 && i === board_x -1) ||
            (j === board_y -1 && i === board_x -1) ) ? 1 : 2 )
          :3}

          onClick={(e: React.MouseEvent<HTMLButtonElement>) => onClickCell(i, j)}
            
          canClick={canClick}
        
        />
      );
  }

  const [position, setPosition] = useState("bottom")


  return (
    <>
      { /* root div */}
      <div className='flex justify-center items-center flex-col min-h-screen bg-[#191919] text-white font-sans antialiased'>

          {/* game */}
          <div>
                { /* header */}
                <div className='flex'>
                  <div className='w-14 flex-4'>
                    <DropdownMenu >
                      <DropdownMenuTrigger asChild>
                        <div className="flex items-center justify-center w-10 h-10 pb-2 bg-[#191919] text-inherit  cursor-pointer hover">
                          <CategoryIcon />
                        </div>
                        
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56 bg-[#35393b] ">
                        <DropdownMenuLabel ></DropdownMenuLabel>
                        <DropdownMenuGroup className='text-white'>
                          <DropdownMenuItem>
                            Play with friends
                            <DropdownMenuShortcut>⇧⌘</DropdownMenuShortcut>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Play with AI
                            <DropdownMenuShortcut>[⌘]</DropdownMenuShortcut>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            AI vs AI
                            <DropdownMenuShortcut>:⌘</DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className='text-white flex justify-center font-bold'>Ai level</DropdownMenuLabel>

                        <DropdownMenuRadioGroup value={position} onValueChange={setPosition} className='text-white'>
                          <DropdownMenuRadioItem value="first" >First level</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="second">Second level</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="third">Third level</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                   <div className='flex-4 pr-2.5'>
                      <div className='justify-center align-center   gap-10'>
                           {
                            player_color.map((color , index) => {
                              return(
                                <>
                                    {
                                      (isLive && index === mainPlayerIndex) && <div className='h-[20px] w-[20px] rounded-full m-[5px] inline-block' style={{ backgroundColor: color, border:"3px solid white" }}></div>
                                    }
                                    {
                                      (isLive && index !== mainPlayerIndex) && <div className='h-[20px] w-[20px] rounded-full m-[5px] inline-block' style={{ backgroundColor: color , border: "3px solid #191919"}}></div>
                                    }
                                
                                </>

                              )
                            }
                          )
                      }
                      </div>
                     

                    </div>

                    <div className='flex-1 justify-right align-center pb-4 pt-2 gap-3'>
                        icon
                    </div>

                </div>


                { /* main content */}
                <div>
                
                  { 
                    Object.entries(board).map(([i, row]) => {
                      return (
                          <div className='flex justify-center text-center text-inherit' id = {i}>
                            {
                               Object.entries(row).map(([j, value]) => {
                                return (
                                    render_cell({i: parseInt(i),j: parseInt(j) ,id: i + "_"+j,canClick: canClick})
                                );
                               })
                            }

                          </div>
                      );
                    }) 
                  }

                </div>

                { /* footer */}
                <div>

                </div>
          </div>
        
      </div>
    </>
  )
}

export default App
