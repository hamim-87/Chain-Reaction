interface TwoOrbProps {
  color?: string;
}

const TwoOrb = ({ color = 'fill-inherit' }: TwoOrbProps) => {
  return (
    <svg
      className={`w-[26px] ${color} mt-1 p-[3px]`}
      viewBox="0 0 82 90"
    >
      <g>
        {/* Second Circle (right/bottom) */}
        <g>
          <circle cx="52" cy="60" r="29.5" />
          <path
            className="fill-[#191919]"
            d="M52,31c15.99,0,29,13.01,29,29s-13.01,29-29,29-29-13.01-29-29,13.01-29,29-29
               m0-1c-16.57,0-30,13.43-30,30s13.43,30,30,30,30-13.43,30-30-13.43-30-30-30h0Z"
          />
        </g>
        {/* Second Circle (right/bottom) */}
        <g>
          <circle cx="30" cy="30" r="29.5" />
          <path
            className="fill-[#191919]"
            d="M30,1c15.99,0,29,13.01,29,29s-13.01,29-29,29S1,45.99,1,30,14.01,1,30,1
               m0-1C13.43,0,0,13.43,0,30s13.43,30,30,30,30-13.43,30-30S46.57,0,30,0h0Z"
          />
        </g>
      </g>
    </svg>
  );
};

export default TwoOrb;