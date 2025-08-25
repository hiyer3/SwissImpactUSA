// main entry point
// include your assets here

// get styles
import "./assets/css/styles.css";

// preact 
import {h, render} from "preact";
import htm from "htm";

// get scripts
import "./assets/js/scripts.js";
import "./assets/js/swiper.js";
import preloadar from "preloadar";
import { addFilter } from "./assets/js/filter.js";
import seeMoreEvents from "./assets/js/see-more-events.js";
import SIMapControl from "./assets/js/si-map.jsx";

document.querySelector("#root").innerHTML = ``;
const html = htm.bind(h);

preloadar.run().auto("#preloadar", {
  animation: "custom",
  bgColor: "#dc0018",
  onComplete: () => { 
    // Do something here
    document.querySelector(".main-content").style.display = "block";

    if (window.location.hash) {
      // Get the target element based on the href attribute
      const targetElement = document.querySelector(window.location.hash);

      // Get the target position relative to the viewport
      const targetPosition = targetElement.getBoundingClientRect().top;

      //get the height of the header
      const offsetHeight = document.querySelector("nav").offsetHeight;

      //check if wpadminbar is active and add the offset if yes
      const wpadminbar = document.querySelector("#wpadminbar")
        ? document.querySelector("#wpadminbar").offsetHeight
        : 0;

      // Scroll to the target element with smooth behavior and offset
      window.scrollTo({
        top: targetPosition + window.pageYOffset - offsetHeight - wpadminbar,
        behavior: "smooth",
      });
    }
  },
});

// add filter functions
addFilter();

// see more events
document.querySelectorAll(".see-more-events").forEach((seeMoreBtn) => {
  seeMoreBtn.addEventListener("click", function () {
    seeMoreBtn.classList.add("disabled");
    let btntext = seeMoreBtn.text;
    seeMoreBtn.text = "LOADING...";
    seeMoreEvents({ event: seeMoreBtn.getAttribute("data-event") }).then(() => {
      seeMoreBtn.text = btntext;
      seeMoreBtn.classList.remove("disabled");
    });
  });
});

// search
document.querySelector(".search-icon").addEventListener("click", function () {
  let searchBar = document.querySelector(".search-bar");
  if (searchBar.value && searchBar.value != "" && !searchBar.disabled) {
    window.location.replace(
      window.location.protocol +
        "//" +
        window.location.hostname +
        "?s=" +
        searchBar.value
    );
  } else {
    document.querySelector(".search-bar").classList.toggle("active");

    if (!document.querySelector(".search-bar").classList.contains("active")) {
      document.querySelector(".search-bar").setAttribute("disabled", true);
      document.querySelector(".search-bar").removeAttribute("enabled");
    } else {
      document.querySelector(".search-bar").setAttribute("enabled", true);
      document.querySelector(".search-bar").removeAttribute("disabled");
    }
  }
});

document
  .querySelector(".search-bar")
  .addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      document.querySelector(".search-icon").click();
    }
  });

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const search = urlParams.get("s");

if (search) {
  document.querySelector("input[name='s']").value = search;
}

const form_email = urlParams.get("email");
if (form_email) {
  let gravity_form_email_container = document.querySelector(
    ".ginput_container_email"
  );

  if (gravity_form_email_container) {
    gravity_form_email_container.querySelector("input").readOnly = true;
  }
}

const categories = urlParams.get("cat")?.split(",");
categories?.forEach((category) => {
  document
    .querySelectorAll(".filter-category .filter-dropdown input")
    .forEach((input) => {
      if (input.getAttribute("name") == category) {
        input.checked = true;
      }
    });
});

const tags = urlParams.get("tags")?.split(",");
tags?.forEach((tag) => {
  document
    .querySelectorAll(".filter-tags .filter-dropdown input")
    .forEach((input) => {
      if (input.getAttribute("name") == tag) {
        input.checked = true;
      }
    });
});

// scroll into view

// Get all anchor links on the page
const anchorLinks = document.querySelectorAll('a[href^="#"]');

// Add click event listener to each anchor link
anchorLinks.forEach((anchorLink) => {
  anchorLink.addEventListener("click", (event) => {
    // Prevent the default behavior of the link
    event.preventDefault();

    // Get the target element based on the href attribute
    const targetElement = document.querySelector(
      anchorLink.getAttribute("href")
    );

    // Get the target position relative to the viewport
    const targetPosition = targetElement.getBoundingClientRect().top;

    //get the height of the header
    const offsetHeight = document.querySelector("nav").offsetHeight;

    //check if wpadminbar is active and add the offset if yes
    const wpadminbar = document.querySelector("#wpadminbar")
      ? document.querySelector("#wpadminbar").offsetHeight
      : 0;

    // Scroll to the target element with smooth behavior and offset
    window.scrollTo({
      top: targetPosition + window.pageYOffset - offsetHeight - wpadminbar,
      behavior: "smooth",
    });
  });
});

// nav logo hide on load functionality on homepage

const homepage = document.querySelector("body.home");
const navLogoWrapper = document.querySelector(".nav-logo-wrapper");

if (homepage) {
  const navbar = document.querySelector("nav");
  const header = document.querySelector("header");

  window.addEventListener("scroll", function () {
    if (window.pageYOffset > header.offsetHeight - navbar.offsetHeight) {
      navLogoWrapper.classList.add("active");
    } else {
      navLogoWrapper.classList.remove("active");
    }
  });
} else {
  navLogoWrapper.classList.add("active");
}

//share button click handler

const shareButton = document.querySelector(".nav-share-icon");
const shareIconWrapper = document.querySelector(".share-icon-wrapper");

shareButton?.addEventListener("click", function (ev) {
  ev.preventDefault();
  shareButton.classList.toggle("active");
  shareIconWrapper.classList.toggle("active");
});

// Initialize the map control on the Swiss Impact by the Numbers page
const container = document.querySelector(".popup-content-wrapper");
render(html`<${SIMapControl} />`, container);
  