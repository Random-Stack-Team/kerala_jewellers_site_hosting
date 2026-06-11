(async function () {
  const mount = document.getElementById("site-header");
  if (!mount) return;

  const isSubfolder = window.location.pathname.split("/").length > 2;
  const prefix = isSubfolder ? "../" : "";

  try {
    const response = await fetch(prefix + "partials/header.html?v=26");
    if (!response.ok) {
      throw new Error("Header fetch failed: " + response.status);
    }

    let html = await response.text();

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

    if (typeof window.initKeralaHeader === "function") {
      window.initKeralaHeader();
    }
  } catch (error) {
    console.error("Header loader error:", error);
  }
})();