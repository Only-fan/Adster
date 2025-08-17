export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const choice = (url.searchParams.get("choice") || "").toLowerCase();

    // Where to send the user
    const yesRedirect = env.ADSTERRA_LINK; // your real offer link
    const noRedirect  = env.NO_REDIRECT || "https://google.com";

    // For CAPI matching
    const ip  = request.headers.get("CF-Connecting-IP");
    const ua  = request.headers.get("User-Agent");
    const ref = request.headers.get("Referer") || url.toString();

    // Helper: send event to Facebook CAPI
    async function sendCapi(eventName, valueUsd) {
      const payload = {
        data: [{
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: ref,
          user_data: {
            client_ip_address: ip,
            client_user_agent: ua
          },
          custom_data: valueUsd != null ? { value: valueUsd, currency: "USD" } : undefined
        }]
      };

      try {
        await fetch(`https://graph.facebook.com/v17.0/${env.PIXEL_ID}/events?access_token=${env.ACCESS_TOKEN}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } catch (e) {
        // Don’t block redirect if CAPI fails
        console.error("CAPI error:", e);
      }
    }

    // Route logic
    if (choice === "yes") {
      // Count this as a Lead with value for optimization
      await sendCapi("Lead", 4.00);
      return Response.redirect(yesRedirect, 302);
    }

    // Optional: you could send a low-value ViewContent for "no" clicks
    // await sendCapi("ViewContent", 0.00);

    return Response.redirect(noRedirect, 302);
  }
};
