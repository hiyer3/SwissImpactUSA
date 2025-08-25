import { h } from "preact";

const CardStatNumber = ({ number = 0, style = {} }) => {
  return (
    <div style={style} className="text-[60px] lg:text-[80px] leading-[1.1]  xl:text-[100px] mx-auto font-bold">
      {number}
    </div>
  );
};

export default CardStatNumber;