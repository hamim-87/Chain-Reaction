interface OneOrbProps {
    color?: string;

}

export const OneOrb = ({color = 'fill-inherit'}: OneOrbProps) => {
    return (
        <svg
            className={`w-[18.9px] mt-1 p-[3px] ${color}`}
            viewBox="0 0 60 60"
        >
            <g>
                <g>
                    <circle
                        className={`${color}`}
                        cx="30"
                        cy="30"
                        r="29.5"
                    />
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

export default OneOrb;