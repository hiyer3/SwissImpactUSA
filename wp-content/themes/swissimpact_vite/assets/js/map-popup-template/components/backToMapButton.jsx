import { h } from 'preact';

const BackToMapButton = () => {
  return (
    <div className="back-to-map-button hidden lg:block">
      <button
        className="flex items-center gap-2 text-white bg-swissred px-4 py-2 rounded hover:bg-swissred-dark transition-colors"
        onClick={() => {
          document.querySelector(".data-popup").classList.add("hidden");
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="87.082"
          height="32.914"
          viewBox="0 0 87.082 32.914"
        >
          <g
            id="Group_127"
            data-name="Group 127"
            transform="translate(-1267.144 -592.983)"
          >
            <g
              id="Group_172"
              data-name="Group 172"
              transform="translate(1267.144 592.983)"
            >
              <path
                id="Polygon_1"
                data-name="Polygon 1"
                d="M16.247,0,32.493,17.957H0Z"
                transform="translate(0 32.493) rotate(-90)"
                fill="#fff"
              />
              <g
                id="Group_127-2"
                data-name="Group 127"
                transform="translate(25.53 0.855)"
              >
                <text
                  id="BACK_TO_MAP"
                  data-name="BACK TO MAP"
                  transform="translate(-0.448 12.059)"
                  fill="#fff"
                  font-size="16"
                  font-family="Helvetica"
                >
                  <tspan x="0" y="0">
                    BACK{" "}
                  </tspan>
                  <tspan x="0" y="16">
                    TO MAP
                  </tspan>
                </text>
              </g>
            </g>
          </g>
        </svg>
      </button>
    </div>
  );
};

export default BackToMapButton;