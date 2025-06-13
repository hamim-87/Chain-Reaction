import { useState } from 'react'
import './App.css'
import Cell from './components/Cell'




function App() {
  const [board_x, setBoardX] = useState(9);
  const [board_y, setBoardY] = useState(6);
  
  const [isLive , setIsLive] = useState(false);

  const array = Array.from({ length:board_x}, _ => new Array(board_y).fill({player: null,state: 0}));

  const [board, setBoard] = useState({ ...array});

  const [canClick, setCanClick] = useState(true);




  const render_cell = ({i, j , id, canClick}
    :
     {
      i: number,
      j: number,
      id: string,
      canClick: Boolean,
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
        
        />
      );
  }




  return (
    <>
      { /* root div */}
      <div className='flex justify-center items-center flex-col min-h-screen bg-[#191919] text-white font-sans antialiased'>

          {/* game */}
          <div>
                { /* header */}
                <div>

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
