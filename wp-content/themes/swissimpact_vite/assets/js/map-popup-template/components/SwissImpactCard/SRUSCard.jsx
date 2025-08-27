import { h } from "preact";

const SRUSCard = ({ data }) => {
    console.log("SRUSCard data:", data);
  return (
    <div className="bg-white px-5 pb-6 flex items-center rounded-b-3xl">
      <div className="w-20"></div>
      <div className="w-full">
        <p className="text-lg mb-5 lg:text-xl xl:text-2xl pb-0 font-bold">
          {data.representationDescription}
        </p>
        {/*<div className="mt-4 grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 grid overflow-x-scroll">
          <div>
            <img
              className="w-full max-w-[120px] mr-auto"
              src="/wp-content/themes/swissimpact_vite/assets/img/si-number-map/si-dc-icon-2x.png"
            />
            <p className="mt-3">Embassy in Washington</p>
            <ul className="sr-list">
              {data.representations.map((item, index) => (
                <li key={"srus-" + index}>{item.representation}</li>
              ))}
            </ul>
          </div>

          <div>
            <img
              className="w-full max-w-[120px] mr-auto"
              src="/wp-content/themes/swissimpact_vite/assets/img/si-number-map/si-dc-icon-2x.png"
            />
            <p className="mt-3">Consulate General in</p>
            <ul className="sr-list">
              <li>New York (NY)</li>
              <li>Boston (MA)</li>
              <li>Chicago (IL)</li>
              <li>San Francisco (CA)</li>
              <li>Los Angeles (CA)</li>
              <li>Miami (FL)</li>
              <li>Houston (TX)</li>
              <li>Seattle (WA)</li>
            </ul>
          </div>

          <div>
            <img
              className="w-full max-w-[120px] mr-auto"
              src="/wp-content/themes/swissimpact_vite/assets/img/si-number-map/si-dc-icon-2x.png"
            />
            <p className="mt-3">Consulate General in</p>
            <ul className="sr-list">
              <li>New York (NY)</li>
              <li>Boston (MA)</li>
              <li>Chicago (IL)</li>
              <li>San Francisco (CA)</li>
              <li>Los Angeles (CA)</li>
              <li>Miami (FL)</li>
              <li>Houston (TX)</li>
              <li>Seattle (WA)</li>
            </ul>
          </div>

          <div>
            <img
              className="w-full max-w-[120px] mr-auto"
              src="/wp-content/themes/swissimpact_vite/assets/img/si-number-map/si-dc-icon-2x.png"
            />
            <p className="mt-3">Consulate General in</p>
            <ul className="sr-list">
              <li>New York (NY)</li>
              <li>Boston (MA)</li>
              <li>Chicago (IL)</li>
              <li>San Francisco (CA)</li>
              <li>Los Angeles (CA)</li>
              <li>Miami (FL)</li>
              <li>Houston (TX)</li>
              <li>Seattle (WA)</li>
            </ul>
          </div>

          <div>
            <img
              className="w-full max-w-[120px] mr-auto"
              src="/wp-content/themes/swissimpact_vite/assets/img/si-number-map/si-dc-icon-2x.png"
            />
            <p className="mt-3">Consulate General in</p>
            <ul className="sr-list">
              <li>New York (NY)</li>
              <li>Boston (MA)</li>
              <li>Chicago (IL)</li>
              <li>San Francisco (CA)</li>
              <li>Los Angeles (CA)</li>
              <li>Miami (FL)</li>
              <li>Houston (TX)</li>
              <li>Seattle (WA)</li>
            </ul>
          </div>
        </div>*/}
      </div>
    </div>
  );
};

export default SRUSCard;
