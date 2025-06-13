import OneOrb from "./OneOrb";
import TwoOrb from "./TwoOrb";
import ThreeOrb from "./ThreeOrb";

interface PlayerProps {
  state: number; 
  color?: string; 
  max?: number; 
}

const Player = ({ state, color, max }: PlayerProps) => {
  return (
    <div className="relative">
      {/* Atom animation container */}
      <div className="relative hidden anim atom">
        {max === 1 && (
          <>
            <div className="h-[60px] w-[60px] absolute bg-inherit border border-[#191919] rounded-full" />
            <div className="h-[60px] w-[60px] absolute bg-inherit border border-[#191919] rounded-full" />
          </>
        )}
        {max === 2 && (
          <>
            <div className="h-[60px] w-[60px] absolute bg-inherit border border-[#191919] rounded-full" />
            <div className="h-[60px] w-[60px] absolute ml-[45px] mt-[60px] bg-inherit border border-[#191919] rounded-full" />
            <div className="h-[60px] w-[60px] absolute mr-[45px] mt-[60px] bg-inherit border border-[#191919] rounded-full" />
          </>
        )}
        {max === 3 && (
          <>
            <div className="h-[60px] w-[60px] absolute bg-inherit border border-[#191919] rounded-full" />
            <div className="h-[60px] w-[60px] absolute ml-[45px] mt-[60px] bg-inherit border border-[#191919] rounded-full" />
            <div className="h-[60px] w-[60px] absolute mr-[45px] mt-[60px] bg-inherit border border-[#191919] rounded-full" />
            <div className="h-[60px] w-[60px] absolute bottom-0 left-1/2 -translate-x-1/2 bg-inherit border border-[#191919] rounded-full" />
          </>
        )}
      </div>

      {/* State-based icon */}
      <div style={{ fill: color }}>
        {state === 1 && <OneOrb />}
        {state === 2 && <TwoOrb />}
        {state >= 3 && <ThreeOrb />}
      </div>
    </div>
  );
};


export default Player;