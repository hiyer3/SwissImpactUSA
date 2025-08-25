import { h } from "preact";

const PopupSearchInput = (props) => {
    
  return (
    <div className="popup-search-input-wrapper">
      {
        <input
          className="popup-search-input-field"
          onInput={props.onChange}
          type="text"
          placeholder=""
        />
      }
    </div>
  );
};

export default PopupSearchInput;
