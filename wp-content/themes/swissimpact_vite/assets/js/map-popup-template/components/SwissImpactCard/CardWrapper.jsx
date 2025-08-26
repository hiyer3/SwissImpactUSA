import { h } from "preact";

const CardWrapper = ({ children, cols = 1, style }) => {
  return (
    <div
      className={`grid grid-cols-1 ${
        cols === 1 ? "" : "sm:grid-cols-2"
      } gap-5 pb-5`}
      style={style}
    >
      {children}
    </div>
  );
};

export default CardWrapper;
 