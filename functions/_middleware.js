export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.hostname === "teknopraktis.pages.dev") {
    url.protocol = "https:";
    url.hostname = "teknopraktis.my.id";
    return Response.redirect(url.toString(), 301);
  }

  const response = await context.next();
  const headers = new Headers(response.headers);

  headers.set("X-Frame-Options", "DENY");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  headers.set("Cross-Origin-Opener-Policy", "same-origin");

  if (
    url.pathname.startsWith("/_astro/") ||
    url.pathname.startsWith("/brand/") ||
    url.pathname === "/favicon.svg"
  ) {
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
