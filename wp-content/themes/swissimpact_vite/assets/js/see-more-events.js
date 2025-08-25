import { getFilteredData } from "./filter";
import Render from "./render-post-template";
import { addCategoryLabel } from "./scripts";

const seeMoreEvents = async (props) => {
  let container;

  if (props.event == "upcoming") {
    container = document.querySelector(".upcoming-post-wrapper");
  } else if (props.event == "past") {
    container = document.querySelector(".past-post-wrapper");
  } else {
    console.log("System Error, please refresh the page");
    return;
  }

  // Store the current displayed posts
  const containerInnerHtml = container.innerHTML.toString();
  const containerOG = container;

  // get the container parent
  container = container.parentElement;

  if (!container.getAttribute("data-page")) {
    container.setAttribute("data-page", 1);
  }

  container.setAttribute(
    "data-page",
    parseInt(container.getAttribute("data-page")) + 1
  );

  await getFilteredData(container).then((postData) => {
    // render the returned data
    Render(postData, container.querySelector(".category-filter"));

    // add the existing posts to the top of the fetched results
    containerOG.insertAdjacentHTML("afterbegin", containerInnerHtml);

    // Add label to categoryies
    addCategoryLabel();
  });
};

export default seeMoreEvents;
