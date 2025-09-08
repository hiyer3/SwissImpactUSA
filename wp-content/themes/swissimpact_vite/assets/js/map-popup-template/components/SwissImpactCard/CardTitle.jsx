import { h } from "preact";

const CardTitle = ({
  title,
  imageURL,
  alt,
  iconWidth = 110,
  iconPadding = 12,
}) => {
  return (
    <div className="flex items-center">
      <div className="max-w-[80px] w-full" style={{ paddingRight: iconPadding + "px" }}>
        <img style={{ width: iconWidth + "px" }} className="max-w-full" src={imageURL} alt={alt} />
      </div>
      <div>
        <p className="text-[30px] leading-[1.1] pb-0 font-bold">{title}</p>
      </div>
    </div>
  );
};

export default CardTitle;
