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
  const [board_x, setBoardX] = useState(9);
  const [board_y, setBoardY] = useState(6);
  
  const [isLive , setIsLive] = useState(true);

  const array : CellType[][] = Array.from({ length: board_x }, () =>
  Array.from({ length: board_y }, () => ({ player: null, state: 0 }))
);

  const [board, setBoard] = useState<CellType[][]>(array);

  const [canClick, setCanClick] = useState(true);

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

  const onClickCell = async (i: number, j: number) => {
    setCanClick(false);
    console.log(`Click canccel at position: (${i}, ${j})`);

    const player_color = index_to_color_map[mainPlayerIndex];

    if (board[i][j].player === null || player_color === board[i][j].player ) {
        const newBoard = board.map((row,rowI) =>

          row.map((cell,colJ) => 
             rowI === i && colJ === j ? { ...cell , player: player_color as "B" | "R", state: cell.state + 1 } : cell
          )
        ) 

        setBoard(newBoard);
        setMainPlayerIndex((mainPlayerIndex+1)%2);
    }


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
