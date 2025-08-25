module.exports = {
  content: [
    // https://tailwindcss.com/docs/content-configuration
    "./*.php",
    "./assets/js/render-post-template.js",
    "./inc/**/*.php",
    "./template-parts/*.php",
    "./templates/**/*.php",
    "./safelist.txt",
    "./assets/js/**/*.js",
    "./assets/js/**/**/*.jsx",
    //'./**/*.php', // recursive search for *.php (be aware on every file change it will go even through /node_modules which can be slow, read doc)
  ],
  safelist: [
    "text-center",
    //{
    //  pattern: /text-(white|black)-(200|500|800)/
    //}
  ],
  theme: {
    extend: {
      spacing: {
        swiper: "500px",
      },
      maxHeight: {
        "max-h-50": "300px",
      },
      minHeight: {
        "half-screen": "50vh",
        "sm-custom": "60vh",
        auto: "100%",
      },
      backgroundPosition: {
        "pos-strips": "-400px",
      },
      backgroundSize: {
        auto: "auto",
        cover: "cover",
        contain: "contain",
        "size-strips": "110%",
      },
    },
    colors: {
      transparent: "transparent",
      white: "#fff",
      black: "#000",
      swissred: "#dc0018",
    },
  },
  plugins: [],
  variants: {
    extend: {
      display: ["group-hover"],
    },
  },
};
