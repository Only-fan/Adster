export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const event = url.searchParams.get("event");

    // Redirect destinations
    const yesRedirect = env.YES_REDIRECT || "https://only-fan.github.io/Juicypleasure/";
    const noRedirect = env.NO_REDIRECT || "https://only-fan.github.io/Juicypleasure/";

    // Map events
    let fbEvent = "ViewContent";
    let redirectUrl = noRedirect;

    if (event === "lead") {
      fbEvent = "Lead";
      redirectUrl = yesRedirect;
    } else if (event === "exit") {
      fbEvent = "PageView";
      redirectUrl = noRedirect;
    }

    // Send to Facebook CAPI
    await fetch(`https://graph.facebook.com/v17.0/${env.PIXEL_ID}/events?access_token=${env.ACCESS_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [{
          event_name: fbEvent,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website"
        }]
      })
    });

    return Response.redirect(redirectUrl, 302);
  }
};
