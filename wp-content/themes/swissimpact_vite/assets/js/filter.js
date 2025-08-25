import getPostData from "./fetch-post.js";
import Render from "./render-post-template.jsx";
import { addCategoryLabel } from "./scripts.js";

const addFilter = () => {
  const categoryFilters = document.querySelectorAll(".filter-category");
  const tagFilters = document.querySelectorAll(".filter-tags");

  tagFilters.forEach((tagFilter) => {
    // select all tag filters and add listner to toggle dropdown
    tagFilter
      .querySelector(".filter-header")
      .addEventListener("click", function () {
        tagFilter.querySelector(".filter-dropdown").classList.toggle("hidden");
      });

    tagFilter
      ?.querySelectorAll(".filter-dropdown input")
      .forEach((tagInput) => {
        tagInput.addEventListener("change", function () {
          let container =
            tagInput.parentElement.parentElement.parentElement.parentElement
              .parentElement.parentElement.parentElement;

          // reset page
          container.setAttribute("data-page", 1);

          getFilteredData(container).then((postData) => {
            // render the returned data
            Render(postData, tagFilter);

            // Add label to categoryies
            addCategoryLabel();
          });
        });
      });
  });

  categoryFilters.forEach((categoryFilter) => {
    // select all category and add listner to toggle dropdown
    categoryFilter
      .querySelector(".filter-header")
      .addEventListener("click", function () {
        categoryFilter
          .querySelector(".filter-dropdown")
          .classList.toggle("hidden");
      });

    // on input change, filter the data
    categoryFilter?.querySelectorAll("input").forEach((categoryInput) => {
      categoryInput.addEventListener("change", function () {
        let container =
          categoryInput.parentElement.parentElement.parentElement.parentElement
            .parentElement.parentElement.parentElement;

        // reset page
        container.setAttribute("data-page", 1);

        getFilteredData(container).then((postData) => {
          // render the returned data
          Render(postData, categoryFilter);

          // Add label to categoryies
          addCategoryLabel();
        });
      });
    });
  });

  // hide filter dropdown when clicked outside the filter
  document.addEventListener("click", function (ev) {
    if (
      !ev.target.classList.contains("text-base") &&
      !ev.target.classList.contains("w-5") &&
      !ev.target.classList.contains("filter-header") &&
      !ev.target.classList.contains("filter-dropdown") &&
      ev.target.type != "checkbox"
    ) {
      const activeDropdowns = document.querySelectorAll(".filter-dropdown");
      activeDropdowns.forEach((dropdown) => {
        if (!dropdown.classList.contains("hidden")) {
          dropdown.classList.add("hidden");
        }
      });
    }
  });
};

// get the filtered data
const getFilteredData = async (container) => {
  let param = {};

  // get categories if cateogry filter exists and input elements checked
  let categoryFilter = container.querySelector(".filter-category");

  // push all checked category slugs
  let categorySlug = [];

  categoryFilter?.querySelectorAll("input").forEach((categoryInputInner) => {
    if (categoryInputInner.checked) {
      categorySlug.push(categoryInputInner.getAttribute("name"));
    }
  });

  // get tags if tag filter exists and input elements checked
  let tagFilter = container.querySelector(".filter-tags");

  // push all tag slugs
  let tagSlug = [];

  tagFilter?.querySelectorAll("input").forEach((tagInputInner) => {
    if (tagInputInner.checked) {
      tagSlug.push(tagInputInner.getAttribute("name"));
    }
  });

  // if on tag page get push the default tag on filter select
  if (categoryFilter?.getAttribute("data-tag")) {
    tagSlug.push(categoryFilter.getAttribute("data-tag"));
  }

  // if on a category page push the default category on filter select
  if (tagFilter?.getAttribute("data-category")) {
    categorySlug.push(tagFilter.getAttribute("data-category"));
  }

  if (categorySlug.length > 0) {
    param.category = categorySlug;
  }

  if (tagSlug.length > 0) {
    param.tags = tagSlug;
  }

  // get the type of event {past or upcoming}
  param.event = container.id == "past-events" ? "past" : "upcoming";

  // get the page number for the retrieved posts and add it to args
  param.page = container.getAttribute("data-page")
    ? container.getAttribute("data-page")
    : 1;

  // check if filter on search page
  if (tagFilter?.hasAttribute("data-search")) {
    param.search = true;
  }

  // get filtered post
  return await getPostData(param);
};

export { addFilter, getFilteredData };
