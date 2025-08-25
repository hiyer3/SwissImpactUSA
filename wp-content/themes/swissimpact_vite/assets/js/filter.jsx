import getPostData from "./fetch-post.js";
import { h, render } from "preact";
import htm from "htm";

const addFilter = () => {
  // Initialize htm with Preact
  const html = htm.bind(h);

  const filterHeader = document.querySelector(".filter-header");
  const categoryFilters = document.querySelectorAll(".filter-category");
  const tagFilters = document.querySelectorAll(".filter-tags");

  tagFilters.forEach((tagFilter) => {
    tagFilter
      .querySelector(".filter-header")
      .addEventListener("click", function () {
        tagFilter.querySelector(".filter-dropdown").classList.toggle("hidden");
      });

    let tagSlug = [];
    let tagSlugName = [];

    tagFilter
      ?.querySelectorAll(".filter-dropdown input")
      .forEach((tagInput) => {
        tagInput.addEventListener("change", function () {
          tagSlug = [];
          tagSlugName = [];
          tagFilter.querySelectorAll("input").forEach((tagInputInner) => {
            if (tagInputInner.checked) {
              tagSlug.push(tagInputInner.getAttribute("name"));
              tagSlugName.push(tagInputInner.getAttribute("data-tag-name"));
            }
          });

          if (tagFilter.getAttribute("data-tag")) {
            tagSlug.push(tagFilter.getAttribute("data-category"));
          }

          let param = { tags: tagSlug, tagsName: tagSlugName };

          // get categories if selected
          let categoryFilter =
            tagFilter.parentElement.querySelector(".filter-category");
          if (categoryFilter) {
            let categorySlug = [];
            categoryFilter
              .querySelectorAll("input")
              .forEach((categoryInputInner) => {
                if (categoryInputInner.checked) {
                  categorySlug.push(categoryInputInner.getAttribute("name"));
                }
              });

            if (categorySlug.length > 0) {
              param.category = categorySlug;
            }
          }

          let event = tagFilter?.getAttribute("data-event");
          param.event = event;

          //check if filter on search page
          if (tagFilter?.hasAttribute("data-search")) {
            param.search = true;
          }

          let page = tagFilter.getAttribute("data-page")
            ? tagFilter.getAttribute("data-page")
            : 1;

          if (categoryFilter?.getAttribute("data-see-more") == "true") {
            param.page = 1;
          } else {
            param.page = page;
          }

          param.page = page;

          console.log("page_ number ", page);

          //get filtered post
          getPostData(param).then((postData) => {
            let container = tagFilter.getAttribute("data-container");

            document.querySelector(container).innerHTML = "";

            render(
              html`<${App} name="World" />`,
              document.querySelector(container)
            );

            function App(props) {
              return postData.length > 0 ? (
                postData.map((post) => (
                  <div class="post border-t-2 border-black">
                    <div class="flex flex-column md:flex-row my-4">
                      <div class="w-full md:w-3/4 flex flex-col items-start">
                        <p class="text-swissred text-base font-black ml-2">
                          {
                            post["toolset-meta"]["post-options"][
                              "event-from-date"
                            ]["formatted"]
                          }
                        </p>
                        {post.custom_fields.tags.map((tag, i) => (
                          <a href={tag.slug} class="flex flex-row">
                            {tag.icon && (
                              <figure>
                                <img
                                  class="img w-6 inline-block gap-5"
                                  src={tag.icon}
                                  alt={tag.name + "map"}
                                />
                              </figure>
                            )}
                            <h5 class="inline-block text-lg xl:text-xl font-black">
                              {tag.name}
                            </h5>
                          </a>
                        ))}
                      </div>
                      <div class="tags w-full md:w-1/3 flex place-content-end gap-2">
                        {post.custom_fields.category.map((cat, i) => (
                          <a href={cat.slug}>
                            <figure>
                              <img alt={cat.name} src={cat.icon} class="img" />
                            </figure>
                          </a>
                        ))}
                      </div>
                    </div>

                    {post._embedded["wp:featuredmedia"] && (
                      <a class="block" href={post.link}>
                        <img
                          src={
                            post._embedded["wp:featuredmedia"]["0"].source_url
                          }
                          class="img"
                        />
                      </a>
                    )}

                    <div class="w-10/12 mt-4 mb-3">
                      <a href={post.link}>
                        <h3>{post.title.rendered}</h3>
                      </a>
                      <div
                        class="text-sm excerpt"
                        innerHTML={post.excerpt.rendered}
                      ></div>
                    </div>

                    <div class="flex flex-column md:flex-row">
                      <div class="w-full md:w-1/3 flex items-center">
                        <a href={post.link} class="text-xs tracking-widest">
                          LEARN MORE <span class="">&gt;</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div class="grid grid-cols-1 gap-x-16 gap-y-10">
                  <h3>No results found for the selected filter.</h3>
                </div>
              );
            }
          });
        });
      });
  });

  categoryFilters.forEach((categoryFilter) => {
    categoryFilter
      .querySelector(".filter-header")
      .addEventListener("click", function () {
        categoryFilter
          .querySelector(".filter-dropdown")
          .classList.toggle("hidden");
      });

    let categorySlug = [];
    categoryFilter?.querySelectorAll("input").forEach((categoryInput) => {
      categoryInput.addEventListener("change", function () {
        categorySlug = [];
        categoryFilter
          .querySelectorAll("input")
          .forEach((categoryInputInner) => {
            if (categoryInputInner.checked) {
              categorySlug.push(categoryInputInner.getAttribute("name"));
            }
          });

        if (categoryFilter.getAttribute("data-category")) {
          categorySlug.push(categoryFilter.getAttribute("data-category"));
        }

        let param = { category: categorySlug };

        // get tags if selected
        let tagFilter =
          categoryFilter.parentElement.querySelector(".filter-tags");
        if (tagFilter) {
          let tagSlug = [];
          let tagSlugName = [];
          tagFilter.querySelectorAll("input").forEach((tagInputInner) => {
            if (tagInputInner.checked) {
              tagSlug.push(tagInputInner.getAttribute("name"));
              tagSlugName.push(tagInputInner.getAttribute("data-tag-name"));
            }
          });

          if (tagSlug.length > 0) {
            param.tags = tagSlug;
            param.tagsName = tagSlugName;
          }
        }

        if (categorySlug.length == 0) {
          param = {};
        }

        let event = categoryFilter.getAttribute("data-event");
        param.event = event;

        let page = categoryFilter.getAttribute("data-page")
          ? categoryFilter.getAttribute("data-page")
          : 1;

        if (categoryFilter.getAttribute("data-see-more") == "false") {
          param.page = 1;
          categoryFilter.setAttribute("data-page", 1);
        } else {
          param.page = page;
        }

        //check if filter on search page
        if (tagFilter?.hasAttribute("data-search")) {
          param.search = true;
        }

        //get filtered post
        getPostData(param).then((postData) => {
          console.log(postData);
          let container = categoryFilter.getAttribute("data-container");

          // Store the current displayed posts
          let containerInnerHtml = document
            .querySelector(container)
            .innerHTML.toString();

          // clear the HTML
          document.querySelector(container).innerHTML = "";

          render(
            html`<${App} name="World" />`,
            document.querySelector(container)
          );

          if (
            postData.length > 0 &&
            categoryFilter.getAttribute("data-see-more") == "true"
          ) {
            document
              .querySelector(container)
              .insertAdjacentHTML("afterbegin", containerInnerHtml);
          }

          if (postData.length < 6 || postData.length == 0) {
            if (document.querySelector(".see-more-events")) {
              document.querySelector(".see-more-events").style.display = "none";
            }
          } else {
            if (document.querySelector(".see-more-events")) {
              document.querySelector(".see-more-events").style.display =
                "inline-block";
            }
          }

          categoryFilter.setAttribute("data-see-more", "false");

          function App(props) {
            return postData.length > 0 ? (
              postData.map((post) => (
                <div class="post border-t-2 border-black">
                  <div class="flex flex-column md:flex-row my-4">
                    <div class="w-full md:w-3/4 flex flex-col items-start">
                      <p class="text-swissred text-base font-black ml-2">
                        {
                          post["toolset-meta"]["post-options"][
                            "event-from-date"
                          ]["formatted"]
                        }
                      </p>
                      {post.custom_fields.tags.map((tag, i) => (
                        <a href={tag.slug} class="flex flex-row">
                          {tag.icon && (
                            <figure>
                              <img
                                class="img w-6 inline-block gap-5"
                                src={tag.icon}
                                alt={tag.name + "map"}
                              />
                            </figure>
                          )}

                          <h5 class="inline-block text-lg xl:text-xl font-black">
                            {tag.name}
                          </h5>
                        </a>
                      ))}
                    </div>
                    <div class="tags w-full md:w-1/3 flex place-content-end gap-2">
                      {post.custom_fields.category.map((cat, i) => (
                        <a href={cat.slug}>
                          <figure>
                            <img alt={cat.name} src={cat.icon} class="img" />
                          </figure>
                        </a>
                      ))}
                    </div>
                  </div>

                  {post._embedded["wp:featuredmedia"] && (
                    <a class="block" href={post.link}>
                      <div
                        class="max-h-60 relative bg-cover bg-center overflow-hidden"
                        style={`background-image: url(${post._embedded["wp:featuredmedia"]["0"].source_url});`}
                      >
                        <img
                          src={
                            post._embedded["wp:featuredmedia"]["0"].source_url
                          }
                          class="img left-0 top-0 invisible"
                        />
                      </div>
                    </a>
                  )}

                  <div class="w-10/12 mt-4 mb-3">
                    <a href={post.link}>
                      <h3>{post.title.rendered}</h3>
                    </a>
                    <div
                      class="text-sm excerpt"
                      innerHTML={post.excerpt.rendered}
                    ></div>
                  </div>

                  <div class="flex flex-column md:flex-row">
                    <div class="w-full md:w-1/3 flex items-center">
                      <a href={post.link} class="text-xs tracking-widest">
                        LEARN MORE <span class="">&gt;</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div class="grid grid-cols-1 gap-x-16 gap-y-10">
                <h3>No results found for the selected filter.</h3>
              </div>
            );
          }
        });
      });
    });
  });

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

export default addFilter;
