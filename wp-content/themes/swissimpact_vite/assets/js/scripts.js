document.addEventListener("DOMContentLoaded", function () {
  // Handler when the DOM is fully loaded

  // Navigation Menu Handler
  const navButton = document.querySelector("header .menu");
  const dropdownMenuWrapper = document.querySelector("header .dropdown");
  navButton.addEventListener("click", () => {
    navButton.classList.toggle("active");
    dropdownMenuWrapper.classList.toggle("visible");
    document.body.classList.toggle("navActive");
  });

  // Navigation dropdown menu on items hover
  const dropdownMenu = document.querySelector(
    "header .dropdown ul:not(.sub-menu)"
  );
  const dropdownMenuItems = dropdownMenu.querySelectorAll("li > a");

  dropdownMenuItems.forEach((dropdownMenuItem) => {
    dropdownMenuItem.addEventListener("mouseover", (event) => {
      dropdownMenuItems.forEach((dropdownMenuItem) => {
        //dropdownMenuItem.classList.remove("hover");
      });

      //event.currentTarget.classList.add("hover");
    });

    /*dropdownMenuItem.addEventListener("mouseout", (event) => {
      event.currentTarget.classList.remove("hover");
    });*/
  });

  // On scroll Navbar
  const isMinimalHeader = document.querySelector("header").classList.contains("minimum-header");
  const navbar = document.querySelector("header nav");

  window.addEventListener("scroll", function (ev) {
    let top =
      (window.pageYOffset || document.scrollTop) - (document.clientTop || 0);

    if (
      top >= 1 &&
      !document.querySelector("body").classList.contains("single") && !isMinimalHeader
    ) {
      if (top <= 100) {
        navbar.classList.add("scrolling");
        document.documentElement.style.setProperty("--alpha", top / 100);
      } else {
        document.documentElement.style.setProperty("--alpha", 1);
      }
    } else {
      if (document.querySelector("body").classList.contains("single")) {
        navbar.classList.add("scrolling");
        document.documentElement.style.setProperty("--alpha", 1);
      } else {
        navbar.classList.remove("scrolling");
      }
    }
  });

  if (document.querySelector("body").classList.contains("single")) {
    navbar.classList.add("scrolling");
    document.documentElement.style.setProperty("--alpha", 1);
  }

  // swiss impact category handler
  const experienceSwissImpact = document.getElementById(
    "experience-swiss-impact"
  );

  if (experienceSwissImpact) {
    const experienceSwissImpactCategories = document.querySelectorAll(
      "#experience-swiss-impact a"
    );

    experienceSwissImpactCategories.forEach((category) => {
      category.addEventListener("mouseenter", function () {
        if (window.innerWidth > 991) {
          experienceSwissImpact.classList.add("item-active");
          experienceSwissImpact
            .querySelector(".attribute")
            .classList.add("active");
          category.querySelectorAll("img")[1].classList.add("floating");
          category.querySelectorAll("img").forEach((catImage) => {
            catImage.classList.toggle("hidden");
          });
        }
      });
    });

    experienceSwissImpactCategories.forEach((category) => {
      category.addEventListener("mouseleave", function () {
        if (window.innerWidth > 991) {
          experienceSwissImpact.classList.remove("item-active");
          experienceSwissImpact
            .querySelector(".attribute")
            .classList.remove("active");
          category.querySelectorAll("img")[1].classList.remove("floating");
          category.querySelectorAll("img").forEach((catImage) => {
            catImage.classList.toggle("hidden");
          });
        }
      });
    });

    /*window.addEventListener("resize", function () {
      onResizeWindowSwissImpact();
    });*/

    //onResizeWindowSwissImpact();

    function onResizeWindowSwissImpact() {
      if (window.innerWidth < 768) {
        experienceSwissImpactCategories.forEach((category) => {
          category.querySelectorAll("img")[0].classList.remove("hidden");
          category.querySelectorAll("img")[0].classList.add("hidden");
          category.querySelectorAll("img")[1].classList.remove("hidden");
          category.querySelectorAll("img")[1].classList.add("block");
        });
      } else {
        experienceSwissImpact.classList.remove("item-active");
        experienceSwissImpactCategories.forEach((category) => {
          category.querySelectorAll("img")[0].classList.remove("hidden");
          category.querySelectorAll("img")[0].classList.add("block");
          category.querySelectorAll("img")[1].classList.remove("block");
          category.querySelectorAll("img")[1].classList.add("hidden");
        });
      }
    }
  }

  const navMenu = document.querySelector("header .dropdown .nav-menu");

  if (navMenu) {
    const listItems = navMenu.querySelectorAll("li");
    listItems.forEach((listItem) => {
      const subMenu = listItem.querySelector(".sub-menu");

      if (subMenu) {
        listItem.querySelector("a").classList.add("has-dropdown");
        listItem
          .querySelector("a")
          .addEventListener("mouseenter", function (ev) {
            ev.preventDefault();

            listItems.forEach((item) => {
              item.querySelector("a").classList.remove("hover");
              navMenu.querySelectorAll(".sub-menu").forEach((reSubMenu) => {
                reSubMenu.classList.remove("hover");
              });
            });

            listItem.querySelector("a").classList.add("hover");
            subMenu.classList.add("hover");
          });
      } else {
        listItem
          .querySelector("a")
          .addEventListener("mouseenter", function (ev) {
            if (
              !ev.target.parentElement.parentElement.classList.contains(
                "sub-menu"
              )
            ) {
              listItems.forEach((item) => {
                item.querySelector("a").classList.remove("hover");
                navMenu.querySelectorAll(".sub-menu").forEach((reSubMenu) => {
                  reSubMenu.classList.remove("hover");
                });
              });
              listItem.querySelector("a").classList.add("hover");
            }
          });
      }
    });
  }

  // social icon attr change

  document
    .querySelectorAll(
      ".wp-block-social-links:not(.is-style-logos-only) .wp-social-link-facebook svg"
    )
    .forEach((svgim) => {
      svgim.setAttribute("viewBox", "0 0 14222 14222");
      svgim
        .querySelector("path")
        .setAttribute(
          "d",
          "M9879 9168l315-2056H8222V5778c0-562 275-1111 1159-1111h897V2917s-814-139-1592-139c-1624 0-2686 984-2686 2767v1567H4194v2056h1806v4969c362 57 733 86 1111 86s749-30 1111-86V9168z"
        );
    });

  document
    .querySelectorAll(
      ".wp-block-social-links:not(.is-style-logos-only) .wp-social-link-twitter svg"
    )
    .forEach((svgim) => {
      svgim.setAttribute("viewBox", "0 0 248 204");
      svgim.style.width = "20px";
      svgim.style.height = "20px";
      svgim
        .querySelector("path")
        .setAttribute(
          "d",
          "M221.95 51.29c.15 2.17.15 4.34.15 6.53 0 66.73-50.8 143.69-143.69 143.69v-.04c-27.44.04-54.31-7.82-77.41-22.64 3.99.48 8 .72 12.02.73 22.74.02 44.83-7.61 62.72-21.66-21.61-.41-40.56-14.5-47.18-35.07 7.57 1.46 15.37 1.16 22.8-.87-23.56-4.76-40.51-25.46-40.51-49.5v-.64c7.02 3.91 14.88 6.08 22.92 6.32C11.58 63.31 4.74 33.79 18.14 10.71c25.64 31.55 63.47 50.73 104.08 52.76-4.07-17.54 1.49-35.92 14.61-48.25 20.34-19.12 52.33-18.14 71.45 2.19 11.31-2.23 22.15-6.38 32.07-12.26-3.77 11.69-11.66 21.62-22.2 27.93 10.01-1.18 19.79-3.86 29-7.95-6.78 10.16-15.32 19.01-25.2 26.16z"
        );
    });

  document
    .querySelectorAll(
      ".wp-block-social-links:not(.is-style-logos-only) .wp-social-link-linkedin svg"
    )
    .forEach((svgim) => {
      svgim.setAttribute("viewBox", "4 3 15 17");
      svgim
        .querySelector("path")
        .setAttribute(
          "d",
          "M 19.7 3 M 8.3 18.3 H 5.7 V 9.7 H 8.4 V 18.3 z M 7 8.6 C 6.1 8.6 5.5 7.9 5.5 7.1 c 0 -0.9 0.7 -1.5 1.5 -1.5 c 0.9 0 1.5 0.7 1.5 1.5 C 8.6 7.9 7.9 8.6 7 8.6 z M 18.3 18.3 h -2.7 v -4.2 c 0 -1 0 -2.3 -1.4 -2.3 c -1.4 0 -1.6 1.1 -1.6 2.2 v 4.2 h -2.7 v -8.6 h 2.6 v 1.2 h 0 c 0.4 -0.7 1.2 -1.4 2.5 -1.4 c 2.7 0 3.2 1.8 3.2 4.1 V 18.3 z"
        );
    });

  document
    .querySelectorAll(
      ".wp-block-social-links:not(.is-style-logos-only) .wp-social-link-instagram svg"
    )
    .forEach((svgim) => {
      svgim.setAttribute("viewBox", "20 20 220 220");
      svgim.style.width = "20px";
      svgim.style.height = "20px";
      svgim
        .querySelector("path")
        .setAttribute(
          "d",
          "M160,128a32,32,0,1,1-32-32A32.03667,32.03667,0,0,1,160,128Zm68-44v88a56.06353,56.06353,0,0,1-56,56H84a56.06353,56.06353,0,0,1-56-56V84A56.06353,56.06353,0,0,1,84,28h88A56.06353,56.06353,0,0,1,228,84Zm-52,44a48,48,0,1,0-48,48A48.05436,48.05436,0,0,0,176,128Zm16-52a12,12,0,1,0-12,12A12,12,0,0,0,192,76Z"
        );
    });

  document
    .querySelectorAll(
      ".wp-block-social-links:not(.is-style-logos-only) .wp-social-link-tiktok svg"
    )
    .forEach((svgim) => {
      svgim.setAttribute("viewBox", "-40 -30 500 550");
      svgim.style.width = "20px";
      svgim.style.height = "20px";
      svgim
        .querySelector("path")
        .setAttribute(
          "d",
          "M412.19,118.66a109.27,109.27,0,0,1-9.45-5.5,132.87,132.87,0,0,1-24.27-20.62c-18.1-20.71-24.86-41.72-27.35-56.43h.1C349.14,23.9,350,16,350.13,16H267.69V334.78c0,4.28,0,8.51-.18,12.69,0,.52-.05,1-.08,1.56,0,.23,0,.47-.05.71,0,.06,0,.12,0,.18a70,70,0,0,1-35.22,55.56,68.8,68.8,0,0,1-34.11,9c-38.41,0-69.54-31.32-69.54-70s31.13-70,69.54-70a68.9,68.9,0,0,1,21.41,3.39l.1-83.94a153.14,153.14,0,0,0-118,34.52,161.79,161.79,0,0,0-35.3,43.53c-3.48,6-16.61,30.11-18.2,69.24-1,22.21,5.67,45.22,8.85,54.73v.2c2,5.6,9.75,24.71,22.38,40.82A167.53,167.53,0,0,0,115,470.66v-.2l.2.2C155.11,497.78,199.36,496,199.36,496c7.66-.31,33.32,0,62.46-13.81,32.32-15.31,50.72-38.12,50.72-38.12a158.46,158.46,0,0,0,27.64-45.93c7.46-19.61,9.95-43.13,9.95-52.53V176.49c1,.6,14.32,9.41,14.32,9.41s19.19,12.3,49.13,20.31c21.48,5.7,50.42,6.9,50.42,6.9V131.27C453.86,132.37,433.27,129.17,412.19,118.66Z"
        );
    });
});

//single category hover
export const addCategoryLabel = () => {
  const singleCategories = document.querySelectorAll(".single-category");

  singleCategories.forEach((singleCategory) => {
    singleCategory.removeEventListener("mouseover", () => {});
    singleCategory.removeEventListener("mouseleave", () => {});
  });

  singleCategories.forEach((singleCategory) => {
    singleCategory.addEventListener("mouseover", () => {
      singleCategory.querySelector("span").style.display = "inline-block";
      setTimeout(() => {
        singleCategory.querySelector("span").classList.add("show");
      }, 200);
    });

    singleCategory.addEventListener("mouseleave", () => {
      singleCategory.querySelector("span").style.display = "none";
      singleCategory.querySelector("span").classList.remove("show");
    });
  });
};

addCategoryLabel();
