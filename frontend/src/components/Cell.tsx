
import Player from "@/components/Player";

interface CellProps {
    id?: string;
    board_cell: { player?: "R" | "B" | null; state: number; }
    max?: number;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    canClick: boolean;
}
const Cell = ({ id, board_cell, max, onClick, canClick }: CellProps) => {
    const player_color = {
        "R": '#e80747',
        "B": '#038fad',
    };
    return (
        <>
            <button 
                className="bg-[#191919] text-inherit border float-left h-[55px] w-[55px] -mr-[1px] -mt-[1px] p-0 text-center flex flex-col justify-center items-center"
                id={id}
                onClick={onClick}
                disabled = {!canClick}

            >
                <Player
                    state={board_cell.state}
                    color={board_cell.player ? player_color[board_cell.player] : undefined}
                    max={max}
                />

            </button>

        </>

    );
};
export default Cell;