export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const choice = url.searchParams.get("choice");
    const fbc = url.searchParams.get("fbc");
    const fbclid = url.searchParams.get("fbclid");

    // 🔑 Get event_id from query or cookie
    const eventId = url.searchParams.get("event_id") || crypto.randomUUID();

    const PIXEL_ID = "1091970342909970";
    const ACCESS_TOKEN = env.FB_ACCESS_TOKEN;

    let eventData = {
      event_name: "Lead",
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      event_source_url: request.headers.get("referer") || "https://only-fan.github.io/Juicypleasure/",
      event_id: eventId, // ✅ Deduplication
      user_data: {
        client_ip_address: request.headers.get("cf-connecting-ip"),
        client_user_agent: request.headers.get("user-agent"),
        fbc: fbc || null,
        fbclid: fbclid || null
      },
      custom_data: {
        content_name: choice === "yes" ? "Age Verification - Accepted" : "Age Verification - Rejected",
        content_category: "Adult Content",
        value: choice === "yes" ? 0.003 : 0.00,
        currency: "USD"
      }
    };

    // ✅ Send to Meta CAPI
    try {
      const fbResponse = await fetch(
        `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: [eventData] })
        }
      );

      if (!fbResponse.ok) {
        console.error("❌ Facebook API error:", await fbResponse.text());
      } else {
        console.log("✅ Sent event to Facebook:", eventData.event_id, eventData.event_name);
      }
    } catch (err) {
      console.error("❌ Error sending to Meta:", err);
    }

    // ✅ Wait so event sends
    await new Promise(r => setTimeout(r, 200));

    // Redirect user
    if (choice === "yes") {
      return Response.redirect("https://only-fan.github.io/Juicypleasure/", 302);
    } else {
      return Response.redirect("https://only-fan.github.io/Juicypleasure/", 302);
    }
  }
                    }
