import { h } from "preact";
import { useState, useEffect, useRef } from "preact/hooks";
import Swiper from "swiper";
import { Navigation } from "swiper/modules";

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
  const swiperContainerRef = useRef(null);
  const swiperInstanceRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!tag) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        let postsData = [];

        if (tag === "map") {
          // Fetch from ACF options page for map featured events
          const optionsResponse = await fetch(`/wp-json/acf/v3/options/options`);
          if (!optionsResponse.ok) {
            throw new Error(`Error fetching options: ${optionsResponse.status}`);
          }

          const optionsData = await optionsResponse.json();
          const featuredEvents = optionsData.acf?.map_featured_events;

          if (featuredEvents && Array.isArray(featuredEvents)) {
            // featuredEvents should contain post objects or post IDs
            // If they are post IDs, we need to fetch the full post data
            const postIds = featuredEvents.map(event =>
              typeof event === 'object' ? event.ID : event
            ).filter(id => id);

            if (postIds.length > 0) {
              const postsResponse = await fetch(
                `/wp-json/wp/v2/posts?include=${postIds.join(',')}&_embed`
              );

              if (postsResponse.ok) {
                postsData = await postsResponse.json();
                // Maintain the order from the ACF field
                postsData.sort((a, b) => {
                  return postIds.indexOf(a.id) - postIds.indexOf(b.id);
                });
              }
            }
          }
        } else {
          // Original tag-based fetching logic
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

          postsData = await postsResponse.json();
        }

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

  // Initialize Swiper after posts are rendered
  useEffect(() => {
    if (!loading && posts.length > 0 && swiperContainerRef.current) {
      if (swiperInstanceRef.current) {
        swiperInstanceRef.current.destroy(true, true);
        swiperInstanceRef.current = null;
      }
      swiperInstanceRef.current = new Swiper(swiperContainerRef.current, {
        modules: [Navigation],
        speed: 500,
        spaceBetween: 20,
        navigation: {
          nextEl: ".tab-featured-events .swiper-button-next",
          prevEl: ".tab-featured-events .swiper-button-prev",
        },
      });
    }
    return () => {
      if (swiperInstanceRef.current) {
        swiperInstanceRef.current.destroy(true, true);
        swiperInstanceRef.current = null;
      }
    };
  }, [loading, posts]);

  return (
    <div class="slider-wrapper w-full mt-16 mb-10 tab-featured-events">
      {(!loading && posts.length > 0) && (
        <div class="title flex">
          <h1 class="inline-block text-white">Featured events</h1>
          <div class="swiper-nav inline-flex gap-7 ml-5">
            <div class="swiper-button-prev text-white"></div>
            <div class="swiper-button-next text-white"></div>
          </div>
        </div>
      )}
      {loading && (
        <div class="grid grid-cols-1 gap-x-16 gap-y-10 upcoming-post-wrapper text-white">
          <h3>Loading featured events...</h3>
        </div>
      )}
      {!loading && !error && posts.length > 0 && (
        <div class="slider w-swiper" ref={swiperContainerRef}>
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
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default RecomendedPosts;
