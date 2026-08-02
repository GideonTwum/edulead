import sanitizeHtmlLib from "sanitize-html";

export function sanitizeHtml(html: string): string {
  return sanitizeHtmlLib(html, {
    allowedTags: sanitizeHtmlLib.defaults.allowedTags.concat(["img", "h1", "h2", "iframe"]),
    allowedAttributes: {
      ...sanitizeHtmlLib.defaults.allowedAttributes,
      iframe: ["src", "width", "height", "frameborder", "allowfullscreen", "allow"],
      img: ["src", "alt", "width", "height"],
      a: ["href", "name", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
}
