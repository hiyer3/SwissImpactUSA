const getPostData = async (params) => {
  let perPage = "&per_page=9";

  let queryArgs = "?_embed" + perPage;

  if (params.search) {
    queryArgs = "";
  }

  if (params.category) {
    let catIDString = "";
    var catIds = params.category;
    catIds.forEach((catId) => {
      if (catId != "") {
        catIDString += catId + ",";
      }
    });

    let catSlug = "categories";
    if (params.search) {
      catSlug = "cat";
    }
    if (catIDString != "") {
      queryArgs += "&" + catSlug + "=" + catIDString;
    }
  }

  if (params.tags && params.tags?.length > 0) {
    let tagIDString = "";
    var tagIds = params.tags;

    tagIds.forEach((tagId) => {
      tagIDString += tagId + ",";
    });

    let tagSlug = "tags";

    queryArgs += "&" + tagSlug + "=" + tagIDString;
  }

  if (params.event && !params.search) {
    if (params.event == "upcoming") {
      queryArgs += "&event=" + params.event;
    }

    if (params.event == "past") {
      queryArgs += "&event=" + params.event;
    }
  }

  if (params.page && !params.search) {
    queryArgs += "&page=" + params.page;
  }

  if (params.search && params.search != "") {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get("s");
    let location = "?s=" + searchTerm + queryArgs;
    window.location.href = location;
    return;
  } else {
    /*const response = await fetch(
      "http://localhost/wp-json/wp/v2/posts" + queryArgs
    );*/
    
    const response = await fetch("/wp-json/wp/v2/posts" + queryArgs);

    const jsonData = await response.json();
    return jsonData;
  }
};

export default getPostData;
