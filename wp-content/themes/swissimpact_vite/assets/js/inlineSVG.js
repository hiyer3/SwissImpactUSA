async function inlineSVG(url, container) {
  try {
    const res = await fetch(url, { credentials: "same-origin" });
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);

    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, "image/svg+xml");
    const svgEl = doc.documentElement;

    if (!svgEl || svgEl.tagName.toLowerCase() !== "svg") {
      throw new Error("File did not parse into a valid <svg>");
    }

    // Make responsive
    svgEl.removeAttribute("width");
    svgEl.removeAttribute("height");
    svgEl.setAttribute("width", "100%");
    svgEl.setAttribute("height", "auto");
    if (!svgEl.hasAttribute("preserveAspectRatio")) {
      svgEl.setAttribute("preserveAspectRatio", "xMidYMid meet");
    }

    // Clear previous content and append new SVG
    container.innerHTML = "";
    container.appendChild(svgEl);

    console.log("SVG loaded successfully:", url);
    return svgEl;
  } catch (err) {
    console.error("Error loading SVG:", err);
    container.innerHTML = `
      <div style="padding:10px;border:1px solid #ccc;border-radius:6px;background:#fafafa">
        Failed to load map. Please refresh the page.
      </div>`;
    return null;
  }
}

export default inlineSVG;   