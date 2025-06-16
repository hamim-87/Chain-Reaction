import { useState, useEffect, use } from 'react'
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

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"


import CategoryIcon from '@mui/icons-material/Category';

import playerWinImg from './images/won.gif'
import playerLoseImg from './images/lose.gif'

type CellType = {
  player: "B" | "R" | null;
  state: number;
}



function App() {
  //board
  const [board_x,] = useState(9);
  const [board_y,] = useState(6);
  const array : CellType[][] = Array.from({ length: board_x }, () =>
    Array.from({ length: board_y }, () => ({ player: null, state: 0 }))
  );
  const [board, setBoard] = useState<CellType[][]>(array);

  //game helper
  const [canClick, setCanClick] = useState(true);
  const [isLive , setIsLive] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(-1);
  const [meVsAi, setMeVsAi] = useState(true);
  const [level, setLevel] = useState(2);
  const [aiVsAi , setAiVsAi] = useState(false);

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

    useEffect(() => {
        const init_game = async () => {
            try{
                const response = await fetch("http://localhost:8000/init",{
                  method:"GET",
                  headers: {
                      "Content-Type": "application/json",
                  },
            
                })

                const data = await response.json();

                console.log(data.message);
            }catch(e){
              console.log("fali to init game\n");
            }
        }
      init_game();
  },[])

  const reset_game = async () => {

    const newarray : CellType[][] = Array.from({ length: board_x }, () =>
        Array.from({ length: board_y }, () => ({ player: null, state: 0 }))
      );

      setBoard(newarray);
      setMainPlayerIndex(0);
    
        const init_game = async () => {
            try{
                const response = await fetch("http://localhost:8000/init",{
                  method:"GET",
                  headers: {
                      "Content-Type": "application/json",
                  },
            
                })

                const data = await response.json();

                console.log(data.message);
            }catch(e){
              console.log("fali to init game\n");
            }
        }
      init_game();

  }

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

  const chain_reaction = async (i: number, j:number, currentPlayer = mainPlayerIndex) => {
    let max = (i === 0 || i === (board_x - 1) || j === 0 || j === (board_y - 1)) ?
      ((
      (i === 0 && j === 0) || 
      (i === 0 && j === (board_y-1) ) ||
      ( j === 0 && i === board_x -1) ||
      (j === board_y -1 && i === board_x -1) ) ? 1 : 2 )
    :3;
      
    let newboard = board.map((row,_) => 
        row.map((val,_) => 
            val
        )
    )

    let current_player_color = index_to_color_map[currentPlayer];

    //console.log(current_player_color);

    if(newboard[i][j].player === null || newboard[i][j].state < max) {
      newboard[i][j].player = current_player_color as "B" | "R";
      newboard[i][j].state += 1;

    }else {
      return true;
    }

    setBoard(newboard);
    return false;
  }




    const getAiNextMove = async (current_player: number, level:number) => {
      try {
        const response = await fetch("http://localhost:8000/get_next_move", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ current_player, level }),
        });

        const data = await response.json();
        console.log("AI move:", data.move); 
        return data.move;
      } catch (error) {
        console.error("Error getting AI move:", error);
      }
  };


  const updateMove = async (x:number, y:number) => {
        try {
          const response = await fetch("http://localhost:8000/make_move", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify([x, y]),
          });

          const data = await response.json();
          console.log("Move response:", data.message);
        } catch (error) {
          console.error("Error making move:", error);
        }
    };

  const make_move = async (i: number, j: number , currentPlayer = mainPlayerIndex) => {
    if(gameOver) return;

    if(await chain_reaction(i,j,currentPlayer)) {
      let newboard = board.map((row,_) => 
          row.map((val,_) => 
              val
          )
      )

      newboard[i][j].player = null;
      newboard[i][j].state = 0;

      setBoard(newboard);

      if(i > 0) await make_move(i-1,j,currentPlayer);
      if(i < board_x-1) await make_move(i+1,j,currentPlayer);
      if(j > 0) await make_move(i,j-1,currentPlayer);
      if(j < board_y-1) await make_move(i,j+1,currentPlayer);
    }



    if(!gameOver) check_gameover();
  }

  const onClickCell = async (i: number, j: number) => {
    setCanClick(false);


    const player_color = index_to_color_map[mainPlayerIndex];

    if (board[i][j].player === null || player_color === board[i][j].player ) {
      await make_move(i, j);


      if (meVsAi) {
        await updateMove(i, j);
      }


      const nextPlayer = (mainPlayerIndex + 1) % 2;
      setMainPlayerIndex(nextPlayer);


      if (meVsAi && nextPlayer === 1 && !gameOver) {
        try {
          const [ai_i, ai_j] = await getAiNextMove(nextPlayer, level);
          //console.log("AI chose:", ai_i, ai_j);


          await new Promise(res => setTimeout(res, 300));

          await make_move(ai_i, ai_j,1);
          //await updateMove(ai_i, ai_j);
          setMainPlayerIndex(0); 
        } catch (error) {
          console.error("AI move failed:", error);
        }
      }


    }




    setCanClick(true);

  }



  const ai_make_move = async (current_player: number, level:number) => {
      try {
        const response = await fetch("http://localhost:8000/ai_vs_ai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ current_player, level }),
        });

        const data = await response.json();
        console.log("AI move:", data.move); 
        return data.move;
      } catch (error) {
        console.error("Error getting AI move:", error);
      }
  };




  // AI vs AI mode
  useEffect(() => {
    if (!aiVsAi || gameOver) return;
    
    const aiVsAiMove = async () => {
      setCanClick(false);
      
      // Get AI move
      const [row, col] = await ai_make_move(mainPlayerIndex, level);
      
      // Process move
      make_move( row, col, mainPlayerIndex);
  
      
      // Check for winner
      const wn = check_gameover();
      if (wn) {

        setGameOver(true);
        setCanClick(true);
        return;
      }
      
      // Switch to next player
      const nextPlayer = (mainPlayerIndex + 1) % 2;
      setMainPlayerIndex(nextPlayer);
      
      setCanClick(true);
    };
    
    const timer = setTimeout(aiVsAiMove, 300);
    return () => clearTimeout(timer);
  }, [aiVsAi, gameOver, mainPlayerIndex, board, level]);

  // const ai_vs_ai_move = async () => {
  //   setCanClick(false);


  
  //   try {
  //     const [row, col] = await ai_make_move(mainPlayerIndex,level);

  //     console.log(`ai ${mainPlayerIndex} make a move: ${row},${col}`);

  //     await make_move(row,col,mainPlayerIndex);

  //     const newIndex = (mainPlayerIndex+1)%2;
  //     await new Promise(res => setTimeout(res,300));

  //     setMainPlayerIndex(newIndex);
      
  //   }catch(e) {
  //     console.log("fail to make move ai:", e);
  //   }



  // }



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
                           {
             (gameOver) && 
                  <Drawer open={gameOver} onOpenChange={setGameOver} >
                    <DrawerTrigger>Open</DrawerTrigger>
                    <DrawerContent className="bg-[#191919] text-white font-sans antialiased">
                      <DrawerHeader>
                        <DrawerTitle className="bold text-white">
                          {(winner === 1) ?( (meVsAi) ?  "AI Win!" : "Ai Red Win" ): ((!aiVsAi) ? "Who is the conquer of the word!" : "Ai Blue Win")}
                        </DrawerTitle>
                            
                              { (winner === 1) ? <img
                                src={playerLoseImg}
                                alt="Player Lose Animation"
                                className="mx-auto mt-4 w-350 h-100 object-contain"
                              />
                              : <img
                                src={playerWinImg}
                                alt="Player Win Animation"
                                className="mx-auto mt-4 w-350 h-100 object-contain"
                              />
                              }
                      </DrawerHeader>
                      <DrawerFooter>
                        <Button onClick={() => {setGameOver(false); reset_game();}}>Reset Game</Button>
 
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
           }
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
                          <DropdownMenuItem onClick={async () => { setAiVsAi(false); setMeVsAi(false);await reset_game();setCanClick(true)}}>
                            Play with friends
                            <DropdownMenuShortcut>⇧⌘</DropdownMenuShortcut>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={async () =>{ setAiVsAi(false); setMeVsAi(true); await reset_game();}}>
                            Play with AI
                            <DropdownMenuShortcut>[⌘]</DropdownMenuShortcut>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={async () =>{  await reset_game();setAiVsAi(true);setMeVsAi(false);}}>
                            AI vs AI
                            <DropdownMenuShortcut>:⌘</DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className='text-white flex justify-center font-bold'>Ai level</DropdownMenuLabel>

                          <DropdownMenuRadioGroup
                            value={String(level)}
                            onValueChange={(value) => setLevel(Number(value))}
                            className="text-white mt-4"
                          >
                            <DropdownMenuRadioItem value="1">First level</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="2">Second level</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="3">Third level</DropdownMenuRadioItem>
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
