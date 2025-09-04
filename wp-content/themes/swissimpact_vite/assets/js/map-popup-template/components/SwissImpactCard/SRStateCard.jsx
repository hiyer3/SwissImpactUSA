import { h } from "preact";

const SRStateCard = ({ data }) => {
  return (
    <div className="bg-white px-5 pb-6 flex items-center rounded-b-3xl">
      <div className="w-20"></div>
      <div className="w-full">
        <div className="max-h-[360px] h-full overflow-y-auto">
          <ul className="sr-list mt-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 grid">
            {data?.map((item, index) => (
              <li key={"srstate-" + index}>
                {item?.type_of_representation_link ? (
                  <a
                    target="_blank"
                    href={item.type_of_representation_link.url}
                  >
                    {item?.representation}
                  </a>
                ) : (
                  item?.representation
                )}
              </li>
            ))}
          </ul> 
        </div>
      </div>
    </div>
  );
};

export default SRStateCard;
