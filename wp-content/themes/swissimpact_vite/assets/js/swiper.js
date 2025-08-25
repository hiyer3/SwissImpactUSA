// Import Swiper and modules
import Swiper, { Navigation, Pagination, Scrollbar } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

// Now you can use Swiper
const swiper = new Swiper(".slider", {
  // Install modules
  modules: [Navigation, Pagination, Scrollbar],
  speed: 500,
  spaceBetween: 20,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  // ...
});

const postGalleries = document.querySelectorAll(
  ".post-content .wp-block-gallery"
);
postGalleries.forEach((gallery) => {
  const gallerySlider = document.createElement("div");
  gallerySlider.id = "gallery-slider";

  const swiperWrapper = document.createElement("div");
  swiperWrapper.classList.add("swiper-wrapper");
  const galleryChildren = gallery.children;

  for (let i = 0; i < galleryChildren.length; i++) {
    const swiperSlide = document.createElement("div");
    swiperSlide.classList.add("swiper-slide");
    swiperSlide.innerHTML = galleryChildren[i].outerHTML;
    swiperWrapper.append(swiperSlide);
  }

  gallerySlider.append(swiperWrapper);

  //next button
  const nextButton = document.createElement("div");
  nextButton.classList.add("post-swiper-button-next");
  //prev button
  const prevButton = document.createElement("div");
  prevButton.classList.add("post-swiper-button-prev");
  //pagination
  const swiperPagination = document.createElement("div");
  swiperPagination.classList.add("swiper-pagination");
  //scrollbar
  const swiperScrollbar = document.createElement("div");
  swiperScrollbar.classList.add("swiper-scrollbar");

  gallerySlider.append(nextButton);
  gallerySlider.append(prevButton);
  gallerySlider.append(swiperPagination);
  gallerySlider.append(swiperScrollbar);

  gallery.innerHTML = "";
  gallery.append(gallerySlider);
  //document.querySelector(".post-content").append(gallerySlider);

  //create popup
  const popup = document.createElement("div");
  popup.classList.add("lightbox");
  const popupImg = document.createElement("img");
  const closePopup = document.createElement("a");
  closePopup.href = "javascript:void(0);";
  closePopup.innerHTML = "&#x2715;";
  closePopup.classList.add("close-lightbox");
  closePopup.addEventListener("click", function () {
    popup.classList.remove("active");
    popupImg.src = "";
  });
  popup.append(popupImg);
  popup.append(closePopup);
  gallerySlider.append(popup);

  // gallery slide on click
  gallerySlider.querySelectorAll(".wp-block-image img").forEach((slideImg) => {
    slideImg.addEventListener("click", function () {
      console.log("click");
      popup.classList.add("active");
      popupImg.src = slideImg.getAttribute("src");
    });
  });
});

const postswiper = new Swiper("#gallery-slider ", {
  // Install modules
  modules: [Navigation, Pagination, Scrollbar],
  speed: 500,
  spaceBetween: 20,
  slidesPerView: 2,
  navigation: {
    nextEl: ".post-swiper-button-next",
    prevEl: ".post-swiper-button-prev",
  },
  scrollbar: {
    el: ".swiper-scrollbar",
    draggable: true,
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
      spaceBetween: 20,
      scrollbar: false,
      pagination: {
        el: ".swiper-pagination",
        type: "bullets",
      },
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 30,
    },
  },
});
