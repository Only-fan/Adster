export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const choice = url.searchParams.get("choice");

    // Facebook Pixel settings
    const pixelId = "1091970342909970";
    const accessToken = env.ACCESS_TOKEN; // stored in wrangler.toml
    const fbEndpoint = `https://graph.facebook.com/v17.0/${pixelId}/events?access_token=${accessToken}`;

    // Base event data
    const baseEvent = {
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      event_source_url: request.url,
    };

    // Decide redirect + event
    let redirectUrl = "https://only-fan.github.io/Juicypleasure/";
    let eventName = "ViewContent"; // default

    if (choice === "yes") {
      eventName = "AgeConfirmed";
      redirectUrl = "https://only-fan.github.io/Juicypleasure/";
    } else if (choice === "no") {
      eventName = "AgeRejected";
      redirectUrl = "https://www.google.com/";
    } else if (choice === "lead") {
      eventName = "Lead";
      redirectUrl = "https://only-fan.github.io/Juicypleasure/";
    }

    // Fire Pixel event
    await fetch(fbEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [{
          ...baseEvent,
          event_name: eventName,
          custom_data: {
            currency: "USD",
            value: choice === "lead" ? 3.00 : 0.00  // your $2-$4 CPM avg
          }
        }]
      }),
    });

    return Response.redirect(redirectUrl, 302);
  }
  }
