export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const choice = url.searchParams.get("choice");

    // 🔑 Your Pixel ID & Access Token
    const PIXEL_ID = "1091970342909970";
    const ACCESS_TOKEN = "EAAeAAwIifDgBPOpWtJncqjlyDTzliqcGy5iV91NDqIOXuUr6l6WRv4RRv7e4vgdSj27BTZC7z8Fj6DZCVfGJzeJEBYXGEOD0yYHjtRe3R1N6OoP91CbuaMvufWMfkmLfpDG1xWY7ZCNlS7ZBsxuZCgM9H6Ep1Vuj5vZAg17ZCbHJCM3clWZA8RG0RgjabqXaHgZDZD"; // replace with the token you copied

    let eventName = "ViewContent";
    let eventData = {
      event_name: "ViewContent",
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      event_source_url: request.headers.get("referer") || "https://juicy-pleasure.pages.dev/",
      user_data: {
        client_ip_address: request.headers.get("cf-connecting-ip"),
        client_user_agent: request.headers.get("user-agent")
      },
      custom_data: {
        value: 0.003,   // same as LP
        currency: "USD"
      }
    };

    if (choice === "yes") {
      eventData.event_name = "Lead";
      eventName = "Lead";
      eventData.custom_data = {
        value: 0.004,  // same as LP button
        currency: "USD"
      };
    }

    if (choice === "no") {
      eventData.event_name = "Rejected";
      eventName = "Rejected";
      delete eventData.custom_data;
    }

    // ✅ Send to Meta Conversion API
    const fbResponse = await fetch(
      `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [eventData] })
      }
    );

    console.log("Sent to Meta Pixel:", eventName);

    // Redirect users
    if (choice === "yes") {
      return Response.redirect("https://only-fan.github.io/Juicypleasure/", 302);
    } else {
      return Response.redirect("https://only-fan.github.io/Juicypleasure/", 302);
    }
  }
};
