import { h } from "preact";

const CardContent = ({ description, children, type }) => {
  return (
    <div className="flex items-center">
      <div className="w-20"></div>
      <div className={`flex ${type === "fullWidth" ? "flex-col" : "gap-7"} mt-4 items-center`}>
        <p
          style={{ lineHeight: "1.1" }}
          className={`text-lg lg:text-xl xl:text-2xl pb-0 font-bold ${
            type === "fullWidth" ? "max-w-full" : "max-w-[200px]"
          }`}
        >
          {description}
        </p>
        {children}
      </div>
    </div>
  );
};

export default CardContent;
