export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname.toLowerCase();

    // Pixel + token
    const pixelId = "1091970342909970";
    const accessToken = "EAAeAAwIifDgBPIWlb9op95UrRg3ssVOLgqp3KwuPu2zJ15pzlt8yUORE3DFv4NCmi8pBZAPMGpTYlVHFyuGZBeeEm6lchCT3j8ZCBwuX0Le3A3l8wYzPTA3qCM7fQEnN4s2fDLjDNnaaWaqRxo91oZBZC76FTXDxdELxoTJZAOSZA7uPcSfQF8HgioaemJhzAZDZD";

    // Where to send users after signup click
    const offerUrl = "https://only-fan.github.io/Juicypleasure/"; // change to your real offer if needed

    // Helper: send CAPI (non-blocking)
    function sendFBEvent(eventName, req) {
      const payload = {
        data: [{
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: req.url,
          // Uncomment while testing in Events Manager (Test Events tab):
          // test_event_code: "TEST55612",
          user_data: {
            client_ip_address: req.headers.get("CF-Connecting-IP"),
            client_user_agent: req.headers.get("User-Agent")
          }
        }]
      };
      // fire & forget
      fetch(`https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).catch(() => {});
    }

    if (path === "/signup") {
      sendFBEvent("Lead", request);             // server-side event
      return Response.redirect(offerUrl, 302);  // instant redirect
    }

    return new Response("OK", { status: 200 });
  }
};
