// Helper function to construct link with optional title
  const constructLink = (title, link) => {
    return link
      ? `<a href="${link}" class="underline" target="_blank" rel="noopener noreferrer">${title}</a>`
      : title;
  };

  export default constructLink;