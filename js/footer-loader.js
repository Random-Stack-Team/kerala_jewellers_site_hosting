(async function () {
  console.log("[FooterLoader] Script started.");
  const mount = document.getElementById("site-footer");
  console.log("[FooterLoader] Mount #site-footer exists:", !!mount);
  if (!mount) return;

  const isSubfolder = window.location.pathname.split("/").length > 2;
  const prefix = isSubfolder ? "../" : "";

  const fetchUrl = prefix + "partials/footer.html?v=premium-footer-rebuild-3";
  console.log("[FooterLoader] Exact fetch URL:", fetchUrl);

  try {
    const response = await fetch(fetchUrl);
    console.log("[FooterLoader] Fetch status:", response.status, response.statusText);
    if (!response.ok) {
      throw new Error("Footer fetch failed: " + response.status);
    }

    let html = await response.text();
    console.log("[FooterLoader] First 300 chars of fetched HTML:", html.slice(0, 300));
    console.log("[FooterLoader] Fetched HTML contains '<iframe':", html.toLowerCase().includes("<iframe"));

    if (prefix) {
      html = html.replace(/(href|src)="(?!https?:|mailto:|tel:|#|\/|\.\.\/)([^"]+)"/g, `$1="${prefix}$2"`);
      html = html.replace(/srcset="([^"]+)"/g, (_, contents) => {
        return 'srcset="' + contents.split(',').map(part => {
          part = part.trim();
          return (part && !part.startsWith('http') && !part.startsWith('/') && !part.startsWith('../')) ? prefix + part : part;
        }).join(', ') + '"';
      });
    }

    mount.innerHTML = html;
    
    // Remove branch maps entirely on contact page so they don't load or exist in DOM
    if (document.body.classList.contains('contact-page')) {
      const branches = mount.querySelector('.premium-footer-branches');
      if (branches) branches.remove();
    }
    
    const iframesCount = document.querySelectorAll('#site-footer iframe, footer iframe').length;
    console.log("[FooterLoader] Final iframe count after injection:", iframesCount);

  } catch (error) {
    console.error("[FooterLoader] error:", error);
  }
})();
