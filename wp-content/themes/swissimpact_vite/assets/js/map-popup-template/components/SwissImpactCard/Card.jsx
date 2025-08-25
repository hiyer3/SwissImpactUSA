import { h } from "preact";

const Card = ({ children, style }) => {
  return (
    <div style={style} className="si-popup-card bg-white rounded-3xl p-5">
      {children}
    </div>
  );
};

export default Card;
