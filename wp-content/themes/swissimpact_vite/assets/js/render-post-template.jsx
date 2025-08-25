import { h, render } from "preact";
import htm from "htm";

const Render = (postData, filter) => {
  // Initialize htm with Preact
  const html = htm.bind(h);

  // Fetch the container to append the data to
  let container = filter.getAttribute("data-container");

  // clear the HTML
  document.querySelector(container).innerHTML = "";

  // hide the See More Events button if have no posts or has less than 15 posts
  if (!postData || postData.length < 9 || postData.length == 0) {
    if (document.querySelector(".see-more-events")) {
      document.querySelector(".see-more-events").style.display = "none";
    }
  } else {
    if (document.querySelector(".see-more-events")) {
      document.querySelector(".see-more-events").style.display = "inline-block";
    }
  }

  return render(
    html`<${App} name="post" />`,
    document.querySelector(container)
  );

  function App(props) {
    return postData.length > 0 ? (
      postData.map((post) => (
        <div class="post border-t-2 border-black">
          <div class="flex flex-column md:flex-row mt-4">
            <div class="w-full md:w-3/4 flex flex-col items-start">
              <p class="text-swissred text-base font-black ml-2">
                {
                  post["toolset-meta"]["post-options"]["event-from-date"][
                    "formatted"
                  ]
                }
              </p>
            </div>
            <div class="tags w-full md:w-1/3 flex place-content-end gap-2">
              {post.custom_fields.category.map((cat, i) => (
                <a class="single-category z-5 relative" href={cat.slug}>
                  <figure>
                    <img alt={cat.name} src={cat.icon} class="img" />
                  </figure>
                  <span class="label -z-1 transition-all font-medium duration-300 -right-[5%] lg:-right-[250%] absolute -bottom-5 w-36 text-center text-xs opacity-0 bg-black px-2 py-1 text-white">
                    {cat.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div class="flex flex-col items-start mb-4">
            {post.custom_fields.tags.map((tag, i) => (
              <a
                href={"/tag/" + tag.slug}
                class="flex flex-row flex-wrap gap-1 md:my-0 mr-2"
              >
                {tag.icon && (
                  <figure>
                    <img
                      class={`img ${
                        tag.slug == "virtual" ? "w-4" : "w-6"
                      } inline-block gap-5`}
                      src={tag.icon}
                      alt={tag.name + "map"}
                    />
                  </figure>
                )}

                {!tag.icon && <div class="w-4 inline-block gap-5"></div>}

                <h5
                  class={`inline-block ${
                    tag.slug == "virtual" ? "text-normal" : "text-lg"
                  } font-black ml-1 uppercase`}
                >
                  {tag.name}
                </h5>
              </a>
            ))}
          </div>

          {post._embedded["wp:featuredmedia"] && (
            <a class="block" href={post.link}>
              <div
                class="h-60 relative bg-cover bg-center overflow-hidden"
                style={`background-image: url(${post._embedded["wp:featuredmedia"]["0"].source_url});`}
              >
                {/*<!--img src={post._embedded["wp:featuredmedia"]["0"].source_url} class="img left-0 top-0 invisible" /-->*/}
              </div>
            </a>
          )}

          <div class="w-10/12 mt-4 mb-3">
            <a href={post.link}>
              <h3 innerHTML={post.title.rendered}></h3>
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
};

export default Render;
