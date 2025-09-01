export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const choice = url.searchParams.get("choice");

    // ✅ CAPTURE CLICK ID PARAMETERS
    const fbc = url.searchParams.get("fbc");
    const fbclid = url.searchParams.get("fbclid");

    // ✅ DEBUG LOGGING
    console.log("=== CLOUDFLARE WORKER DEBUG ===");
    console.log("Choice parameter:", choice);
    console.log("FBC from URL:", fbc);
    console.log("FBCLID from URL:", fbclid);
    console.log("IP Address:", request.headers.get("cf-connecting-ip"));
    console.log("User Agent:", request.headers.get("user-agent"));
    console.log("Referer:", request.headers.get("referer"));
    console.log("=== DEBUG END ===");

    const PIXEL_ID = "1091970342909970";
    const ACCESS_TOKEN = env.FB_ACCESS_TOKEN;

    let eventData = {
      event_name: "ViewContent",
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      event_source_url: request.headers.get("referer") || "https://only-fan.github.io/Juicypleasure/",
      user_data: {
        client_ip_address: request.headers.get("cf-connecting-ip"),
        client_user_agent: request.headers.get("user-agent"),
        // ✅ INCLUDING CLICK IDs
        fbc: fbc || null,
        fbclid: fbclid || null
      },
      custom_data: {
        content_name: "Age Verification",
        value: 0.00,
        currency: "USD"
      }
    };

    if (choice === "yes") {
      eventData.event_name = "Lead";
      eventData.custom_data = {
        content_name: "Age Verification - Accepted",
        value: 0.003,
        currency: "USD"
      };
    } else if (choice === "no") {
      eventData.event_name = "Lead";
      eventData.custom_data = {
        content_name: "Age Verification - Rejected",
        value: 0.00,
        currency: "USD"
      };
    }

    // Send to Meta Conversion API
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
        console.log("✅ Successfully sent event to Facebook:", eventData.event_name);
      }
    } catch (error) {
      console.error("❌ Error sending event to Facebook:", error);
    }

    // Redirect users
    if (choice === "yes") {
      return Response.redirect("https://only-fan.github.io/Juicypleasure/", 302);
    } else {
      return Response.redirect("https://google.com", 302);
    }
  }
      }
