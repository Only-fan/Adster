export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Replace with your own details
    const FB_PIXEL_ID = "1091970342909970";
    const FB_ACCESS_TOKEN = "EAAeAAwIifDgBPIWlb9op95UrRg3ssVOLgqp3KwuPu2zJ15pzlt8yUORE3DFv4NCmi8pBZAPMGpTYlVHFyuGZBeeEm6lchCT3j8ZCBwuX0Le3A3l8wYzPTA3qCM7fQEnN4s2fDLjDNnaaWaqRxo91oZBZC76FTXDxdELxoTJZAOSZA7uPcSfQF8HgioaemJhzAZDZD";
    const YES_REDIRECT = "https://only-fan.github.io/Juicypleasure/";
    const NO_REDIRECT = "https://only-fan.github.io/Juicypleasure/";

    async function sendCapiEvent(eventName) {
      const eventData = {
        data: [
          {
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            action_source: "website",
            event_source_url: request.headers.get("referer") || "",
          }
        ]
      };

      await fetch(`https://graph.facebook.com/v17.0/${FB_PIXEL_ID}/events?access_token=${FB_ACCESS_TOKEN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData)
      });
    }

    // Route handling
    if (url.pathname === "/yes") {
      await sendCapiEvent("AgeConfirmed");
      return Response.redirect(YES_REDIRECT, 302);
    } 
    else if (url.pathname === "/no") {
      await sendCapiEvent("AgeRejected");
      return Response.redirect(NO_REDIRECT, 302);
    } 
    else {
      return new Response("Invalid path", { status: 404 });
    }
  }
};
