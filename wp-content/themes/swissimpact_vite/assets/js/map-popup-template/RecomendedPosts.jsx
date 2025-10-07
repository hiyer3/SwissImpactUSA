import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import Swiper, { Navigation, Pagination, Scrollbar } from "swiper";

function decodeHTMLEntities(text) {
  var textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  return textArea.value;
}

const RecomendedPosts = ({ tag = "economic-impact" }) => {
  // fetch posts from WordPress REST API for posts tagged with economic-impact

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!tag) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // First, get the tag ID from the tag slug
        const tagResponse = await fetch(`/wp-json/wp/v2/tags?slug=${tag}`);
        if (!tagResponse.ok) {
          throw new Error(`Error fetching tag: ${tagResponse.status}`);
        }
        
        const tagData = await tagResponse.json();
        if (tagData.length === 0) {
          throw new Error(`Tag "${tag}" not found`);
        }
        
        const tagId = tagData[0].id;
        
        // Then fetch posts with that tag ID
        const postsResponse = await fetch(
          `/wp-json/wp/v2/posts?tags=${tagId}&_embed&per_page=10&orderby=date&order=desc`
        );
        
        if (!postsResponse.ok) {
          throw new Error(
            "Error fetching posts, please try again. Error code: " +
              postsResponse.status
          );
        }
        
        const postsData = await postsResponse.json();
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [tag]);
 
  return (
    <div class="slider-wrapper w-full mt-16 mb-10 tab-featured-events">
      <div class="title flex">
        <h1 class="inline-block text-white">Featured events</h1>
        <div class="swiper-nav inline-flex gap-7 ml-5">
          <div class="swiper-button-prev text-white"></div>
          <div class="swiper-button-next text-white"></div>
        </div>
      </div>
      {loading && (
        <div class="grid grid-cols-1 gap-x-16 gap-y-10 upcoming-post-wrapper text-white">
          <h3>Loading featured events...</h3>
        </div>
      )}
      {!loading && !error && (
        <div class="slider w-swiper">
          <div class="swiper-wrapper">
            {posts.map((post) => (
              <div class="swiper-slide flex flex-col">
                <div>
                  <a class="block" href={`${post.link}`}>
                    <div
                      class="h-60 relative bg-cover bg-center overflow-hidden"
                      style={`background-image: url('${post["wp:featuredmedia"]?.["media_details"]?.["sizes"]?.["post-item"]?.["source_url"]}');`}
                    ></div>
                  </a>

                  <div class="w-10/12 mt-4 mb-1">
                    <h3>
                      <a href={`${post.link}`}>
                        {decodeHTMLEntities(post.title.rendered)}
                      </a>
                    </h3>
                  </div>
                </div>

                <div class="flex flex-column md:flex-row w-11/12 border-t-2 mt-auto pt-3 border-black">
                  <div class="w-full md:w-1/3 flex items-center">
                    <a href={`${post.link}`} class="text-xs">
                      LEARN MORE <span class="">&gt;</span>
                    </a>
                  </div>
                  {/*<div class="tags w-full md:w-3/4 flex place-content-end gap-2">
                    <a class="single-category relative z-50" href="">
                      <figure>
                        <img
                          alt="<?php echo $single_post_category->name; ?>"
                          src="<?php echo get_term_meta($single_post_category->cat_ID, "
                          class="img"
                        />
                      </figure>
                      <span class="label -z-1 transition-all font-medium duration-300 -right-[5%] lg:-right-[250%] absolute top-[102%] leading-[1.15] h-auto w-36 text-center text-xs opacity-0 bg-black px-2 py-1 text-white"></span>
                    </a>
                  </div>*/}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {error && (
        <div class="grid text-white grid-cols-1 gap-x-16 gap-y-10 upcoming-post-wrapper">
          <h3>Error loading events: {error.message}</h3>
        </div>
      )}
      {!loading && !error && posts.length === 0 && (
        <div class="grid text-white grid-cols-1 gap-x-16 gap-y-10 upcoming-post-wrapper">
          <h3>No events found for tag "{tag}". Check back soon for featured events.</h3>
        </div>
      )}
    </div>
  );
};

export default RecomendedPosts;
