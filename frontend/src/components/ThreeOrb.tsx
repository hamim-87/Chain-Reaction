interface ThreeOrbProps {
  color?: string;
}

const ThreeOrb = ({ color = 'fill-inherit' }: ThreeOrbProps) => {
  return (
    <svg
      className={`w-[33px] ${color} mt-1 p-[3px]`}
      viewBox="0 0 104 90"
    >
      <g id="Layer_1-2">
        {/* Right Circle */}
        <g>
          <circle cx="74" cy="60" r="29.5" />
          <path
            className="fill-[#191919]"
            d="M74,31c15.99,0,29,13.01,29,29s-13.01,29-29,29-29-13.01-29-29,13.01-29,29-29
               m0-1c-16.57,0-30,13.43-30,30s13.43,30,30,30,30-13.43,30-30-13.43-30-30-30h0Z"
          />
        </g>

        {/* Left Circle */}
        <g>
          <circle cx="30" cy="60" r="29.5" />
          <path
            className="fill-[#191919]"
            d="M30,31c15.99,0,29,13.01,29,29s-13.01,29-29,29S1,75.99,1,60,14.01,31,30,31
               m0-1C13.43,30,0,43.43,0,60s13.43,30,30,30,30-13.43,30-30-13.43-30-30-30h0Z"
          />
        </g>

        {/* Top Circle */}
        <g>
          <circle cx="52" cy="30" r="29.5" />
          <path
            className="fill-[#191919]"
            d="M52,1c15.99,0,29,13.01,29,29s-13.01,29-29,29-29-13.01-29-29S36.01,1,52,1
               m0-1c-16.57,0-30,13.43-30,30s13.43,30,30,30,30-13.43,30-30S68.57,0,52,0h0Z"
          />
        </g>
      </g>
    </svg>
  );
};

export default ThreeOrb;